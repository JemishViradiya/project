import { MtdPolicyMock } from '@ues-data/mtd/mocks'
import { FeatureName } from '@ues-data/shared-types'
import {
  DATA_PRIVACY_FORM_SETTINGS,
  FORM_REFS,
  NOTIFY_SUFFIX,
  POLICY_WARNING_NOTIFICATION_INTERVAL,
  TAB,
} from '@ues-mtd/policy/mocks'

import { payloads } from '../support/commands'
import { PolicyBase } from '../support/policyBase'
import {
  ANDROID_NOTIFY_ELEMENT,
  beChecked,
  beDisabled,
  beEnabled,
  beUnchecked,
  beVisible,
  copyItem,
  exist,
  getButton,
  getCheckbox,
  getDialog,
  getDialogButton,
  getGenericLabel,
  getSpinButton,
  getTabButton,
  haveValue,
  IOS_NOTIFY_ELEMENT,
  mockPolicyGuid,
  notExist,
  setLocalStorageState,
  validate,
} from '../support/settings'

const getAndroidScanMsgStartTimeOffset = () => {
  return I.findByRole('spinbutton', { name: PolicyBase.androidScanMsgStartTimeOffset })
}

// click the confirm dialog delete button
// using @policyDelete capture the MTD DELETE request
// verify the request url contains the correct guid using regex
// remove the policy delete snackbar message issued on succesfully policy delete
const verifyDelete = guid => {
  getButton('deletePolicyConfirmationDialog.confirmButton')
    .click()
    .wait('@policyDelete')
    .should(xhr => {
      // remove the snackbar message
      // PolicyBase.verifySnackbarMsg(PolicyBase.policyDeletedMessage).then(() => {
      // })
      // verify url ends with guid
      expect(xhr.request.url).to.match(new RegExp(guid + '$'))
      // getDialog().should(notExist)
    })
}

// submit form
// using @policyUpdate capture the MTD PUT update payload
// verify payload against payloadToVerify parameter
// remove the policy update snackbar message issued on succesfully policy update
const verifyUpdatePayload = payloadToVerify => {
  const payload = copyItem(payloadToVerify)
  return PolicyBase.getSubmitButton(false)
    .click()
    .wait('@policyUpdate')
    .its('request.body')
    .then(body => {
      // remove the snackbar message
      //I.verifySnackbarMsg(PolicyBase.policyUpdatedMessage)
      // PolicyBase.verifySnackbarMsg(PolicyBase.policyUpdatedMessage).then(() => {
      // })
      // verify complex members separately - ignore order to make less fragile
      validate(body, payload, FORM_REFS.ANDROID_INSECURE_WIFI_LIST)
      validate(body, payload, FORM_REFS.ANDROID_UNSUPPORTED_OS_LIST)
      validate(body, payload, FORM_REFS.ANDROID_SECURITY_PATCH_LIST)
      validate(body, payload, FORM_REFS.IOS_UNSUPPORTED_OS_LIST)
      validate(body, payload, FORM_REFS.ANDROID_UNSUPPORTED_MODEL_LIST)

      // validate the payload
      expect(body).contains(payload)
    })
}

