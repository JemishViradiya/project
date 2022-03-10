/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { FeatureName, Permission } from '@ues-data/shared-types'

let noAccess: string

const setLocalStorageState = win => {
  win.localStorage.setItem('UES_DATA_MOCK', 'true')
  win.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  win.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
}

const getIgnoreButton = () => I.findByRole('button', { name: 'Ignore' })
const getSelectAllCheckbox = () => I.findByRole('checkbox', { name: 'Select All Rows checkbox' })

//--TODO: resolve "Max depth exceeded" error and un-skip these tests
describe.skip('Mobile alerts RBAC tests', () => {
  before(() => {
    window.localStorage.clear()
    setLocalStorageState(window)
    I.loadI18nNamespaces('access').then(() => {
      noAccess = I.translate('access:errors.notFound.title')
      I.visit(`#/mobile-alerts`)
    })
  })
  it('testing ignore button is visible with update permission', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_EVENTS_READ] = true
    overridePermissionsObj[Permission.MTD_EVENTS_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    getSelectAllCheckbox().click()
    getIgnoreButton().should('exist')
  })
  it('testing ignore button is not visible without update permission', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_EVENTS_READ] = true
    overridePermissionsObj[Permission.MTD_EVENTS_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    getSelectAllCheckbox().click()
    getIgnoreButton().should('not.exist')
  })
  it('testing read permission denied ', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_EVENTS_READ] = false
    overridePermissionsObj[Permission.MTD_EVENTS_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.findByText(noAccess).should('exist')
  })
})
