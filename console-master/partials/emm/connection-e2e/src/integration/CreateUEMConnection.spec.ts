import { FeatureName } from '@ues-data/shared-types'

import { emm_connection_json } from '../support/commands'
import { AddUemConnectionPage } from '../support/page-objects/adduemconnection.page'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

describe('platform', () => {
  const headerpannel = new Header_Panel()
  const adduemconnection = new AddUemConnectionPage()
  const setting_emmconnections_page = new setting_emmconnections()
  const uemTenantId = 'L63224054'
  const authKey = 'testAuthKey'
  let goBackButtonText: string

  before(() => {
    window.localStorage.setItem(FeatureName.UESUEMConnector, 'true')
    I.loadI18nNamespaces('components').then(() => {
      goBackButtonText = I.translate('button.goBackText')
    })
    I.loadI18nNamespaces('emm/connection').then(() => {
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
      I.visit('#/emm/add/AddUEMConnection')
    })
  })

  beforeEach(() => {
    I.setMocks()
    window.localStorage.setItem(FeatureName.UESUEMConnector, 'true')
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
  })

  it('Should load left nav with expected heading', () => {
    headerpannel.getNavigation().should('exist').and('be.visible')
    headerpannel.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
  })

  it('Should have input fields with their default values', () => {
    adduemconnection.getUEMTenantID().should('exist').and('be.visible').should('have.value', '')
    adduemconnection.getUEMAuthKey().should('exist').and('be.visible').should('have.value', '')
  })

  it('Should redirect to the Add UEM Connection page when click on add UEM connection button on EMM Connection page', () => {
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
    I.url().then(urlString => {
      expect(Cypress.config().baseUrl + '#/emm/add/AddUEMConnection').eq(urlString)
    })
  })

  it('Should make the cancel and next button visible only after giving input to the tenant ID', () => {
    adduemconnection.getCancelButton().should('not.exist')
    adduemconnection.getSaveButton().should('not.exist')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.getCancelButton().should('exist').and('be.visible')
    adduemconnection.getSaveButton().should('exist').and('be.visible')
  })

  it('Should make the cancel and next button visible only after giving input to the Auth Key', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.getCancelButton().should('not.exist')
    adduemconnection.getSaveButton().should('not.exist')
    adduemconnection.inputUEMAuthKey(authKey)
    adduemconnection.getCancelButton().should('exist').and('be.visible')
    adduemconnection.getSaveButton().should('exist').and('be.visible')
  })

  it('Should go back to EMM Connections page on clicking the Cancel button', () => {
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')

    I.visitRoute('/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    adduemconnection.getCancelButton().should('exist').and('be.visible').click()
    adduemconnection.getSaveButton().should('not.exist')

    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    I.url().then(urlString => {
      expect(Cypress.config().baseUrl + '#/emm').eq(urlString)
    })
  })

  it('Should go back to EMM Connections page on clicking the back button', () => {
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visitRoute('/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types/uem/tenants', connections.UemTenants)
    })
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    headerpannel.getBackButton(goBackButtonText).should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    I.url().then(urlString => {
      expect(Cypress.config().baseUrl + '#/emm').eq(urlString)
    })
  })

  it('Should show default values after coming back to UEM create page after going back', () => {
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible').click({ force: true })
    headerpannel.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
    adduemconnection.getUEMTenantID().should('exist').and('be.visible').should('have.value', '')
    adduemconnection.getUEMAuthKey().should('exist').and('be.visible').should('have.value', '')
  })

  it('Should add uem connection with valid tenantID and it Should redirect to the EMM connections page with success message prompt on successfully adding uem connection', () => {
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', req => {
        req.reply(201, connections.addUemConnection)
      })
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[1]])
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getSuccessAlertMessage().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    headerpannel.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })

  it('Should not add uem connection when a connection already exists', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.uemConnectionAlreadyExist,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForConnectionExists().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
  })

  it('Should pop up error message when add uem connection get interrupted due to data sync and remains incomplete', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      connections.AddConnectionFailedDueToDataSync.responses[0].body.type = 'UEM'
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionFailedDueToDataSync,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForServerError().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
  })

  it('Should pop up error message when add UEM connection get interrupted and remains incomplete', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      connections.AddConnectionIncompleteError.responses[0].body.type = 'UEM'
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.AddConnectionIncompleteError,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForServerError().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
  })

  it('Should pop up error message on add UEM connection when UEM tenant is already associated', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.uemTenantAlreadyAssociated,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUemTenantAlreadyAssociated().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
  })

  it('Should pop up error message on add UEM connection when UEM is having Unknown Internal Error', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.UEMUnknownFailure,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUnknownInternalError().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUnknownInternalError().should('not.exist')
  })

  it('Should pop up error message on add UEM connection when UEM Intersect Failure', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.UEMIntersectFailure,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUEMIntersectFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUEMIntersectFailure().should('not.exist')
  })

  it('Should pop up error message on add UEM connection when UEM PCE Failure', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.UEMPCEFailure,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUEMPCEFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForUEMPCEFailure().should('not.exist')
  })

  it('Should pop up error message on add UEM connection when UEM Tenant Service Failed', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.UEMTenantServiceFailure,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForTenantServiceFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForTenantServiceFailure().should('not.exist')
  })

  it('Should pop up default error message in case of unknown substatus code on Add UEM Connection', () => {
    I.visit('#/emm/add/AddUEMConnection')
    adduemconnection.inputUEMTenantID(uemTenantId)
    adduemconnection.inputUEMAuthKey(authKey)
    I.fixture(emm_connection_json).then(connections => {
      connections.UEMTenantServiceFailure.responses[0].status = 400
      connections.UEMTenantServiceFailure.responses[0].error.subStatusCode = 5000
      I.intercept('POST', '**/api/platform/v1/emm/types', {
        statusCode: 207,
        body: connections.UEMTenantServiceFailure,
      })
    })
    adduemconnection.getSaveButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForGeneralFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    adduemconnection.getErrorPopUpForGeneralFailure().should('not.exist')
  })
})
