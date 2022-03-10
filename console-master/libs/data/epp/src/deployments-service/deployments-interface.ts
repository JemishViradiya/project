import type { Response } from '@ues-data/shared-types'

import type {
  BuildVersions,
  CreateStrategyParams,
  DownloadUrlResponse,
  FetchBuildVersionsParams,
  FetchOsFamiliesParams,
  FetchPackagesParams,
  FetchPresignedUrlParams,
  FetchProductVersionsParams,
  OsFamilyResponse,
  PackagesResponse,
  Product,
  ProductVersions,
  StrategiesListItem,
  UpdateRule,
  UpdateStrategyParams,
} from './deployments-types'

export default interface DeploymentInterface {
  fetchProducts(): Response<Product[]>
  fetchOsFamilies(params: FetchOsFamiliesParams): Response<OsFamilyResponse>
  fetchBuildVersions(params: FetchBuildVersionsParams): Response<BuildVersions>
  fetchPackages(params: FetchPackagesParams): Response<PackagesResponse>
  fetchDownloadUrl(params: FetchPresignedUrlParams): Response<DownloadUrlResponse>
  fetchProductVersions(params: FetchProductVersionsParams): Response<ProductVersions>
  fetchStrategies(): Response<StrategiesListItem[]>
  fetchUpdateRules(): Response<UpdateRule[]>
  createStrategy(params: CreateStrategyParams): Response<StrategiesListItem>
  updateStrategy(params: UpdateStrategyParams): Response<StrategiesListItem>
  fetchHybridInstallerScript(): Response<string>
  fetchHybridLicenseKey(): Response<string>
}
