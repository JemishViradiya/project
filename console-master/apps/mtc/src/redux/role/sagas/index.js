import { all, takeLatest } from 'redux-saga/effects'

import { CREATE_ROLE, DELETE_ROLE, EDIT_ROLE, GET_PERMISSION_LIST, GET_ROLE, GET_ROLE_LIST } from '../actions'
import createRoleSaga from './createRole'
import deleteRoleSaga from './deleteRole'
import editRoleSaga from './editRole'
import getPermissionListSaga from './getPermissionList'
import getRoleByIdSaga from './getRoleById'
import getRoleListSaga from './getRoleList'

export { getRoleListSaga, createRoleSaga, deleteRoleSaga, editRoleSaga, getPermissionListSaga, getRoleByIdSaga }

export default function* watchers() {
  yield all([
    takeLatest(GET_ROLE_LIST, getRoleListSaga),
    takeLatest(CREATE_ROLE, createRoleSaga),
    takeLatest(DELETE_ROLE, deleteRoleSaga),
    takeLatest(EDIT_ROLE, editRoleSaga),
    takeLatest(GET_PERMISSION_LIST, getPermissionListSaga),
    takeLatest(GET_ROLE, getRoleByIdSaga),
  ])
}
