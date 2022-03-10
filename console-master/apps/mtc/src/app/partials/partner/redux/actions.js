export const GET_PARTNER_LIST = '@Cylance/api/partner/GET_PARTNER_LIST'
export const SET_PARTNER_LIST = '@Cylance/api/partner/SET_PARTNER_LIST'
export const GET_PARTNER_USER_LIST = '@Cylance/api/partner/GET_PARTNER_USER_LIST'
export const SET_PARTNER_USER_LIST = '@Cylance/api/partner/SET_PARTNER_USER_LIST'
export const GET_PARTNER_DETAILS = '@Cylance/api/partner/GET_PARTNER_DETAILS'
export const SET_PARTNER_DETAILS = '@Cylance/api/partner/SET_PARTNER_DETAILS'
export const CLEAR_PARTNER_DETAILS = '@Cylance/api/partner/CLEAR_PARTNER_DETAILS'
export const GET_PARTNER_DETAILS_BY_ID = '@Cylance/api/partner/GET_PARTNER_DETAILS_BY_ID'
export const GET_PARTNER_BILLING_INFO = '@Cylance/api/partner/GET_PARTNER_BILLING_INFO'
export const SET_PARTNER_BILLING_INFO = '@Cylance/api/partner/SET_PARTNER_BILLING_INFO'
export const CLEAR_PARTNER_BILLING_INFO = '@Cylance/api/partner/CLEAR_PARTNER_BILLING_INFO'
export const GET_PARTNER_BILLING_HISTORY = '@Cylance/api/partner/GET_PARTNER_BILLING_HISTORY'
export const SET_PARTNER_BILLING_HISTORY = '@Cylance/api/partner/SET_PARTNER_BILLING_HISTORY'
export const CLEAR_PARTNER_BILLING_HISTORY = '@Cylance/api/partner/CLEAR_PARTNER_BILLING_HISTORY'
export const CREATE_PARTNER = '@Cylance/partner/CREATE_PARTNER'
export const EDIT_PARTNER = '@Cylance/partner/EDIT_PARTNER'
export const EDIT_PARTNER_BILLING = '@Cylance/partner/EDIT_PARTNER_BILLING'
export const DELETE_PARTNER = '@Cylance/partner/DELETE_PARTNER'
export const SIGN_PARTNER_EULA = '@Cylance/partner/SIGN_PARTNER_EULA'

export const getPartnerList = gridParams => ({
  type: GET_PARTNER_LIST,
  payload: {
    params: gridParams,
  },
})

export const setPartnerList = response => ({
  type: SET_PARTNER_LIST,
  payload: {
    totalCount: response.data.totalCount,
    listData: response.data.listData,
  },
})

export const getPartnerUserList = partnerId => ({
  type: GET_PARTNER_USER_LIST,
  payload: {
    partnerId: partnerId,
  },
})

export const setPartnerUserList = partnerUserList => ({
  type: SET_PARTNER_USER_LIST,
  payload: partnerUserList,
})

export const getPartnerDetails = partnerId => ({
  type: GET_PARTNER_DETAILS,
  payload: {
    partnerId: partnerId,
  },
})

export const setPartnerDetails = partnerDetails => ({
  type: SET_PARTNER_DETAILS,
  payload: partnerDetails,
})

export const clearPartnerDetails = () => ({
  type: CLEAR_PARTNER_DETAILS,
})

export const getPartnerDetailsById = partnerId => ({
  type: GET_PARTNER_DETAILS_BY_ID,
  payload: partnerId,
})

export const getPartnerBillingInfo = partnerId => ({
  type: GET_PARTNER_BILLING_INFO,
  payload: {
    partnerId: partnerId,
  },
})

export const setPartnerBillingInfo = partnerBillingInfo => ({
  type: SET_PARTNER_BILLING_INFO,
  payload: partnerBillingInfo,
})

export const clearPartnerBillingInfo = () => ({
  type: CLEAR_PARTNER_BILLING_INFO,
})

export const getPartnerBillingHistory = partnerId => ({
  type: GET_PARTNER_BILLING_HISTORY,
  payload: {
    partnerId: partnerId,
  },
})

export const setPartnerBillingHistory = partnerHistory => ({
  type: SET_PARTNER_BILLING_HISTORY,
  payload: partnerHistory,
})

export const clearPartnerBillingHistory = () => ({
  type: CLEAR_PARTNER_BILLING_HISTORY,
})

export const createPartner = partnerModel => ({
  type: CREATE_PARTNER,
  payload: {
    partnerModel: partnerModel,
  },
})

export const editPartner = (partnerModel, partnerId) => ({
  type: EDIT_PARTNER,
  payload: {
    partnerId: partnerId,
    partnerModel: partnerModel,
  },
})

export const editPartnerBilling = (billingValues, partnerId) => ({
  type: EDIT_PARTNER_BILLING,
  payload: {
    partnerId: partnerId,
    billingValues: billingValues,
  },
})

export const deletePartner = partnerId => ({
  type: DELETE_PARTNER,
  payload: {
    partnerId: partnerId,
  },
})

export const signPartnerEula = id => ({
  type: SIGN_PARTNER_EULA,
  payload: { id },
})
