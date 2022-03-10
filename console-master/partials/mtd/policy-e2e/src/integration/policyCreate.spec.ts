import {
  DATA_PRIVACY_FORM_SETTINGS,
  NOTIFY_SUFFIX,
  POLICY_HW_ATTESTATION_SECURITY_LEVEL,
  POLICY_SMS_SCANNING_OPTIONS,
  TAB,
} from '@ues-mtd/policy/mocks'

import { PolicyBase } from '../support/policyBase'
import {
  beDisabled,
  beEnabled,
  beVisible,
  CHECKBOX_STATE,
  clickVirtualizedCheckbox,
  exist,
  getButton,
  getCheckbox,
  getCheckboxInTable,
  getDialog,
  getDialogButton,
  getReactSelectOption,
  getSpinButton,
  getTabButton,
  getTable,
  notExist,
  policyDescription,
  setLocalStorageState,
  verifyBadge,
  verifyErrorMsg,
  verifyNoBadge,
} from '../support/settings'

const { INDETERMINATE, CHECKED, UNCHECKED } = CHECKBOX_STATE

const setSwitchAndValidate = (name: string, value: boolean) => {
  PolicyBase.setSwitchValidate(name, value)
  PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
}
const getAndroidScanMsgStartTimeOffset = () => {
  return I.findByRole('spinbutton', { name: PolicyBase.androidScanMsgStartTimeOffset })
}

