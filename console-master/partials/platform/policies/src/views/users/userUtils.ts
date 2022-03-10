import type { User } from '@ues-data/platform'
import { Permission } from '@ues-data/shared'

export const sources = {
  curUserDataSource: 'cur',
  localUserDataSource: 'ldap',
  azureUserDataSource: 'azure',
  adUserDataSource: 'active_directory',
}

export const renderDataSource = (dataSource: string, t) => {
  return t(`users.add.dataSource.${dataSource}`)
}

export const isCompleted = (current, previous) => {
  return current && !current.loading && previous.loading
}

export const firstPath = (routes: { path: string }[]) => {
  return routes[0].path.replace('*', '')
}

export const userActions = {
  REMOVE_TOTP_ENROLLMENT: 'removeTOTPEnrollment',
  VIEW_USER_DETAILS: 'viewUserDetails',
  EDIT_USER_DETAILS: 'editUserDetails',
  DELETE_USER: 'deleteUser',
}

export const userActionsTranslations = {
  [userActions.REMOVE_TOTP_ENROLLMENT]: 'users.details.actions.removeTOTPEnrollment',
  [userActions.VIEW_USER_DETAILS]: 'users.details.actions.viewUserDetails',
  [userActions.EDIT_USER_DETAILS]: 'users.details.actions.editUserDetails',
  [userActions.DELETE_USER]: 'users.details.actions.deleteUser',
}

export const actionIsAllowed = (action, hasPermission, userDataSource, totpEnrolled, eidTOTPEnrollmentEnabled) => {
  const canEdit = () => hasPermission(Permission.ECS_USERS_UPDATE) && userDataSource === sources.curUserDataSource

  switch (action) {
    case userActions.DELETE_USER:
      return hasPermission(Permission.ECS_USERS_DELETE)
    case userActions.VIEW_USER_DETAILS:
      return hasPermission(Permission.ECS_USERS_READ) && !canEdit()
    case userActions.EDIT_USER_DETAILS:
      return canEdit()
    case userActions.REMOVE_TOTP_ENROLLMENT:
      return eidTOTPEnrollmentEnabled && hasPermission(Permission.ECS_USERS_UPDATE) && totpEnrolled
    default:
      return false
  }
}

export const prepareUserData = (user: User): User => {
  const tempUser = {}

  for (const key in user) {
    if (user[key] !== '') {
      tempUser[key] = typeof user[key] == 'string' ? user[key]?.trim() : user[key]
    }
  }

  return tempUser as User
}
