import { FORM_REFS, POLICY_DEFAULTS, TAB } from '@ues-mtd/policy/mocks'

import {
  beChecked,
  beDisabled,
  beEnabled,
  beUnchecked,
  beVisible,
  CHECKBOX_STATE,
  chooseReactSelectOption,
  copyItem,
  getButton,
  getCheckbox,
  getDialog,
  getDialogButton,
  getGeneric,
  getGenericLabel,
  getLeftLabel,
  getRightLabel,
  getSpinButton,
  getSubmitButton,
  getTabButton,
  getTextBox,
  haveAttr,
  notBeChecked,
  notBeVisible,
  notExist,
  notHaveAttr,
  policyDescription,
  policyName,
  validate,
} from './settings'

export class PolicyBase {
  static payloadToValidate: any

  static duplicateNameError: string
  static nameError: string
  static singleError: string
  static doubleError: string
  static noSelectedModelError: string
  static warningNoDataPrivacySelected: string
  static modifiedDialogCancelButton: string
  static modifiedDialogConfirmButton: string
  static formButtonPanelText: string
  static goBackButtonText: string
  static selectAllLeftLabel: string
  static selectAllRightLabel: string
  static transferItemsLeftLabel: string
  static transferItemsRightLabel: string
  static androidInsecureWifiLeftLabel: string
  static androidInsecureWifiRightLabel: string
  static androidUnsupportedOsListLeftLabel: string
  static androidUnsupportedOsListRightLabel: string
  static iosUnsupportedOsListLeftLabel: string
  static iosUnsupportedOsListRightLabel: string
  static mtdPolicyNavigation: string
  static policyCreatedMessage: string
  static createAddButtonLabel: string
  static updateButtonLabel: string
  static policyNameLabel: string
  static policyDescriptionLabel: string
  static policyDeletedMessage: string
  static policyUpdatedMessage: string
  static androidScanMsgStartTimeOffset: string
  static noModelsToViewMessage: string
  static clearLabel: string

  static resetPayload = () => {
    PolicyBase.payloadToValidate = copyItem(POLICY_DEFAULTS)
    PolicyBase.payloadToValidate['warningNotificationsEnabled'] = true
  }

  static setBasePolicyName = (name: string) => {
    I.findByRole('textbox', { name: PolicyBase.policyNameLabel }).clear().type(name)
    PolicyBase.payloadToValidate['name'] = name
  }

  static setPolicyName = () => {
    PolicyBase.setBasePolicyName(policyName)
  }

  static clearPolicyName = () => {
    I.findByRole('textbox', { name: PolicyBase.policyNameLabel }).clear()
    delete PolicyBase.payloadToValidate['name']
  }

  static setPolicyDescription = description => {
    I.findByRole('textbox', { name: PolicyBase.policyDescriptionLabel }).clear().type(description)
    PolicyBase.payloadToValidate['description'] = description
  }

  static verifyMissingNameError = () => {
    I.findByText(PolicyBase.nameError).should(beVisible)
    I.findByRole('alert').find('button').click()
  }

  static verifyDuplicateNameError = () => {
    I.findByText(PolicyBase.duplicateNameError).should(beVisible)
    I.findByRole('alert').find('button').click()
  }

  static toggleSwitch = (name: string) => {
    if (PolicyBase.payloadToValidate[name] === true) {
      getCheckbox(name).should(beChecked).should(beEnabled).uncheck().should(beUnchecked)
      PolicyBase.payloadToValidate[name] = false // keep payload current
    } else {
      getCheckbox(name).should(beUnchecked).should(beEnabled).check().should(beChecked)
      PolicyBase.payloadToValidate[name] = true // keep payload current
    }
  }

  static setSpinButton = (name: string, value: number) => {
    PolicyBase.payloadToValidate[name] = value
    getSpinButton(name).clear().type(value.toString())
  }

  static setSelectOption = (name: string, value: string) => {
    PolicyBase.payloadToValidate[name] = value
    chooseReactSelectOption(name, value)
  }

  static setSwitch = (name: string, value: boolean) => {
    if (value === true) {
      getCheckbox(name).check().should(beChecked)
    } else {
      getCheckbox(name).uncheck().should(beUnchecked)
    }
    PolicyBase.payloadToValidate[name] = value // keep payload current
  }

  static setSwitchValidate = (name: string, value: boolean) => {
    if (value === true) {
      getCheckbox(name).should(beUnchecked).should(beEnabled).check().should(beChecked)
    } else {
      getCheckbox(name).should(beChecked).should(beEnabled).uncheck().should(beUnchecked)
    }
    PolicyBase.payloadToValidate[name] = value // keep payload current
  }