describe('MTD policy create testcases', () => {
  before(() => {
    setLocalStorageState()
    PolicyBase.resetPayload()
    PolicyBase.loadStrings().then(() => {
      I.visit('#/protectMobile/create')
    })
  })
  beforeEach(() => {
    // Define the "@policyCreate" intercept used in verifyPostPayload to validate policy create payload
    setLocalStorageState()
    I.intercept(
      {
        method: 'POST',
        pathname: '/**/api/mtd/v1/policies/',
      },
      {
        statusCode: 200,
      },
    ).as('policyCreate')
  })
  it('testing policy create with missing name', () => {
    // Verify email notification UX settings
    getSpinButton('warningNotificationsCount').should(notExist)
    getSpinButton('warningNotificationsInterval').should(notExist)
    getReactSelectOption('warningNotificationsIntervalType').should(notExist)

    // Add description to make form dirty to test error on submit
    PolicyBase.setPolicyDescription(policyDescription)
    // Submit the form and verify error
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifyMissingNameError()
  })
  it('testing androidScanMsgStartTimeOffset boundries', () => {
    PolicyBase.setPolicyName()
    getAndroidScanMsgStartTimeOffset().clear().type('-1')
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      getAndroidScanMsgStartTimeOffset().clear().type('169')
      PolicyBase.getSubmitButton(true).click()
      PolicyBase.verifySingleError().then(() => {
        getAndroidScanMsgStartTimeOffset().clear().type('168')
        PolicyBase.payloadToValidate['androidScanMsgStartTimeOffset'] = 168

        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
      })
    })
  })
  it('testing androidSideLoadedAppEnabled', () => {
    setSwitchAndValidate('androidSideLoadedAppEnabled', false)
  })
  it('testing androidCompromisedNetworkEnabled', () => {
    setSwitchAndValidate('androidCompromisedNetworkEnabled', false)
  })
  it('testing androidEncryptionDisabled', () => {
    setSwitchAndValidate('androidEncryptionDisabled', false)
  })
  it('testing androidScreenLockDisabled', () => {
    setSwitchAndValidate('androidScreenLockDisabled', false)
  })
  it('testing androidKnoxAttestationEnabled', () => {
    setSwitchAndValidate('androidKnoxAttestationEnabled', true)
  })
  // Now run IOS tests
  it('testing iosPrivilegeEscalationEnabled', () => {
    getTabButton(TAB.IOS).click()
    setSwitchAndValidate('iosPrivilegeEscalationEnabled', false)
  })
  it('testing iosIntegrityCheckAttestationEnabled', () => {
    getTabButton(TAB.IOS).click()
    setSwitchAndValidate('iosIntegrityCheckAttestationEnabled', false)
  })
  it('testing iosSideLoadedAppEnabled', () => {
    getTabButton(TAB.IOS).click()
    setSwitchAndValidate('iosSideLoadedAppEnabled', false)
  })
  it('testing iosCompromisedNetworkEnabled', () => {
    getTabButton(TAB.IOS).click()
    setSwitchAndValidate('iosCompromisedNetworkEnabled', false)
  })
  it('testing iosScreenLockDisabled', () => {
    getTabButton(TAB.IOS).click()
    setSwitchAndValidate('iosScreenLockDisabled', false)
  })
  it('testing androidMaliciousAppEnabled disabled', () => {
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

    getCheckbox('androidMaliciousAppAlwaysAllowApprovedList').should(notExist)
    getCheckbox('androidMaliciousAppAlwaysBlockRestrictList').should(notExist)
    getCheckbox('androidMaliciousAppScanSystem').should(notExist)
    getSpinButton('androidMaliciousAppWifiMaxSize').should(notExist)
    getSpinButton('androidMaliciousAppWifiMaxMonthly').should(notExist)
    getCheckbox('androidMaliciousAppUploadOverWifi').should(notExist)
    getSpinButton('androidMaliciousAppMobileMaxSize').should(notExist)
    getSpinButton('androidMaliciousAppMobileMaxMonthly').should(notExist)
    getCheckbox('androidMaliciousAppUploadOverMobile').should(notExist)
  })
  Object.keys(POLICY_SMS_SCANNING_OPTIONS).forEach((key, index) => {
    it(`testing POLICY_SMS_SCANNING_OPTIONS: ${key}`, () => {
      getTabButton(TAB.IOS).click()
      PolicyBase.setSwitch('iosMessageScanningEnabled', true)
      PolicyBase.setSelectOption('iosMessageScanningOption', key)

      getTabButton(TAB.ANDROID).click()
      PolicyBase.setSwitch('androidMessageScanningEnabled', true)
      PolicyBase.setSelectOption('androidMessageScanningOption', key)
      getAndroidScanMsgStartTimeOffset().clear().type(index.toString())
      PolicyBase.payloadToValidate['androidScanMsgStartTimeOffset'] = index

      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
        PolicyBase.setSwitch('androidMessageScanningEnabled', false)
        getReactSelectOption('androidMessageScanningOption').should(notExist)
        getTabButton(TAB.IOS).click()
        PolicyBase.setSwitch('iosMessageScanningEnabled', false)
        getReactSelectOption('iosMessageScanningOption').should(notExist)
      })
    })
  })
  it('testing PageTitlePanel go back button - form dirty', () => {
    PolicyBase.setPolicyDescription('FormDirty')
    // verify modified dialog is invoked when we click go back button
    PolicyBase.goBackButton().should(beEnabled).click()
    getDialogButton(PolicyBase.modifiedDialogCancelButton).click()
    getDialog().should(notExist)
  })
  it('testing androidUnsupportedModelEnabled', () => {
    // Model selection, used for checkbox states and payload verification
    const modelTest_vendor = 'Acer'
    const modelTest_brand = 'Acer Iconia Tab 8'
    const modelTest_model = 'A1-840FHD'
    // Brand selection, used for payload verification
    const brandTest_vendor = 'Gionee'
    const brandTest_brand = 'A1'
    // Vendor selection, used for payload verification
    const vendorTest_vendor = 'htc'

    getTabButton(TAB.ANDROID).click()
    PolicyBase.setSwitchValidate('androidUnsupportedModelEnabled', true)

    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      verifyBadge(TAB.ANDROID)
      verifyErrorMsg(PolicyBase.noSelectedModelError)
    })

    // disable androidUnsupportedModelEnabled submit form and verify displayed error condition is removed
    PolicyBase.setSwitchValidate('androidUnsupportedModelEnabled', false)
    verifyNoBadge(TAB.ANDROID)
    I.findByText(PolicyBase.noSelectedModelError).should(notExist)

    // switch back on
    PolicyBase.setSwitchValidate('androidUnsupportedModelEnabled', true)

    // Verify that the view dialog has no models to display
    getButton('androidViewUnsupportedDeviceModelLabel').click()
    getDialog().findByText(PolicyBase.noModelsToViewMessage).should(beVisible)
    getDialogButton(I.translate('common.close')).should(exist).click()

    // Go inside edit dialog and verify that:
    // 1. Search works
    // 2. Different selected states (full, partial, not) behave as expected when clicked

    // 1. Test search
    getButton('androidEditUnsupportedDeviceModelLabel').click()
    getDialog()
      .findByRole('textbox', { name: I.translate('policy.selectDeviceModelDialog.searchText') })
      .type('A1')
    // everything should be expanded; vendor, brands and models
    PolicyBase.verifyRowLength(getDialog(), 6)

    // 2. Make sure selected, not selected, and indeterminate checkboxes are working
    // Check the Acer vendor box, verify that the vendor, brand and model are all selected
    clickVirtualizedCheckbox(`${modelTest_vendor}`)
    PolicyBase.verifyUnsupportedModelCheckboxes(modelTest_vendor, modelTest_brand, modelTest_model, CHECKED, CHECKED, CHECKED)

    // We click the brand checkbox to turn it into indeterminate, this should affect both vendor and brand checkbox states
    clickVirtualizedCheckbox(`${modelTest_vendor}||${modelTest_brand}`)
    PolicyBase.verifyUnsupportedModelCheckboxes(
      modelTest_vendor,
      modelTest_brand,
      modelTest_model,
      INDETERMINATE,
      INDETERMINATE,
      CHECKED,
    )

    // We unselect the model checkbox. Everything should be unselected
    clickVirtualizedCheckbox(`${modelTest_vendor}||${modelTest_brand}||${modelTest_model}`)
    PolicyBase.verifyUnsupportedModelCheckboxes(modelTest_vendor, modelTest_brand, modelTest_model, UNCHECKED, UNCHECKED, UNCHECKED)

    // With nothing selected, we shouldn't be able to save
    getDialogButton(I.translate('common.save')).should(beDisabled)

    // Check some boxes for verifying save payload
    clickVirtualizedCheckbox(`${modelTest_vendor}||${modelTest_brand}||${modelTest_model}`) // select a model
    getDialogButton(PolicyBase.clearLabel).click()
    PolicyBase.getUnsupportedModelDropdownButton(`${brandTest_vendor}`).click({ force: true })
    clickVirtualizedCheckbox(`${brandTest_vendor}||${brandTest_brand}`) // select a brand
    clickVirtualizedCheckbox(`${vendorTest_vendor}`) // select a vendor
    getDialogButton(I.translate('common.save')).click()

    // Go to view dialog and verify that:
    // 1. all checkboxes have correct selection states
    getButton(`androidViewUnsupportedDeviceModelLabel`).click()

    // Verify model only selection is correct
    PolicyBase.verifyUnsupportedModelCheckboxes(
      modelTest_vendor,
      modelTest_brand,
      modelTest_model,
      INDETERMINATE,
      INDETERMINATE,
      CHECKED,
    )

    // Verify all models that fall under our chosen brand
    const modelsToVerify = ['GIONEE A1']
    modelsToVerify.forEach(model => {
      PolicyBase.verifyUnsupportedModelCheckboxes(brandTest_vendor, brandTest_brand, model, INDETERMINATE, CHECKED, CHECKED)
    })

    // Verify all brands and models that fall under our chosen vendor
    const brandModelsToVerify = [
      { brand: '10', models: ['HTC_M10h'] },
      { brand: '10 evo', models: ['HTC 10 evo'] },
      { brand: 'Amaze 4G', models: ['HTC_Amaze_4G'] },
    ]

    PolicyBase.verifyRowLength(getDialog(), 7, { name: /htc.*/ }) // make sure there are only 3 models, 3 brands and 1 vendor
    brandModelsToVerify.forEach(brandObj => {
      const brand = brandObj.brand
      brandObj.models.forEach(model => {
        PolicyBase.verifyUnsupportedModelCheckboxes(vendorTest_vendor, brand, model, CHECKED, CHECKED, CHECKED)
      })
    })
    getDialogButton(I.translate('common.close')).click()

    PolicyBase.payloadToValidate['androidUnsupportedModelList'] = [
      {
        name: modelTest_vendor,
        brands: [
          {
            name: modelTest_brand,
            models: [modelTest_model],
          },
        ],
      },
      {
        name: brandTest_vendor,
        brands: [
          {
            name: brandTest_brand,
          },
          {
            name: brandTest_brand,
            models: ['GIONEE A1'],
          },
        ],
      },
      {
        name: vendorTest_vendor,
      },
    ]
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
  })
  it(`testing DATA_PRIVACY_FORM_SETTINGS`, () => {
    // Verify dataPrivacyEnabled is unchecked and all setting elements do not exist
    PolicyBase.setSwitch('dataPrivacyEnabled', false)
    Object.keys(DATA_PRIVACY_FORM_SETTINGS).forEach(key => {
      getCheckbox(key).should(notExist)
    })

    PolicyBase.setSwitch('dataPrivacyEnabled', true)
    Object.keys(DATA_PRIVACY_FORM_SETTINGS).forEach(key => {
      PolicyBase.setSwitch(key, false)
    })

    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      verifyErrorMsg(PolicyBase.warningNoDataPrivacySelected)

      Object.keys(DATA_PRIVACY_FORM_SETTINGS).forEach(key => {
        PolicyBase.setSwitch(key, true)
      })
      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
    })
  })
  it(`testing androidHwAttestationEnabled:`, () => {
    PolicyBase.setSwitch('androidHwAttestationEnabled', false)
    getCheckbox('androidHwAttestationSecurityPatchEnabled').should(notExist)

    PolicyBase.setSwitch('androidHwAttestationEnabled', true)
    getCheckbox('androidHwAttestationSecurityPatchEnabled').should(exist)
  })
  // No need checking the default payload already have verified this
  Object.keys(POLICY_HW_ATTESTATION_SECURITY_LEVEL)
    .filter(key => key !== POLICY_HW_ATTESTATION_SECURITY_LEVEL.SOFTWARE)
    .forEach(key => {
      it(`testing POLICY_HW_ATTESTATION_SECURITY_LEVEL: ${key}`, () => {
        PolicyBase.setPolicyDescription(key)
        // test all select options
        PolicyBase.setSelectOption('androidHwAttestationSecurityLevel', key)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
      })
    })
  it('testing androidHwAttestationEnabled and SecurityPatch', () => {
    PolicyBase.setSwitch('androidHwAttestationEnabled', true)
    PolicyBase.setSwitch('androidHwAttestationSecurityPatchEnabled', true)

    // verify save with empty list is error
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      // Add multiple items from pop-up
      getTable('androidHwAttestationSecurityPatchEnabled')
        .findByRole('button', { name: I.translate('common.add') })
        .click()
      getCheckboxInTable(1, getDialog()).check({ force: true })
      getDialog().findByPlaceholderText(I.translate('policy.androidHwAttestationSecurityPatchSearch')).type('blu')
      getCheckboxInTable(1, getDialog()).check({ force: true })
      getDialogButton(I.translate('common.add')).click()
      getDialog().should(notExist)

      // verify table data (includes header)
      getTable('androidHwAttestationSecurityPatchEnabled').findAllByRole('row').its('length').should('be.eq', 3)

      // remove first (and verify size)
      getTable('androidHwAttestationSecurityPatchEnabled')
        .findByRole('row', { name: '|null|null' })
        .findByRole('button', { name: I.translate('common.delete') })
        .click()
      getTable('androidHwAttestationSecurityPatchEnabled').findAllByRole('row').its('length').should('be.eq', 2)

      // clear the date and verify error
      getTable('androidHwAttestationSecurityPatchEnabled').findByRole('row', { name: '|Blu|null' }).findByRole('textbox').clear()
      PolicyBase.getSubmitButton(true).click()
      PolicyBase.verifySingleError().then(() => {
        // fix date fields and submit/verify
        getTable('androidHwAttestationSecurityPatchEnabled')
          .findByRole('row', { name: '|Blu|null' })
          .findByRole('textbox')
          .type('12/18/2019')

        // submit and verify
        PolicyBase.payloadToValidate['androidHwAttestationSecurityPatchLevelList'] = [
          { date: { year: 2019, month: 12, day: 18 }, vendor: 'Blu' },
        ] // keep payload current
        PolicyBase.setNotiy('androidHwAttestationSecurityPatchEnabled', NOTIFY_SUFFIX.DeviceNotify)
        PolicyBase.setNotiy('androidHwAttestationSecurityPatchEnabled', NOTIFY_SUFFIX.EmailNotify)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
          PolicyBase.setSwitch('androidHwAttestationSecurityPatchEnabled', false)
          PolicyBase.setSwitch('androidHwAttestationEnabled', false)
          delete PolicyBase.payloadToValidate['androidHwAttestationSecurityPatchLevelList']
        })
      })
    })
  })
  it('testing androidSafetynetAttestationEnabled', () => {
    // Verify safteynet settings, check CtsEnabled and verify payload
    PolicyBase.setSwitch('androidSafetynetAttestationEnabled', false)
    getCheckbox('androidSafetynetAttestationCtsEnabled').should(notExist)

    PolicyBase.setSwitch('androidSafetynetAttestationEnabled', true)
    PolicyBase.setSwitch('androidSafetynetAttestationCtsEnabled', true)
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
      PolicyBase.setSwitch('androidSafetynetAttestationEnabled', false)
    })
  })
})
