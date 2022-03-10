import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

export const setReadonlyPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = true
  overridePermissionsObj[Permission.ECS_DIRECTORY_CREATE] = false
  overridePermissionsObj[Permission.ECS_DIRECTORY_UPDATE] = false
  overridePermissionsObj[Permission.ECS_DIRECTORY_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

export const setFullPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = true
  overridePermissionsObj[Permission.ECS_DIRECTORY_CREATE] = true
  overridePermissionsObj[Permission.ECS_DIRECTORY_UPDATE] = true
  overridePermissionsObj[Permission.ECS_DIRECTORY_DELETE] = true
  I.overridePermissions({ ...overridePermissionsObj })
}

export const setNoPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = false
  overridePermissionsObj[Permission.ECS_DIRECTORY_CREATE] = false
  overridePermissionsObj[Permission.ECS_DIRECTORY_UPDATE] = false
  overridePermissionsObj[Permission.ECS_DIRECTORY_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

export const getCancelButton = () => BasePage.findButton('general/form:commonLabels.cancel')

export const getSyncTypes = () => ({
  USERS_AND_GROUPS: I.translate('platform/common:directory.syncSchedule.syncGroups.all'),
  GROUPS_ONBOARDING: I.translate('platform/common:directory.syncSchedule.syncGroups.onboarding'),
  GROUPS_DLG: I.translate('platform/common:directory.syncSchedule.syncGroups.linked'),
  USER_ATTRIBUTES: I.translate('platform/common:directory.syncSchedule.syncGroups.userAttributes'),
})

export const getDialog = () => I.findByRole('dialog')

export const getPresentationWithin = callback => I.findByRole('presentation').within(callback)
