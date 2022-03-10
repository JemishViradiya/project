import { BffPlatform } from '@ues-data/platform/mocks'

import {
  getPolicyDescriptionTextField,
  getPolicyDescriptionTextFieldContents,
  getPolicyFormCancelButton,
  getPolicyFormSaveButton,
  getPolicyNameTextField,
  getResponseActionContents,
  getSnackbar,
  TranslationKeys,
  verifyHashEquals,
  visitPage,
} from '../support/utils'

const MOCK_NETWORK_ACCESS_POLICIES = BffPlatform.defaultProfilesMock.profiles.elements
const testName = 'my testing name'
const testDescription = 'my testing description'
const testNetworkAccessPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]

describe('Persona adaptive response policies', () => {
  before(() => {
    I.loadI18nNamespaces('components', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues')
  })
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('UES.ARR.Enabled', 'false')
    window.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
  })
  describe('Policies -> Adaptive response -> Copy policy (C88674243)', () => {
    let copiedDescription
    let copiedResponseAction
    before(() => {
      visitPage('#/list/adaptiveResponse')
    })
    it('Should display policy details screen with data fields populated', () => {
      const mockPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]
      I.findByRole('link', { name: mockPolicy.name }).should('be.visible').click()
      verifyHashEquals(`#/adaptiveResponse/${mockPolicy.entityId}`)
      getPolicyDescriptionTextFieldContents().then(contents => {
        copiedDescription = contents
      })
      getResponseActionContents().then(contents => {
        copiedResponseAction = contents
      })
    })
    it('Should display copy of policy details with data fields copied (except Name)', () => {
      I.findByRole('button', { name: I.translate(TranslationKeys.copyPolicy) }).click()
      verifyHashEquals('#/adaptiveResponse/create')
      getPolicyNameTextField().should('contain.value', '')
      getPolicyDescriptionTextField().should('contain.value', copiedDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .should('contain', copiedResponseAction)
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormSaveButton().should('be.disabled')
    })
    it('Should enable save when policy name is entered', () => {
      getPolicyNameTextField().type(testName)
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormSaveButton().should('be.enabled')
    })
    it('Should save copied policy, display policy list', () => {
      getPolicyFormSaveButton().click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.notNowButton) }).click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulCreation))
    })
    it('Should display policy details screen with data fields populated', () => {
      const mockPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]
      I.findByRole('link', { name: mockPolicy.name }).should('be.visible').click()
      verifyHashEquals(`#/adaptiveResponse/${mockPolicy.entityId}`)
      getPolicyNameTextField().should('not.have.value', '')
      getPolicyDescriptionTextField().should('not.have.value', '')
    })
    it('Should have modified data fields', () => {
      getPolicyNameTextField().type(testName)
      getPolicyDescriptionTextField().type(testDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .find('.MuiChip-deleteIcon')
        .click()
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .findByRole('button')
        .should('be.visible')
        .click()
      I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) })
        .should('be.visible')
        .click()
      I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).click()
      I.findByRoleOptionsWithin('listbox', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel) }, 'option', {
        name: testNetworkAccessPolicy.name,
      }).click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.saveButton) }).click()
      getPolicyDescriptionTextFieldContents().then(contents => {
        copiedDescription = contents
      })
      getResponseActionContents().then(contents => {
        copiedResponseAction = contents
      })
    })
    it('Should display copy of policy details with data fields copied (except Name)', () => {
      I.findByRole('button', { name: I.translate(TranslationKeys.copyPolicy) }).click()
      verifyHashEquals('#/adaptiveResponse/create')
      getPolicyNameTextField().should('contain.value', '')
      getPolicyDescriptionTextField().should('contain.value', copiedDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .should('contain', copiedResponseAction)
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormSaveButton().should('be.disabled')
    })
    it('Should enable save when Name is entered', () => {
      getPolicyNameTextField().type(testName)
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormSaveButton().should('be.enabled')
    })
    it('Should save policy -> return to policy list', () => {
      getPolicyFormSaveButton().click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.notNowButton) }).click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulCreation))
    })
  })
})