describe('MTD policy update testcases', () => {
  before(() => {
    setLocalStorageState()
    PolicyBase.payloadToValidate = copyItem(MtdPolicyMock)
    PolicyBase.payloadToValidate.id = mockPolicyGuid
    PolicyBase.loadStrings()
    I.visit(`#/protectMobile/update/${mockPolicyGuid}`)
  })

  beforeEach(() => {
    setLocalStorageState()
    // Define the "@policyUpdate" intercept used in verifyPostPayload to validate policy update payload
    I.intercept(
      {
        method: 'PUT',
        pathname: '/**/api/mtd/v1/policies/**',
      },
      {
        statusCode: 200,
        body: PolicyBase.payloadToValidate,
      },
    ).as('policyUpdate')
  })
  it('testing policy update', () => {
    // Now verify missing name error
    PolicyBase.clearPolicyName()
    // Submit the form and verify error
    PolicyBase.getSubmitButton(false).click()
    PolicyBase.verifyMissingNameError()

    PolicyBase.setBasePolicyName(MtdPolicyMock.name)
    // for policy update the button panel is not displayed without making the form dirty
    PolicyBase.verifyFormButtonPanelVisible(false)

    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    PolicyBase.verifyFormButtonPanelButtons(true, true, true, true, false)
    // verify modified dialog is invoked when we click cancel button on dirty form
    getButton('cancelButtonLabel').should(beEnabled).click()
    getDialog().should(beVisible)
    getDialogButton(PolicyBase.modifiedDialogCancelButton).click()
    getDialog().should(notExist)

    // verify modified dialog is invoked when we click go back button on dirty form
    PolicyBase.goBackButton().should(beEnabled).click()
    getDialogButton(PolicyBase.modifiedDialogCancelButton).click()
    getDialog().should(notExist)

    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    PolicyBase.verifyFormButtonPanelVisible(false)
    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    PolicyBase.verifyFormButtonPanelButtons(true, true, true, true, false)
    PolicyBase.toggleSwitch('dataPrivacyEnabled')

    PolicyBase.nonDefaultData()
    verifyUpdatePayload(PolicyBase.payloadToValidate)
  })
})
describe('MTD policy update duplicate name error', () => {
  before(() => {
    setLocalStorageState()
    PolicyBase.payloadToValidate = copyItem(MtdPolicyMock)
    PolicyBase.payloadToValidate.id = mockPolicyGuid
    PolicyBase.loadStrings()
    I.visit(`#/protectMobile/update/${mockPolicyGuid}`)
  })
  it('testing duplicate name error', () => {
    setLocalStorageState()
    I.fixture(payloads).then(connections => {
      I.intercept(
        {
          method: 'PUT',
          pathname: '/**/api/mtd/v1/policies/**',
        },
        {
          statusCode: 409,
          body: connections.DuplicateName,
        },
      )
    })
    PolicyBase.setPolicyName()
    PolicyBase.getSubmitButton(false).click()
    PolicyBase.verifyDuplicateNameError()
  })
})
describe('MTD policy save as', () => {
  beforeEach(() => {
    setLocalStorageState()
    PolicyBase.payloadToValidate = copyItem(MtdPolicyMock)
    PolicyBase.payloadToValidate.id = mockPolicyGuid
    PolicyBase.loadStrings()
    I.visit(`#/protectMobile/update/${mockPolicyGuid}`)
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
  it('testing policy save as', () => {
    // issue policy create as part of update copy test
    PolicyBase.nonDefaultData() // change to default mock update policy prior to copy

    // issue copy command
    getButton('saveAsButtonLabel').click()
    PolicyBase.verifyFormButtonPanelButtons(true, true, false, true, true)

    delete PolicyBase.payloadToValidate['modified'] // modified not part of create payload
    delete PolicyBase.payloadToValidate['id'] // id not part of create payload
    PolicyBase.setPolicyName()
    PolicyBase.verifyFormButtonPanelButtons(true, true, false, true, true)

    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate)
  })
})
describe('MTD feature testcase', () => {
  before(() => {
    PolicyBase.loadStrings()
  })
  it('testing UES.MTD.enabled false', () => {
    setLocalStorageState()
    window.localStorage.setItem('UES.MTD.enabled', 'false')
    I.visit('#/protectMobile')
    I.findByRole('table').should(notExist)
  })
  it('testing ues.nav.cronos.enabled false', () => {
    setLocalStorageState()
    window.localStorage.setItem('ues.nav.cronos.enabled', 'false')
    I.visit('#/protectMobile')
    I.findByRole('table').should(notExist)
  })
  it('testing UES.MTD.enabled/ues.nav.cronos.enabled true', () => {
    setLocalStorageState()
    I.visit('#/protectMobile')
    I.findByRole('table').should(beVisible)
  })
})
describe('MTD policy update - delete testcases', () => {
  before(() => {
    setLocalStorageState()
    PolicyBase.payloadToValidate = copyItem(MtdPolicyMock)
    PolicyBase.payloadToValidate.id = mockPolicyGuid
    PolicyBase.loadStrings().then(() => {
      I.visit(`#/protectMobile/update/${mockPolicyGuid}`)
    })
  })

  beforeEach(() => {
    setLocalStorageState()
    I.intercept(
      {
        method: 'DELETE',
        pathname: '/**/api/mtd/v1/policies/**',
      },
      {
        statusCode: 200,
      },
    ).as('policyDelete')
  })
  it('testing delete policy from update', () => {
    // verify for update the delete button is visible and enabled
    getButton('updateFormDeletePolicyTooltip').should(beEnabled)

    // click the delete button and verify the delete dialog is displayed
    getDialog().should(notExist)
    getButton('updateFormDeletePolicyTooltip').click()
    getDialog().should(beVisible)

    // click the cancel button on dialog and verify the dialog goes away
    getButton('deletePolicyConfirmationDialog.cancelButton').click()
    getDialog().should(notExist)

    // verify when form is dirty the delete button becomes disabled
    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    getButton('updateFormDeletePolicyTooltip').should(beDisabled)

    // Make form not dirty and verify the button goes back to enabled
    PolicyBase.toggleSwitch('dataPrivacyEnabled')
    getButton('updateFormDeletePolicyTooltip').should(beEnabled)

    // click the delete button and verify the delete dialog is displayed
    getDialog().should(notExist)
    getButton('updateFormDeletePolicyTooltip').click()
    getDialog().should(beVisible)

    // click the delete button on the update page
    verifyDelete(mockPolicyGuid)
  })
})
describe('MTD create FEATURE tests', () => {
  before(() => {
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionKnoxAttestationThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionReportingOnlyMode, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'false')
    PolicyBase.resetPayload()
    // with MobileThreatDetectionReportingOnlyMode=false these payload items are false by default
    PolicyBase.payloadToValidate['warningNotificationsEnabled'] = false
    PolicyBase.payloadToValidate['warningEmailNotificationsEnabled'] = false

    PolicyBase.loadStrings().then(() => {
      I.visit('#/protectMobile/create')
    })
  })
  beforeEach(() => {
    // Define the "@policyCreate" intercept used in verifyPostPayload to validate policy create payload
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnsafeMsgThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionKnoxAttestationThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionDeveloperModeThreat, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionReportingOnlyMode, 'false')
    window.localStorage.setItem(FeatureName.MobileThreatDetectionUnresponsiveAgentThreat, 'false')
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
  it('testing "UES.MTD.knoxAttestation.threat.enabled"=false', () => {
    getCheckbox('androidKnoxAttestationEnabled').should(notExist)
  })
  it('testing "UES.MTD.developerMode.threat.enabled"=false', () => {
    getCheckbox('androidDeveloperModeDetectionEnabled').should(notExist)
  })
  it('testing "UES.MTD.unresponsiveAgent.threat.enabled"=false', () => {
    getGenericLabel('androidUnresponsiveAgentEmailNotify').should(notExist)
  })
  it('testing "UES.MTD.reportingOnlyMode.enabled"=false - warningNotificationsEnabled', () => {
    Object.keys(NOTIFY_SUFFIX)
      .filter(suffix => isNaN(Number(suffix)))
      .forEach(suffix => {
        Object.keys(ANDROID_NOTIFY_ELEMENT)
          .filter(key => isNaN(Number(key)))
          .forEach(key => {
            PolicyBase.getNotiyBase(key, suffix).should(notExist)
          })
      })
    getTabButton(TAB.IOS).click()
    Object.keys(NOTIFY_SUFFIX)
      .filter(suffix => isNaN(Number(suffix)))
      .forEach(suffix => {
        Object.keys(IOS_NOTIFY_ELEMENT)
          .filter(key => isNaN(Number(key)))
          .forEach(key => {
            PolicyBase.getNotiyBase(key, suffix).should(notExist)
          })
      })
    // verify default of false for warningNotificationsEnabled
    getCheckbox('warningNotificationsEnabled').should(beEnabled).should(beUnchecked)
    // check email notification and verify the submit button becomes visible and the interval types are now enabled
    PolicyBase.setPolicyName()
    PolicyBase.verifyCreatePayload(PolicyBase.payloadToValidate).then(() => {
      PolicyBase.setSwitch('warningNotificationsEnabled', true)
      PolicyBase.payloadToValidate['warningEmailNotificationsEnabled'] = true // keep payload current
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
  })
  it('testing "UES.MTD.unsafeMsg.threat.enabled"=false', () => {
    PolicyBase.setSwitch('dataPrivacyEnabled', true)
    getCheckbox(DATA_PRIVACY_FORM_SETTINGS.dataPrivacyApplicationName).should(exist)
    getCheckbox(DATA_PRIVACY_FORM_SETTINGS.dataPrivacyMessageSenderPhoneEmail).should(notExist)
    getCheckbox(DATA_PRIVACY_FORM_SETTINGS.dataPrivacyUrl).should(notExist)
    getCheckbox('androidMessageScanningEnabled').should(beChecked)
    getAndroidScanMsgStartTimeOffset().should(notExist)
  })
})
