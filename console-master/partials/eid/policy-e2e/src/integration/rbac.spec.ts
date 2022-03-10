/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { authenticatorsMock, policyMock } from '@ues-data/eid/mocks'
import { Permission } from '@ues-data/shared-types'

import {
  beDisabled,
  beEnabled,
  beVisible,
  exist,
  getButton,
  getButtons,
  getLabel,
  getSaveAsButton,
  getSubmitButton,
  getTextBoxLabel,
  mockPolicyGuid,
  notExist,
  setLocalStorageState,
} from '../support/settings'

const policyNameForUpdateCreate = 'updateCreateName'
const authenticatorNameOption = authenticatorsMock[0].name

let noPermission: string
let noAccessMessage: string

const loadStrings = () => {
  I.loadI18nNamespaces('platform/common', 'access').then(() => {
    noPermission = I.translate('access:errors.notFound.title')
    noAccessMessage = I.translate('access:errors.notFound.description')
  })
}

const validateEnabled = (enabled: boolean) => {
  const enableCheck: string = enabled ? beEnabled : beDisabled
  getTextBoxLabel('name').should(enableCheck)
  getTextBoxLabel('description').should(enableCheck)
  if (enabled) {
    getButtons('authenticatorsList.addButton').first().should(enableCheck)
  } else {
    getButtons('authenticatorsList.addButton').should(notExist)
  }
}

const validateNoAccess = () => {
  I.findByText(noPermission).scrollIntoView().should(exist).should(beVisible)
  I.findByText(noAccessMessage).scrollIntoView().should(exist).should(beVisible)
}
describe('EID policy create RBAC testcases', () => {
  before(() => {
    loadStrings()
    setLocalStorageState()
    // Single visit for all create tests
    I.visit('#/enterpriseIdentity/create')
  })
  it('testing Permission.ECS_IDENTITY_CREATE', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      validateEnabled(true)

      // remove policy create and verify access denied message exists
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_IDENTITY_CREATE] = false
      I.overridePermissions({ ...overridePermissionsObj })
      validateNoAccess()
    })
  })
  // This testcase MUST be the last one executed in this describe
  it('testing Permission.ECS_USERS_UPDATE', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      // Add some history to navigate back from (required in Chrome browser)
      window.history.pushState({ urlPath: `#/enterpriseIdentity/create` }, '', `#/enterpriseIdentity/create`)
      // remove ECS_USERS_UPDATE and verify policy create does NOT get redirected to assign
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
      I.overridePermissions({ ...overridePermissionsObj })

      // Must specify a authenticator prior to saving policy
      getButton('authenticatorsList.addButton').click()
      I.findByRole('generic', { name: getLabel('addAuthenticatorsDialog.dropdownLabel') }).type(authenticatorNameOption + '{enter}')
      getButton('addAuthenticatorsDialog.addButton').click()

      getTextBoxLabel('name').clear().type(policyNameForUpdateCreate)
      getSubmitButton(true).click().wait(2000)
      I.findByText(getLabel('createPolicyAssignConfirmationDialog.title')).should(notExist)
    })
  })
})
describe('EID policy update RBAC testcases', () => {
  before(() => {
    loadStrings()
    setLocalStorageState()
    // Single visit for all update tests
    I.visit(`#/enterpriseIdentity/update/${mockPolicyGuid}`)
  })
  beforeEach(() => {
    setLocalStorageState()
    // Reset permissions setting between tests
    const overridePermissionsObj = {}
    I.overridePermissions({ ...overridePermissionsObj })
  })
  it('testing Permission.ECS_IDENTITY_UPDATE', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      // Remove policy update and verify page properties are diabled
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_IDENTITY_UPDATE] = false
      I.overridePermissions({ ...overridePermissionsObj })
      validateEnabled(false)
    })
  })
  it('testing Permission.ECS_IDENTITY_CREATE', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      validateEnabled(true)

      // Make the form dirty and verify saveas button
      getTextBoxLabel('name').clear().type(policyNameForUpdateCreate)
      getSaveAsButton().should(beVisible)
      getTextBoxLabel('name').clear().type(policyMock[0].name)
      getSaveAsButton().should(notExist)

      // Remove policy create and verify no saveas button when form dirty
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_IDENTITY_CREATE] = false
      I.overridePermissions({ ...overridePermissionsObj })
      getTextBoxLabel('name').clear().type(policyNameForUpdateCreate)
      getSaveAsButton().should(notExist)
    })
  })
  it('testing Permission.ECS_IDENTITY_READ', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      validateEnabled(true)
      // Remove policy read and verify no access message is displayed
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_IDENTITY_READ] = false
      I.overridePermissions({ ...overridePermissionsObj })

      // Verify "no access" message is displayed
      validateNoAccess()
    })
  })
  it('testing Permission.ECS_IDENTITY_DELETE', () => {
    I.loadI18nNamespaces('eid/common').then(() => {
      getButton('updateFormDeletePolicyTooltip').scrollIntoView().should(beVisible)
      // Remove policy delete and verify delete button is not displayed
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_IDENTITY_DELETE] = false
      I.overridePermissions({ ...overridePermissionsObj })
      getButton('updateFormDeletePolicyTooltip').should(notExist)
    })
  })
})
