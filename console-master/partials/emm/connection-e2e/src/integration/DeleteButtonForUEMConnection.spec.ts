import { emm_connection_json } from '../support/commands'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

describe('emm connection', () => {
  const setting_emmconnections_page = new setting_emmconnections()
  const header_pannel_page = new Header_Panel()
  before(() => {
    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      I.visit('#/emm')
    })
  })
  it('Should load Navigation and title of the page should be EMM Connections', () => {
    header_pannel_page.getNavigation().should('exist').and('be.visible')
    header_pannel_page.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
  })
  it('Delete Button should be exist and should not be disabled and hidden for UEM Connection and click on it', () => {
    setting_emmconnections_page
      .getDeleteButtonForUEMConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .and('not.be.hidden')
      .click()
  })
  it('Get dialog box for delete button For UEM', () => {
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
  })
  it('Get dialog box Header and confirmation message, Delete and Cancel Button for UEM', () => {
    setting_emmconnections_page.getHeaderMessageForDeleteButtonDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getDescriptionMessageForDeleteButtonDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page
      .getDeleteButtonForDeleteConnectionDialogBox()
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .and('not.be.hidden')
    setting_emmconnections_page
      .getCancelButtonForDeleteConnectionDialogBox()
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .and('not.be.hidden')
  })
  it('Get Cancel Button in Delete Connection Dialog Box and click on it', () => {
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getCancelButtonForDeleteConnectionDialogBox().click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist')
  })
  it('Get Delete button in dialog box and Click on it', () => {
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').click()
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().click()
  })
  it('After delete UEM connection, There should be a success message for delete Connection', () => {
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('not.exist')
  })
  it('After delete UEM connection, UEM connection should be removed from Emm Connection grid and should not appear after reload', () => {
    setting_emmconnections_page.getUEMConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('not.exist')
  })
  it('Should show Add Connection Button After delete UEM connection and show list UEM Connection Option', () => {
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist').and('be.visible')
  })
  it('Error on delete UEM connection, In case of delete connection failure', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
      statusCode: 500,
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('not.exist')
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist')
  })
  it('Error on delete UEM connection, In case of delete connection failure for permission Erros', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList).as('Waiting')
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 403,
        body: Connections.DeleteConnectionPermissionError,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('not.exist')
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })
  it('Should be able to delete UEM Connection having Error', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm')
    I.fixture('EmmConnections.json').then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.TwoConnectionAndUEMFailed,
        })
      })
    })
    I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', req => {
      req.reply({
        statusCode: 204,
      })
    })
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionUEM().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('exist')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('not.exist')
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('not.exist')
    setting_emmconnections_page.getAddConnectionButton().should('exist').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist')
    setting_emmconnections_page.clickAnywhereAfterAddConnectionButton()
  })
  it('Force Delete DailogBox should appear, In case of delete connection failure for UEM Failure(418 StatusCode) and a Error Popup Should also appear', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 418,
        body: Connections.ErrorForDeleteConnection,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
  })
  it('Force Delete DailogBox should have header message, Description text and Yes and No Button', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 418,
        body: Connections.ErrorForDeleteConnection,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getDescriptionMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible')
  })
  it('After clicking on the No Button From Force Delete DailogBox, The dailogBox should disappear from the screen and The connection should not be removed', () => {
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })
  it('On Force Delete DailogBox Click on the Yes Button, In case of success the Connection should be removed with success Message and Dailog Box disappear', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      Connections.ErrorForDeleteConnection.subStatusCode = 31410
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 418,
        body: Connections.ErrorForDeleteConnection,
      })
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM?force=true', {
        statusCode: 204,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getSuccessMessageAfterForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('not.exist')
    setting_emmconnections_page.getAddConnectionButton().should('exist').click()
    setting_emmconnections_page.getAddConnectionButtonForUEM().should('exist')
  })
  it('On Force Delete DailogBox Click on the Yes Button, In case of Error the Connection should not be removed and Force Delete Dailog Box should appear again', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 418,
        body: Connections.ErrorForDeleteConnection,
      })
      Connections.ErrorForDeleteConnection.subStatusCode = 31410
      I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
        statusCode: 418,
        body: Connections.ErrorForDeleteConnection,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
  })
  it('Any other statucode than 418(UEM Failure) like 500 the Force Delete DailogBox should not appear', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.intercept('DELETE', '**/api/platform/v1/emm/types/UEM', {
      statusCode: 500,
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('not.exist')
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('exist')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getErrorMessageForUEMConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist')
  })
})
