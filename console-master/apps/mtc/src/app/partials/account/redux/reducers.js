import { CLEAR_SSO_CONFIG, SET_SSO_CONFIG } from './actions'

const initialState = {
  ssoConfig: {
    isEnabled: false,
    x509Certificate: null,
    loginUrl: null,
    provider: null,
    allowPasswordLogin: true,
  },
}

function setSsoConfig(state, action) {
  return {
    ...state,
    ssoConfig: action.payload,
  }
}

function clearSsoConfig(state) {
  return {
    ...state,
    ssoConfig: initialState.ssoConfig,
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SSO_CONFIG:
      return setSsoConfig(state, action)
    case CLEAR_SSO_CONFIG:
      return clearSsoConfig(state)
    default:
      return state
  }
}
