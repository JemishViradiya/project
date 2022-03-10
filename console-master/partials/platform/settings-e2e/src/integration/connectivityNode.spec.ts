/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { bcnInstanceMock } from '@ues-data/platform/mocks'
import { Permission } from '@ues-data/shared-types'

import { BasePage } from '../support/pages/basePage'

export const getNonLocalizedDate = dateString => {
  const dateObject = new Date(dateString)
  const date = dateObject.toLocaleDateString()
  const time = dateObject.toLocaleTimeString()
  const timezone = dateObject.getTimezoneOffset() / 60

  const timezoneWithSign = timezone < 0 ? timezone : `+${timezone}`
  return `${date} ${time} (${timezoneWithSign} GMT)`
}

const BCN_CONNECTIVITY_URL = '#/bcnconnectivity'
const BCN_CONNECTIVITY_GENERATE_URL = '#/bcnconnectivity/generatebcn'
const BCN_CONNECTIVITY_SETTINGS_URL = '#/bcnconnectivity/settings'

// URLs for testing from platform/policies partial
const PARTIAL_BCN_CONNECTIVITY_GENERATE_URL = '#/bcncustom/generatebcn'
const PARTIAL_BCN_CONNECTIVITY_SETTINGS_URL = '#/bcncustom/settings'

const BCN_APP_LINK = 'https://swdownloads.blackberry.com/Downloads/entry.do?code=39D0A8908FBE6C18039EA8227F827023'

const initTest = () => {
  BasePage.clearLocalStorage()
  BasePage.setLocalStorageState()
  I.loadI18nNamespaces('platform/common', 'access', 'components', 'tables', 'general/form').then(() => {
    I.visit(BCN_CONNECTIVITY_URL)
  })
}

const setLocalStorageState = () => {
  BasePage.setLocalStorageMock('true')
  BasePage.setLocalStoragePermissionCheck('true')
}

const setBCNConnectivityPermissions = (canCreate: boolean, canRead: boolean, canUpdate: boolean, canDelete: boolean) => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_BCN_CREATE] = canCreate
  overridePermissionsObj[Permission.ECS_BCN_READ] = canRead
  overridePermissionsObj[Permission.ECS_BCN_UPDATE] = canUpdate
  overridePermissionsObj[Permission.ECS_BCN_DELETE] = canDelete
  I.overridePermissions({ ...overridePermissionsObj })
}

const getResourceNotFoundMessage = () => {
  return I.findByText(I.translate('access:errors.notFound.title'))
}

const getDescription = () => {
  return I.findByText(I.translate('bcn.table.description'))
}

const getAddButton = () => {
  return I.findByRole('button', { name: I.translate('bcn.table.buttons.add') })
}

const getSettingsButton = () => {
  return I.findByRole('button', { name: I.translate('bcn.table.buttons.settings') })
}

const getTableRow = rowId => {
  return I.findByLabelText(rowId)
}

const getExpandButton = rowId => {
  return getTableRow(rowId).findByLabelText(I.translate('tables:expandRow'))
}

const getExpandedTableRow = rowId => {
  return I.findByLabelText(rowId)
}

const getGoBackButton = () => {
  return I.findByLabelText('Go back')
}

describe('Connectivity Node page navigate and common appearance', () => {
  before(() => {
    initTest()
  })

  it('Should navigate to Connectivity Node page', () => {
    I.location().should(loc => {
      expect(loc.hash).to.eq(BCN_CONNECTIVITY_URL)
    })
  })

  it('Should check all content on the screen', () => {
    getDescription().should('exist')
    getAddButton().should('exist')
    getSettingsButton().should('exist')
    getTableRow(bcnInstanceMock.instanceId)
      .should('contain', bcnInstanceMock.displayName)
      .and('contain', getNonLocalizedDate(bcnInstanceMock.activationDate))
  })

  it('Table row should be expandable', () => {
    getExpandButton(bcnInstanceMock.instanceId).click()
    getExpandedTableRow(bcnInstanceMock.services[0].serviceID).should('contain', bcnInstanceMock.services[0].name)
    getExpandButton(bcnInstanceMock.instanceId).click()
    getExpandedTableRow(bcnInstanceMock.services[0].serviceID).should('not.exist')
  })

  it('Table row should be removed', () => {
    getTableRow(bcnInstanceMock.instanceId).findByLabelText(I.translate('bcn.table.actions.deleteButtonLabel')).click()
    I.findByRole('dialog')
      .findByRole('button', { name: I.translate('general/form:commonLabels.delete') })
      .click()
    getTableRow(bcnInstanceMock.instanceId).should('not.exist')
  })

  it('Add Connectivity Node page should be opened and closed', () => {
    getAddButton().click()
    I.location().should(loc => {
      expect(loc.hash).to.eq(BCN_CONNECTIVITY_GENERATE_URL)
    })
  })

  it('Add Connectivity Node page content should be checked', () => {
    I.visit(PARTIAL_BCN_CONNECTIVITY_GENERATE_URL)
    getGoBackButton().should('exist')
    I.findByText(I.translate('bcn.generate.pageTitle')).should('exist')
    I.findByText(I.translate('bcn.generate.title')).should('exist')
    I.findByText(I.translate('bcn.generate.bcnStep1Title')).should('exist')
    I.findByText(I.translate('general/form:commonLabels.download')).parent().should('have.attr', 'href', BCN_APP_LINK)
    I.findByText(I.translate('bcn.generate.bcnStep2Title')).should('exist')
    I.findByText(I.translate('bcn.generate.bcnStep2Description')).should('exist')
    I.findByRole('button', { name: I.translate('button.downloadActivationFile') })
    I.findByText(I.translate('bcn.generate.bcnStep3Title')).should('exist')
    I.findByText(I.translate('bcn.generate.bcnStep3Description')).should('exist')
    I.findByRole('button', { name: I.translate('general/form:commonLabels.close') })
  })

  it('Connectivity Node Settings page should be opened and closed', () => {
    I.visit(PARTIAL_BCN_CONNECTIVITY_SETTINGS_URL)
    I.location().should(loc => {
      expect(loc.hash).to.eq(PARTIAL_BCN_CONNECTIVITY_SETTINGS_URL)
    })
  })
})

