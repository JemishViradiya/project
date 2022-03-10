export const SET_ROLE_LIST = '@Cylance/role/SET_ROLE_LIST'
export const GET_ROLE_LIST = '@Cylance/role/GET_ROLE_LIST'
export const CREATE_ROLE = '@Cylance/role/CREATE_ROLE'
export const DELETE_ROLE = '@Cylance/role/DELETE_ROLE'
export const EDIT_ROLE = '@Cylance/role/EDIT_ROLE'
export const GET_PERMISSION_LIST = '@Cylance/role/GET_PERMISSION_LIST'
export const SET_PERMISSION_LIST = '@Cylance/role/SET_PERMISSION_LIST'
export const UNSET_PERMISSION_LIST = '@Cylance/role/UNSET_PERMISSION_LIST'
export const GET_ROLE = '@Cylance/role/GET_ROLE'
export const SET_ROLE = '@Cylance/role/SET_ROLE'
export const UNSET_ROLE = '@Cylance/role/UNSET_ROLE'

export const setRoleList = response => ({
  type: SET_ROLE_LIST,
  payload: {
    totalCount: response.data.totalCount,
    listData: response.data.listData,
  },
})

export const getRoleList = gridParams => ({
  type: GET_ROLE_LIST,
  payload: {
    params: gridParams,
  },
})

export const getRoleById = roleId => ({
  type: GET_ROLE,
  payload: {
    roleId: roleId,
  },
})

export const setRole = roleModel => ({
  type: SET_ROLE,
  payload: {
    roleModel,
  },
})

export const getPermissionList = () => ({
  type: GET_PERMISSION_LIST,
})

export const setPermissionList = permissionList => ({
  type: SET_PERMISSION_LIST,
  payload: {
    permissionList,
  },
})

export const unsetPermissionList = () => ({
  type: UNSET_PERMISSION_LIST,
})

export const createRole = roleModel => ({
  type: CREATE_ROLE,
  payload: {
    roleModel: roleModel,
  },
})

export const deleteRole = roleId => ({
  type: DELETE_ROLE,
  payload: {
    roleId: roleId,
  },
})

export const editRole = (roleModel, roleId) => ({
  type: EDIT_ROLE,
  payload: {
    roleId: roleId,
    roleModel: roleModel,
  },
})

export const unsetRole = () => ({
  type: UNSET_ROLE,
})
