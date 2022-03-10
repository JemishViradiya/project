import { SET_INSTALLATION_TOKEN } from './actions'

const initialState = {
  token: '',
}

const setInstallationToken = (state, action) => {
  return {
    ...state,
    token: action.payload,
  }
}

export default function (state = initialState, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SET_INSTALLATION_TOKEN:
      return setInstallationToken(state, action)
    default:
      return state
  }
}
