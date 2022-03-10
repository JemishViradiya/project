import { PolicyListDetailsQueryMock } from '@ues-data/bis/mocks'
import { BffPlatform } from '@ues-data/platform/mocks'

import {
  getAddNewPolicyButton,
  getPolicyFormAddButton,
  getPolicyFormSaveButton,
  getPolicyNameTextField,
  getSnackbar,
  TranslationKeys,
  verifyHashEquals,
  visitPage,
} from '../support/utils'

const MOCK_POLICY = PolicyListDetailsQueryMock.policy
const MOCK_NETWORK_ACCESS_POLICIES = BffPlatform.defaultProfilesMock.profiles.elements

describe('Persona adaptive response policies', () => {
  before(() => {
    I.loadI18nNamespaces('components', 'gateway-settings', 'profiles', 'bis/shared', 'bis/ues')
  })
  beforeEach(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('UES.ARR.Enabled', 'true')
    window.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
  })
  describe('Enable Automatic Risk Reduction (ARR) in UES Adaptive Response policy screen (C88546586)', () => {
    const mockPolicyHasARR = MOCK_POLICY.policyData?.identityPolicy?.fixUp?.enabled
    const testName = 'my testing name'
    const policyListItem = MOCK_NETWORK_ACCESS_POLICIES[0]
    before(() => {
      visitPage('#/list/adaptiveResponse', contentWindow => {
        contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
        contentWindow.localStorage.setItem('UES.ARR.Enabled', 'true')
        contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
      })
    })
    it('Should have ARR disabled by default -> ARR settings displayed as per UX', () => {
      getAddNewPolicyButton().click()
      verifyHashEquals('#/adaptiveResponse/create')
      I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) })
        .should('be.enabled')
        .should('not.be.checked')
      I.findByText(I.translate(TranslationKeys.automaticRiskReductionCheckbox)).should('be.visible')
      I.findByText(I.translate(TranslationKeys.automaticRiskReductionDescription)).should('be.visible')
    })
    it('Should enable toggle for ARR', () => {
      I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) }).click()
      I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) })
        .should('be.enabled')
        .should('be.checked')
    })
    it('Should save policy -> display list view', () => {
      getPolicyNameTextField().should('exist').type(testName)
      getPolicyFormAddButton().click()
      I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.notNowButton) })
        .should('be.enabled')
        .click()
      verifyHashEquals('#/list/adaptiveResponse')
      getSnackbar(I.translate(TranslationKeys.successfulCreation)).should('be.visible')
    })
    if (mockPolicyHasARR) {
      it('Should have policy with ARR setting enabled', () => {
        I.findByRole('link', { name: policyListItem.name }).should('exist').click()
        I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) })
          .should('be.enabled')
          .should('be.checked')
      })
      it('Should disable ARR', () => {
        I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) }).click()
        I.findByRoleWithin('group', 'checkbox', { name: I.translate(TranslationKeys.automaticRiskReductionCheckbox) })
          .should('be.enabled')
          .should('not.be.checked')
      })
      it('Should save policy -> display list view', () => {
        getPolicyFormSaveButton().click()
        verifyHashEquals('#/list/adaptiveResponse')
        getSnackbar(I.translate(TranslationKeys.successfulUpdate)).should('be.visible')
      })
    }
  })
})
