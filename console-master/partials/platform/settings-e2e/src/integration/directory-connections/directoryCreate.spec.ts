import { Permission } from '@ues-data/shared-types'

import { BasePage } from '../../support/pages/basePage'
import { getCancelButton, setFullPermissions, setNoPermissions, setReadonlyPermissions } from '../../support/pages/directoryPage'

const directoryListUrl = '#/settings/companydirectory/'
const createDirectoryInstanceUrl = `#/companyDirectory/azure`

let connectionNameFieldLabel: string
let connectonDomainLabel: string
let connectionClientIdLabel: string
let connectionClientKeyLabel: string
let formButtonPanel: string
let resourceNotFoundMessage: string
let inputFields: string[]

const init = () => {
  BasePage.clearLocalStorage()
  BasePage.setLocalStorageState()
  loadStrings().then(() => {
    I.visit(directoryListUrl)
    I.findByText(I.translate('platform/common:directory.actions.add')).click()
  })
  setFullPermissions()
}

const loadStrings = () => {
  return I.loadI18nNamespaces('platform/common', 'platform/validation', 'components', 'access', 'general/form').then(() => {
    formButtonPanel = I.translate('components:drawer.formButtonPanel')
    resourceNotFoundMessage = I.translate('access:errors.notFound.title')
    connectionNameFieldLabel = I.translate('platform/common:directory.connectionName')
    connectonDomainLabel = I.translate('platform/common:directory.domain')
    connectionClientIdLabel = I.translate('platform/common:directory.clientId')
    connectionClientKeyLabel = I.translate('platform/common:directory.clientKey')
    inputFields = [connectionNameFieldLabel, connectonDomainLabel, connectionClientIdLabel, connectionClientKeyLabel]
  })
}

const checkInputFields = () => {
  inputFields.forEach(field => {
    I.findByRole('textbox', { name: field }).should('be.visible').and('be.enabled')
  })
}

const checkInputsEmptyFieldValidation = (shouldBeValid: boolean) => {
  const chainer = shouldBeValid ? 'not.exist' : 'exist'

  inputFields.forEach(field => {
    I.findByText(I.translate('platform/validation:emptyField', { fieldName: field })).should(chainer)
  })
}

const checkDomainInputValidation = () => {
  I.findByRole('textbox', { name: connectonDomainLabel })
    .parent()
    .next()
    .should('contain', I.translate('platform/validation:invalidField', { fieldName: connectonDomainLabel }))
}

const fillInputsWithValidData = () => {
  inputFields.forEach(field => {
    const inputValue = field === connectonDomainLabel ? field + '.com' : field

    I.findByRole('textbox', { name: field }).clear().type(inputValue)
  })
}

const getAddButton = () => BasePage.findButton('platform/common:button.addLabel')
describe('Create directory connection navigation test cases', () => {
  beforeEach(() => {
    init()
  })

  it('Should navigate back to a directory list page on Cancel button click', () => {
    getCancelButton().click()
    BasePage.checkLocationHashWithCurrent(directoryListUrl)
  })

  it('Should navigate back to a directory list page on Go Back button click', () => {
    BasePage.getGoBackButton().click()
    BasePage.checkLocationHashWithCurrent(directoryListUrl)
  })
})

describe('Create directory connection general test cases', () => {
  before(() => {
    init()
  })

  it('Should navigate to Add directory connection page', () => {
    BasePage.checkLocationHashWithCurrent(createDirectoryInstanceUrl)
  })

  it('Should check all content on the page', () => {
    BasePage.getGoBackButton().should('exist').and('be.visible')
    I.findByText(I.translate('platform/common:directory.azureConnection.add.header')).should('exist').and('be.visible')
    BasePage.getHelpLink().should('exist').should('have.attr', 'href', BasePage.HELP_LINKS.DIRECTORY_CONNECTIONS)
    I.findByText(I.translate('platform/common:directory.azureConnection.add.page.title')).should('exist').and('be.visible')
    I.findByText(I.translate('platform/common:directory.azureConnection.add.page.description')).should('exist').and('be.visible')
    checkInputFields()
    getAddButton().should('exist').and('be.visible')
    getCancelButton().should('exist').and('be.visible')
  })

  it('Should check input fields validation', () => {
    getAddButton().click()
    checkInputsEmptyFieldValidation(false)
    I.reload()
    I.findByRole('textbox', { name: connectonDomainLabel }).type(connectonDomainLabel)
    getAddButton().click()
    checkDomainInputValidation()
    fillInputsWithValidData()
    checkInputsEmptyFieldValidation(true)
  })
})

describe('Create directory connection RBAC test cases', () => {
  before(() => {
    init()
  })

  it('Create directory - full access', () => {
    setFullPermissions()
    checkInputFields()
    I.findByLabelText(formButtonPanel).should('be.visible')
  })

  it('Create directory - readonly access', () => {
    setReadonlyPermissions()
    I.findByRole('generic').contains(resourceNotFoundMessage).should('exist').and('be.visible')
    I.findByRole('generic').contains(Permission.ECS_DIRECTORY_CREATE)
  })

  it('Create directory - no access', () => {
    setNoPermissions()
    I.findByText(resourceNotFoundMessage).should('exist').and('be.visible')
    I.findByRole('generic').contains(Permission.ECS_DIRECTORY_CREATE)
  })
})
