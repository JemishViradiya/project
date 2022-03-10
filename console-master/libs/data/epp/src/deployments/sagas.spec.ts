import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { call } from 'redux-saga/effects'

import { DeploymentsMockApi, ProductType } from '../deployments-service'
import {
  BuildVersionsMock,
  DownloadUrlMock,
  mockCreateUpdateStrategy,
  OpticsVersionsMock,
  OsFamiliesMock,
  PackagesMock,
  PersonaVersionsMock,
  ProductsMock,
  ProductsVersionsMock,
  StrategiesMock,
  UpdateRulesMock,
} from '../deployments-service/deployments-mock.data'
import {
  createStrategyError,
  createStrategyStart,
  createStrategySuccess,
  fetchAllProductVersionsError,
  fetchAllProductVersionsStart,
  fetchAllProductVersionsSuccess,
  fetchBuildVersionsError,
  fetchBuildVersionsStart,
  fetchBuildVersionsSuccess,
  fetchHybridLicenseKeyAndInstallerScriptError,
  fetchHybridLicenseKeyAndInstallerScriptStart,
  fetchHybridLicenseKeyAndInstallerScriptSuccess,
  fetchOsFamiliesError,
  fetchOsFamiliesStart,
  fetchOsFamiliesSuccess,
  fetchPackagesError,
  fetchPackagesStart,
  fetchPackagesSuccess,
  fetchPresignedUrlError,
  fetchPresignedUrlStart,
  fetchPresignedUrlSuccess,
  fetchProductsError,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductVersionsError,
  fetchProductVersionsStart,
  fetchProductVersionsSuccess,
  fetchStrategiesError,
  fetchStrategiesStart,
  fetchStrategiesSuccess,
  fetchUpdateRulesError,
  fetchUpdateRulesStart,
  fetchUpdateRulesSuccess,
  updateStrategyError,
  updateStrategyStart,
  updateStrategySuccess,
} from './actions'
import { DeploymentsReduxSlice } from './constants'
import { defaultState } from './reducer'
import {
  createStrategySaga,
  fetchAllProductVersionsSaga,
  fetchBuildVersionsSaga,
  fetchHybridLicenseKeyAndInstallerScriptSaga,
  fetchOsFamiliesSaga,
  fetchPackagesSaga,
  fetchPresignedUrlSaga,
  fetchProductsSaga,
  fetchProductVersionsSaga,
  fetchStrategiesSaga,
  fetchUpdateRulesSaga,
  updateStrategySaga,
} from './sagas'