  static getFormButtonPanel = () => {
    return getGeneric(PolicyBase.formButtonPanelText)
  }

  static verifyFormButtonPanelVisible = (isVisible: boolean) => {
    if (isVisible) {
      PolicyBase.getFormButtonPanel().should(beVisible)
    } else {
      PolicyBase.getFormButtonPanel().should(notBeVisible)
    }
  }

  static goBackButton = () => {
    return I.findByLabelText(PolicyBase.goBackButtonText)
  }

  static getIosUnsupportedOsLeftCheckBox = name => {
    return getGeneric(PolicyBase.iosUnsupportedOsListLeftLabel).findByRole('checkbox', { name: name })
  }

  static getIosUnsupportedOsRightCheckBox = name => {
    return getGeneric(PolicyBase.iosUnsupportedOsListRightLabel).findByRole('checkbox', { name: name })
  }

  static getAndroidUnsupportedOsLeftCheckBox = name => {
    return getGeneric(PolicyBase.androidUnsupportedOsListLeftLabel).findByRole('checkbox', { name: name })
  }

  static getAndroidUnsupportedOsRightCheckBox = name => {
    return getGeneric(PolicyBase.androidUnsupportedOsListRightLabel).findByRole('checkbox', { name: name })
  }

  static getWifiLeftCheckBox = name => {
    return getGeneric(PolicyBase.androidInsecureWifiLeftLabel).findByRole('checkbox', { name: name })
  }

  static getNotiyBase = (name: string, suffix: string) => {
    return getGenericLabel(`${name}${suffix}`)
  }

  static getNotiy = (key: string, suffix: string) => {
    return PolicyBase.getNotiyBase(key, suffix).findByRole('checkbox')
  }

  static setNotiy = (key: string, suffix: string) => {
    PolicyBase.getNotiy(key, suffix).should(beChecked).uncheck()
    PolicyBase.payloadToValidate[`${key}${suffix}`] = false // keep payload current
  }

  static getWifiRightCheckBox = name => {
    return getGeneric(PolicyBase.androidInsecureWifiRightLabel).findByRole('checkbox', { name: name })
  }

  static getSubmitButton = (isCreate: boolean) => {
    return isCreate
      ? PolicyBase.getFormButtonPanel().findByRole('button', { name: PolicyBase.createAddButtonLabel })
      : PolicyBase.getFormButtonPanel().findByRole('button', { name: PolicyBase.updateButtonLabel })
  }

  static verifyFormButtonPanelButtons = (
    submitVisible: boolean,
    cancelVisible: boolean,
    copyVisible: boolean,
    submitEnabled: boolean,
    isCreate: boolean,
  ) => {
    PolicyBase.verifyFormButtonPanelVisible(true)
    if (submitVisible) {
      getSubmitButton(isCreate).should(submitEnabled ? beEnabled : beDisabled)
    } else {
      getSubmitButton(isCreate).should(notBeVisible)
    }
    getButton('cancelButtonLabel').should(cancelVisible ? beVisible : notBeVisible)
    getButton('saveAsButtonLabel').should(copyVisible ? beVisible : notExist)
  }

  static testFormButttonPanelCancel = () => {
    PolicyBase.toggleSwitch('dataPrivacyEnabled')

    getButton('cancelButtonLabel').should(beEnabled).click()
    getDialogButton(PolicyBase.modifiedDialogCancelButton).click()
    getDialog().should(notExist)

    // getButton('cancelButtonLabel').should(beEnabled).click()
    // getDialogButton(PolicyBase.modifiedDialogConfirmButton).click()
    // getDialog().should(notExist)
    PolicyBase.toggleSwitch('dataPrivacyEnabled')
  }

  static verifyRowLength = (parentElement, desiredLength: number, options?) => {
    const elementToSelectFrom = parentElement ? parentElement : I
    elementToSelectFrom
      .findAllByRole('row', options ?? {})
      .its('length')
      .should('be.eq', desiredLength)
  }

  static getUnsupportedModelDropdownButton = (name: string) => {
    return getDialog().findByRole('button', { name: name })
  }

  static verifyUnsupportedModelCheckboxes = (
    vendorName: string,
    brandName: string,
    modelName: string,
    vendorState: CHECKBOX_STATE,
    brandState: CHECKBOX_STATE,
    modelState: CHECKBOX_STATE,
  ) => {
    PolicyBase.verifyUnsupportedModelCheckbox(vendorName, vendorState)
    PolicyBase.verifyUnsupportedModelCheckbox(`${vendorName}||${brandName}`, brandState)
    PolicyBase.verifyUnsupportedModelCheckbox(`${vendorName}||${brandName}||${modelName}`, modelState)
  }

