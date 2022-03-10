import { MOCK_ANDROID_OS_VERSIONS, MOCK_IOS_OS_VERSIONS, MOCK_WIFI_TYPES, MtdPolicyMock } from '@ues-data/mtd/mocks'
import {
  FORM_REFS,
  NOTIFY_SUFFIX,
  POLICY_WARNING_NOTIFICATION_INTERVAL,
  TAB,
  UNRESPONSIVE_AGENT_MAX_VALUE,
  UNRESPONSIVE_AGENT_MIN_VALUE,
} from '@ues-mtd/policy/mocks'

import { PolicyBase } from '../support/policyBase'
import {
  ANDROID_NOTIFY_ELEMENT,
  beChecked,
  beDisabled,
  beEnabled,
  beUnchecked,
  exist,
  getButtonBase,
  getCheckbox,
  getGenericLabel,
  getSpinButton,
  getTabButton,
  haveValue,
  IOS_NOTIFY_ELEMENT,
  notExist,
  setLocalStorageState,
  verifyBadge,
  verifyErrorMsg,
  verifyNoBadge,
} from '../support/settings'

describe('MTD policy create reload testcases ', () => {
  const visitOptions = {
    onBeforeLoad: setLocalStorageState,
  }
  before(() => {
    PolicyBase.loadStrings()
  })
  beforeEach(() => {
    PolicyBase.resetPayload()
    I.visit('#/protectMobile/create', visitOptions).then(() => {
      PolicyBase.setPolicyName()
    })
    // Define the "@policyCreate" intercept used in verifyPostPayload to validate policy create payload
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
  it.skip('testing androidMaliciousApp', () => {
    PolicyBase.setSwitch('androidMaliciousAppEnabled', false)
    getCheckbox('androidMaliciousAppAlwaysAllowApprovedList').should(notExist)
    getCheckbox('androidMaliciousAppAlwaysBlockRestrictList').should(notExist)
    getCheckbox('androidMaliciousAppScanSystem').should(notExist)
    getCheckbox('androidMaliciousAppUploadOverWifi').should(notExist)
    getGenericLabel('androidMaliciousAppWifiMaxSizeHelperText').should(notExist)
    getGenericLabel('androidMaliciousAppWifiMaxMonthlyHelperText').should(notExist)
    getCheckbox('androidMaliciousAppUploadOverMobile').should(notExist)
    getGenericLabel('androidMaliciousAppMobileMaxSizeHelperText').should(notExist)
    getGenericLabel('androidMaliciousAppMobileMaxMonthlyHelperText').should(notExist)
    getSpinButton('androidMaliciousAppWifiMaxSize').should(notExist)
    getSpinButton('androidMaliciousAppWifiMaxMonthly').should(notExist)

    PolicyBase.setSwitch('androidMaliciousAppEnabled', true)
    PolicyBase.setSwitch('androidMaliciousAppUploadOverMobile', false)
    PolicyBase.setSwitch('androidMaliciousAppUploadOverWifi', false)
    getCheckbox('androidMaliciousAppAlwaysAllowApprovedList').should(exist)
    getCheckbox('androidMaliciousAppAlwaysBlockRestrictList').should(exist)
    getCheckbox('androidMaliciousAppScanSystem').should(exist)
    getGenericLabel('androidMaliciousAppUploadOverWifi').should(notExist)
    getGenericLabel('androidMaliciousAppUploadOverMobile').should(notExist)

    PolicyBase.setSwitch('androidMaliciousAppUploadOverWifi', true)

    getSpinButton('androidMaliciousAppWifiMaxSize').should(exist)
    getSpinButton('androidMaliciousAppWifiMaxMonthly').should(exist)

    PolicyBase.setSwitch('androidMaliciousAppAlwaysAllowApprovedList', true)
    PolicyBase.setSwitch('androidMaliciousAppAlwaysBlockRestrictList', true)
    PolicyBase.setSwitch('androidMaliciousAppScanSystem', true)
    PolicyBase.setSwitch('androidMaliciousAppUploadOverWifi', true)
    PolicyBase.setSwitch('androidMaliciousAppUploadOverMobile', false)
    PolicyBase.setSpinButton('androidMaliciousAppWifiMaxSize', 11)
    PolicyBase.setSpinButton('androidMaliciousAppWifiMaxMonthly', 12)

    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
      PolicyBase.setSwitch('androidMaliciousAppUploadOverWifi', false)
      delete PolicyBase.payloadToValidate['androidMaliciousAppWifiMaxSize']
      delete PolicyBase.payloadToValidate['androidMaliciousAppWifiMaxMonthly']
      PolicyBase.setSwitch('androidMaliciousAppUploadOverMobile', true)
      PolicyBase.setSpinButton('androidMaliciousAppMobileMaxSize', 13)
      PolicyBase.setSpinButton('androidMaliciousAppMobileMaxMonthly', 14)
      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
        PolicyBase.setSwitch('androidMaliciousAppEnabled', false)
      })
    })
  })
  it.skip('testing androidInsecureWifiEnabled', () => {
    const filterEvery = 5
    PolicyBase.setSwitchValidate('androidInsecureWifiEnabled', true)
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      verifyBadge(TAB.ANDROID)

      // disable androidInsecureWifiEnabled submit and verify single error and no Android tab error
      PolicyBase.setSwitchValidate('androidInsecureWifiEnabled', false)
      verifyNoBadge(TAB.ANDROID)

      PolicyBase.setSwitchValidate('androidInsecureWifiEnabled', true)

      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)
      PolicyBase.getWifiLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled)
      PolicyBase.getWifiRightCheckBox(PolicyBase.selectAllRightLabel).should(beDisabled)

      // validate all the options are in the unselected side
      Object.keys(MOCK_WIFI_TYPES)
        .filter((_, index) => index % filterEvery === 0)
        .filter(key => isNaN(Number(key)))
        .forEach(key => {
          PolicyBase.getWifiLeftCheckBox(key).should(beUnchecked).should(beEnabled)
          PolicyBase.getWifiRightCheckBox(key).should(notExist)
        })

      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)
      // select all left
      PolicyBase.getWifiLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled)
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      // verify the entire set is checked and on the left
      Object.keys(MOCK_WIFI_TYPES)
        .filter((_, index) => index % filterEvery === 0)
        .filter(key => isNaN(Number(key)))
        .forEach(key => {
          PolicyBase.getWifiLeftCheckBox(key).should(beChecked).should(beEnabled)
        })

      // uncheck select all and verify all are unchecked and still on the left
      PolicyBase.getWifiLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)
      const wifiSettings: string[] = []
      Object.keys(MOCK_WIFI_TYPES)
        .filter((_, index) => index % filterEvery === 0)
        .filter(key => isNaN(Number(key)))
        .forEach(key => {
          // Manually check item
          PolicyBase.getWifiLeftCheckBox(key).should(beUnchecked).should(beEnabled).check()
          // Transfer item to right
          getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled).click()
          getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
          getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)

          PolicyBase.getWifiLeftCheckBox(key).should(notExist) // no longer on left
          PolicyBase.getWifiRightCheckBox(key).should(beEnabled) // moved to right

          wifiSettings.push(key)
        })
      PolicyBase.payloadToValidate[FORM_REFS.ANDROID_INSECURE_WIFI_LIST] = wifiSettings
      PolicyBase.setNotiy('androidInsecureWifiEnabled', NOTIFY_SUFFIX.DeviceNotify)
      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
        // remove a selected item and verify form dirty and payload is as expected
        // originally this specific test identified a bug in the form dirty code
        const key = wifiSettings[0]
        PolicyBase.getWifiRightCheckBox(key).should(beEnabled).check()
        getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()
        const pos = PolicyBase.payloadToValidate[FORM_REFS.ANDROID_INSECURE_WIFI_LIST].indexOf(key)
        PolicyBase.payloadToValidate[FORM_REFS.ANDROID_INSECURE_WIFI_LIST].splice(pos, 1)
        PolicyBase.setNotiy('androidInsecureWifiEnabled', NOTIFY_SUFFIX.EmailNotify)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
          // now test select all right
          // PolicyBase.getWifiLeftCheckBox(PolicyBase.selectAllLeftLabel).should(notExist)
          PolicyBase.getWifiRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).check()
          getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()

          Object.keys(MOCK_WIFI_TYPES)
            .filter((_, index) => index % filterEvery === 0)
            .filter(key => isNaN(Number(key)))
            .forEach(key => {
              PolicyBase.getWifiLeftCheckBox(key).should(beUnchecked).should(beEnabled)
              PolicyBase.getWifiRightCheckBox(key).should(notExist)
            })

          delete PolicyBase.payloadToValidate[FORM_REFS.ANDROID_INSECURE_WIFI_LIST]
          PolicyBase.getSubmitButton(true).click()
          PolicyBase.verifySingleError().then(() => {
            verifyBadge(TAB.ANDROID)
            PolicyBase.setSwitch('androidInsecureWifiEnabled', false)
          })
        })
      })
    })
  })
  it.skip('testing androidUnsupportedOsEnabled', () => {
    const filterEvery = 4
    PolicyBase.setSwitchValidate('androidUnsupportedOsEnabled', true)

    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError()

    verifyBadge(TAB.ANDROID)
    getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
    getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)
    PolicyBase.getAndroidUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled)
    PolicyBase.getAndroidUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beDisabled)

    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
    })

    // select all left
    PolicyBase.getAndroidUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
    getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled)
    getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
    // verify the entire set is checked and on the left
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beChecked).should(beEnabled)
    })

    // Now unselect all left (second click)
    PolicyBase.getAndroidUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
    })

    // Now select all left and transfer right
    PolicyBase.getAndroidUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
    getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled).click()
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsRightCheckBox(key.version).should(beUnchecked).should(beEnabled)
    })

    // Select all right and verify all are checked
    PolicyBase.getAndroidUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsRightCheckBox(key.version).should(beChecked).should(beEnabled)
    })

    // Now unselect all right and verify not checked (second click)
    PolicyBase.getAndroidUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsRightCheckBox(key.version).should(beUnchecked).should(beEnabled)
    })

    // Now transfer all left
    PolicyBase.getAndroidUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
    getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
    })

    const osVersions: string[] = []
    // Manually transfer each element then submit and verify payload
    MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
      // Manually check item
      PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled).check()
      // Transfer item to right
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled).click()
      osVersions.push(key.version)
    })

    PolicyBase.payloadToValidate[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST] = osVersions
    PolicyBase.setNotiy('androidUnsupportedOsEnabled', NOTIFY_SUFFIX.DeviceNotify)
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
      // remove a selected item and verify form dirty and payload is as expected
      // originally this specific test identified a bug in the form dirty code
      const key = osVersions[0]
      PolicyBase.getAndroidUnsupportedOsRightCheckBox(key).should(beEnabled).check()
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()
      const pos = PolicyBase.payloadToValidate[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST].indexOf(key)
      PolicyBase.payloadToValidate[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST].splice(pos, 1)
      PolicyBase.setNotiy('androidUnsupportedOsEnabled', NOTIFY_SUFFIX.EmailNotify)
      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
        // now test select all right
        // PolicyBase.getAndroidUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(notExist)
        PolicyBase.getAndroidUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).check()
        getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()

        MOCK_ANDROID_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
          PolicyBase.getAndroidUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
          PolicyBase.getAndroidUnsupportedOsRightCheckBox(key.version).should(notExist)
        })

        verifyBadge(TAB.ANDROID)

        // disable androidUnsupportedOsList submit form and verify single error
        PolicyBase.setSwitch('androidUnsupportedOsEnabled', false)
        verifyNoBadge(TAB.ANDROID)
        delete PolicyBase.payloadToValidate[FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST]
      })
    })
  })
  it.skip('testing iosUnsupportedOsEnabled', () => {
    const filterEvery = 10
    getTabButton(TAB.IOS).click()
    PolicyBase.setSwitchValidate('iosUnsupportedOsEnabled', true)

    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      verifyBadge(TAB.IOS)
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beDisabled)
      PolicyBase.getIosUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled)
      PolicyBase.getIosUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beDisabled)

      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
      })

      // select all left
      PolicyBase.getIosUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled)
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beDisabled)
      // verify the entire set is checked and on the left
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beChecked).should(beEnabled)
      })

      // Now unselect all left (second click)
      PolicyBase.getIosUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
      })

      // Now select all left and transfer right
      PolicyBase.getIosUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(beEnabled).click()
      getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled).click()
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsRightCheckBox(key.version).should(beUnchecked).should(beEnabled)
      })

      // Select all right and verify all are checked
      PolicyBase.getIosUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsRightCheckBox(key.version).should(beChecked).should(beEnabled)
      })

      // Now unselect all right and verify not checked (second click)
      PolicyBase.getIosUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsRightCheckBox(key.version).should(beUnchecked).should(beEnabled)
      })

      // Now transfer all left
      PolicyBase.getIosUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).click()
      getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
      })

      const osVersions: string[] = []
      // Manually transfer each element then submit and verify payload
      MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
        // Manually check item
        PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled).check()
        // Transfer item to right
        getButtonBase(PolicyBase.transferItemsRightLabel).should(beEnabled).click()
        osVersions.push(key.version)
      })

      PolicyBase.payloadToValidate[FORM_REFS.IOS_UNSUPPORTED_OS_LIST] = osVersions
      PolicyBase.setNotiy('iosUnsupportedOsEnabled', NOTIFY_SUFFIX.DeviceNotify)
      PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
        getTabButton(TAB.IOS).click()
        // remove a selected item and verify form dirty and payload is as expected
        // originally this specific test identified a bug in the form dirty code
        const key = osVersions[0]
        PolicyBase.getIosUnsupportedOsRightCheckBox(key).should(beEnabled).check()
        getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()
        const pos = PolicyBase.payloadToValidate[FORM_REFS.IOS_UNSUPPORTED_OS_LIST].indexOf(key)
        PolicyBase.payloadToValidate[FORM_REFS.IOS_UNSUPPORTED_OS_LIST].splice(pos, 1)
        PolicyBase.setNotiy('iosUnsupportedOsEnabled', NOTIFY_SUFFIX.EmailNotify)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
          getTabButton(TAB.IOS).click()

          // now test select all right
          // PolicyBase.getIosUnsupportedOsLeftCheckBox(PolicyBase.selectAllLeftLabel).should(notExist)
          PolicyBase.getIosUnsupportedOsRightCheckBox(PolicyBase.selectAllRightLabel).should(beEnabled).check()
          getButtonBase(PolicyBase.transferItemsLeftLabel).should(beEnabled).click()

          MOCK_IOS_OS_VERSIONS.filter((_, index) => index % filterEvery === 0).forEach(key => {
            PolicyBase.getIosUnsupportedOsLeftCheckBox(key.version).should(beUnchecked).should(beEnabled)
            PolicyBase.getIosUnsupportedOsRightCheckBox(key.version).should(notExist)
          })

          verifyBadge(TAB.IOS)

          // disable iosUnsupportedOsList submit form and verify single error
          PolicyBase.setSwitch('iosUnsupportedOsEnabled', false)
          verifyNoBadge(TAB.IOS)
          delete PolicyBase.payloadToValidate[FORM_REFS.IOS_UNSUPPORTED_OS_LIST]
        })
      })
    })
  })
  // gets stuck in an infinite loop
  it.skip('testing iosUnsupportedModelEnabled', () => {
    getTabButton(TAB.IOS).click()

    getCheckbox('iosUnsupportedModelEnabled').should(beUnchecked).should(beEnabled).check().should(beChecked)
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      verifyBadge(TAB.IOS)
      verifyErrorMsg(PolicyBase.noSelectedModelError)

      // disable iosUnsupportedModelEnabled submit form and verify error no longer exists
      getCheckbox('iosUnsupportedModelEnabled').uncheck().should(beUnchecked)
      verifyNoBadge(TAB.IOS)
    })
  })
  it('testing warningNotificationsEnabled', () => {
    // check email notification and verify the submit button becomes visible and the interval types are now enabled
    getCheckbox('warningNotificationsEnabled').should(notExist)
    PolicyBase.verifyFormButtonPanelButtons(true, true, false, true, true)

    getSpinButton('warningNotificationsCount').should(beEnabled).should(haveValue, '3')
    getSpinButton('warningNotificationsInterval').should(beEnabled).should(haveValue, '4')

    // change the iterval type from HOURS to MINUTES and verify error
    PolicyBase.setSelectOption('warningNotificationsIntervalType', POLICY_WARNING_NOTIFICATION_INTERVAL.MINUTES)

    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      // set allowable values for interval and count to verify in form submit
      PolicyBase.setSpinButton('warningNotificationsInterval', 16)
      PolicyBase.setSpinButton('warningNotificationsCount', 22)

      Object.keys(POLICY_WARNING_NOTIFICATION_INTERVAL).forEach(key => {
        PolicyBase.setPolicyDescription(key)
        PolicyBase.setSelectOption('warningNotificationsIntervalType', key)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
      })
    })
  })
  it.skip('testing android notifications', () => {
    const ignore: string[] = [
      ANDROID_NOTIFY_ELEMENT[ANDROID_NOTIFY_ELEMENT.androidUnsupportedOsEnabled],
      ANDROID_NOTIFY_ELEMENT[ANDROID_NOTIFY_ELEMENT.androidInsecureWifiEnabled],
      ANDROID_NOTIFY_ELEMENT[ANDROID_NOTIFY_ELEMENT.androidUnsupportedModelEnabled],
      ANDROID_NOTIFY_ELEMENT[ANDROID_NOTIFY_ELEMENT.androidHwAttestationSecurityPatchEnabled],
    ]
    Object.keys(ANDROID_NOTIFY_ELEMENT)
      .filter(key => isNaN(Number(key)))
      .filter(key => !ignore.includes(key))
      .forEach(key => {
        PolicyBase.setSwitch(key, true)
        Object.keys(NOTIFY_SUFFIX)
          .filter(suffix => isNaN(Number(suffix)))
          .forEach(suffix => {
            PolicyBase.setNotiy(key, suffix)
          })
      })
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
  })
  it.skip('testing androidUnresponsiveAgent', () => {
    PolicyBase.setSpinButton('androidUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MIN_VALUE - 1)
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      PolicyBase.setSpinButton('androidUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MAX_VALUE + 1)
      PolicyBase.getSubmitButton(true).click()
      PolicyBase.verifySingleError().then(() => {
        PolicyBase.setSpinButton('androidUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MAX_VALUE)
        PolicyBase.setNotiy('androidUnresponsiveAgent', NOTIFY_SUFFIX.EmailNotify)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
      })
    })
  })
  it.skip('testing iosUnresponsiveAgent', () => {
    getTabButton(TAB.IOS).click()
    PolicyBase.setSpinButton('iosUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MIN_VALUE - 1)
    PolicyBase.getSubmitButton(true).click()
    PolicyBase.verifySingleError().then(() => {
      // set allowable values for interval and count to verify in form submit
      PolicyBase.setSpinButton('iosUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MAX_VALUE + 1)
      PolicyBase.getSubmitButton(true).click()
      PolicyBase.verifySingleError().then(() => {
        PolicyBase.setSpinButton('iosUnresponsiveThresholdHours', UNRESPONSIVE_AGENT_MIN_VALUE)
        PolicyBase.setNotiy('iosUnresponsiveAgent', NOTIFY_SUFFIX.EmailNotify)
        PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
      })
    })
  })
  it.skip('testing ios notifications', () => {
    const ignore: string[] = [
      IOS_NOTIFY_ELEMENT[IOS_NOTIFY_ELEMENT.iosUnsupportedModelEnabled],
      IOS_NOTIFY_ELEMENT[IOS_NOTIFY_ELEMENT.iosUnsupportedOsEnabled],
    ]
    getTabButton(TAB.IOS).click()
    Object.keys(IOS_NOTIFY_ELEMENT)
      .filter(key => isNaN(Number(key)))
      .filter(key => !ignore.includes(key.toString()))
      .forEach(key => {
        PolicyBase.setSwitch(key, true)
        Object.keys(NOTIFY_SUFFIX)
          .filter(suffix => isNaN(Number(suffix)))
          .forEach(suffix => {
            PolicyBase.setNotiy(key, suffix)
          })
      })
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
  })
})
