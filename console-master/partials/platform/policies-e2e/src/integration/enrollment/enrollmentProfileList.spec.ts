/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { FeatureName, Permission } from '@ues-data/shared-types'

import { BasePage } from '../../support/pages/basePage'

const setLocalStorageState = win => {
  BasePage.setLocalStorageMock('true')
  win.localStorage.setItem(FeatureName.MobileThreatDetection, 'true')
  BasePage.setLocalStorageCronos('true')
  BasePage.setLocalStoragePermissionCheck('true')
}

describe('Enrollment policy list - RBAC', () => {
  before(() => {
    window.localStorage.clear()
    setLocalStorageState(window)
    I.loadI18nNamespaces('platform/common', 'access').then(() => {
      I.visit('#/userPolicies/activation')
    })
  })
  it('Full access', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = true
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = true
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.findAllByRole('button')
  })

  it('Readonly access', () => {})

  it('No access', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = false
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = false
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = false
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = false

    I.overridePermissions({ ...overridePermissionsObj })

    BasePage.findNotFoundMessage()
  })
})
