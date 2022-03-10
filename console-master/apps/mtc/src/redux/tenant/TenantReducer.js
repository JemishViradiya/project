import {
  CLEAR_TENANT_LIST,
  SET_TENANT_DETAILS,
  SET_TENANT_DEVICE_LIST,
  SET_TENANT_EULA,
  SET_TENANT_FEATURES,
  SET_TENANT_LICENSE_INFO,
  SET_TENANT_LICENSE_TYPE,
  SET_TENANT_LIST,
  UNSET_TENANT_DETAILS,
  UNSET_TENANT_DEVICE_LIST,
  UNSET_TENANT_FEATURES,
} from './actions'

const initialState = {
  tenantList: {
    listData: [],
    totalCount: null,
  },
  tenantDeviceList: {},
  tenantDetails: {
    approvedDateTime: null,
    licenseType: null,
    eula: {
      listData: [],
      totalCount: null,
    },
    isDeletable: null,
    licenseInfo: {},
    name: null,
    shutdownDate: null,
    status: null,
    term: null,
  },
}

const setList = (state, action) => ({
  ...state,
  tenantList: action.payload.data,
})

const clearTenantList = state => ({
  ...state,
  tenantList: initialState.tenantList,
})

const setTenantDeviceList = (state, action) => ({
  ...state,
  tenantDeviceList: action.payload,
})

const unsetTenantDeviceList = state => ({
  ...state,
  tenantDeviceList: {},
})

const setTenantDetails = (state, action) => ({
  ...state,
  tenantDetails: {
    ...state.tenantDetails,
    ...action.payload,
  },
})

const setTenantEULA = (state, action) => ({
  ...state,
  tenantDetails: {
    ...state.tenantDetails,
    eula: action.payload,
  },
})

const setTenantLicenseInfo = (state, action) => ({
  ...state,
  tenantDetails: {
    ...state.tenantDetails,
    licenseInfo: action.payload,
  },
})

const unsetTenantDetails = state => ({
  ...state,
  tenantDetails: initialState.tenantDetails,
})

const setTenantLicenseType = (state, action) => ({
  ...state,
  tenantDetails: {
    ...state.tenantDetails,
    licenseType: action.payload,
  },
})

const setTenantFeatures = (state, action) => ({
  ...state,
  tenantFeatures: action.payload.features,
})

const unsetTenantFeatures = state => ({
  ...state,
  tenantFeatures: null,
})

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TENANT_LIST:
      return setList(state, action)
    case SET_TENANT_DEVICE_LIST:
      return setTenantDeviceList(state, action)
    case UNSET_TENANT_DEVICE_LIST:
      return unsetTenantDeviceList(state)
    case SET_TENANT_DETAILS:
      return setTenantDetails(state, action)
    case UNSET_TENANT_DETAILS:
      return unsetTenantDetails(state)
    case SET_TENANT_EULA:
      return setTenantEULA(state, action)
    case SET_TENANT_LICENSE_INFO:
      return setTenantLicenseInfo(state, action)
    case SET_TENANT_LICENSE_TYPE:
      return setTenantLicenseType(state, action)
    case CLEAR_TENANT_LIST:
      return clearTenantList(state)
    case SET_TENANT_FEATURES:
      return setTenantFeatures(state, action)
    case UNSET_TENANT_FEATURES:
      return unsetTenantFeatures(state)
    default:
      return state
  }
}
