export const GET_SSO_CONFIG = '@Cylance/account/GET_SSO_CONFIG'
export const EDIT_SSO_CONFIG = '@Cylance/account/EDIT_SSO_CONFIG'
export const SET_SSO_CONFIG = '@Cylance/account/SET_SSO_CONFIG'
export const CLEAR_SSO_CONFIG = '@Cylance/account/CLEAR_SSO_CONFIG'

export const getSsoConfig = partnerId => ({
  type: GET_SSO_CONFIG,
  payload: partnerId,
})

export const editSsoConfig = ssoConfigUpdates => ({
  type: EDIT_SSO_CONFIG,
  payload: ssoConfigUpdates,
})

export const setSsoConfig = ssoConfigModel => ({
  type: SET_SSO_CONFIG,
  payload: ssoConfigModel,
})

export const clearSsoConfig = () => ({
  type: CLEAR_SSO_CONFIG,
  payload: null,
})
