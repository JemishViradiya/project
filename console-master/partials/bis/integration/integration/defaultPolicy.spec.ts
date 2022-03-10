/* eslint-env node, codeceptjs/codeceptjs, mocha */
/* eslint-disable no-unused-expressions */

import data from '../fixtures/defaultPolicy.json'
import riskAssessement from '../pages/userPolicies/riskAssessment'

const t = I.loadI18nNamespaces('bis/ues', 'mtd/common', 'general/form', 'profiles')
const testData = data.testConfig

Feature('Default User policy')

Before(async ({ login }) => {
  await login('admin')
})

Scenario('Edit Default Policy description', async () => {
  riskAssessement.goToRiskAssessmentPage()
  riskAssessement.openDefaultPolicy()
  riskAssessement.checkNameInputReadOnly()
  riskAssessement.editDescription(testData.description)
  riskAssessement.checkDefaultPolicyDeletionDisabled()
  riskAssessement.openDefaultPolicy()
  riskAssessement.editDescription(testData.descriptionUpdated)
})
  .tag('TestID=C97752521')
  .tag('defaultUserPolicy')
