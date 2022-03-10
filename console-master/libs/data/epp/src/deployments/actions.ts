import type {
  CreateStrategyParams,
  FetchAllProductVersionsParams,
  FetchBuildVersionsParams,
  FetchOsFamiliesParams,
  FetchPackagesParams,
  FetchPresignedUrlParams,
  FetchProductVersionsParams,
  HybridResponse,
  OsFamily,
  Product,
  ProductVersions,
  StrategiesListItem,
  UpdateRulesList,
  UpdateStrategyParams,
} from '../deployments-service'
import { DeploymentsActions } from './constants'
import type { ApiProvider } from './types'

// Products

const fetchProductsStart = (apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchProductsStart,
  payload: { apiProvider },
})

const fetchProductsSuccess = (payload: Product[]) => ({
  type: DeploymentsActions.FetchProductsSuccess,
  payload,
})

const fetchProductsError = (error: Error) => ({
  type: DeploymentsActions.FetchProductsError,
  payload: { error },
})

// Os Families

const fetchOsFamiliesStart = (params: FetchOsFamiliesParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchOsFamiliesStart,
  payload: { params, apiProvider },
})

const fetchOsFamiliesSuccess = (payload: OsFamily[]) => ({
  type: DeploymentsActions.FetchOsFamiliesSuccess,
  payload,
})

const fetchOsFamiliesError = (error: Error) => ({
  type: DeploymentsActions.FetchOsFamiliesError,
  payload: { error },
})

const resetOsFamilies = () => ({
  type: DeploymentsActions.ResetOsFamilies,
})

// Build Versions

const fetchBuildVersionsStart = (params: FetchBuildVersionsParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchBuildVersionsStart,
  payload: { params, apiProvider },
})

const fetchBuildVersionsSuccess = (payload: string[]) => ({
  type: DeploymentsActions.FetchBuildVersionsSuccess,
  payload,
})

const fetchBuildVersionsError = (error: Error) => ({
  type: DeploymentsActions.FetchBuildVersionsError,
  payload: { error },
})

const resetBuildVersions = () => ({
  type: DeploymentsActions.ResetBuildVersions,
})

// Packages

const fetchPackagesStart = (params: FetchPackagesParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchPackagesStart,
  payload: { params, apiProvider },
})

const fetchPackagesSuccess = (payload: string[]) => ({
  type: DeploymentsActions.FetchPackagesSuccess,
  payload,
})

const fetchPackagesError = (error: Error) => ({
  type: DeploymentsActions.FetchPackagesError,
  payload: { error },
})

const resetPackages = () => ({
  type: DeploymentsActions.ResetPackages,
})

// Presigned Url

const fetchPresignedUrlStart = (params: FetchPresignedUrlParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchPresignedUrlStart,
  payload: { params, apiProvider },
})

const fetchPresignedUrlSuccess = (payload: string) => ({
  type: DeploymentsActions.FetchPresignedUrlSuccess,
  payload,
})

const fetchPresignedUrlError = (error: Error) => ({
  type: DeploymentsActions.FetchPresignedUrlError,
  payload: { error },
})

const resetPresignedUrl = () => ({
  type: DeploymentsActions.ResetPresignedUrl,
})

// Strategies

const fetchStrategiesStart = (apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchStrategiesStart,
  payload: { apiProvider },
})

const fetchStrategiesSuccess = (payload: StrategiesListItem[]) => ({
  type: DeploymentsActions.FetchStrategiesSuccess,
  payload,
})

const fetchStrategiesError = (error: Error) => ({
  type: DeploymentsActions.FetchStrategiesError,
  payload: { error },
})

// Create Strategy

const createStrategyStart = (params: CreateStrategyParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.CreateStrategyStart,
  payload: { params, apiProvider },
})

const createStrategySuccess = () => ({
  type: DeploymentsActions.CreateStrategySuccess,
})

const createStrategyError = (error: Error) => ({
  type: DeploymentsActions.CreateStrategyError,
  payload: { error },
})

// Update Rules

