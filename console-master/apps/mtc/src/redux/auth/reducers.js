import jwtDecode from 'jwt-decode'
import { zipObject } from 'lodash'

import { TOKEN_UPDATE, USER_LOGIN_SUCCESS, USER_LOGOUT } from './actions'

function login(state, action) {
  const { per, exp, pid, uid, rid } = jwtDecode(action.payload.token)
  return {
    ...state,
    permissions: Array.isArray(per) ? zipObject(per, Array(per.length).fill(true)) : { [per]: true },
    expiration: exp,
    partnerId: pid,
    userId: uid,
    roleId: rid,
  }
}

function logout(state) {
  localStorage.removeItem(['persist:auth'])
  return {
    ...state,
  }
}

function updateToken(state, action) {
  login(state, action)
}

export default function (
  state = {
    permissions: {},
  },
  action,
) {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      return login(state, action)
    case USER_LOGOUT:
      return logout(state)
    case TOKEN_UPDATE:
      return updateToken(state, action)
    default:
      return {
        ...state,
      }
  }
}
