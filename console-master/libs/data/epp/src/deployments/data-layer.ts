import type { ReduxQuery } from '@ues-data/shared'
import { NoPermissions, Permission } from '@ues-data/shared'

import type { BuildVersion, HybridResponse, Product, StrategiesListItem, UpdateRulesList } from '../deployments-service'
import { DeploymentsApi, DeploymentsMockApi } from '../deployments-service'
import {
  createStrategyStart,
  fetchAllProductVersionsStart,
  fetchBuildVersionsStart,
  fetchHybridLicenseKeyAndInstallerScriptStart,
  fetchOsFamiliesStart,
  fetchPackagesStart,
  fetchPresignedUrlStart,
  fetchProductsStart,
  fetchProductVersionsStart,
  fetchStrategiesStart,
  fetchUpdateRulesStart,
  updateStrategyStart,
} from './actions'
import { DeploymentsReduxSlice } from './constants'
import {
  selectAllProductVersions,
  selectBuildVersions,
  selectCreateStrategy,
  selectHybrid,
  selectOsFamilies,
  selectPackages,
  selectPresignedUrl,
  selectProducts,
  selectProductVersions,
  selectStrategies,
  selectUpdateRules,
  selectUpdateStrategy,
} from './selectors'
import type { DeploymentsState, TaskId } from './types'

const installerReadPermissions = new Set([Permission.DEPLOYMENTS_INSTALLER_READ])

const queryProducts: ReduxQuery<Product[], Parameters<typeof fetchProductsStart>[0], DeploymentsState['tasks'][TaskId.Products]> = {
  query: () => fetchProductsStart(DeploymentsApi),
  mockQuery: () => fetchProductsStart(DeploymentsMockApi),
  selector: () => selectProducts,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

const queryOsFamilies: ReduxQuery<
  Product[],
  Parameters<typeof fetchOsFamiliesStart>[0],
  DeploymentsState['tasks'][TaskId.OsFamilies]
> = {
  query: payload => fetchOsFamiliesStart(payload, DeploymentsApi),
  mockQuery: payload => fetchOsFamiliesStart(payload, DeploymentsMockApi),
  selector: () => selectOsFamilies,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

const queryBuildVersions: ReduxQuery<
  BuildVersion[],
  Parameters<typeof fetchBuildVersionsStart>[0],
  DeploymentsState['tasks'][TaskId.BuildVersions]
> = {
  query: payload => fetchBuildVersionsStart(payload, DeploymentsApi),
  mockQuery: payload => fetchBuildVersionsStart(payload, DeploymentsMockApi),
  selector: () => selectBuildVersions,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

const queryPackages: ReduxQuery<string[], Parameters<typeof fetchPackagesStart>[0], DeploymentsState['tasks'][TaskId.Packages]> = {
  query: payload => fetchPackagesStart(payload, DeploymentsApi),
  mockQuery: payload => fetchPackagesStart(payload, DeploymentsMockApi),
  selector: () => selectPackages,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

const queryPresignedUrl: ReduxQuery<
  string,
  Parameters<typeof fetchPresignedUrlStart>[0],
  DeploymentsState['tasks'][TaskId.PresignedUrl]
> = {
  query: payload => fetchPresignedUrlStart(payload, DeploymentsApi),
  mockQuery: payload => fetchPresignedUrlStart(payload, DeploymentsMockApi),
  selector: () => selectPresignedUrl,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

const queryStrategies: ReduxQuery<
  StrategiesListItem[],
  Parameters<typeof fetchStrategiesStart>[0],
  DeploymentsState['tasks'][TaskId.Strategies]
> = {
  query: () => fetchStrategiesStart(DeploymentsApi),
  mockQuery: () => fetchStrategiesStart(DeploymentsMockApi),
  selector: () => selectStrategies,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: NoPermissions,
}

const mutateCreateStrategy: ReduxQuery<
  StrategiesListItem,
  Parameters<typeof createStrategyStart>[0],
  DeploymentsState['tasks'][TaskId.CreateStrategy]
> = {
  query: payload => createStrategyStart(payload, DeploymentsApi),
  mockQuery: payload => createStrategyStart(payload, DeploymentsMockApi),
  selector: () => selectCreateStrategy,
  slice: DeploymentsReduxSlice,
  permissions: NoPermissions,
}

const mutateUpdateStrategy: ReduxQuery<
  StrategiesListItem,
  Parameters<typeof updateStrategyStart>[0],
  DeploymentsState['tasks'][TaskId.UpdateStrategy]
> = {
  query: payload => updateStrategyStart(payload, DeploymentsApi),
  mockQuery: payload => updateStrategyStart(payload, DeploymentsMockApi),
  selector: () => selectUpdateStrategy,
  slice: DeploymentsReduxSlice,
  permissions: NoPermissions,
}

const queryUpdateRules: ReduxQuery<
  UpdateRulesList,
  Parameters<typeof fetchUpdateRulesStart>[0],
  DeploymentsState['tasks'][TaskId.UpdateRules]
> = {
  query: () => fetchUpdateRulesStart(DeploymentsApi),
  mockQuery: () => fetchUpdateRulesStart(DeploymentsMockApi),
  selector: () => selectUpdateRules,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: NoPermissions,
}

const queryProductVersions: ReduxQuery<
  string[],
  Parameters<typeof fetchProductVersionsStart>[0],
  DeploymentsState['tasks'][TaskId.ProductVersions]
> = {
  query: payload => fetchProductVersionsStart(payload, DeploymentsApi),
  mockQuery: payload => fetchProductVersionsStart(payload, DeploymentsMockApi),
  selector: () => selectProductVersions,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: NoPermissions,
}

const queryAllProductVersions: ReduxQuery<
  Record<string, unknown>,
  Parameters<typeof fetchAllProductVersionsStart>[0],
  DeploymentsState['tasks'][TaskId.AllProductVersions]
> = {
  query: payload => fetchAllProductVersionsStart(payload, DeploymentsApi),
  mockQuery: payload => fetchAllProductVersionsStart(payload, DeploymentsMockApi),
  selector: () => selectAllProductVersions,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: NoPermissions,
}

const queryHybrid: ReduxQuery<
  HybridResponse,
  Parameters<typeof fetchHybridLicenseKeyAndInstallerScriptStart>[0],
  DeploymentsState['tasks'][TaskId.Hybrid]
> = {
  query: () => fetchHybridLicenseKeyAndInstallerScriptStart(DeploymentsApi),
  mockQuery: () => fetchHybridLicenseKeyAndInstallerScriptStart(DeploymentsMockApi),
  selector: () => selectHybrid,
  slice: DeploymentsReduxSlice,
  dataProp: 'result',
  permissions: installerReadPermissions,
}

export {
  queryOsFamilies,
  queryProducts,
  queryBuildVersions,
  queryPackages,
  queryPresignedUrl,
  queryStrategies,
  mutateCreateStrategy,
  queryUpdateRules,
  queryProductVersions,
  queryAllProductVersions,
  mutateUpdateStrategy,
  queryHybrid,
}
