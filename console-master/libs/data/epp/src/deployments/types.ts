import type {
  BuildVersion,
  DeploymentsApi,
  DeploymentsMockApi,
  Hybrid,
  OsFamily,
  Product,
  ProductVersions,
  StrategiesListItem,
  UpdateRulesList,
} from '../deployments-service'

export enum TaskId {
  Products = 'products',
  OsFamilies = 'osFamilies',
  BuildVersions = 'buildVersions',
  PresignedUrl = 'presignedUrl',
  Packages = 'packages',
  Strategies = 'updateStrategies',
  CreateStrategy = 'createStrategy',
  UpdateStrategy = 'updateStrategy',
  UpdateRules = 'updateRules',
  ProductVersions = 'productVersions',
  AllProductVersions = 'allProductVersions',
  Hybrid = 'hybrid',
}
export interface Task<TResult = unknown> {
  loading?: boolean
  error?: Error
  result?: TResult
}

export type ApiProvider = typeof DeploymentsApi | typeof DeploymentsMockApi

export interface DeploymentsState {
  tasks?: {
    [TaskId.Products]?: Task<Product[]>
    [TaskId.OsFamilies]?: Task<OsFamily[]>
    [TaskId.BuildVersions]?: Task<BuildVersion[]>
    [TaskId.PresignedUrl]?: Task<string>
    [TaskId.Packages]?: Task<string[]>
    [TaskId.Strategies]: Task<Partial<StrategiesListItem[]>>
    [TaskId.CreateStrategy]: Task
    [TaskId.UpdateStrategy]: Task
    [TaskId.UpdateRules]?: Task<Partial<UpdateRulesList>>
    [TaskId.ProductVersions]?: Task<ProductVersions[]>
    [TaskId.AllProductVersions]?: Task<Record<string, unknown>>
    [TaskId.Hybrid]?: Task<Hybrid>
  }
}
