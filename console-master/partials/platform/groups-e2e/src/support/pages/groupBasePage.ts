import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

const setNoAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = false
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const setFullAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = true
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = true
  I.overridePermissions({ ...overridePermissionsObj })
}

const setReadOnlyAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const setReadAndCreateAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const setReadAndDeleteAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = true
  I.overridePermissions({ ...overridePermissionsObj })
}

const setReadCreateAndUpdateAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = true
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}
const setReadCreateAndDeleteAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = true
  I.overridePermissions({ ...overridePermissionsObj })
}

const navigateToGroup = name => I.findByRole('link', { name }).click()

export const GroupBasePage = {
  navigateToGroup,
  setFullAccess,
  setNoAccess,
  setReadOnlyAccess,
  setReadAndCreateAccess,
  setReadAndDeleteAccess,
  setReadCreateAndUpdateAccess,
  setReadCreateAndDeleteAccess,
  ...BasePage,
}
