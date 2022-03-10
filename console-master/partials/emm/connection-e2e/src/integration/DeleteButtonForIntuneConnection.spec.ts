import { emm_connection_json } from '../support/commands'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

const setting_emmconnections_page = new setting_emmconnections()
const header_pannel_page = new Header_Panel()
describe('emm connection', () => {
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
  it('Delete Button should be exist and should not be disabled and hidden for INTUNE Connection and click on it', () => {
    setting_emmconnections_page
      .getDeleteButtonForIntuneConnection()
      .should('exist')
      .and('be.visible')
      .and('not.be.disabled')
      .and('not.be.hidden')
      .click()
  })
  it('Get dialog box for delete button For INTUNE', () => {
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
  })
  it('Get dialog box Header and confirmation message, Delete and Cancel Button for INTUNE', () => {
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
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
  it('Get Delete button in dialog box and Click on it', () => {
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().click()
  })
  it('After delete intune connection, There should be a success message for delete Connection', () => {
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('not.exist')
  })
  it('After delete intune connection, Intune connection should be removed from Emm Connection grid', () => {
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
  })
  it('Should show Add Connection Button After delete Intune connection and show list Intune Connection Option', () => {
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible')
  })
  it('Error on delete Intune connection, In case of delete connection failure', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList).as('Waiting')
    })
    I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
      statusCode: 500,
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getDescriptionMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('not.exist')
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
  it('Error on delete Intune connection, In case of delete connection failure for permission Erros', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList).as('Waiting')
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
        statusCode: 403,
        body: Connections.DeleteConnectionPermissionError,
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
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('not.exist')
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })

  it('Should be able to delete Intune Connection having Error', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture('EmmConnections.json').then(connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', req => {
        req.reply({
          statusCode: 207,
          body: connections.TwoConnectionAndINTUNEFailed,
        })
      })
    })
    I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', req => {
      req.reply({
        statusCode: 204,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getErrorMessageForRetrieveConnectionINTUNE().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getSuccessMessageAfterConnectionDelete().should('not.exist')
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist').and('be.visible')
    setting_emmconnections_page.clickAnywhereAfterAddConnectionButton()
  })

  it('Force Delete DailogBox should appear, In case of delete connection failure for EMM Activation not found and a Error Popup Should also appear', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
        statusCode: 404,
        body: Connections.NoConnectionError,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('not.exist')
  })
  it('Force Delete DailogBox should have header message, Description text and Yes and No Button', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
        statusCode: 404,
        body: Connections.NoConnectionError,
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
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
  it('On Force Delete DailogBox Click on the Yes Button, In case of success, The Connection should be removed with success Message and Dailog Box disappear', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
        statusCode: 404,
        body: Connections.NoConnectionError,
      })
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE?force=true', {
        statusCode: 204,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getSuccessMessageAfterForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
    setting_emmconnections_page.getAddConnectionButton().should('exist').click()
    setting_emmconnections_page.getAddConnectionButtonForIntune().should('exist')
  })
  it('On Force Delete DailogBox Click on the Yes Button, In case of Error the Connection should not be removed and Force Delete Dailog Box should appear again', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', Connections.EMMConnections.ConnectionsList)
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE', {
        statusCode: 404,
        body: Connections.NoConnectionError,
      })
      I.intercept('DELETE', '**/api/platform/v1/emm/types/INTUNE?force=true', {
        statusCode: 500,
        //body: Connections.NoConnectionError,
      })
    })
    I.visit('#/emm')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForDeleteConnectionDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getHeaderMessageForForceDeleteDialogBox().should('exist').and('be.visible')
    setting_emmconnections_page.getYesButtonForDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getDialogBoxForForceDeleteConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getNoButtonForForceDeleteDialogBox().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('exist').and('be.visible')
    setting_emmconnections_page.getErrorAlertCloseButton().should('exist').and('be.visible').click()
    setting_emmconnections_page.getErrorMessageForIntuneConnectionDeleteFailure().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
  })
})
