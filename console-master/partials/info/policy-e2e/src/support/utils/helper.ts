import { v4 as uuidv4 } from 'uuid'

import type { Policy } from '@ues-data/dlp/mocks'
import { CLASSIFICATION, POLICY_TYPE, policyTest } from '@ues-data/dlp/mocks'
import { FeatureName } from '@ues-data/shared-types'

import { FLAGS } from '../../support/constants/selectors'
import { CONDITIONS } from '../constants/conditions'
import { HeaderPanel } from '../pages/header-panel.page'
import { ContentPoliciesTable } from '../pages/policies-pages/content-policies-table.page'
import { ContentPolicy } from '../pages/policies-pages/content-policy.page'

const dlpPolicy = `${FLAGS.DLP_POLICY}:policy`

const WAIT_TIMEOUT = {
  halfOfSecond: 500,
  oneSecond: 1000,
  twoSeconds: 2000,
  threeSeconds: 3000,
}
const defaultPolicy = policyTest(POLICY_TYPE.CONTENT, CLASSIFICATION.ORGANIZATIONAL, uuidv4(), 'Test Policy', 'Test Description')

const setLocalStoragePermissionCheck = (enabled: string) => {
  window.localStorage.setItem(FeatureName.PermissionChecksEnabled, enabled)
}

const setLocalStorageUesDataMock = (enabled: string) => {
  window.localStorage.setItem('UES_DATA_MOCK', enabled)
}

const setLocalStorageDlp = (enabled: string) => {
  window.localStorage.setItem(FeatureName.UESDlpNavigation, enabled)
}

const setLocalStorageDlpMobile = (enabled: string) => {
  window.localStorage.setItem(FeatureName.UESDlpMobileNavigation, enabled)
}

const initializeBrowserFeatures = () => {
  window.localStorage.clear()
  setLocalStorageUesDataMock('true')
  setLocalStorageDlp('true')
  setLocalStorageDlpMobile('true')
  Cypress.log({
    name: 'setMocks',
    displayName: 'setMocks',
    message: `Setting MOCKS for UES_DATA_MOCK , ${FeatureName.UESDlpNavigation}, ${FeatureName.UESDlpMobileNavigation}`,
  })
}

const fillRequiredFieldsOfNewPolicyAndSave = (policyName: string, policyDescription: string) => {
  ContentPolicy.visit()
  Cypress.log({ message: `Creating default policy. Policy name: ${policyName}, Policy description: ${policyDescription}` })
  HeaderPanel.getHeadingByName(I.translate(`${dlpPolicy}.addPolicyWithType`, { policyType: 'content' })).should(
    CONDITIONS.BE_VISIBLE,
    {
      timeout: WAIT_TIMEOUT.threeSeconds,
    },
  )
  ContentPolicy.getPolicyNameField().type(policyName)
  ContentPolicy.getPolicyDescriptionField().type(policyDescription)
  ContentPolicy.conditions.getAddFromTemplateButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
  ContentPolicy.conditions.template.getAllCheckbox().click({ multiple: true })
  ContentPolicy.conditions.template.getSaveButton().click()
  ContentPolicy.getAddButton().click()
  ContentPolicy.getRejectConfirmationButton().click()
  ContentPoliciesTable.getButtonByLabel('close').click()
}

const addContentPolicyToListView = (policy: Policy) => {
  ContentPoliciesTable.visit()
  I.location()
    .window({ log: true })
    .wait(WAIT_TIMEOUT.threeSeconds)
    .its('IPolicyMock')
    .then(IPolicyMock => IPolicyMock.create(policy))
  Cypress.log({
    name: 'Adding Content Policy to list policy view.',
    displayName: 'addContentPolicyToListView',
    message: `Policy Name: ${policy.policyName} \n
                      Policy Description: ${policy.description} \n
                      Policy Type: ${policy.policyType} \n
                      Policy sub Type: ${policy.classification} \n
                      Policy guid: ${policy.policyId}`,
  })
  ContentPoliciesTable.getTabByName(`${dlpPolicy}.tabTitle.mobile`).click().go('back')
}

export const Helper = {
  setLocalStoragePermissionCheck,
  setLocalStorageUesDataMock,
  setLocalStorageDlp,
  setLocalStorageDlpMobile,
  addContentPolicyToListView,
  fillRequiredFieldsOfNewPolicyAndSave,
  initializeBrowserFeatures,
  WAIT_TIMEOUT,
  defaultPolicy,
}
