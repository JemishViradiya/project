// CodeceptJS and Cypress Page Object for user policies common objects

const isVisible = 'be.visible'

const translateString = {
  ADD_POLICY: 'platform/common:activationProfile.list.addProfile',
  GENERAL_INFO: 'platform/common:activationProfile.form.generalInfo',
  NAME: 'platform/common:activationProfile.form.name',
  DESCRIPTION: 'platform/common:activationProfile.form.description',
  ADD: 'general/form:commonLabels.add',
  SAVE: 'general/form:commonLabels.save',
  CANCEL: 'general/form:commonLabels.cancel',
  DELETE: 'profiles:policy.deleteButton',
}

export enum PolicyType {
  Enrollment = 'Enrollment',
  Network_Access_Control = 'Network Access Control',
  Gateway_Service = 'Gateway Service',
  Authentication = 'Authentication',
  Protect_Mobile = 'Protect Mobile',
  Risk_Assessment = 'Risk Assessment',
}

export enum SaveOption {
  Add = 'Add',
  Cancel = 'Cancel',
  Save = 'Save',
}

export enum AssignOption {
  Cancel = 'Cancel',
  Leave_Page = 'Leave Page',
  Not_Now = 'Not Now',
  Yes = 'Yes',
}

export enum ResendOption {
  No = 'No',
  Send = 'Send',
}

export enum DeleteOption {
  Delete = 'Delete',
  Cancel = 'Cancel',
}

