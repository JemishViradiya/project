import { emm_connection_json } from '../support/commands'
import { addIntuneAppConfigPolicies } from '../support/page-objects/addIntuneAppConfigPolicies.page'
import { AddIntuneConnectionPage } from '../support/page-objects/addintuneconnection.page'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

let goBackButtonText: string

describe('platform', () => {
  const { GroupListMock } = require('libs/data/emm/src/connection/group-mock')
  const headerpannel = new Header_Panel()
  const addintuneconnection = new AddIntuneConnectionPage()
  const addIntuneAppConfig = new addIntuneAppConfigPolicies()
  const setting_emmconnections_page = new setting_emmconnections()
  const testAppConfig = 'Test App Config'

  before(() => {
    I.loadI18nNamespaces('components').then(() => {
      goBackButtonText = I.translate('button.goBackText')
    })
    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
      I.visit('#/emm/intune/appconfig')
    })
  })
  it('Should load left nav with expected heading', () => {
    headerpannel.getNavigation().should('exist')
    headerpannel.getHeading(I.translate('emm.appConfig.title')).should('exist').and('be.visible')
  })

  it('For Android, Search text box should be visible along with group list and label text on clicking + button', () => {
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
    })
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBoxLabelText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible')
  })

  it.skip('For Android, After Type a group name in the search box for searching a group a cross button should appear for clearing the search field and after clicking on that button the searched text should be cleared', () => {
    I.fixture(emm_connection_json).then(Connections => {
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=test', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').type('test')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').and('have.value', '')
  })

  it('For Android, To search a particular group, Type the full name or few characters of the group name, The searched group should appear in the Available groups list.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=group', Connections.SearchedGroups)
    })
    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupCheckBox('group_123').should('exist')
  })

  it('For Android, Search the group which does not exist and after doing this, In the list of available groups should be empty and should show "No results" Text.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/intune/appconfig')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=noresults', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('noresults')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
  })

  it('For Android, Enter some text in the search box and click on the cancel button or "X" button, Now click on the "+" button again to get the group list. The search box should not contain the last entered text.', () => {
    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').type('group')
    addIntuneAppConfig.getGroupsDailogBoxCancelButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').and('have.value', '')
  })

  it('For Android, On searching a group name which is already added, that group name should be grayed out in the search result along with the checkbox as selected.', () => {
    I.visit('#/emm/intune/appconfig')
    const group1 = GroupListMock.groups[0].displayName
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupCheckBox(group1).click()
    addIntuneAppConfig.getGroupsDailogBoxAddButton().click()
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupName(group1).should('have.attr', 'aria-disabled', 'true')
  })

  it('For Android, Verify that search box can not accept text having length more than 120 character.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    const OneTwenty =
      'aIfAPNW5Jmep8RhebRoSrBXGD5b2pk0pdlVBmOUywXedioAarfgcweQEgAXku3Oh5snUatQKoqTcmjyB0cXEbvd0WtyY8SgvEG7oEI7GJE0Xjo5aSEKT5Q711'
    // eslint-disable-next-line no-restricted-globals
    cy.on('uncaught:exception', err => {
      expect(err.message).to.include('Request failed with status code 400')
      return false
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=' + OneTwenty, req => {
        req.continue(res => {
          res.send(400, Connections.lengthySearchText)
        })
      })
    })

    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_1').should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type(OneTwenty)
    addIntuneAppConfig.getErrorForLengthyString().should('exist').and('be.visible')
  })

  it('For Android, Verify that search box should give success results on giving capital letter as text.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/intune/appconfig')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=TEST', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('TEST')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
  })

  it('For iOS, Search text box should be visible along with group list and label text on clicking + button', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/intune/appconfig')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
    })
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBoxLabelText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible')
  })

  it('For iOS, After Type a group name in the search box for searching a group a cross button should appear for clearing the search field and after clicking on that button the searched text should be cleared', () => {
    I.fixture(emm_connection_json).then(Connections => {
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=test', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').type('test')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').and('have.value', '')
  })

  it('For iOS, To search a particular group, Type the full name or few characters of the group name, The searched group should appear in the Available groups list.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=group', Connections.SearchedGroups)
    })
    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_1').should('not.exist')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_123').should('exist')
  })

  it('For iOS, In the search result, each group should contain the checkbox along with it.', () => {
    addIntuneAppConfig.getGroupsDailogBoxGroupCheckBox('group_123').should('exist')
  })

  it('For iOS, Search the group which does not exist and after doing this, In the list of available groups should be empty and should show "No results" Text.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/intune/appconfig')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=noresults', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('noresults')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
  })

  it('For iOS, Enter some text in the search box and click on the cancel button or "X" button, Now click on the "+" button again to get the group list. The search box should not contain the last entered text.', () => {
    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').type('group')
    addIntuneAppConfig.getGroupsDailogBoxCancelButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible').and('have.value', '')
  })

  it('For iOS, On searching a group name which is already added, that group name should be grayed out in the search result along with the checkbox as selected.', () => {
    I.visit('#/emm/intune/appconfig')
    const group1 = GroupListMock.groups[0].displayName
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupCheckBox(group1).click()
    addIntuneAppConfig.getGroupsDailogBoxAddButton().click()
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('group')
    addIntuneAppConfig.getGroupsDailogBoxGroupName(group1).should('have.attr', 'aria-disabled', 'true')
  })

  it('For iOS, Verify that search box can not accept text having length more than 120 character.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    // eslint-disable-next-line no-restricted-globals
    cy.on('uncaught:exception', err => {
      expect(err.message).to.include('Request failed with status code 400')
      return false
    })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      I.intercept(
        'GET',
        '**/v1/emm/types/Intune/groups?query=aIfAPNW5Jmep8RhebRoSrBXGD5b2pk0pdlVBmOUywXedioAarfgcweQEgAXku3Oh5snUatQKoqTcmjyB0cXEbvd0WtyY8SgvEG7oEI7GJE0Xjo5aSEKT5Q711',
        {
          statusCode: 400,
          body: Connections.lengthySearchText,
        },
      )
    })
    I.visit('#/emm/intune/appconfig')
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig
      .getGroupsDailogBoxSearchBox()
      .type(
        'aIfAPNW5Jmep8RhebRoSrBXGD5b2pk0pdlVBmOUywXedioAarfgcweQEgAXku3Oh5snUatQKoqTcmjyB0cXEbvd0WtyY8SgvEG7oEI7GJE0Xjo5aSEKT5Q711',
      )
    addIntuneAppConfig.getErrorForLengthyString().should('exist').and('be.visible')
  })

  it('For iOS, Verify that search box should give success results on giving capital letter as text.', () => {
    I.setMocks()
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
    I.visit('#/emm/intune/appconfig')
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
      Connections.SearchedGroups.groups = []
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=TEST', Connections.SearchedGroups)
    })
    addIntuneAppConfig.getIosTableHeaderPlusButton().scrollIntoView().should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().type('TEST')
    addIntuneAppConfig.getGroupsDailogBoxNoResultsText().should('exist').and('be.visible')
  })
})
