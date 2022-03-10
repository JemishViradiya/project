/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { Permission } from '@ues-data/shared-types'

const activationSettingsUri = '#/settings/activation'
const passcodeTtlDefaultValue = 15

const setLocalStorageState = () => {
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem('UES.MTD.enabled', 'true')
  window.localStorage.setItem('ues.permission.checks.enabled', 'true')
}

const setActivationSettingsPermissions = (canRead: boolean, canUpdate: boolean) => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_ACTIVATIONSETTINGS_READ] = canRead
  overridePermissionsObj[Permission.ECS_ACTIVATIONSETTINGS_UPDATE] = canUpdate
  I.overridePermissions({ ...overridePermissionsObj })
}

const getNoAccessMessage = () => {
  return I.findByText(I.translate('noAccessMessage'))
}

const getNotFoundMessage = () => {
  return I.findByText(I.translate('access:errors.notFound.title'))
}

const getSubtitle = () => {
  return I.findByText(I.translate('activationSettings.subTitle'))
}

const getPasscodeTtlInputField = () => {
  return I.findByRole('textbox').get('input')
}

const getPasscodeTtlLabel = () => {
  return I.findByText(I.translate('activationSettings.passcodeTtl.helpLabel', { min: 1, max: 30 }))
}

const getOutOfRangePasscodeTtlLabel = () => {
  return I.findByText(I.translate('activationSettings.passcodeTtl.error.outOfRange', { min: 1, max: 30 }))
}

const getCancelButton = () => {
  return I.findByRole('button', { name: I.translate('general/form:commonLabels.cancel') })
}

const getSaveButton = () => {
  return I.findByRole('button', { name: I.translate('general/form:commonLabels.save') })
}

const getHelpLink = () => {
  return I.findByLabelText(I.translate('components:helpLink.helpLinkText'))
}

describe('Activation Settings page navigate and common appearance', () => {
  before(() => {
    window.localStorage.clear()
    setLocalStorageState()
    I.loadI18nNamespaces('platform/common', 'access', 'components', 'general/form').then(() => {
      I.visit(activationSettingsUri)
    })
  })

  it('Should verify Activation Settings page', () => {
    I.location().should(loc => {
      expect(loc.hash).to.eq(activationSettingsUri)
    })

    getSubtitle().should('exist')
    getPasscodeTtlInputField().should('be.visible')
    getPasscodeTtlLabel().should('exist')
    getCancelButton().should('not.exist')
    getSaveButton().should('not.exist')

    getPasscodeTtlInputField().clear().type('5')
    getCancelButton().should('be.enabled')
    getSaveButton().should('be.enabled')
  })

  it('Should check that out of range error is displayed for passcode ttl', () => {
    getPasscodeTtlInputField().clear().type('0')
    getOutOfRangePasscodeTtlLabel().should('exist')
    getCancelButton().should('be.enabled')
    getSaveButton().should('be.disabled')

    getPasscodeTtlInputField().clear().type('31')
    getOutOfRangePasscodeTtlLabel().should('exist')
    getCancelButton().should('be.enabled')
    getSaveButton().should('be.disabled')
  })

  it('Cancel button should work', () => {
    getPasscodeTtlInputField().should('be.visible').clear().type('11')
    getCancelButton().should('be.enabled').click()
    getPasscodeTtlInputField().should('have.value', passcodeTtlDefaultValue)
  })

  it('Should save activation settings', () => {
    getPasscodeTtlInputField().clear().type('2')
    getCancelButton().should('be.enabled')
    getSaveButton().should('be.enabled').click()
    I.findByRole('alert').should('contain', I.translate('activationSettings.success.update')).dismissAlert()
  })

  it('Test RBAC - no access', () => {
    setActivationSettingsPermissions(false, false)

    getNotFoundMessage().should('exist')

    getSubtitle().should('not.exist')
    I.findByRole('textbox').should('not.exist')
    getPasscodeTtlLabel().should('not.exist')
    getCancelButton().should('not.exist')
    getSaveButton().should('not.exist')
  })

  it('Test RBAC - read only access', () => {
    setActivationSettingsPermissions(true, false)

    getSubtitle().should('exist')
    getNoAccessMessage().should('not.exist')
    getSubtitle().should('exist')
    getPasscodeTtlInputField().should('be.disabled')
  })

  it('Test RBAC - full access', () => {
    setActivationSettingsPermissions(true, true)

    getSubtitle().should('exist')
    getPasscodeTtlInputField().should('be.enabled')
  })

  it('should contain activation url in HelpLink', () => {
    getHelpLink().should('have.attr', 'href').and('include', '/activation')
  })
})