export const AddPolicyCommonObjects = {
  gotoUserPolicy() {
    const tPOLICIES = I.translate('profiles:navigation.policies')
    const tUSER_POLICY = I.translate('profiles:navigation.title')

    I.visit('/uc/user-policies#/list/activation')
    I.findByRole('heading', { level: 1, name: tPOLICIES, timeout: 20000 })
    I.findByRole('heading', { level: 1, name: tUSER_POLICY, timeout: 20000 })
  },

  selectUserPolicyTab(policyType: PolicyType) {
    switch (policyType) {
      case PolicyType.Enrollment: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.activation.label') }).click()
        break
      }
      case PolicyType.Network_Access_Control: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.networkAccessControl.label') }).click()
        break
      }
      case PolicyType.Gateway_Service: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.gatewayService.label') }).click()
        break
      }
      case PolicyType.Authentication: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.enterpriseIdentity.label') }).click()
        break
      }
      case PolicyType.Protect_Mobile: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.mobileDeviceThreats.label') }).click()
        break
      }
      case PolicyType.Risk_Assessment: {
        I.findByRole('tab', { name: I.translate('profiles:navigation.riskDetection.label') }).click()
        break
      }
    }
  },

  enterPolicyGeneralInfo(testCaseData: unknown) {
    const tADD_POLICY = I.translate(translateString.ADD_POLICY)
    const tGENERAL_INFO = I.translate(translateString.GENERAL_INFO)
    const tNAME = I.translate(translateString.NAME)
    const tDESCRIPTION = I.translate(translateString.DESCRIPTION)

    I.findByText(tADD_POLICY, { timeout: 30000 })
    I.findByRole('button', { name: tADD_POLICY }).click()
    I.findByText(tGENERAL_INFO, { timeout: 10000 }).should(isVisible)

    const dNAME = testCaseData[0].generalInformation[0].name
    if (dNAME !== '') {
      I.findByRole('textbox', { name: tNAME }).type(dNAME)
    }
    const dDESC = testCaseData[0].generalInformation[0].description
    if (dDESC !== '') {
      I.findByRole('textbox', { name: tDESCRIPTION }).type(dDESC)
    }
  },

  addPolicyOption(saveOption: SaveOption) {
    const tCANCEL = I.translate(translateString.CANCEL)
    const tADD = I.translate(translateString.ADD)

    I.findByRole('button', { name: tCANCEL }).should(isVisible)
    I.findByRole('button', { name: tADD }).should(isVisible)

    if (saveOption === SaveOption.Add) {
      I.findByRole('button', { name: tADD }).click()
    } else {
      I.findByText(tCANCEL).click()
    }
  },

  modifyPolicyGeneralInfo(testCaseData: unknown) {
    const tGENERAL_INFO = I.translate(translateString.GENERAL_INFO)
    const tNAME = I.translate(translateString.NAME)
    const tDESCRIPTION = I.translate(translateString.DESCRIPTION)
    const tSAVE = I.translate(translateString.SAVE)
    const tCANCEL = I.translate(translateString.CANCEL)

    // before modify
    const dNAME = testCaseData[0].generalInformation[0].name
    const dDESC = testCaseData[0].generalInformation[0].description
    I.findByText(dNAME).should('exist').click()
    I.findByText(tGENERAL_INFO, { timeout: 10000 }).should(isVisible)
    I.findByRole('button', { name: tSAVE }).should('not.exist')
    I.findByRole('button', { name: tCANCEL }).should('not.exist')

    // modify
    const uniqueSeed = Date.now().toString()
    I.findByRole('textbox', { name: tNAME }).fillField(dNAME + uniqueSeed)
    I.findByRole('textbox', { name: tDESCRIPTION }).fillField(dDESC + uniqueSeed)
    I.findByRole('button', { name: tSAVE }).should(isVisible)
    I.findByRole('button', { name: tCANCEL }).should(isVisible)
    return dNAME + uniqueSeed
  },

  saveModifiedPolicyOption(saveOption: SaveOption) {
    const tSAVE = I.translate(translateString.SAVE)
    const tCANCEL = I.translate(translateString.CANCEL)

    if (saveOption === SaveOption.Save) {
      I.findByRole('button', { name: tSAVE }).click()
    } else {
      I.findByText(tCANCEL).click()
    }
  },

  deletePolicy(policyName: string, deleteOption: DeleteOption) {
    const tDELETE = I.translate(translateString.DELETE)
    const tCANCEL = I.translate(translateString.CANCEL)

    const chkboxName = 'Select row for ' + policyName + '.'
    I.findByRole('checkbox', { name: chkboxName, timeout: 10000 }).click()
    I.findByRole('button', { name: tDELETE }).should(isVisible)
    I.findByRole('button', { name: tDELETE }).click()

    const tDeletedMsg = I.translate('profiles:policy.delete.successMessage')
    I.findByRole('dialog', { name: 'Delete confirmation' }).should(isVisible)
    if (deleteOption === DeleteOption.Delete) {
      I.findByRole('button', { name: tDELETE }).click()
      I.findByText(tDeletedMsg).should(isVisible)
    } else {
      I.findByText(tCANCEL).click()
    }
  },

  checkRequiredHelperText() {
    const tRequired = I.translate('platform/common:activationProfile.form.required')
    const tNAME = I.translate(translateString.NAME)
    const dNAME = 'Enrollment Policy 03 Name is Required'
    I.findAllByText(tRequired).should(isVisible)
    I.findByRole('textbox', { name: tNAME }).type(dNAME)
    I.findAllByText(tRequired).should('not.be.visible')
  },

  unsavedChangesOption(assignOption: AssignOption) {
    const tCANCEL = I.translate(translateString.CANCEL)
    const tLEAVE_PAGE = I.translate('platform/common:activationProfile.unsaved.submit')
    const tUNSAVED_CHANGES = I.translate('platform/common:activationProfile.unsaved.title')
    const tUNSAVED_MSG = I.translate('platform/common:activationProfile.unsaved.content')

    I.findByRole('button', { name: tCANCEL }).should(isVisible)
    I.findByRole('button', { name: tLEAVE_PAGE }).should(isVisible)
    I.findByRole('heading', { level: 2, name: tUNSAVED_CHANGES }).should(isVisible)
    I.findByText(tUNSAVED_MSG).should(isVisible)
    if (assignOption === AssignOption.Leave_Page) {
      I.findByRole('button', { name: tLEAVE_PAGE }).click()
    } else {
      I.findByRole('button', { name: tCANCEL }).click()
    }
  },

  assignPolicyOption(assignOption: AssignOption) {
    const tNOT_NOW = I.translate('platform/common:activationProfile.assignCreatedPolicyConfirmation.notNow')
    const tYES = I.translate('general/form:commonLabels.yes')
    const tASSIGN_TITLE = I.translate('platform/common:activationProfile.assignCreatedPolicyConfirmation.title')
    const tASSIGN_MSG = I.translate('platform/common:activationProfile.assignCreatedPolicyConfirmation.description')

    I.findByText(tASSIGN_MSG, { timeout: 20000 })
    I.findByRole('heading', { level: 2, name: tASSIGN_TITLE }).should(isVisible)
    I.findByRole('button', { name: tNOT_NOW }).should(isVisible)
    I.findByRole('button', { name: tYES }).should(isVisible)

    if (assignOption === AssignOption.Yes) {
      I.findByRole('button', { name: tYES }).click()
    } else {
      I.findByRole('button', { name: tNOT_NOW }).click()
    }
  },

  resendEmailToUsersOption(resendOption: ResendOption) {
    const tNO = I.translate('general/form:commonLabels.no')
    const tSEND = I.translate('general/form:commonLabels.send')
    const tTITLE = I.translate('platform/common:activationProfile.editResendEmailConfirmation.title')
    const tMSG = I.translate('platform/common:activationProfile.editResendEmailConfirmation.content')

    I.findByText(tMSG, { timeout: 20000 })
    I.findByRole('heading', { level: 2, name: tTITLE }).should(isVisible)
    I.findByRole('button', { name: tNO }).should(isVisible)
    I.findByRole('button', { name: tSEND }).should(isVisible)

    if (resendOption === ResendOption.Send) {
      I.findByRole('button', { name: tSEND }).click()
    } else {
      I.findByRole('button', { name: tNO }).click()
    }
  },

  refreshPolicyList(policyType: PolicyType) {
    I.findByRole('tab', { name: policyType }).click()
  },
}
