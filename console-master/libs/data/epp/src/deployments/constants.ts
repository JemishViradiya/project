import type { StrategiesListItem, UpdateRulesList } from '../deployments-service'

const DeploymentsReduxSlice = 'app.epp.deployments'

const UPDATE_STRATEGIES_LIST_DEFAULT_VALUE: StrategiesListItem[] = []

const UPDATE_RULES_LIST_DEFAULT_VALUE: UpdateRulesList = []

const DeploymentsActions = {
  FetchProductsStart: `${DeploymentsReduxSlice}/fetch-products-start`,
  FetchProductsSuccess: `${DeploymentsReduxSlice}/fetch-products-success`,
  FetchProductsError: `${DeploymentsReduxSlice}/fetch-products-error`,
  FetchOsFamiliesStart: `${DeploymentsReduxSlice}/fetch-os-families-start`,
  FetchOsFamiliesSuccess: `${DeploymentsReduxSlice}/fetch-os-families-success`,
  FetchOsFamiliesError: `${DeploymentsReduxSlice}/fetch-os-families-error`,
  ResetOsFamilies: `${DeploymentsReduxSlice}/reset-os-families`,
  FetchBuildVersions: `${DeploymentsReduxSlice}/fetch-build-versions`,
  FetchBuildVersionsStart: `${DeploymentsReduxSlice}/fetch-build-versions-start`,
  FetchBuildVersionsSuccess: `${DeploymentsReduxSlice}/fetch-build-versions-success`,
  FetchBuildVersionsError: `${DeploymentsReduxSlice}/fetch-build-versions-error`,
  ResetBuildVersions: `${DeploymentsReduxSlice}/reset-build-versions`,
  FetchPresignedUrlStart: `${DeploymentsReduxSlice}/fetch-presigned-url-start`,
  FetchPresignedUrlSuccess: `${DeploymentsReduxSlice}/fetch-presigned-url-success`,
  FetchPresignedUrlError: `${DeploymentsReduxSlice}/fetch-presigned-url-error`,
  ResetPresignedUrl: `${DeploymentsReduxSlice}/reset-presigned-url`,
  FetchPackagesStart: `${DeploymentsReduxSlice}/fetch-packages-start`,
  FetchPackagesSuccess: `${DeploymentsReduxSlice}/fetch-packages-success`,
  FetchPackagesError: `${DeploymentsReduxSlice}/fetch-packages-error`,
  ResetPackages: `${DeploymentsReduxSlice}/reset-packages`,
  FetchProductVersionsStart: `${DeploymentsReduxSlice}/fetch-product-versions-start`,
  FetchProductVersionsSuccess: `${DeploymentsReduxSlice}/fetch-product-versions-success`,
  FetchProductVersionsError: `${DeploymentsReduxSlice}/fetch-product-versions-error`,
  FetchAllProductVersionsStart: `${DeploymentsReduxSlice}/fetch-all-product-versions-start`,
  FetchAllProductVersionsSuccess: `${DeploymentsReduxSlice}/fetch-all-product-versions-success`,
  FetchAllProductVersionsError: `${DeploymentsReduxSlice}/fetch-all-product-versions-error`,
  FetchStrategiesStart: `${DeploymentsReduxSlice}/fetch-strategies-start`,
  FetchStrategiesSuccess: `${DeploymentsReduxSlice}/fetch-strategies-success`,
  FetchStrategiesError: `${DeploymentsReduxSlice}/fetch-strategies-error`,
  CreateStrategyStart: `${DeploymentsReduxSlice}/create-strategy-start`,
  CreateStrategySuccess: `${DeploymentsReduxSlice}/create-strategy-success`,
  CreateStrategyError: `${DeploymentsReduxSlice}/create-update-strategy-error`,
  UpdateStrategyStart: `${DeploymentsReduxSlice}/update-strategy-start`,
  UpdateStrategySuccess: `${DeploymentsReduxSlice}/update-strategy-success`,
  UpdateStrategyError: `${DeploymentsReduxSlice}/update-strategy-error`,
  FetchUpdateRulesStart: `${DeploymentsReduxSlice}/fetch-update-rules-start`,
  FetchUpdateRulesSuccess: `${DeploymentsReduxSlice}/fetch-update-rules-success`,
  FetchUpdateRulesError: `${DeploymentsReduxSlice}/fetch-update-rules-error`,
  FetchHybridLicenseKeyAndInstallerScriptStart: `${DeploymentsReduxSlice}/fetch-hybrid-license-key-and-installer-script-start`,
  FetchHybridLicenseKeyAndInstallerScriptSuccess: `${DeploymentsReduxSlice}/fetch-hybrid-license-key-and-installer-script-success`,
  FetchHybridLicenseKeyAndInstallerScriptError: `${DeploymentsReduxSlice}/fetch-hybrid-license-key-and-installer-script-error`,
}

export { DeploymentsReduxSlice, DeploymentsActions, UPDATE_STRATEGIES_LIST_DEFAULT_VALUE, UPDATE_RULES_LIST_DEFAULT_VALUE }