const fetchUpdateRulesStart = (apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchUpdateRulesStart,
  payload: { apiProvider },
})

const fetchUpdateRulesSuccess = (payload: UpdateRulesList) => ({
  type: DeploymentsActions.FetchUpdateRulesSuccess,
  payload,
})

const fetchUpdateRulesError = (error: Error) => ({
  type: DeploymentsActions.FetchUpdateRulesError,
  payload: { error },
})

// Product Versions

const fetchProductVersionsStart = (params: FetchProductVersionsParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchProductVersionsStart,
  payload: { params, apiProvider },
})

const fetchProductVersionsSuccess = (payload: ProductVersions) => ({
  type: DeploymentsActions.FetchProductVersionsSuccess,
  payload,
})

const fetchProductVersionsError = (error: Error) => ({
  type: DeploymentsActions.FetchProductVersionsError,
  payload: { error },
})

// All Product Versions

const fetchAllProductVersionsStart = (params: FetchAllProductVersionsParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchAllProductVersionsStart,
  payload: { params, apiProvider },
})

const fetchAllProductVersionsSuccess = (payload: Record<string, unknown>) => ({
  type: DeploymentsActions.FetchAllProductVersionsSuccess,
  payload,
})

const fetchAllProductVersionsError = (error: Error) => ({
  type: DeploymentsActions.FetchAllProductVersionsError,
  payload: { error },
})

// Update Strategy

const updateStrategyStart = (params: UpdateStrategyParams, apiProvider: ApiProvider) => ({
  type: DeploymentsActions.UpdateStrategyStart,
  payload: { params, apiProvider },
})

const updateStrategySuccess = () => ({
  type: DeploymentsActions.UpdateStrategySuccess,
})

const updateStrategyError = (error: Error) => ({
  type: DeploymentsActions.UpdateStrategyError,
  payload: { error },
})

// Hybrid License Key And Installer Script

const fetchHybridLicenseKeyAndInstallerScriptStart = (apiProvider: ApiProvider) => ({
  type: DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptStart,
  payload: { apiProvider },
})

const fetchHybridLicenseKeyAndInstallerScriptSuccess = (payload: HybridResponse) => ({
  type: DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptSuccess,
  payload,
})

const fetchHybridLicenseKeyAndInstallerScriptError = (error: Error) => ({
  type: DeploymentsActions.FetchHybridLicenseKeyAndInstallerScriptError,
  payload: { error },
})

export {
  // Products
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsError,
  // Os Families
  fetchOsFamiliesStart,
  fetchOsFamiliesSuccess,
  fetchOsFamiliesError,
  resetOsFamilies,
  // Build Versions
  fetchBuildVersionsStart,
  fetchBuildVersionsSuccess,
  fetchBuildVersionsError,
  resetBuildVersions,
  // Packages
  fetchPackagesStart,
  fetchPackagesSuccess,
  fetchPackagesError,
  resetPackages,
  // Presigned Url
  fetchPresignedUrlStart,
  fetchPresignedUrlSuccess,
  fetchPresignedUrlError,
  resetPresignedUrl,
  // Strategies
  fetchStrategiesStart,
  fetchStrategiesSuccess,
  fetchStrategiesError,
  // Create Strategy
  createStrategyStart,
  createStrategySuccess,
  createStrategyError,
  // Update Rules
  fetchUpdateRulesStart,
  fetchUpdateRulesSuccess,
  fetchUpdateRulesError,
  // Product Versions
  fetchProductVersionsStart,
  fetchProductVersionsSuccess,
  fetchProductVersionsError,
  // All Product Versions
  fetchAllProductVersionsStart,
  fetchAllProductVersionsSuccess,
  fetchAllProductVersionsError,
  // Update Strategy
  updateStrategyStart,
  updateStrategySuccess,
  updateStrategyError,
  // Hybrid License Key And Installer Script
  fetchHybridLicenseKeyAndInstallerScriptStart,
  fetchHybridLicenseKeyAndInstallerScriptSuccess,
  fetchHybridLicenseKeyAndInstallerScriptError,
}
