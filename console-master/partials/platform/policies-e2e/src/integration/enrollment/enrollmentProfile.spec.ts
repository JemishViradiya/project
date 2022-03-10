/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { activationProfilesMocks, mockActivationProfileGuids } from '@ues-data/platform/mocks'
import { Permission } from '@ues-data/shared-types'

const setLocalStorageState = win => {
  win.localStorage.setItem('UES_DATA_MOCK', 'true')
  win.localStorage.setItem('UES.MTD.enabled', 'true')
  win.localStorage.setItem('ues.nav.cronos.enabled', 'true')
  win.localStorage.setItem('ues.permission.checks.enabled', 'true')
}

const mockPolicyGuid = mockActivationProfileGuids.androidAndIOSButIOSInLowerCaseGuid

describe('Enrollment Profile - RBAC', () => {
  let noAccessString: string
  let noAccessMessageString: string

  before(() => {
    window.localStorage.clear()
    setLocalStorageState(window)
    I.loadI18nNamespaces('platform/common', 'access', 'general/form').then(() => {
      noAccessString = I.translate('access:errors.notFound.title')
      noAccessMessageString = I.translate('access:errors.notFound.description')
      I.visit(`#/activation/edit/${mockPolicyGuid}`)
    })
  })

  const verifyTextField = (labelString, isVisible, value, isDisabled) => {
    if (isVisible) {
      I.findByText(labelString)
        .should('exist')
        .and('be.visible')
        .next()
        .within(() => {
          I.findByRole('textbox')
            .should('have.value', value)
            .and((isDisabled ? '' : 'not.') + 'be.disabled')
        })
    } else {
      I.findByText(labelString).should('not.exist')
    }
  }
  const verifySettingsContent = (shouldExist, isDisabled = false) => {
    const activationProfileMockEntry = activationProfilesMocks.find(entry => entry.id === mockPolicyGuid)

    verifyTextField('Name*', shouldExist, activationProfileMockEntry.name.trim(), isDisabled)
    verifyTextField('Description', shouldExist, activationProfileMockEntry.description?.trim(), isDisabled)

    // settings heading should exist
    I.findByRole('heading', { name: 'Settings' }).should((shouldExist ? '' : 'not.') + 'exist')
    if (shouldExist) {
      I.findByRole('group').within(() => {
        // find mobile platform tab ios/Android group button
        I.findByRole('button', { name: 'Mobile' }).should(
          (activationProfileMockEntry.allowedMobilePlatformsEnabled ? '' : 'not.') + 'exist',
        )
        I.findByRole('button', { name: 'GATEWAY DESKTOP' }).should(
          (activationProfileMockEntry.allowedDesktopPlatformsEnabled ? '' : 'not.') + 'exist',
        )
      })
    } else {
      I.findByRole('group').should('not.exist')
    }
    // TODO: need to verify more stuff on the page, but this sets up framework to do so.
  }

  it('testing read permission', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = true
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_CREATE] = true
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_UPDATE] = true
    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_DELETE] = true

    I.overridePermissions({ ...overridePermissionsObj })

    I.findByRole('heading', { name: noAccessString }).should('not.exist')
    I.findByText(noAccessMessageString).should('not.exist')

    // verify content of the page here that all is visible
    verifySettingsContent(true /*isVisible*/, false /*isDisabled*/)

    overridePermissionsObj[Permission.ECS_ACTIVATIONPROFILE_READ] = false

    I.overridePermissions({ ...overridePermissionsObj })
    verifySettingsContent(false /*isVisible*/)

    I.findByRole('heading', { name: noAccessString }).should('exist')
    I.findByText(noAccessMessageString).should('exist')
  })
})

describe('Enrollment Profile assignment - RBAC', () => {
  before(() => {
    setLocalStorageState(window)
    I.loadI18nNamespaces('platform/common', 'tables', 'profiles', 'general/form').then(() => {
      I.visit(`#/activation/edit/${mockPolicyGuid}?tabId=1`)
    })
  })

  it('user and group assignment enabled', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByRole('button', { name: I.translate('profiles:policy.assignment.add') }).should('exist')
    I.findByRole('cell', { name: I.translate('tables:selectAll') })
      .should('exist')
      .click()
    I.findByRole('button', { name: I.translate('profiles:policy.removeButton') }).should('exist')
  })

  it('user and group assignment disabled', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByRole('button', { name: I.translate('profiles:policy.assignment.add') }).should('not.exist')
    I.findByRole('cell', { name: I.translate('tables:selectAll') }).should('not.exist')
    I.findByRole('button', { name: I.translate('profiles:policy.removeButton') }).should('not.exist')
  })
})

describe('Enrollment Profile assignment after create - RBAC', () => {
  beforeEach(() => {
    setLocalStorageState(window)
    I.loadI18nNamespaces('platform/common', 'profiles', 'general/form').then(() => {
      I.visit(`#/activation/add`)
    })
  })

  it('assignment redirect dialog is displayed', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByLabelText(I.translate('activationProfile.form.name')).should('exist').type('Test name')
    I.findAllByRole('button', { name: I.translate('general/form:commonLabels.add') })
      .should('exist')
      .click()

    I.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        I.findByText(I.translate('activationProfile.assignCreatedPolicyConfirmation.title')).should('exist')
        I.findAllByRole('button', { name: I.translate('general/form:commonLabels.yes') }).click()
      })

    I.findByRole('button', { name: I.translate('profiles:policy.assignment.add') }).should('exist')
  })

  it('assignment redirect dialog is not displayed', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.findByLabelText(I.translate('activationProfile.form.name')).should('exist').type('Test name')
    I.findAllByRole('button', { name: I.translate('general/form:commonLabels.add') })
      .should('exist')
      .click()

    I.findByRole('dialog').should('not.exist')
    I.findByRole('button', { name: I.translate('profiles:policy.assignment.add') }).should('not.exist')
  })
})
