const locators = {
  addNewPolicyBtn() {
    return I.findByText(I.translate('profiles:policy.list.add'), { timeout: 10000 })
  },
  policyRiskAssessmentHeader() {
    return I.findByText(I.translate('bis/ues:detectionPolicies.list.info.paragraph'), { timeout: 10000 })
  },
  defaultPolicyLink() {
    return I.findByText(I.translate('profiles:policy.defaultPolicyName'), { timeout: 10000 })
  },
  editPolicyNameInput() {
    return I.findByText(I.translate('bis/ues:detectionPolicies.form.labels.name'), { timeout: 10000 })
  },
  editPolicyDescriptionInput() {
    return I.findByText(I.translate('bis/ues:detectionPolicies.form.labels.description'), { timeout: 10000 })
  },
  saveBtn() {
    return I.findByRole('button', { name: I.translate('mtd/common:common.save') })
  },
}
export default {
  goToRiskAssessmentPage() {
    I.visit('/uc/user-policies#/list/riskAssessment')
    locators.policyRiskAssessmentHeader().isVisible()
  },
  checkDefaultPolicyDeletionDisabled() {
    locators.defaultPolicyLink().isVisible()
    I.findByLabelText(I.translate('general/form:ariaLabels.selectRow', { identifier: 'Default' })).isDisabled()
  },
  openDefaultPolicy() {
    locators.defaultPolicyLink().isVisible()
    locators.defaultPolicyLink().click()
  },
  checkNameInputReadOnly() {
    locators.editPolicyNameInput().isVisible()
    locators.editPolicyNameInput().isDisabled()
  },
  editDescription(description: string) {
    locators.editPolicyDescriptionInput().isVisible()
    locators.editPolicyDescriptionInput().isEnabled()
    locators.editPolicyDescriptionInput().fill(description)
    locators.saveBtn().isVisible()
    locators.saveBtn().isEnabled()
    locators.saveBtn().click()
    locators.defaultPolicyLink().isVisible()
    locators.policyRiskAssessmentHeader().isVisible()
    I.findByText(description, { timeout: 10000 }).should('exist')
  },
}
