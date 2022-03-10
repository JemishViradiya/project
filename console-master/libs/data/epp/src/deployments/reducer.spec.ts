import {
  BuildVersionsMock,
  DownloadUrlMock,
  OsFamiliesMock,
  PackagesMock,
  ProductsMock,
  ProductsVersionsMock,
  StrategiesMock,
  UpdateRulesMock,
} from '../deployments-service/deployments-mock.data'
import {
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
} from './actions'
import { DeploymentsActions, DeploymentsReduxSlice } from './constants'
import reducer, { defaultState } from './reducer'
import { TaskId } from './types'

describe(`${DeploymentsReduxSlice} reducer`, () => {
  const mockApiProvider: any = {}

  describe(`${TaskId.Products}`, () => {
    describe(`${DeploymentsActions.FetchProductsStart}`, () => {
      it(`should set ${TaskId.Products} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchProductsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Products]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchProductsSuccess}`, () => {
      it(`should set ${TaskId.Products} loading state to false and add data`, () => {
        const action = fetchProductsSuccess(ProductsMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Products]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Products]: {
              loading: false,
              result: ProductsMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchProductsError}`, () => {
      it(`should set ${TaskId.Products} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchProductsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Products]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Products]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.OsFamilies}`, () => {
    describe(`${DeploymentsActions.FetchOsFamiliesStart}`, () => {
      it(`should set ${TaskId.OsFamilies} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchOsFamiliesStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.OsFamilies]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchOsFamiliesSuccess}`, () => {
      it(`should set ${TaskId.OsFamilies} loading state to false and add data`, () => {
        const action = fetchOsFamiliesSuccess(OsFamiliesMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.OsFamilies]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.OsFamilies]: {
              loading: false,
              result: OsFamiliesMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchOsFamiliesError}`, () => {
      it(`should set ${TaskId.OsFamilies} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchOsFamiliesError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.OsFamilies]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.OsFamilies]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.BuildVersions}`, () => {
    describe(`${DeploymentsActions.FetchBuildVersionsStart}`, () => {
      it(`should set ${TaskId.BuildVersions} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchBuildVersionsStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.BuildVersions]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchBuildVersionsSuccess}`, () => {
      it(`should set ${TaskId.OsFamilies} loading state to false and add data`, () => {
        const action = fetchBuildVersionsSuccess(BuildVersionsMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.BuildVersions]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.BuildVersions]: {
              loading: false,
              result: BuildVersionsMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchBuildVersionsError}`, () => {
      it(`should set ${TaskId.BuildVersions} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchBuildVersionsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.BuildVersions]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.BuildVersions]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.Packages}`, () => {
    describe(`${DeploymentsActions.FetchPackagesStart}`, () => {
      it(`should set ${TaskId.Packages} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchPackagesStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Packages]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPackagesSuccess}`, () => {
      it(`should set ${TaskId.Packages} loading state to false and add data`, () => {
        const action = fetchPackagesSuccess(PackagesMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Packages]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Packages]: {
              loading: false,
              result: PackagesMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPackagesError}`, () => {
      it(`should set ${TaskId.Packages} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchPackagesError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Packages]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Packages]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.PresignedUrl}`, () => {
    describe(`${DeploymentsActions.FetchPresignedUrlStart}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchPresignedUrlStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPresignedUrlSuccess}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to false and add data`, () => {
        const action = fetchPresignedUrlSuccess(PackagesMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              loading: false,
              result: PackagesMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPresignedUrlError}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchPresignedUrlError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.PresignedUrl}`, () => {
    describe(`${DeploymentsActions.FetchPresignedUrlStart}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchPresignedUrlStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPresignedUrlSuccess}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to false and add data`, () => {
        const action = fetchPresignedUrlSuccess(DownloadUrlMock.url)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              loading: false,
              result: DownloadUrlMock.url,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchPresignedUrlError}`, () => {
      it(`should set ${TaskId.PresignedUrl} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchPresignedUrlError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.PresignedUrl]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.PresignedUrl]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.Strategies}`, () => {
    describe(`${DeploymentsActions.FetchStrategiesStart}`, () => {
      it(`should set ${TaskId.Strategies} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchStrategiesStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Strategies]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchStrategiesSuccess}`, () => {
      it(`should set ${TaskId.Strategies} loading state to false and add data`, () => {
        const action = fetchStrategiesSuccess(StrategiesMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Strategies]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Strategies]: {
              loading: false,
              result: StrategiesMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchStrategiesError}`, () => {
      it(`should set ${TaskId.Strategies} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchStrategiesError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Strategies]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Strategies]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.UpdateRules}`, () => {
    describe(`${DeploymentsActions.FetchUpdateRulesStart}`, () => {
      it(`should set ${TaskId.UpdateRules} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchUpdateRulesStart(mockParams, mockApiProvider)

        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.UpdateRules]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchUpdateRulesSuccess}`, () => {
      it(`should set ${TaskId.UpdateRules} loading state to false and add data`, () => {
        const action = fetchUpdateRulesSuccess(UpdateRulesMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.UpdateRules]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.UpdateRules]: {
              loading: false,
              result: UpdateRulesMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchUpdateRulesError}`, () => {
      it(`should set ${TaskId.UpdateRules} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchUpdateRulesError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.UpdateRules]: {
              loading: true,
            },
          },
        }

        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.UpdateRules]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.ProductVersions}`, () => {
    describe(`${DeploymentsActions.FetchProductVersionsStart}`, () => {
      it(`should set ${TaskId.ProductVersions} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchProductVersionsStart(mockParams, mockApiProvider)
        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.ProductVersions]: {
              loading: true,
              result: [],
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchProductVersionsSuccess}`, () => {
      it(`should set ${TaskId.ProductVersions} loading state to false and add data`, () => {
        const action = fetchProductVersionsSuccess(ProductsVersionsMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.ProductVersions]: {
              loading: true,
              result: [],
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.ProductVersions]: {
              loading: false,
              result: [ProductsVersionsMock],
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchProductVersionsError}`, () => {
      it(`should set ${TaskId.ProductVersions} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchProductVersionsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.ProductVersions]: {
              loading: true,
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.ProductVersions]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.AllProductVersions}`, () => {
    describe(`${DeploymentsActions.FetchAllProductVersionsStart}`, () => {
      it(`should set ${TaskId.AllProductVersions} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchAllProductVersionsStart(mockParams, mockApiProvider)
        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.AllProductVersions]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchAllProductVersionsSuccess}`, () => {
      it(`should set ${TaskId.AllProductVersions} loading state to false and add data`, () => {
        const action = fetchAllProductVersionsSuccess(ProductsVersionsMock)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.AllProductVersions]: {
              loading: true,
              result: {},
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.AllProductVersions]: {
              loading: false,
              result: ProductsVersionsMock,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchAllProductVersionsError}`, () => {
      it(`should set ${TaskId.AllProductVersions} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchAllProductVersionsError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.AllProductVersions]: {
              loading: true,
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.AllProductVersions]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })

  describe(`${TaskId.Hybrid}`, () => {
    describe(`${DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptStart}`, () => {
      it(`should set ${TaskId.Hybrid} loading state to true`, () => {
        const mockParams: any = {}
        const action = fetchHybridLicenseKeyAndInstallerScriptStart(mockParams, mockApiProvider)
        expect(reducer(defaultState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Hybrid]: {
              loading: true,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptSuccess}`, () => {
      it(`should set ${TaskId.AllProductVersions} loading state to false and add data`, () => {
        const hybridPayload = { licenseKey: 'Bpg9sd9vAvoirD7SQrWkK3Sq3mlqxPvY', installerScript: '"InstallScript"{"Registry"{}}' }
        const action = fetchHybridLicenseKeyAndInstallerScriptSuccess(hybridPayload)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Hybrid]: {
              loading: true,
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Hybrid]: {
              loading: false,
              result: hybridPayload,
            },
          }),
        )
      })
    })

    describe(`${DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptError}`, () => {
      it(`should set ${TaskId.Hybrid} loading state to false and add error`, () => {
        const error = new Error('test error')
        const action = fetchHybridLicenseKeyAndInstallerScriptError(error)
        const prevState = {
          ...defaultState,
          tasks: {
            ...defaultState.tasks,
            [TaskId.Hybrid]: {
              loading: true,
            },
          },
        }
        expect(reducer(prevState, action).tasks).toEqual(
          expect.objectContaining({
            [TaskId.Hybrid]: {
              error,
              loading: false,
            },
          }),
        )
      })
    })
  })
})
