import { emm_connection_json } from '../support/commands'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

declare global {
  namespace Cypress {
    interface ChainableI<Subject> {
      setMocks: Cypress.Chainable<Subject>['setMocks']
    }
  }
}

describe('emm connection', () => {
  const setting_emmconnections_page = new setting_emmconnections()
  const header_pannel_page = new Header_Panel()
  const azureTenantID = '84f373e8-8167-43cb-afff-f11bf93e421c'
  const UEMTenantID = 'L63224054'
  before(() => {
    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
      I.fixture(emm_connection_json).then(Connections => {
        I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
      })
      I.visit('#/emm')
    })
  })
  it('Should load Navigation and title of the page should be EMM Connections', () => {
    header_pannel_page.getNavigation().should('exist').and('be.visible')
    header_pannel_page.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
  })
  it('Table header should have Connection Name, Connection Type and Connection Status', () => {
    setting_emmconnections_page.getTableHeader(I.translate('emm.table.tenant')).should('exist').and('be.visible')
    setting_emmconnections_page.getTableHeader(I.translate('emm.table.type')).should('exist').and('be.visible')
    setting_emmconnections_page.getTableHeader(I.translate('emm.table.status')).should('exist').and('be.visible')
  })
  it('Should be having the intune connection', () => {
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
  it('Intune Connection Server name should present and its name should be same as Azure Tenant Id ', () => {
    setting_emmconnections_page
      .checkConnectionServerNameForIntune()
      .should('have.text', azureTenantID)
      .and('exist')
      .and('be.visible')
  })
  it('Intune Connection Should be having Connection type Microsoft Intune ', () => {
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
  it('Intune Connection should have Delete Button ', () => {
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible')
  })
  it('Should have Generate App Button', () => {
    setting_emmconnections_page.getGenerateAppButton().should('exist').and('be.visible')
  })
  it('Should Not having Generate App Config Button when intune connection is MAM based', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      Connections.EMMConnections.ConnectionsList[0].activationType = 'MAM'
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
      I.visit('#/emm')
      console.log('Data is visible now')
    })
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getGenerateAppButton().should('not.exist')
  })
  it('Should list the Blackberry UEM option in dropdown of Add Connection Button, when only intune connection is added', () => {
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('not.exist')
    setting_emmconnections_page.clickAnywhereAfterAddConnectionButton()
  })
  it('Should not be having the add connection button when both connection exist', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.visit('#/emm')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
  })
  it('Should be having the uem connection', () => {
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })
  it('UEM Connection Should be having Connection type BlackBerry UEM" ', () => {
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })
  it('UEM Connection Server name should be present and Name should be same as Tenant Id', () => {
    setting_emmconnections_page.checkConnectionServerNameForUEM().should('have.text', UEMTenantID).and('exist').and('be.visible')
  })
  it('UEM Connection should have Delete Button ', () => {
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible')
  })
  it('Should list the Microsoft intune option in dropdown of Add Connection Button, When only uem connection is added', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [connections.EMMConnections.ConnectionsList[1]])
    })
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('not.exist')
    setting_emmconnections_page.clickAnywhereAfterAddConnectionButton()
  })
  it('Should be having the Add Connection button when No Connection is added and after click should list intune and UEM connection ', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 404,
          body: connections.NoConnectionError,
        })
      })
    })

    setting_emmconnections_page.getTableHeader(I.translate('emm.table.tenant')).should('exist').and('be.visible')
    setting_emmconnections_page.getTableHeader(I.translate('emm.table.type')).should('exist').and('be.visible')
    setting_emmconnections_page.getTableHeader(I.translate('emm.table.status')).should('exist').and('be.visible')
    setting_emmconnections_page.getNoDataMessageWhenNoConnectionExist().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible')
  })
  //207 multi status case when both Connections are failed to Retrieve in get emm/types call, When Both Connections exist:
  it('Should show Error Message in Connection Status and Delete Button should exist for intune connection and UEM Connection', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.TwoConnectionBothFailed,
        })
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.checkConnectionServerNameForIntune().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.checkConnectionServerNameForUEM().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionUEM().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionINTUNE().should('exist').and('be.visible')
    setting_emmconnections_page.getNoDataMessageWhenNoConnectionExist().should('not.exist')
    setting_emmconnections_page
      .getDeleteButtonForIntuneConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page
      .getDeleteButtonForUEMConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
  })
  //207 multi status case when UEM Connections is failed to Retrieve in get emm/types call, When Both Connections exist:
  it('Should show Intune Connection correctly and show Error Message in connection status and Delete Button Should exist for UEM Connection', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.TwoConnectionAndUEMFailed,
        })
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page
      .checkConnectionServerNameForIntune()
      .should('have.text', azureTenantID)
      .and('exist')
      .and('be.visible')
    setting_emmconnections_page.checkConnectionServerNameForUEM().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionUEM().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionINTUNE().should('not.exist')
    setting_emmconnections_page
      .getDeleteButtonForIntuneConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page
      .getDeleteButtonForUEMConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
  })
  //207 multi status case when INTUNE Connections is failed to Retrieve in get emm/types call, When Both Connections exist:
  it('Should show UEM Connection correctly and show Error Message in connection status and Delete Button Should exist for INTUNE Connection', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.TwoConnectionAndINTUNEFailed,
        })
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.checkConnectionServerNameForIntune().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.checkConnectionServerNameForUEM().should('have.text', UEMTenantID).and('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionINTUNE().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionUEM().should('not.exist')
    setting_emmconnections_page
      .getDeleteButtonForIntuneConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page
      .getDeleteButtonForUEMConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
  })
  //207 multi status case when UEM Connections is failed to Retrieve in get emm/types call, When only UEM Connection exist:
  it('should show Error Message in connection status and Delete Button Should exist for UEM Connection', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.OneConnectionAndOneFailed,
        })
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
    setting_emmconnections_page.checkConnectionServerNameForUEM().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionUEM().should('exist').and('be.visible')
    setting_emmconnections_page
      .getDeleteButtonForUEMConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('not.exist')
  })
  //207 multi status case when INTUNE Connections is failed to Retrieve in get emm/types call, When only INTUNE Connection exist:
  it('should show Error Message in connection status and Delete Button Should exist for INTUNE Connection', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(connections => {
      connections.OneConnectionAndOneFailed.responses[0].body.type = 'INTUNE'
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.OneConnectionAndOneFailed,
        })
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('not.exist')
    setting_emmconnections_page.checkConnectionServerNameForIntune().should('have.text', '-').and('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionINTUNE().should('exist').and('be.visible')
    setting_emmconnections_page
      .getDeleteButtonForIntuneConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.hidden')
      .and('not.be.disabled')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('not.exist')
  })
})
