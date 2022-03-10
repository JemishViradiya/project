export interface UpdateRule {
  id: number
  name: string
  zones: string[]
  strategy: string
  description: string
}

export interface Product {
  name: string
  value: string
}

export interface Strategy {
  productName: string
  strategyType: string
  version: string
  errors?: string[]
}

export interface StrategiesListItem {
  updateStrategyId: string
  tenantId: string
  name: string
  description: string
  modified: string
  strategies: Strategy[]
  errors?: string[]
  modifiedBy?: string
  created: string
}

export interface ProductVersionsItem {
  product: string
  versions: string[]
}

export interface ProductVersions {
  product: string
  versions: string[]
}

export interface OsFamily {
  name: string
  value: string
}

export interface OsFamilyResponse {
  osFamily: OsFamily[]
}

export interface Package {
  architecture: string
  format: string
}

export interface DownloadUrlResponse {
  url: string
}

export interface Packages {
  [packageName: string]: string
}

export interface PackagesResponse {
  packages: Packages
}

export enum ProductType {
  Protect = 'Protect',
  Optics = 'Optics',
  Persona = 'Persona',
  Guard = 'Guard',
  Hybrid = 'Hybrid',
}

export interface BuildVersion {
  version: string
}

export interface BuildVersions {
  versions: string[]
}

export interface StrategiesList {
  data: StrategiesListItem[]
}
export type UpdateRulesList = UpdateRule[]

export interface PreSignedUrl {
  buildVersion: string
  installer: string
  osFamily: string
  targetArchitecture: string
  productName: ProductType
}

export interface StrategyItem {
  productName: string
  strategyType: string
  version?: string
}

export interface Hybrid {
  installerScript: string
  licenseKey: string
}

export interface FetchOsFamiliesParams {
  productName: ProductType
}

export interface FetchBuildVersionsParams extends FetchOsFamiliesParams {
  osFamily: string
}
export interface FetchPackagesParams extends FetchBuildVersionsParams {
  version: string
}

export interface FetchPresignedUrlParams {
  presignedUrl: PreSignedUrl
}

export interface CreateStrategyParams {
  name: string
  strategies: StrategyItem[]
  description?: string
}

export interface FetchProductVersionsParams {
  productName: ProductType
}

export interface FetchAllProductVersionsParams {
  products: string[]
}

export interface UpdateStrategyParams {
  strategy: StrategiesListItem
}

export interface HybridResponse {
  licenseKey: string
  installerScript: string
}

export enum StrategyTypes {
  AUTOUPDATE = 'AutoUpdate',
  DO_NOT_UPDATE = 'DoNotUpdate',
  FIXED = 'Fixed',
}