  static verifyUnsupportedModelCheckbox = (name: string, state: CHECKBOX_STATE, parentElement?: Cypress.Chainable) => {
    const checkBoxName = `${name}`
    const vendorCheckbox = parentElement
      ? parentElement.findByRole('checkbox', { name: checkBoxName })
      : getDialog().findByRole('checkbox', { name: checkBoxName })
    switch (state) {
      case CHECKBOX_STATE.CHECKED:
        vendorCheckbox.should(beChecked)
        PolicyBase.verifyDataIndetermindate(vendorCheckbox, haveAttr, 'false')
        break
      case CHECKBOX_STATE.INDETERMINATE:
        vendorCheckbox.should(notBeChecked)
        PolicyBase.verifyDataIndetermindate(vendorCheckbox, notHaveAttr, 'false')
        break
      case CHECKBOX_STATE.UNCHECKED:
        vendorCheckbox.should(notBeChecked)
        PolicyBase.verifyDataIndetermindate(vendorCheckbox, haveAttr, 'false')
    }
  }

  static verifyDataIndetermindate = (element: Cypress.Chainable, chainer, value: string) => {
    element.should(chainer, 'data-indeterminate', value)
  }

  static loadStrings = () => {
    return I.loadI18nNamespaces('mtd/common', 'profiles', 'components', 'general/form').then(() => {
      PolicyBase.mtdPolicyNavigation = I.translate('profiles:navigation.mobileDeviceThreats.label')
      PolicyBase.formButtonPanelText = I.translate('components:drawer.formButtonPanel')
      PolicyBase.goBackButtonText = I.translate('components:button.goBackText')
      PolicyBase.selectAllLeftLabel = I.translate('components:transferList.selectAllLeftLabel')
      PolicyBase.selectAllRightLabel = I.translate('components:transferList.selectAllRightLabel')
      PolicyBase.transferItemsLeftLabel = I.translate('components:transferList.transferItemsLeftLabel')
      PolicyBase.transferItemsRightLabel = I.translate('components:transferList.transferItemsRightLabel')
      PolicyBase.clearLabel = I.translate('general/form:commonLabels.clear')
      // Last one should be mtd/common
      PolicyBase.duplicateNameError = I.translate('mtd/common:policy.nameHelperText')
      PolicyBase.nameError = I.translate('mtd/common:policy.nameHelperTextRequired')
      PolicyBase.singleError = I.translate('mtd/common:policy.formSubmitSnackBarError', { count: 1 })
      PolicyBase.doubleError = I.translate('mtd/common:policy.formSubmitSnackBarError', { count: 2 })
      PolicyBase.noSelectedModelError = I.translate('mtd/common:policy.androidUnsupportedModelListRequired')
      PolicyBase.warningNoDataPrivacySelected = I.translate('mtd/common:policy.dataPrivacyEnabledRequired')
      PolicyBase.modifiedDialogCancelButton = I.translate('mtd/common:policy.modifiedPolicyConfirmationDialog.cancelButton')
      PolicyBase.modifiedDialogConfirmButton = I.translate('mtd/common:policy.modifiedPolicyConfirmationDialog.confirmButton')
      PolicyBase.createAddButtonLabel = I.translate('mtd/common:policy.create.addButtonLabel')
      PolicyBase.updateButtonLabel = I.translate('mtd/common:policy.saveButtonLabel')
      PolicyBase.androidInsecureWifiLeftLabel = I.translate('mtd/common:policy.androidInsecureWifiListLeft')
      PolicyBase.androidInsecureWifiRightLabel = I.translate('mtd/common:policy.androidInsecureWifiListRight')
      PolicyBase.androidUnsupportedOsListLeftLabel = I.translate('mtd/common:policy.androidUnsupportedOsListLeft')
      PolicyBase.androidUnsupportedOsListRightLabel = I.translate('mtd/common:policy.androidUnsupportedOsListRight')
      PolicyBase.iosUnsupportedOsListLeftLabel = I.translate('mtd/common:policy.iosUnsupportedOsListLeft')
      PolicyBase.iosUnsupportedOsListRightLabel = I.translate('mtd/common:policy.iosUnsupportedOsListRight')
      PolicyBase.policyCreatedMessage = I.translate('mtd/common:policy.policyCreatedMessage')
      PolicyBase.policyNameLabel = I.translate('mtd/common:policy.name')
      PolicyBase.policyDescriptionLabel = I.translate('mtd/common:policy.description')
      PolicyBase.policyDeletedMessage = I.translate('mtd/common:policy.policyDeletedMessage')
      PolicyBase.policyUpdatedMessage = I.translate('mtd/common:policy.policyUpdatedMessage')
      PolicyBase.androidScanMsgStartTimeOffset = I.translate('mtd/common:policy.androidScanMsgStartTimeOffset')
      PolicyBase.noModelsToViewMessage = I.translate('mtd/common:policy.viewDeviceModelDialog.noData')
    })
  }

