export const USER_FORGOT_PASSWORD = '@Cylance/auth/USER_FORGOT_PASSWORD'
export const USER_LOGIN = '@Cylance/auth/USER_LOGIN'
export const USER_LOGIN_SUCCESS = '@Cylance/auth/USER_LOGIN_SUCCESS'
export const USER_LOGOUT = '@Cylance/auth/USER_LOGOUT'
export const TOKEN_UPDATE = '@Cylance/auth/TOKEN_UPDATE'
export const EXTERNAL_AUTH_LOGIN = '@Cylance/auth/EXTERNAL_AUTH_LOGIN'
export const REQUEST_IDP_REDIRECT = '@Cylance/auth/REQUEST_IDP_REDIRECT'

export const requestForgotPassword = email => ({
  type: USER_FORGOT_PASSWORD,
  payload: email,
})

export const loginUser = (email, password) => ({
  type: USER_LOGIN,
  payload: { email, password },
})

export const loginUserSuccess = (token, email) => ({
  type: USER_LOGIN_SUCCESS,
  payload: { token, email },
})

export const logoutUser = () => ({
  type: USER_LOGOUT,
})

export const updateToken = token => ({
  type: TOKEN_UPDATE,
  payload: { token },
})

export const externalAuthLogin = ({ email, token }) => ({
  type: EXTERNAL_AUTH_LOGIN,
  payload: { email, token },
})

export const requestIdpRedirect = ({ email, region }) => ({
  type: REQUEST_IDP_REDIRECT,
  payload: { email, region },
})
