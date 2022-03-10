import { iteratee } from 'cypress/types/lodash'

import { FeatureName, Permission } from '@ues-data/shared-types'

import { emm_connection_json } from '../support/commands'
import { addIntuneAppConfigPolicies } from '../support/page-objects/addIntuneAppConfigPolicies.page'
import { AddIntuneConnectionPage } from '../support/page-objects/addintuneconnection.page'
import { AddUemConnectionPage } from '../support/page-objects/adduemconnection.page'
import { Header_Panel } from '../support/page-objects/header_pannel.page'
import { setting_emmconnections } from '../support/page-objects/settings-emmconnections.page'

describe('emm connection', () => {
  const setting_emmconnections_page = new setting_emmconnections()
  const headerpannelpage = new Header_Panel()
  const addintuneconnection = new AddIntuneConnectionPage()
  const addIntuneAppConfig = new addIntuneAppConfigPolicies()
  const adduemconnection = new AddUemConnectionPage()
  const azureTenantID = '84f373e8-8167-43cb-afff-f11bf93e421c'
  const UEMTenantID = 'L63224054'
  const authKey = 'AuthKey'
  let RBAC_RESOURCE_NOT_FOUND
  let RBAC_RESOURCE_NOT_FOUND_MESSAGE
  const TargetName = 'Work'
  const TargetedAppName = 'BlackBerry Work'
  before(() => {
    I.loadI18nNamespaces('access').then(() => {
      RBAC_RESOURCE_NOT_FOUND = I.translate('errors.notFound.title')
      RBAC_RESOURCE_NOT_FOUND_MESSAGE = I.translate('errors.notFound.description')
    })
    I.loadI18nNamespaces('emm/connection').then(() => {
      I.setMocks()
      window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
      I.fixture(emm_connection_json).then(Connections => {
        I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
      })
      I.visit('#/emm')
    })
  })
  beforeEach(() => {
    window.localStorage.clear()
    window.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')
  })
  it('Should load Navigation and title of the page should be EMM Connections', () => {
    headerpannelpage.getNavigation().should('exist').and('be.visible')
    headerpannelpage.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
  })
  it('Should be able to show Emm Connections, But the Delete Buttons and Generate App Button should be hidden when Update Permssion is False, Delete is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').and('not.be.disabled')
    setting_emmconnections_page.getGenerateAppButton().should('not.exist')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('not.exist')
  })
  it('Should be able to show Emm Connections, And Generate App Button should be hidden when Update Permssion is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible')
    setting_emmconnections_page.getGenerateAppButton().should('not.exist')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible')
  })
  it('Should be able to show Emm Connections, But only Delete Buttons should be hidden when Delete Permssion is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getUEMConnection().should('not.exist')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('not.exist')
    setting_emmconnections_page.getGenerateAppButton().should('exist').and('be.visible')
  })
  it('Should be able to show Emm Connections, All the elements should show correctly when Read, Create, Update, Delete permissions is True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('exist').and('be.visible').and('not.be.disabled')
    setting_emmconnections_page.getGenerateAppButton().should('exist').and('be.visible').and('not.be.disabled')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist').and('be.visible')
  })
  it('Should be able to show Emm Connections, But Add Connection Button, Delete Button and Generate App Button should be hidden when Create, Update, Delete permissions is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('not.exist')
    setting_emmconnections_page.getGenerateAppButton().should('not.exist')
    setting_emmconnections_page
      .checkConnectionServerNameForIntune()
      .should('have.text', azureTenantID)
      .and('exist')
      .and('be.visible')
  })
  it('Should be able to show Emm Connections, But Add Connection Button and Generate App Button should be hidden and Delete button should not be hidden when Create and Update permissions is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
    setting_emmconnections_page.getGenerateAppButton().should('not.exist')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('exist')
  })
  it('Should be able to show Emm Connections, But Add Connection Button and Delete Button should be hidden and should show generate App button when Create and Delete permissions is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[0]])
    })
    I.visit('#/emm')
    setting_emmconnections_page.getIntuneConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
    setting_emmconnections_page.getGenerateAppButton().should('exist')
    setting_emmconnections_page.getDeleteButtonForIntuneConnection().should('not.exist')
  })
  it('Should be able to show Emm Connections, But Add Connection Button should be hidden when Create is False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/api/platform/v1/emm/types', [Connections.EMMConnections.ConnectionsList[1]])
    })
    I.visit('#/emm')
    headerpannelpage.getHeading(I.translate('emm.page.title')).should('exist').and('be.visible')
    setting_emmconnections_page.getIntuneConnection().should('not.exist')
    setting_emmconnections_page.getUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getDeleteButtonForUEMConnection().should('exist').and('be.visible')
    setting_emmconnections_page.getAddConnectionButton().should('not.exist')
  })
  it('Should show Resource Not Found Page and should not show Emm Connections with Read Pemission false on Emm Connections Page', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = false
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.visit('#/emm')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })

  it('Should show Resource Not Found Page and should not show any content on the AddIntuneConnection Page when Read Pemission True and Create Permission False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.visit('#/emm/add/AddIntuneConnection')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  it('Should show Resource Not Found page and should not show any content on the AddIntuneConnection Page with Read Pemission False and Create Permission False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = false
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.visit('#/emm/add/AddIntuneConnection')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  //After adding the key in Add Tenant text box the Next and the cancel Button should be vissible after adding the key in Azure tenant text box
  it('Should show all content, Add Tenant text box should not be disabled on the AddIntuneConnection Page with Create Permission True and Read Permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.visit('#/emm/add/AddIntuneConnection')
    headerpannelpage.getHeading(I.translate('emm.intune.add.title')).should('exist').and('be.visible')
    addintuneconnection.getAzureTenantIDHeading().should('exist').and('be.visible')
    addintuneconnection.getAzureInfoDescription().should('exist').and('be.visible')
    addintuneconnection.getAzureTenantID().should('exist').and('be.visible').should('have.value', '')
    addintuneconnection.getAzureTenantIDPlaceholder().should('exist').and('be.visible')
    addintuneconnection.getAzureTenantID().should('not.be.disabled')
    headerpannelpage.getNextButton().should('not.exist')
    headerpannelpage.getCancelButton().should('not.exist')
    addintuneconnection.getAzureTenantID().type(azureTenantID)
    headerpannelpage.getNextButton().should('exist').and('be.visible').should('not.be.disabled')
    headerpannelpage.getCancelButton().should('exist').and('be.visible').should('not.be.disabled')
  })

  it('Should show Resource Not Found Page and should not show any content on the AddUEMConnection Page with Read Pemission True and Create Permission False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.visit('#/emm/add/AddUemConnection')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  it('Should show Resource Not Found page and should not show any content on the AddUemConnection Page with Read Pemission False and Create Permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = false
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.visit('#/emm/add/AddUemConnection')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  //The Save and the cancel Button should be vissible after providing UEM Tenant Id and Auth Key and before input it should not be vissible
  it('Should show all content, Add UEM Tenant Id and Auth Key inputs should not be disabled on the AddUEMConnection Page with Create Permission True and Read Permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.visit('#/emm/add/AddUemConnection')
    headerpannelpage.getHeading(I.translate('emm.uem.title')).should('exist').and('be.visible')
    adduemconnection.getUEMTenantHeading().should('exist').and('be.visible')
    adduemconnection.getUemTenantDescriptionHeading().should('exist').and('be.visible')
    adduemconnection.getSaveButton().should('not.exist')
    adduemconnection.getCancelButton().should('not.exist')
    adduemconnection.getUEMTenantID().should('exist').and('be.visible').should('have.value', '')
    adduemconnection.getUEMAuthKey().should('exist').and('be.visible').should('have.value', '')
    adduemconnection.inputUEMTenantID(UEMTenantID)
    adduemconnection.inputUEMAuthKey(authKey)
    adduemconnection.getUEMTenantID().should('exist').and('be.visible').should('have.value', UEMTenantID)
    adduemconnection.getUEMAuthKey().should('exist').and('be.visible').should('have.value', authKey)
    adduemconnection.getSaveButton().should('exist').and('be.visible').should('not.be.disabled')
    adduemconnection.getCancelButton().should('exist').and('be.visible').should('not.be.disabled')
  })

  it('Should show Resource Not Found Page and should not show any content on the on Generate App Config page with Read Pemission True, Create Permission True and Update Permission False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
    })
    I.visit('#/emm/intune/appconfig')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  it('Should show all the content of the page and they should not be disabled with on Generate App Config page with Read Pemission True, Create Permission False and Update Permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
    })
    I.visit('#/emm/intune/appconfig')
    headerpannelpage.getHeading(I.translate('emm.appConfig.title')).should('exist').and('be.visible')
    addIntuneAppConfig.getAddGenerateConfigHeading().should('exist').and('be.visible')
    addIntuneAppConfig.getAddGenerateConfigDescription().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidSwitchButton().should('exist').and('be.checked')
    addIntuneAppConfig.getAndroidSwitchButtonLabel().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTargetedNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupAssignmentTitleForAndroid().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidAllGroupsButton().should('exist').and('not.be.checked')
    addIntuneAppConfig.getAndroidAllGroupsButtonText().should('exist').and('be.visible')

    addIntuneAppConfig.getAndroidTableHeader().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTableNoDataMessage().should('exist').and('be.visible')

    addIntuneAppConfig.getIosSwitchButton().should('exist').and('be.checked')
    addIntuneAppConfig.getIosSwitchButtonLabel().should('exist').and('be.visible')
    addIntuneAppConfig.getIosNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTargetedNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupAssignmentTitleForIos().should('exist').and('be.visible')
    addIntuneAppConfig.getIosAllGroupsButton().should('exist').and('not.be.checked')
    addIntuneAppConfig.getIosAllGroupsButtonText().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableHeader().scrollIntoView().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableHeaderPlusButton().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableNoDataMessage().should('exist').and('be.visible')

    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').click()

    addIntuneAppConfig.getGroupsDailogBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxHeading().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxDescriptionText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCrossButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCancelButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxList().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_1').should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible').click()
    addIntuneAppConfig.getIosTableHeaderPlusButton().should('exist').click()

    addIntuneAppConfig.getGroupsDailogBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxHeading().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxDescriptionText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBoxLabelText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCrossButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCancelButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxList().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_1').should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible').click()

    addIntuneAppConfig.getAndroidSelectedGroup('group_1').should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidSelectedGroupDeleteButton('group_1').should('exist').and('be.visible')
    addIntuneAppConfig.getIosSelectedGroup('group_1').should('exist').and('be.visible')
    addIntuneAppConfig.getIosSelectedGroupDeleteButton('group_1').should('exist').and('be.visible')
  })
  it('Should show all the content of the page and they should not be disabled with on Generate App Config page with Read Pemission True, Create Permission True and Update Permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    overridePermissionsObj[Permission.ECS_MDM_DELETE] = true
    I.overridePermissions({ ...overridePermissionsObj })
    I.fixture(emm_connection_json).then(Connections => {
      I.intercept('GET', '**/v1/emm/types/Intune/groups?query=', Connections.groups)
    })
    I.visit('#/emm/intune/appconfig')
    headerpannelpage.getHeading(I.translate('emm.appConfig.title')).should('exist').and('be.visible')
    addIntuneAppConfig.getAddGenerateConfigHeading().should('exist').and('be.visible')
    addIntuneAppConfig.getAddGenerateConfigDescription().should('exist').and('be.visible')

    addIntuneAppConfig.getAndroidSwitchButton().should('exist').and('be.checked')
    addIntuneAppConfig.getAndroidSwitchButtonLabel().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTargetedNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupAssignmentTitleForAndroid().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidAllGroupsButton().should('exist').and('not.be.checked')
    addIntuneAppConfig.getAndroidAllGroupsButtonText().should('exist').and('be.visible')

    addIntuneAppConfig.getAndroidTableHeader().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidTableNoDataMessage().should('exist').and('be.visible')

    addIntuneAppConfig.getIosSwitchButton().should('exist').and('be.checked')
    addIntuneAppConfig.getIosSwitchButtonLabel().should('exist').and('be.visible')
    addIntuneAppConfig.getIosNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTargetedNameTextBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupAssignmentTitleForIos().should('exist').and('be.visible')
    addIntuneAppConfig.getIosAllGroupsButton().should('exist').and('not.be.checked')
    addIntuneAppConfig.getIosAllGroupsButtonText().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableHeader().scrollIntoView().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableHeaderPlusButton().should('exist').and('be.visible')
    addIntuneAppConfig.getIosTableNoDataMessage().should('exist').and('be.visible')

    addIntuneAppConfig.getAndroidTableHeaderPlusButton().should('exist').click()

    addIntuneAppConfig.getGroupsDailogBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxHeading().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxDescriptionText().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchBox().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxSearchButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCrossButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxCancelButton().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxList().should('exist').and('be.visible')
    addIntuneAppConfig.getGroupsDailogBoxGroupName('group_1').should('exist').and('be.visible').click()
    addIntuneAppConfig.getGroupsDailogBoxAddButton().should('exist').and('be.visible').click()

    addIntuneAppConfig.getAndroidSelectedGroup('group_1').should('exist').and('be.visible')
    addIntuneAppConfig.getAndroidSelectedGroupDeleteButton('group_1').should('exist').and('be.visible')
  })
  it('Should show Resource Not Found page and should not show any content on the GenerateAppConfig Page with Read Pemission True and Create and Update permission False', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = true
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = false
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })

    I.visit('#/emm/intune/appconfig')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
  it('Should show Resource Not Found page and should not show any content on the GenerateAppConfig Page with Read Pemission False and Create and Update permission True', () => {
    I.setMocks()
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_MDM_READ] = false
    overridePermissionsObj[Permission.ECS_MDM_CREATE] = true
    overridePermissionsObj[Permission.ECS_MDM_UPDATE] = true
    I.overridePermissions({ ...overridePermissionsObj })

    I.visit('#/emm/intune/appconfig')
    setting_emmconnections_page.getRBAC_ResourceNotFound(RBAC_RESOURCE_NOT_FOUND).should('exist').and('be.visible')
    setting_emmconnections_page.getRBAC_ResourceNotFoundMessage(RBAC_RESOURCE_NOT_FOUND_MESSAGE).should('exist').and('be.visible')
  })
})