  static nonDefaultData = () => {
    getTextBox('description').clear().type(policyDescription)
    PolicyBase.payloadToValidate['description'] = policyDescription

    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    PolicyBase.toggleSwitch('androidPrivilegeEscalationEnabled')
    PolicyBase.toggleSwitch('androidHwAttestationEnabled')
    delete PolicyBase.payloadToValidate['androidHwAttestationSecurityLevel']
    PolicyBase.toggleSwitch('androidSafetynetAttestationEnabled')
    delete PolicyBase.payloadToValidate['androidSafetynetAttestationCtsEnabled']
    PolicyBase.toggleSwitch('androidMaliciousAppEnabled')
    delete PolicyBase.payloadToValidate['androidMaliciousAppAlwaysAllowApprovedList'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppAlwaysBlockRestrictList'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppScanSystem'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppWifiMaxSize'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppWifiMaxMonthly'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppUploadOverWifi'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppMobileMaxSize'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppMobileMaxMonthly'] // keep payload current
    delete PolicyBase.payloadToValidate['androidMaliciousAppUploadOverMobile'] // keep payload current
    PolicyBase.toggleSwitch('androidSideLoadedAppEnabled')
    PolicyBase.toggleSwitch('androidMessageScanningEnabled')
    delete PolicyBase.payloadToValidate['androidMessageScainnngOption'] // keep payload current

    PolicyBase.toggleSwitch('androidCompromisedNetworkEnabled')
    PolicyBase.toggleSwitch('androidEncryptionDisabled')
    PolicyBase.toggleSwitch('androidScreenLockDisabled')
    PolicyBase.toggleSwitch('androidKnoxAttestationEnabled')
    PolicyBase.toggleSwitch('androidDeveloperModeDetectionEnabled')

    // now ios settings
    getTabButton(TAB.IOS).click()
    PolicyBase.toggleSwitch('iosPrivilegeEscalationEnabled')
    PolicyBase.toggleSwitch('iosIntegrityCheckAttestationEnabled')
    PolicyBase.toggleSwitch('iosSideLoadedAppEnabled')
    PolicyBase.toggleSwitch('iosMessageScanningEnabled')
    delete PolicyBase.payloadToValidate['iosMessageScanningOption'] // keep payload current
    PolicyBase.toggleSwitch('iosCompromisedNetworkEnabled')
    PolicyBase.toggleSwitch('iosScreenLockDisabled')
  }

  // submit form
  // using @policyCreate capture the MTD POST create payload
  // verify payload against payloadToVerify parameter
  // remove the policy create snackbar message issued on succesfully policy creation
  static verifyCreatePayload = payloadToVerify => {
    const payload = copyItem(payloadToVerify)
    return PolicyBase.getSubmitButton(true)
      .click({ force: true })
      .wait('@policyCreate', { requestTimeout: 30000 })
      .its('request.body')
      .then(body => {
        // remove the snackbar message
        PolicyBase.verifySnackbarMsg(PolicyBase.policyCreatedMessage).then(() => {
          // verify complex members separately - ignore order to make less fragile
          console.log('VerifyCreatePayload', { body, payload })
          validate(body, payload, FORM_REFS.ANDROID_INSECURE_WIFI_LIST)
          validate(body, payload, FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST)
          validate(body, payload, FORM_REFS.ANDROID_SECURITY_PATCH_LIST)
          validate(body, payload, FORM_REFS.IOS_UNSUPPORTED_OS_LIST)
          validate(body, payload, FORM_REFS.ANDROID_UNSUPPORTED_MODEL_LIST)
          expect(body).contains(payload)
        })
      })
  }

  static verifySnackbarMsg = (msg: string) => {
    return I.findByRole('alert')
      .should('contain', msg)
      .find('button')
      .click()
      .then(() => {
        I.findByRole('alert').should(notExist)
      })
  }

  static verifySingleError = () => {
    return PolicyBase.verifySnackbarMsg(PolicyBase.singleError)
  }

  static verifyDoubleError = () => {
    return PolicyBase.verifySnackbarMsg(PolicyBase.doubleError)
  }
}
