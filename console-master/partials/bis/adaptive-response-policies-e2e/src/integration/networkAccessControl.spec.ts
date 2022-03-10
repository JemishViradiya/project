import { PolicyListDetailsQueryMock } from '@ues-data/bis/mocks'
import { BffPlatform } from '@ues-data/platform/mocks'

import {
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
    window.localStorage.setItem('UES.ARR.Enabled', 'false')
    window.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
  })
  describe('Assign Network Access Control Policy to Adaptive Response Policy (C87352670)', () => {
    const testName = 'my testing name'
    const mockPolicy = MOCK_NETWORK_ACCESS_POLICIES[0]
    const policyHashs = ['#/adaptiveResponse/create', `#/adaptiveResponse/${mockPolicy.entityId}`]
    policyHashs.forEach((policyUrl, index) => {
      const title = index === 0 ? 'New Policy' : 'Existing Policy'
      describe(title, () => {
        before(() => {
          visitPage(policyUrl, contentWindow => {
            contentWindow.localStorage.setItem('UES_DATA_MOCK', 'true')
            contentWindow.localStorage.setItem('UES.ARR.Enabled', 'false')
            contentWindow.localStorage.setItem('ues.action.orchestrator.enabled', 'false')
          })
        })
        it('Should open new policy and populate policy name', () => {
          if (index === 0) {
            getPolicyNameTextField().should('exist').type(testName)
            getPolicyNameTextField().should('contain.value', testName)
          } else {
            getPolicyNameTextField().should('contain.value', MOCK_POLICY.name)
          }
        })
        it("Should display 'Override Network Access Policy' menuitem", () => {
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
        it('Should display Modal with dropdown menu to "select network access policy"', () => {
          I.findByRole('menuitem', { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle) }).click()
          I.findByRoleWithin('dialog', 'heading', {
            name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogTitle),
          }).should('be.visible')
          I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).should('be.visible')
        })
        it('Should display network access policies', () => {
          I.findByLabelText(I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel)).click()
          MOCK_NETWORK_ACCESS_POLICIES.forEach(policy => {
            I.findByRoleOptionsWithin(
              'listbox',
              { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel) },
              'option',
              {
                name: policy.name,
              },
            ).should('be.visible')
          })
        })
        it('Should enable save button when a policy is selected', () => {
          I.findByRoleOptionsWithin(
            'listbox',
            { name: I.translate(TranslationKeys.assignNetworkAccessPolicyDialogLabel) },
            'option',
            {
              name: mockPolicy.name,
            },
          ).click()
          I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.saveButton) }).should('be.enabled')
        })
        it('Should display network access policy under Response Actions', () => {
          I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.saveButton) }).click()
          I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
            .next()
            .should('contain.text', `${I.translate(TranslationKeys.overrideNetworkAccessPolicyChip)}${mockPolicy.name}`)
            .should('be.visible')
        })
        it('Should save policy', () => {
          if (index === 0) {
            getPolicyFormAddButton().click()
            I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.notNowButton) })
              .should('be.enabled')
              .click()
            getSnackbar(I.translate(TranslationKeys.successfulCreation)).should('be.visible')
          } else {
            getPolicyFormSaveButton().click()
            getSnackbar(I.translate(TranslationKeys.successfulUpdate)).should('be.visible')
          }
          verifyHashEquals('#/list/adaptiveResponse')
        })
      })
    })
  })
})