describe('Connectivity Node RBAC Tests', () => {
  before(() => {
    initTest()
  })

  beforeEach(() => {
    setLocalStorageState()
  })

  it('CREATE permission is ABSENT', () => {
    setBCNConnectivityPermissions(false, true, true, true)

    getAddButton().should('not.exist')
  })

  it('No access - BCN table', () => {
    setBCNConnectivityPermissions(false, false, false, false)

    getResourceNotFoundMessage().should('exist')

    getDescription().should('not.exist')
    getAddButton().should('not.exist')
    getSettingsButton().should('not.exist')
  })

  it('DELETE permission is ABSENT', () => {
    setBCNConnectivityPermissions(true, true, true, false)

    getTableRow(bcnInstanceMock.instanceId).findByLabelText('delete').should('not.exist')
  })

  it('No acess - Add Connectivity Node page in case of direct navigation ', () => {
    setBCNConnectivityPermissions(false, false, false, false)

    getResourceNotFoundMessage().should('exist')
  })

  it('CREATE permission is ABSENT for Add Connectivity Node page in case of direct navigation ', () => {
    setBCNConnectivityPermissions(false, true, true, true)

    getResourceNotFoundMessage().should('exist')
  })
})

describe('RBAC - BCN settings', () => {
  before(() => {
    BasePage.clearLocalStorage()
    BasePage.setLocalStorageState()
    I.loadI18nNamespaces('platform/common', 'access', 'components', 'general/form').then(() => {
      I.visit(PARTIAL_BCN_CONNECTIVITY_SETTINGS_URL, { timeout: 8000 })
    })
  })

  it('UPDATE permission is ABSENT', () => {
    setBCNConnectivityPermissions(true, true, false, true)

    I.findByText(I.translate('bcn.settings.pageViewTitle')).should('exist')
    I.findByText(I.translate('bcn.settings.debugLevels.info')).should('have.attr', 'aria-disabled', 'true')

    I.findByLabelText('sysLogSwitch').should('have.attr', 'aria-disabled', 'true')
    I.findByLabelText('logFileSwitch').should('have.attr', 'aria-disabled', 'true')
    I.findByLabelText('maximumLogFileSize').find('input').should('be.disabled')
    I.findByLabelText('maximumServerLogFileAge').find('input').should('be.disabled')
    I.findByLabelText('fileCompressionSwitch').should('have.attr', 'aria-disabled', 'true')
    I.findByLabelText(I.translate('components:drawer.formButtonPanel')).should('not.be.visible')
  })

  it('No access - Settings page in case of direct navigation ', () => {
    setBCNConnectivityPermissions(false, false, false, false)

    getResourceNotFoundMessage().should('exist')
  })
})

describe('Connectivity node help link', () => {
  before(() => {
    BasePage.setLocalStorageMock('true')
    BasePage.setLocalStorageCronos('true')
    I.loadI18nNamespaces('components')
  })

  it('Should have correct help link for settings page', () => {
    I.visit(BCN_CONNECTIVITY_SETTINGS_URL)
    BasePage.getHelpLink().should('exist').should('have.attr', 'href', BasePage.HELP_LINKS.CONNECTIVITY_NODE)
  })

  it('Should have correct help link for generate bcn page', () => {
    I.visit(BCN_CONNECTIVITY_GENERATE_URL)
    BasePage.getHelpLink().should('exist').should('have.attr', 'href', BasePage.HELP_LINKS.CONNECTIVITY_NODE)
  })
})
