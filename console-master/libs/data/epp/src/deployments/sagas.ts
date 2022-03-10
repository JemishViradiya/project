import reduce from 'lodash/reduce'
import { all, call, put, takeLatest } from 'redux-saga/effects'

import type { Packages } from '../deployments-service'
import type {
  createStrategyStart,
  fetchAllProductVersionsStart,
  fetchBuildVersionsStart,
  fetchHybridLicenseKeyAndInstallerScriptStart,
  fetchOsFamiliesStart,
  fetchPackagesStart,
  fetchPresignedUrlStart,
  fetchProductsStart,
  fetchProductVersionsStart,
  fetchUpdateRulesStart,
  updateStrategyStart,
} from './actions'
import {
  createStrategyError,
  createStrategySuccess,
  fetchAllProductVersionsError,
  fetchAllProductVersionsSuccess,
  fetchBuildVersionsError,
  fetchBuildVersionsSuccess,
  fetchHybridLicenseKeyAndInstallerScriptError,
  fetchHybridLicenseKeyAndInstallerScriptSuccess,
  fetchOsFamiliesError,
  fetchOsFamiliesSuccess,
  fetchPackagesError,
  fetchPackagesSuccess,
  fetchPresignedUrlError,
  fetchPresignedUrlSuccess,
  fetchProductsError,
  fetchProductsSuccess,
  fetchProductVersionsError,
  fetchProductVersionsSuccess,
  fetchStrategiesError,
  fetchStrategiesStart,
  fetchStrategiesSuccess,
  fetchUpdateRulesError,
  fetchUpdateRulesSuccess,
  resetBuildVersions,
  resetPackages,
  resetPresignedUrl,
  updateStrategyError,
  updateStrategySuccess,
} from './actions'
import { DeploymentsActions } from './constants'

const fetchProductsSaga = function* ({ payload: { apiProvider } }: ReturnType<typeof fetchProductsStart>) {
  try {
    const { data: products } = yield call(apiProvider.fetchProducts)

    yield put(fetchProductsSuccess(products))
  } catch (error) {
    yield put(fetchProductsError(error as Error))
  }
}

const fetchOsFamiliesSaga = function* ({ payload: { apiProvider, params } }: ReturnType<typeof fetchOsFamiliesStart>) {
  try {
    const {
      data: { osFamily },
    } = yield call(apiProvider.fetchOsFamilies, params)

    yield put(fetchOsFamiliesSuccess(osFamily))
  } catch (error) {
    yield put(fetchOsFamiliesError(error as Error))
  }
}

const fetchBuildVersionsSaga = function* ({ payload: { apiProvider, params } }: ReturnType<typeof fetchBuildVersionsStart>) {
  try {
    const {
      data: { versions },
    } = yield call(apiProvider.fetchBuildVersions, params)

    // clear existing selections
    yield all([put(resetBuildVersions()), put(resetPackages()), put(resetPresignedUrl())])

    yield put(fetchBuildVersionsSuccess(versions))
  } catch (error) {
    yield put(fetchBuildVersionsError(error as Error))
  }
}

const fetchPackagesSaga = function* ({ payload: { apiProvider, params } }: ReturnType<typeof fetchPackagesStart>) {
  try {
    const {
      data: { packages },
    }: { data: { packages: Packages } } = yield call(apiProvider.fetchPackages, params)

    // clear existing selections
    yield all([put(resetPackages()), put(resetPresignedUrl())])

    yield put(fetchPackagesSuccess(Object.keys(packages)))
  } catch (error) {
    yield put(fetchPackagesError(error as Error))
  }
}

const fetchPresignedUrlSaga = function* ({ payload: { apiProvider, params } }: ReturnType<typeof fetchPresignedUrlStart>) {
  try {
    const {
      data: { url },
    } = yield call(apiProvider.fetchDownloadUrl, params)

    // clear existing selections
    yield put(resetPresignedUrl())

    yield put(fetchPresignedUrlSuccess(url))
  } catch (error) {
    yield put(fetchPresignedUrlError(error as Error))
  }
}

const fetchStrategiesSaga = function* ({ payload: { apiProvider } }: ReturnType<typeof fetchStrategiesStart>) {
  try {
    const { data: strategies } = yield call(apiProvider.fetchStrategies)
    yield put(fetchStrategiesSuccess(strategies))
  } catch (error) {
    yield put(fetchStrategiesError(error as Error))
  }
}

const createStrategySaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof createStrategyStart>) {
  try {
    yield call(apiProvider.createStrategy, params)
    yield put(createStrategySuccess())

    // refresh strategies list
    yield call(fetchStrategiesStart, apiProvider)
  } catch (error) {
    yield put(createStrategyError(error as Error))
  }
}

const fetchUpdateRulesSaga = function* ({ payload: { apiProvider } }: ReturnType<typeof fetchUpdateRulesStart>) {
  try {
    const { data: updateRulesList } = yield call(apiProvider.fetchUpdateRules)
    yield put(fetchUpdateRulesSuccess(updateRulesList))
  } catch (error) {
    yield put(fetchUpdateRulesError(error as Error))
  }
}

const fetchProductVersionsSaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof fetchProductVersionsStart>) {
  try {
    const { data: productVersions } = yield call(apiProvider.fetchProductVersions, params)
    yield put(fetchProductVersionsSuccess(productVersions))
  } catch (error) {
    yield put(fetchProductVersionsError(error as Error))
  }
}

const fetchAllProductVersionsSaga = function* ({
  payload: {
    params: { products },
    apiProvider,
  },
}: ReturnType<typeof fetchAllProductVersionsStart>) {
  try {
    const responses = yield all(products.map(productName => call(apiProvider.fetchProductVersions, { productName })))
    const versions = reduce(
      responses,
      (productVersions, { data }) => ({
        ...productVersions,
        [data.product]: data.versions,
      }),
      {},
    )

    yield put(fetchAllProductVersionsSuccess(versions))
  } catch (error) {
    yield put(fetchAllProductVersionsError(error as Error))
  }
}

const updateStrategySaga = function* ({ payload: { params, apiProvider } }: ReturnType<typeof updateStrategyStart>) {
  try {
    yield call(apiProvider.updateStrategy, params)

    yield put(updateStrategySuccess())
  } catch (error) {
    yield put(updateStrategyError(error as Error))
  }
}

const fetchHybridLicenseKeyAndInstallerScriptSaga = function* ({
  payload: { apiProvider },
}: ReturnType<typeof fetchHybridLicenseKeyAndInstallerScriptStart>) {
  try {
    const [{ data: licenseKey }, { data: installerScript }] = yield all([
      call(apiProvider.fetchHybridLicenseKey),
      call(apiProvider.fetchHybridInstallerScript),
    ])

    yield put(fetchHybridLicenseKeyAndInstallerScriptSuccess({ licenseKey, installerScript }))
  } catch (error) {
    yield put(fetchHybridLicenseKeyAndInstallerScriptError(error as Error))
  }
}

const rootSaga = function* () {
  yield all([
    takeLatest(DeploymentsActions.FetchProductsStart, fetchProductsSaga),
    takeLatest(DeploymentsActions.FetchOsFamiliesStart, fetchOsFamiliesSaga),
    takeLatest(DeploymentsActions.FetchBuildVersionsStart, fetchBuildVersionsSaga),
    takeLatest(DeploymentsActions.FetchPackagesStart, fetchPackagesSaga),
    takeLatest(DeploymentsActions.FetchPresignedUrlStart, fetchPresignedUrlSaga),
    takeLatest(DeploymentsActions.FetchStrategiesStart, fetchStrategiesSaga),
    takeLatest(DeploymentsActions.CreateStrategyStart, createStrategySaga),
    takeLatest(DeploymentsActions.FetchUpdateRulesStart, fetchUpdateRulesSaga),
    takeLatest(DeploymentsActions.FetchProductVersionsStart, fetchProductVersionsSaga),
    takeLatest(DeploymentsActions.FetchAllProductVersionsStart, fetchAllProductVersionsSaga),
    takeLatest(DeploymentsActions.UpdateStrategyStart, updateStrategySaga),
    takeLatest(DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptStart, fetchHybridLicenseKeyAndInstallerScriptSaga),
  ])
}

export {
  rootSaga as default,
  fetchProductsSaga,
  fetchOsFamiliesSaga,
  fetchBuildVersionsSaga,
  fetchPackagesSaga,
  fetchPresignedUrlSaga,
  fetchStrategiesSaga,
  createStrategySaga,
  fetchUpdateRulesSaga,
  fetchProductVersionsSaga,
  fetchAllProductVersionsSaga,
  updateStrategySaga,
  fetchHybridLicenseKeyAndInstallerScriptSaga,
}
