import { emm_connection_json } from '../support/commands'
import { AddIntuneConnectionPage } from '../support/page-objects/addintuneconnection.page'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

let goBackButtonText: string

describe('platform', () => {
  const headerpannel = new Header_Panel()
  const addintuneconnection = new AddIntuneConnectionPage()
  const setting_emmconnections_page = new setting_emmconnections()
  const azureTenant = 'admin@blackhole.sw.rim.net'
  const azureTenantID = 'bbca07.onmicrosoft.com'
  before(() => {
    I.loadI18nNamespaces('components').then(() => {
      goBackButtonText = I.translate('button.goBackText')
    })

    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
      I.visit('#/emm/add/AddIntuneConnection')
    })
  })

  it('Should load left nav with expected heading', () => {
    headerpannel.getNavigation().should('exist')
    headerpannel.getHeading(I.translate('emm.intune.add.title')).should('exist').and('be.visible')
  })

  it('Should have input fields with their default values', () => {
    addintuneconnection.getAzureTenantID().should('exist').and('be.visible').should('have.value', '')
    addintuneconnection.getAzureTenantIDPlaceholder().should('exist').and('be.visible')
  })

  it('Should redirect to the Add Microsoft Itnune Connection page when click on add intune connection button on EMM Connection page', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.intune.add.title')).should('exist').and('be.visible')
  })

  it('Should not add intune connection when Azure Tenant ID field is empty and verify error', () => {
    I.setMocks()
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.inputAzureTenantID(azureTenant).clear()
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getEmptyTenantIDFieldError().should('exist').and('be.visible')
  })

  it('Should have the description test along with Azure Tenant ID field', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.getAzureTenantID().should('exist').and('be.visible')
    addintuneconnection.getAzureTenantIDHeading().should('exist').and('be.visible')
    addintuneconnection.getAzureInfoDescription().should('exist').and('be.visible')
  })
  it('Should not add intune connection when a connection already exists', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.inputAzureTenantID(azureTenant)

    I.fixture('EmmConnections.json').then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.connectionAlreadyExist,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()

    addintuneconnection.getErrorPopUpForConnectionExists().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
  })
  it('Should not add intune connection when invalid tenant ID is given', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.inputAzureTenantID(azureTenant).should('exist').and('be.visible')
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionWithInvalidTenantID,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getFailureOnInavlidTenantIDAlertMessage().should('exist').and('be.visible')
  })
  it('Should go back to EMM Connections page on clicking the back button', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.intune.add.title')).should('exist').and('be.visible')
    headerpannel.getBackButton(goBackButtonText).should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
  })

  it('Should clear the add intune page values on clicking the back button and user should have default values when go to add intune connection page', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    addintuneconnection.inputAzureTenantID(azureTenant)
    headerpannel.getBackButton(goBackButtonText).should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    addintuneconnection.getAzureTenantID().should('exist').and('be.visible')
  })

  it('Should make the cancel and next button visible only after giving input to the tenant ID', () => {
    headerpannel.getCancelButton().should('not.exist')
    headerpannel.getNextButton().should('not.exist')
    addintuneconnection.inputAzureTenantID(azureTenant)
    headerpannel.getCancelButton().should('exist').and('be.visible')
    headerpannel.getNextButton().should('exist').and('be.visible')
  })

  it('Should go back to EMM Connections page on clicking the Cancel button', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.intune.add.title')).should('exist').and('be.visible')
    addintuneconnection.inputAzureTenantID(azureTenant)
    headerpannel.getCancelButton().should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
  })

  it('Should clear the add intune page values on clicking the Cancel button and user should have default values when go to add intune connection page', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    addintuneconnection.inputAzureTenantID(azureTenant)
    headerpannel.getCancelButton().should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible').click({ force: true })
    addintuneconnection.getAzureTenantID().should('exist').and('be.visible')
  })

  it.skip('Should pop up error message when add intune connection get interrupted due to data sync and remains incomplete', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')

    addintuneconnection.inputAzureTenantID(azureTenant)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionFailedDueToDataSync,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getFailureAlertMessage().should('exist').and('be.visible')
  })

  it('Should pop up error message when add intune connection get interrupted and remains incomplete', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.inputAzureTenantID(azureTenant)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionIncompleteError,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getFailureAlertMessage().should('exist').and('be.visible')
  })

  it('Should pop up default error message for unexpected error', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')
    addintuneconnection.inputAzureTenantID(azureTenant)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.defaultError,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getErrorPopUpForDefault().should('exist').and('be.visible')
  })
  it('Should pop up error message when add intune connection with tenant without intune license', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')

    addintuneconnection.inputAzureTenantID(azureTenantID)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionWhenTenantIsWithoutIntuneLicense,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getErrorPopUpForTenantIsWithoutIntuneLicense().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().click()
    addintuneconnection.getErrorPopUpForTenantIsWithoutIntuneLicense().should('not.be.visible')
  })
  it('Should pop up error message when add intune connection with invalid auth code', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/add/AddIntuneConnection')

    addintuneconnection.inputAzureTenantID(azureTenantID)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionWhenAuthCodeisInvalid,
      })
    })
    headerpannel.getNextButton().should('exist').and('be.visible').click()
    addintuneconnection.getErrorPopUpForInvalidAuthCode().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().click()
    addintuneconnection.getErrorPopUpForInvalidAuthCode().should('not.be.visible')
  })
})
