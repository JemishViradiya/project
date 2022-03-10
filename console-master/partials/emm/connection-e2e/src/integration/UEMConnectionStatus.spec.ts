/* eslint-disable sonarjs/no-duplicate-string */

import { emm_connection_json } from '../support/commands'
import { AddUemConnectionPage } from '../support/page-objects/adduemconnection.page'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

describe('platform', () => {
  const setting_emmconnections_page = new setting_emmconnections()
  const header_pannel_page = new Header_Panel()
  const UEMTenantID = 'L63224054'

  beforeEach(() => {
    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    })
  })

  it('Verify UEM connection is with In pogress status when state=INITIALIZED', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusInProgressProgressBar().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusInProgressMessage().should('exist').and('be.visible')
  })

  it('Verify UEM connection is with In pogress status when state=AUTHORIZED', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[1]])
    })
    I.visit('#/emm')

    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusInProgressProgressBar().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusInProgressMessage().should('exist').and('be.visible')
  })

  it('Verify UEM connection is with successful status when state=ACTIVE', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[2]])
    })
    I.visit('#/emm')

    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusSuccessful().should('exist').and('be.visible')
  })

  it('Verify UEM connection is with ERROR status when state=ERROR and pop up connection can not be authorized', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[3]])
    })
    I.visit('#/emm')

    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusError().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusRetry().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusErrorAndFailedTOAuthorized(UEMTenantID).should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getUEMConnectionStatusErrorAndFailedTOAuthorized(UEMTenantID).should('not.exist')
    setting_emmconnections_page
      .getUEMConnectionStatusRetry()
      .parent()
      .children('a')
      .should('have.text', I.translate('emm.table.data.state.retry'))
  })

  it('Verify UEM connection is with ERROR status when state=ERROR and pop up connection can not be established', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[4]])
    })
    I.visit('#/emm')

    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusError().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusRetry().should('exist').and('be.visible')
    setting_emmconnections_page
      .getUEMConnectionStatusErrorAndFailedTOEnableConnection(UEMTenantID)
      .should('exist')
      .and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getUEMConnectionStatusErrorAndFailedTOEnableConnection(UEMTenantID).should('not.exist')
    setting_emmconnections_page
      .getUEMConnectionStatusRetry()
      .parent()
      .children('a')
      .should('have.text', I.translate('emm.table.data.state.retry'))
  })

  it('Verify UEM connection is with ERROR status when state=ERROR and pop up connection can not be established', () => {
    I.fixture('EmmConnections.json').then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.UEMConnectionStatus.UEMConnectionList[5]])
    })
    I.visit('#/emm')

    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusError().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnectionStatusRetry().should('exist').and('be.visible')
    setting_emmconnections_page
      .getUEMConnectionStatusErrorAndFailedTOEnableUESService(UEMTenantID)
      .should('exist')
      .and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getUEMConnectionStatusErrorAndFailedTOEnableUESService(UEMTenantID).should('not.exist')
    setting_emmconnections_page
      .getUEMConnectionStatusRetry()
      .parent()
      .children('a')
      .should('have.text', I.translate('emm.table.data.state.retry'))
  })
})