describe(`${DeploymentsReduxSlice} sagas`, () => {
  const mockStateObj = { [DeploymentsReduxSlice]: defaultState }

  describe('fetchProductsSaga', () => {
    const action = fetchProductsStart(DeploymentsMockApi)

    it('should fetch product list', () => {
      return expectSaga(fetchProductsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchProducts), { data: ProductsMock }]])
        .call(DeploymentsMockApi.fetchProducts)
        .put(fetchProductsSuccess(ProductsMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchProductsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchProducts), throwError(error)]])
        .put(fetchProductsError(error))
        .run()
    })
  })

  describe('fetchOsFamiliesSaga', () => {
    const params = {
      productName: ProductType.Persona,
    }
    const action = fetchOsFamiliesStart(params, DeploymentsMockApi)

    it('should fetch os families', () => {
      return expectSaga(fetchOsFamiliesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchOsFamilies), { data: OsFamiliesMock }]])
        .call(DeploymentsMockApi.fetchOsFamilies, params)
        .put(fetchOsFamiliesSuccess(OsFamiliesMock.osFamily))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchOsFamiliesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchOsFamilies), throwError(error)]])
        .put(fetchOsFamiliesError(error))
        .run()
    })
  })

  describe('fetchBuildVersionsSaga', () => {
    const params = {
      productName: ProductType.Persona,
      osFamily: 'Ubuntu1604',
    }
    const action = fetchBuildVersionsStart(params, DeploymentsMockApi)

    it('should fetch build versions', () => {
      return expectSaga(fetchBuildVersionsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchBuildVersions), { data: BuildVersionsMock }]])
        .call(DeploymentsMockApi.fetchBuildVersions, params)
        .put(fetchBuildVersionsSuccess(BuildVersionsMock.versions))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchBuildVersionsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchBuildVersions), throwError(error)]])
        .put(fetchBuildVersionsError(error))
        .run()
    })
  })

  describe('fetchPackagesSaga', () => {
    const params = {
      productName: ProductType.Persona,
      osFamily: 'Ubuntu1604',
      version: '1.0.2',
    }
    const action = fetchPackagesStart(params, DeploymentsMockApi)

    it('should fetch packages', () => {
      return expectSaga(fetchPackagesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchPackages), { data: PackagesMock }]])
        .call(DeploymentsMockApi.fetchPackages, params)
        .put(fetchPackagesSuccess(Object.keys(PackagesMock.packages)))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchPackagesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchPackages), throwError(error)]])
        .put(fetchPackagesError(error))
        .run()
    })
  })

  describe('fetchPresignedUrlSaga', () => {
    const params = {
      presignedUrl: {
        buildVersion: '1.0.2',
        installer: '',
        osFamily: 'Ubuntu1604',
        targetArchitecture: 'target-architecture',
        productName: ProductType.Persona,
      },
    }

    const action = fetchPresignedUrlStart(params, DeploymentsMockApi)

    it('should fetch presigned downloadable url', () => {
      return expectSaga(fetchPresignedUrlSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchDownloadUrl), { data: DownloadUrlMock }]])
        .call(DeploymentsMockApi.fetchDownloadUrl, params)
        .put(fetchPresignedUrlSuccess(DownloadUrlMock.url))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchPresignedUrlSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchDownloadUrl), throwError(error)]])
        .put(fetchPresignedUrlError(error))
        .run()
    })
  })

  describe('fetchStrategiesSaga', () => {
    const action = fetchStrategiesStart(DeploymentsMockApi)

    it('should fetch strategies', () => {
      return expectSaga(fetchStrategiesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchStrategies), { data: StrategiesMock }]])
        .call(DeploymentsMockApi.fetchStrategies)
        .put(fetchStrategiesSuccess(StrategiesMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchStrategiesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchStrategies), throwError(error)]])
        .put(fetchStrategiesError(error))
        .run()
    })
  })

  describe('createStrategySaga', () => {
    const params = { name: 'strategy 01', strategies: [], description: 'short description' }
    const action = createStrategyStart(params, DeploymentsMockApi)

    it('should create strategy', () => {
      return expectSaga(createStrategySaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.createStrategy), { data: mockCreateUpdateStrategy(params) }]])
        .call(DeploymentsMockApi.createStrategy, params)
        .put(createStrategySuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(createStrategySaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.createStrategy), throwError(error)]])
        .put(createStrategyError(error))
        .run()
    })
  })

  describe('fetchUpdateRulesSaga', () => {
    const action = fetchUpdateRulesStart(DeploymentsMockApi)

    const responseMock = {
      data: {
        data: UpdateRulesMock,
        meta: {
          page: 1,
          pageSize: 10,
          lastPage: 2,
          total: 20,
        },
      },
    }

    it('should fetch update rules', () => {
      return expectSaga(fetchUpdateRulesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchUpdateRules), responseMock]])
        .call(DeploymentsMockApi.fetchUpdateRules)
        .put(fetchUpdateRulesSuccess(responseMock.data))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchUpdateRulesSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchUpdateRules), throwError(error)]])
        .put(fetchUpdateRulesError(error))
        .run()
    })
  })

  describe('fetchProductVersionsSaga', () => {
    const params = {
      productName: ProductType.Persona,
    }
    const action = fetchProductVersionsStart(params, DeploymentsMockApi)

    it('should fetch product versions', () => {
      return expectSaga(fetchProductVersionsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchProductVersions), { data: ProductsVersionsMock }]])
        .call(DeploymentsMockApi.fetchProductVersions, params)
        .put(fetchProductVersionsSuccess(ProductsVersionsMock))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchProductVersionsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchProductVersions), throwError(error)]])
        .put(fetchProductVersionsError(error))
        .run()
    })
  })

  describe('fetchAllProductVersionsSaga', () => {
    const params = {
      products: [ProductType.Persona, ProductType.Optics],
    }
    const action = fetchAllProductVersionsStart(params, DeploymentsMockApi)
    const expectedPayload = {
      [ProductType.Persona]: PersonaVersionsMock.versions,
      [ProductType.Optics]: OpticsVersionsMock.versions,
    }

    it('should fetch all product versions', () => {
      return expectSaga(fetchAllProductVersionsSaga, action)
        .withState(mockStateObj)
        .provide([
          [call(DeploymentsMockApi.fetchProductVersions, { productName: ProductType.Persona }), { data: PersonaVersionsMock }],
          [call(DeploymentsMockApi.fetchProductVersions, { productName: ProductType.Optics }), { data: OpticsVersionsMock }],
        ])
        .put(fetchAllProductVersionsSuccess(expectedPayload))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchAllProductVersionsSaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.fetchProductVersions), throwError(error)]])
        .put(fetchAllProductVersionsError(error))
        .run()
    })
  })

  describe('updateStrategySaga', () => {
    const params = {
      strategy: {
        updateStrategyId: '5A134EEC001248E182A0DA8F53CD1C3A',
        tenantId: '5A134EEC001248E182A0DA8F53CD1C3A',
        name: 'CylancePROTECT_Do not update',
        description: 'Strategy description goes here',
        strategies: [
          {
            productName: 'Protect',
            strategyType: 'DoNotUpdate',
            version: '1.4.2',
          },
          {
            productName: 'Optics',
            strategyType: 'Fixed',
            version: '2.3.2001',
          },
        ],
        modifiedBy: '',
        created: '2020-02-27T21:28:48.663Z',
        modified: '2020-02-27T21:28:49.663Z',
      },
    }
    const action = updateStrategyStart(params, DeploymentsMockApi)

    it('should fetch product versions', () => {
      return expectSaga(updateStrategySaga, action)
        .withState(mockStateObj)
        .provide([
          [matchers.call.fn(action.payload.apiProvider.updateStrategy), { data: mockCreateUpdateStrategy(params.strategy) }],
        ])
        .call(DeploymentsMockApi.updateStrategy, params)
        .put(updateStrategySuccess())
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(updateStrategySaga, action)
        .withState(mockStateObj)
        .provide([[matchers.call.fn(action.payload.apiProvider.updateStrategy), throwError(error)]])
        .put(updateStrategyError(error))
        .run()
    })
  })

  describe('fetchHybridLicenseKeyAndInstallerScriptSaga', () => {
    const action = fetchHybridLicenseKeyAndInstallerScriptStart(DeploymentsMockApi)
    const licenseKey = 'Bpg9sd9vAvoirD7SQrWkK3Sq3mlqxPvY'
    const installerScript = '"InstallScript"{"Registry"{}}'

    it('should fetch product versions', () => {
      return expectSaga(fetchHybridLicenseKeyAndInstallerScriptSaga, action)
        .withState(mockStateObj)
        .provide([
          [matchers.call.fn(action.payload.apiProvider.fetchHybridLicenseKey), { data: licenseKey }],
          [matchers.call.fn(action.payload.apiProvider.fetchHybridInstallerScript), { data: installerScript }],
        ])
        .call(DeploymentsMockApi.fetchHybridLicenseKey)
        .call(DeploymentsMockApi.fetchHybridInstallerScript)
        .put(fetchHybridLicenseKeyAndInstallerScriptSuccess({ licenseKey, installerScript }))
        .run()
    })

    it('should handle error', () => {
      const error = new Error('error')

      return expectSaga(fetchHybridLicenseKeyAndInstallerScriptSaga, action)
        .withState(mockStateObj)
        .provide([
          [matchers.call.fn(action.payload.apiProvider.fetchHybridLicenseKey), throwError(error)],
          [matchers.call.fn(action.payload.apiProvider.fetchHybridInstallerScript), throwError(error)],
        ])
        .put(fetchHybridLicenseKeyAndInstallerScriptError(error))
        .run()
    })
  })
})
