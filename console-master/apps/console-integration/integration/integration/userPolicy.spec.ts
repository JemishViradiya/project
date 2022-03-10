// Adding User Policies
import {
  AddPolicyCommonObjects,
  AddUserPolicy,
  AssignOption,
  DeleteOption,
  PolicyType,
  ResendOption,
  SaveOption,
  userEnrollmentPolicyData as userPolicyData,
} from '@ues-platform/shared-e2e'

const t = I.loadI18nNamespaces('platform/common', 'general/form', 'profiles')

// currently disabled
xFeature('Policies')

Before(async ({ login }) => {
  await login('admin')
})

Scenario('Add Enrollment policy iOS and Android Allowed', { retries: 2 }, async () => {
  const myTestCase01 = userPolicyData.policyTC01
  const dNAME = myTestCase01[0].generalInformation[0].name
  AddPolicyCommonObjects.gotoUserPolicy()
  AddPolicyCommonObjects.selectUserPolicyTab(PolicyType.Enrollment)
  AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase01)
  AddUserPolicy.addEnrollmentPolicyOptions(myTestCase01)
  AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
  AddPolicyCommonObjects.assignPolicyOption(AssignOption.Not_Now)
  AddPolicyCommonObjects.refreshPolicyList(PolicyType.Enrollment)
  AddPolicyCommonObjects.deletePolicy(dNAME, DeleteOption.Delete)
}).tag('TestID=C104384977')

Scenario('Add Enrollment policy Windows and macOS Allowed', { retries: 2 }, async () => {
  const myTestCase02 = userPolicyData.policyTC02
  const dNAME = myTestCase02[0].generalInformation[0].name
  AddPolicyCommonObjects.gotoUserPolicy()
  AddPolicyCommonObjects.selectUserPolicyTab(PolicyType.Enrollment)
  AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase02)
  AddUserPolicy.addEnrollmentPolicyOptions(myTestCase02)
  AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
  AddPolicyCommonObjects.assignPolicyOption(AssignOption.Not_Now)
  AddPolicyCommonObjects.refreshPolicyList(PolicyType.Enrollment)
  AddPolicyCommonObjects.deletePolicy(dNAME, DeleteOption.Delete)
}).tag('TestID=C104584302')

Scenario('Add Enrollment policy Name is Required', { retries: 2 }, async () => {
  const myTestCase03 = userPolicyData.policyTC03
  AddPolicyCommonObjects.gotoUserPolicy()
  AddPolicyCommonObjects.selectUserPolicyTab(PolicyType.Enrollment)
  AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase03)
  AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
  AddPolicyCommonObjects.checkRequiredHelperText()
  AddPolicyCommonObjects.addPolicyOption(SaveOption.Cancel)
  AddPolicyCommonObjects.unsavedChangesOption(AssignOption.Leave_Page)
}).tag('TestID=C104592957')

Scenario('Add/Edit/Delete Enrollment policy', { retries: 2 }, async () => {
  const myTestCase04 = userPolicyData.policyTC04
  const dNAME = myTestCase04[0].generalInformation[0].name
  let updatedName = dNAME

  // go to Enrollment tab
  AddPolicyCommonObjects.gotoUserPolicy()
  AddPolicyCommonObjects.selectUserPolicyTab(PolicyType.Enrollment)

  // add
  AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase04)
  AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
  AddPolicyCommonObjects.assignPolicyOption(AssignOption.Not_Now)
  AddPolicyCommonObjects.refreshPolicyList(PolicyType.Enrollment)

  // edit
  updatedName = AddPolicyCommonObjects.modifyPolicyGeneralInfo(myTestCase04)
  AddUserPolicy.modifyEnrollmentPolicyEmailOptions(myTestCase04)
  AddPolicyCommonObjects.saveModifiedPolicyOption(SaveOption.Save)
  AddPolicyCommonObjects.resendEmailToUsersOption(ResendOption.No)
  AddPolicyCommonObjects.refreshPolicyList(PolicyType.Enrollment)

  // delete
  AddPolicyCommonObjects.deletePolicy(updatedName, DeleteOption.Delete)
  AddPolicyCommonObjects.refreshPolicyList(PolicyType.Enrollment)
})
  .tag('TestID=104740873')
  .tag('TestID=105065869')
