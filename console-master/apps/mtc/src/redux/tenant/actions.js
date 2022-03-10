export const DELETE_INSTALLATION_TOKEN = '@Cylance/tenant/DELETE_INSTALLATION_TOKEN'
export const REGENERATE_INSTALLATION_TOKEN = '@Cylance/tenant/REGENERATE_INSTALLATION_TOKEN'
export const GET_INSTALLATION_TOKEN = '@Cylance/tenant/GET_INSTALLATION_TOKEN'
export const SET_INSTALLATION_TOKEN = '@Cylance/tenant/SET_INSTALLATION_TOKEN'
export const GET_TENANT_LIST = '@Cylance/api/tenant/GET_LIST'
export const SET_TENANT_LIST = '@Cylance/api/tenant/SET_LIST'
export const CLEAR_TENANT_LIST = '@Cylance/api/tenant/CLEAR_TENANT_LIST'
export const GET_TENANT_DEVICE_LIST = '@Cylance/api/tenant/GET_TENANT_DEVICE_LIST'
export const SET_TENANT_DEVICE_LIST = '@Cylance/api/tenant/SET_TENANT_DEVICE_LIST'
export const UNSET_TENANT_DEVICE_LIST = '@Cylance/api/tenant/SET_TENANT_DEVICE_LIST'
export const GET_TENANT_FEATURES = '@Cylance/api/tenant/GET_TENANT_FEATURES'
export const SET_TENANT_FEATURES = '@Cylance/api/tenant/SET_TENANT_FEATURES'
export const SAVE_TENANT_FEATURES = '@Cylance/api/tenant/SAVE_TENANT_FEATURES'
export const UNSET_TENANT_FEATURES = '@Cylance/api/tenant/UNSET_TENANT_FEATURES'

export const EDIT_TENANT_DETAILS = '@Cylance/tenant/EDIT_TENANT_DETAILS'
export const GET_TENANT_DETAILS = '@Cylance/api/tenant/GET_TENANT_DETAILS'
export const SET_TENANT_DETAILS = '@Cylance/api/tenant/SET_TENANT_DETAILS'
export const UNSET_TENANT_DETAILS = '@Cylance/api/tenant/UNSET_TENANT_DETAILS'
export const GET_TENANT_EULA = '@Cylance/api/tenant/GET_TENANT_EULA'
export const SET_TENANT_EULA = '@Cylance/api/tenant/SET_TENANT_EULA'
export const GET_TENANT_LICENSE_INFO = '@Cylance/api/tenant/GET_TENANT_LICENSE_INFO'
export const SET_TENANT_LICENSE_INFO = '@Cylance/api/tenant/SET_TENANT_LICENSE_INFO'
export const CONVERT_TENANT_TO_CUSTOMER = '@Cylance/api/tenant/CONVERT_TENANT_TO_CUSTOMER'
export const SET_TENANT_LICENSE_TYPE = '@Cylance/tenant/SET_TENANT_LICENSE_TYPE'

export const saveTenantFeatures = (tenantId, features) => ({
  type: SAVE_TENANT_FEATURES,
  payload: {
    tenantId,
    features,
  },
})

export const unsetTenantFeatures = () => ({
  type: UNSET_TENANT_FEATURES,
})

export const getTenantFeatures = tenantId => ({
  type: GET_TENANT_FEATURES,
  payload: {
    tenantId,
  },
})

export const setTenantFeatures = features => ({
  type: SET_TENANT_FEATURES,
  payload: {
    features,
  },
})

export const getInstallationToken = tenantId => ({
  type: GET_INSTALLATION_TOKEN,
  payload: {
    tenantId,
  },
})

export const regenerateInstallationToken = tenantId => ({
  type: REGENERATE_INSTALLATION_TOKEN,
  payload: {
    tenantId,
  },
})

export const deleteInstallationToken = tenantId => ({
  type: DELETE_INSTALLATION_TOKEN,
  payload: {
    tenantId,
  },
})

export const setInstallationToken = installationToken => ({
  type: SET_INSTALLATION_TOKEN,
  payload: installationToken,
})

export const getTenantList = (gridParams, noResolve) => ({
  type: GET_TENANT_LIST,
  payload: { gridParams, noResolve },
})

export const setTenantList = tenantList => ({
  type: SET_TENANT_LIST,
  payload: tenantList,
})

export const clearTenantList = () => ({
  type: CLEAR_TENANT_LIST,
})

export const getTenantDeviceList = (params, tenantId) => ({
  type: GET_TENANT_DEVICE_LIST,
  payload: {
    tenantId,
    params,
  },
})

export const setTenantDeviceList = deviceList => ({
  type: SET_TENANT_DEVICE_LIST,
  payload: deviceList,
})

export const unsetTenantDeviceList = () => ({
  type: UNSET_TENANT_DEVICE_LIST,
})

export const editTenantDetails = (tenantId, tenantDetailsModel) => ({
  type: EDIT_TENANT_DETAILS,
  payload: {
    tenantId: tenantId,
    tenantDetailsModel: tenantDetailsModel,
  },
})

export const getTenantDetails = tenantId => ({
  type: GET_TENANT_DETAILS,
  payload: tenantId,
})

export const setTenantDetails = tenantDetails => ({
  type: SET_TENANT_DETAILS,
  payload: tenantDetails,
})

export const unsetTenantDetails = () => ({
  type: UNSET_TENANT_DETAILS,
})

export const getTenantEULA = tenantId => ({
  type: GET_TENANT_EULA,
  payload: {
    tenantId: tenantId,
  },
})

export const setTenantEULA = tenantEULA => ({
  type: SET_TENANT_EULA,
  payload: tenantEULA,
})

export const getTenantLicenseInfo = tenantId => ({
  type: GET_TENANT_LICENSE_INFO,
  payload: {
    tenantId: tenantId,
  },
})

export const setTenantLicenseInfo = tenantLicenseInfo => ({
  type: SET_TENANT_LICENSE_INFO,
  payload: tenantLicenseInfo,
})

export const convertTenantToCustomer = tenantId => ({
  type: CONVERT_TENANT_TO_CUSTOMER,
  payload: {
    tenantId: tenantId,
  },
})

export const setTenantLicenseType = licenseType => ({
  type: SET_TENANT_LICENSE_TYPE,
  payload: licenseType,
})
