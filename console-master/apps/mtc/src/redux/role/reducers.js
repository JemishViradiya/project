import { SET_PERMISSION_LIST, SET_ROLE, SET_ROLE_LIST, UNSET_PERMISSION_LIST, UNSET_ROLE } from './actions'

const setRoleList = (state, action) => {
  return {
    ...state,
    list: action.payload,
  }
}

const setPermissionList = (state, action) => {
  return {
    ...state,
    permissionList: action.payload.permissionList,
  }
}

const setRole = (state, action) => {
  return {
    ...state,
    selectedRole: action.payload.roleModel,
  }
}

const unsetRole = state => {
  return {
    ...state,
    selectedRole: undefined,
  }
}

const unsetPermissionList = state => {
  return {
    ...state,
    permissionList: undefined,
  }
}

export default function (state = {}, action) {
  switch (action.type) {
    case SET_ROLE_LIST:
      return setRoleList(state, action)
    case SET_PERMISSION_LIST:
      return setPermissionList(state, action)
    case SET_ROLE:
      return setRole(state, action)
    case UNSET_PERMISSION_LIST:
      return unsetPermissionList(state)
    case UNSET_ROLE:
      return unsetRole(state)
    default:
      return {
        ...state,
      }
  }
}
