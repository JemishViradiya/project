// Adding User Policies
import {
  AddPolicyCommonObjects,
  AddUserPolicy,
  AssignOption,
  DeleteOption,
  ResendOption,
  SaveOption,
  userEnrollmentPolicyData as userPolicyData,
} from '@ues-platform/shared-e2e'

describe('Policies', () => {
  before(() => {
    I.loadI18nNamespaces('platform/common', 'profiles', 'general/form').then(() => {
      I.visit('#/uc/user-policies#/list/activation')
    })
  })

  it('Add Enrollment Policies 01 iOS and Android Allowed', () => {
    const myTestCase01 = userPolicyData.policyTC01
    AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase01)
    AddUserPolicy.addEnrollmentPolicyOptions(myTestCase01)
    AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
    AddPolicyCommonObjects.assignPolicyOption(AssignOption.Not_Now)
  })

  it('Add Enrollment Policies 02 Windows and macOS Allowed', () => {
    const myTestCase02 = userPolicyData.policyTC02
    AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase02)
    AddUserPolicy.addEnrollmentPolicyOptions(myTestCase02)
    AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
    AddPolicyCommonObjects.assignPolicyOption(AssignOption.Not_Now)
  })

  it('Add Enrollment Policies 03 Name is Required', () => {
    const myTestCase03 = userPolicyData.policyTC03
    AddPolicyCommonObjects.enterPolicyGeneralInfo(myTestCase03)
    AddPolicyCommonObjects.addPolicyOption(SaveOption.Add)
    AddPolicyCommonObjects.checkRequiredHelperText()
    AddPolicyCommonObjects.addPolicyOption(SaveOption.Cancel)
    AddPolicyCommonObjects.unsavedChangesOption(AssignOption.Leave_Page)
  })

  it('Modify Enrollment Policy Text Fields', () => {
    const myTestCase04 = userPolicyData.policyTC04
    AddPolicyCommonObjects.modifyPolicyGeneralInfo(myTestCase04)
    AddUserPolicy.modifyEnrollmentPolicyEmailOptions(myTestCase04)
    AddPolicyCommonObjects.saveModifiedPolicyOption(SaveOption.Save)
    AddPolicyCommonObjects.resendEmailToUsersOption(ResendOption.No)
  })

  it('Delete an Enrollment Policy', () => {
    const myTestCase04 = userPolicyData.policyTC04
    const dNAME = myTestCase04[0].generalInformation[0].name
    AddPolicyCommonObjects.deletePolicy(dNAME, DeleteOption.Delete)
  })
})
