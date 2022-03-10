import { PolicyListDetailsQueryMock } from '@ues-data/bis/mocks'
import { BffPlatform } from '@ues-data/platform/mocks'

import {
  getAddNewPolicyButton,
  getPolicyDescriptionTextField,
  getPolicyFormAddButton,
  getPolicyFormCancelButton,
  getPolicyFormSaveButton,
  getPolicyNameTextField,
  getSnackbar,
  TranslationKeys,
  verifyConfirmationModal,
  verifyHashEquals,
  visitPage,
} from '../support/utils'

const MOCK_POLICY = PolicyListDetailsQueryMock.policy
const MOCK_NETWORK_ACCESS_POLICIES = BffPlatform.defaultProfilesMock.profiles.elements
const testPolicy = MOCK_NETWORK_ACCESS_POLICIES[0].name
const testName = 'my testing name'
const testDescription = 'my testing description'

describe('Persona adaptive response policies', () => {
  before(() => {
    I.loadI18nNamespaces('components', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues')
  })
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('UES.ARR.Enabled', 'false')
    window.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
  })
  describe('Adaptive Response Policy Details (C84583340)', () => {
    const mockPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]
    const policyHashs = ['#/adaptiveResponse/create', `#/adaptiveResponse/${mockPolicy.entityId}`]
    policyHashs.forEach((url, index) => {
      const title = url === '#/adaptiveResponse/create' ? 'New Policy' : 'Existing Policy'
      describe(title, () => {
        before(() => {
          visitPage(url, contentWindow => {
            contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
            contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
            contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
          })
        })
        it('Should display policy details as per UX', () => {
          getPolicyNameTextField().should('be.visible')
          getPolicyDescriptionTextField().should('be.visible')
          I.findByRole('heading', { name: I.translate(TranslationKeys.identityRiskResponseActionsHeading) }).should('be.visible')
          I.findByRole('checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) }).should('not.exist')
          I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.riskFactorTableHeader) }).should(
            'be.visible',
          )
          I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.detectionTableHeader) }).should(
            'be.visible',
          )
          I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.responseActionsTableHeader) }).should(
            'be.visible',
          )
          I.findByRole('cell', { name: I.translate(TranslationKeys.highRiskLevel) })
            .should('exist')
            .next()
            .should('contain.text', I.translate(TranslationKeys.networkAnomaly))
        })
        it("Should display 'Override network access control policy'", () => {
          if (index === 1)
            I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
              .next()
              .find('.MuiChip-deleteIcon')
              .click()
          I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
            .next()
            .findByRole('button')
            .should('be.visible')
            .click()
          I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) }).should('be.visible')
        })
      })
    })
  })

  describe('Policies -> Adaptive response -> Save policies (C88636545)', () => {
    before(() => {
      visitPage('#/list/adaptiveResponse', contentWindow => {
        contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
        contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
      })
    })
    it('Should display policy details screen', () => {
      getAddNewPolicyButton().should('exist').click()
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormAddButton().should('be.disabled')
    })
    it('Should enable add/save button after data fields are entered', () => {
      getPolicyNameTextField().should('exist').type(testName)
      getPolicyDescriptionTextField().should('exist').type(testDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .findByRole('button')
        .should('exist')
        .click()
      I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) })
        .should('exist')
        .click()
      I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).click()
      I.findByRole('option', { name: testPolicy }).click()
      I.findByRole('button', { name: I.translate(TranslationKeys.cancelButton) }).should('be.enabled')
      I.findByRole('button', { name: I.translate(TranslationKeys.saveButton) })
        .should('be.enabled')
        .click()
      getPolicyFormCancelButton().should('be.enabled')
      getPolicyFormAddButton().should('be.enabled').click()
    })
    it('Should save policy -> display policy list', () => {
      I.findByRole('button', { name: I.translate(TranslationKeys.notNowButton) }).click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulCreation)).should('exist')
    })
    it('Should display policy details of existing policy with hidden Cancel/Save', () => {
      I.findByRole('link', { name: testPolicy }).should('exist').click()
      getPolicyNameTextField().should('contain.value', MOCK_POLICY.name)
      getPolicyDescriptionTextField().should('contain.value', MOCK_POLICY.description)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .should('contain.text', I.translate(TranslationKeys.overrideNetworkAccessPolicyChip))
      getPolicyFormCancelButton().should('not.exist')
      getPolicyFormAddButton().should('not.exist')
      getPolicyFormSaveButton().should('not.exist')
    })
    it('Should make Cancel/Save buttons visible and enabled when fields are modified', () => {
      getPolicyNameTextField().type(testName)
      getPolicyDescriptionTextField().type(testDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .find('.MuiChip-deleteIcon')
        .click()
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .findByRole('button')
        .should('exist')
        .click()
      I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) })
        .should('exist')
        .click()
      I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).click()
      I.findByRole('option', { name: testPolicy }).click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.addButton) }).should('not.exist')
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.cancelButton) })
        .should('be.visible')
        .should('be.enabled')
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.saveButton) })
        .should('be.visible')
        .should('be.enabled')
        .click()
      getPolicyFormAddButton().should('not.exist')
      getPolicyFormCancelButton().should('be.visible').should('be.enabled')
      getPolicyFormSaveButton().should('be.visible').should('be.enabled')
    })
    it('Should return to Policy Adaptive response list after Save', () => {
      getPolicyFormSaveButton().click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulUpdate)).should('be.visible')
    })
  })

  describe('Policies -> Adaptive response -> Cancel policy changes (C88636546)', () => {
    before(() => {
      visitPage('#/list/adaptiveResponse', contentWindow => {
        contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
        contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
      })
    })
    it('Should display Policy details screen', () => {
      getAddNewPolicyButton().click()
      verifyHashEquals('#/adaptiveResponse/create')
      getPolicyFormAddButton().should('exist').should('be.disabled')
      getPolicyFormCancelButton().should('exist').should('be.enabled')
      getPolicyFormSaveButton().should('not.exist')
    })
    it('Should not save -> return to policy list', () => {
      getPolicyFormCancelButton().click()
      verifyHashEquals('#/list/adaptiveResponse')
    })
    it('Should display policy details screen', () => {
      getAddNewPolicyButton().click()
      verifyHashEquals('#/adaptiveResponse/create')
      getPolicyFormAddButton().should('exist').should('be.disabled')
      getPolicyFormCancelButton().should('exist').should('be.enabled')
      getPolicyFormSaveButton().should('not.exist')
    })
    it('Should display policy details with data fields populated and Cancel/Add buttons enabled', () => {
      getPolicyNameTextField().type(testName)
      getPolicyDescriptionTextField().type(testDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .findByRole('button')
        .should('exist')
        .click()
      I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) })
        .should('exist')
        .click()
      I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).click()
      I.findByRole('option', { name: testPolicy }).click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.saveButton) }).click()
      getPolicyFormAddButton().should('be.enabled')
      getPolicyFormCancelButton().should('be.enabled')
    })
    it('Should display confirmation Modal', () => {
      I.findByRoleOptionsWithin('generic', { name: I.translate(TranslationKeys.formButtonPanel) }, 'button', {
        name: I.translate(TranslationKeys.cancelButton),
      }).click()
      verifyConfirmationModal()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.modifiedPolicyConfirmationDialogCancel) })
        .should('be.enabled')
        .click()
    })
    it('Should display populated policy details', () => {
      getPolicyNameTextField().should('contain.value', testName)
      getPolicyDescriptionTextField().should('contain.value', testDescription)
      I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
        .next()
        .find('.MuiChip-label')
        .should('contain.text', I.translate(TranslationKeys.overrideNetworkAccessPolicyChip) + testPolicy)
      getPolicyFormSaveButton().should('not.exist')
      getPolicyFormAddButton().should('be.enabled')
      getPolicyFormCancelButton().should('be.enabled')
    })
    it('Should display confirmation modal', () => {
      getPolicyFormCancelButton().click()
      verifyConfirmationModal()
    })
    it('Should not save policy -> display adaptive response policy list', () => {
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.modifiedPolicyConfirmationDialogConfirm) })
        .should('be.enabled')
        .click()
      verifyHashEquals('#/list/adaptiveResponse')
      I.findByRole('alert').should('not.exist')
    })
  })

  describe('Policies -> Adaptive response -> Delete policy (C88901032)', () => {
    before(() => {
      visitPage('#/list/adaptiveResponse', contentWindow => {
        contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
        contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
      })
    })
    it('Should display deletion confirmation prompt', () => {
      I.findByRole('link', { name: testPolicy }).should('exist').click()
      I.findByRole('button', { name: I.translate(TranslationKeys.deleteButton) })
        .scrollIntoView()
        .should('be.visible')
        .click()
      I.findByRole('dialog').should('be.visible')
      I.findByRoleWithin('dialog', 'heading', { name: I.translate(TranslationKeys.deletionConfirmationHeader) }).should(
        'be.visible',
      )
      I.findByText(I.translate(TranslationKeys.deletionConfirmationSingle, { name: MOCK_POLICY.name })).should('be.visible')
      I.findByText(I.translate(TranslationKeys.deletionConfirmationNote)).should('be.visible')
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.deleteButton) })
        .should('be.enabled')
        .should('contain.text', I.translate(TranslationKeys.deleteButton))
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.cancelButton) })
        .should('be.enabled')
        .should('contain.text', I.translate(TranslationKeys.cancelButton))
    })
    it('Should not delete policy, and display details screen on Cancel', () => {
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.cancelButton) }).click()
      I.findByRole('dialog').should('not.exist')
      getPolicyNameTextField().should('exist')
      getPolicyDescriptionTextField().should('exist')
      I.findByRole('heading', { name: I.translate(TranslationKeys.identityRiskResponseActionsHeading) }).should('exist')
      I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.riskFactorTableHeader) }).should('exist')
      I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.detectionTableHeader) }).should('exist')
      I.findByRoleWithin('table', 'columnheader', { name: I.translate(TranslationKeys.responseActionsTableHeader) }).should('exist')
    })
    it('Should delete policy -> display policy list, on Delete', () => {
      I.findByRole('button', { name: I.translate(TranslationKeys.deleteButton) })
        .should('be.visible')
        .click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.deleteButton) })
        .should('be.enabled')
        .should('contain.text', I.translate(TranslationKeys.deleteButton))
        .click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulDeletion)).should('be.visible')
    })
  })
})
