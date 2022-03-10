/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { FeatureName, Permission } from '@ues-data/shared-types'
import {
  DATA_PRIVACY_FORM_SETTINGS,
  POLICY_HW_ATTESTATION_SECURITY_LEVEL,
  POLICY_SMS_SCANNING_OPTIONS,
  POLICY_WARNING_NOTIFICATION_INTERVAL,
  TAB,
} from '@ues-mtd/policy/mocks'

import { MtdPolicyMock } from '../support/mocks'
import {
  ANDROID_SPIN_NAMES,
  ANDROID_TOGGLE_NAMES,
  beDisabled,
  beEnabled,
  beVisible,
  exist,
  getButton,
  getCheckbox,
  getLabel,
  getSpinButton,
  getSubmitButton,
  getTabButton,
  getTextBox,
  IOS_TOGGLE_NAMES,
  mockPolicyGuid,
  NEUTRAL_SPIN_NAMES,
  NEUTRAL_TEXT_NAMES,
  NEUTRAL_TOGGLE_NAMES,
  notExist,
  setLocalStorageState,
} from '../support/settings'

const policyNameForUpdateCreate = 'updateCreateName'
const policyNameForUpdateCreate2 = 'updateCreateName2'

let noPermission: string
let noAccessMessage: string

const loadStrings = () => {
  I.loadI18nNamespaces('mtd/common', 'platform/common', 'access').then(() => {
    noPermission = I.translate('access:errors.notFound.title')
    noAccessMessage = I.translate('access:errors.notFound.description')
  })
}

const getNameField = () => {
  return getTextBox('name')
}

const getSaveAsButton = () => {
  return getButton('saveAsButtonLabel')
}

const validateEnumButtonEnabled = (enumObject, option, value, enabled) => {
  const att: string = enabled ? 'not.have.attr' : 'have.attr'
  Object.keys(enumObject)
    .filter(key => enumObject[key] === value)
    .forEach(key => {
      I.findByRole('button', {
        name: getLabel(`${option}.${key}`),
      }).should(att, 'aria-disabled', 'true')
    })
}

const validateCreateEnabled = (enabled: boolean) => {
  const enableCheck: string = enabled ? beEnabled : beDisabled
  getTabButton(TAB.ANDROID).click()
  Object.keys(NEUTRAL_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })
  Object.keys(NEUTRAL_TEXT_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getTextBox(key).should(enableCheck)
    })

  Object.keys(DATA_PRIVACY_FORM_SETTINGS)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(notExist)
    })
  Object.keys(NEUTRAL_SPIN_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getSpinButton(key).should(exist)
    })

  validateEnumButtonEnabled(
    POLICY_SMS_SCANNING_OPTIONS,
    'androidMessageScanningOption',
    MtdPolicyMock.androidMessageScanningOption,
    enabled,
  )

  validateEnumButtonEnabled(
    POLICY_HW_ATTESTATION_SECURITY_LEVEL,
    'androidHwAttestationSecurityLevel',
    MtdPolicyMock.androidHwAttestationSecurityLevel,
    enabled,
  )

  validateEnumButtonEnabled(
    POLICY_SMS_SCANNING_OPTIONS,
    'iosMessageScanningOption',
    MtdPolicyMock.iosMessageScanningOption,
    enabled,
  )

  Object.keys(ANDROID_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })

  Object.keys(ANDROID_SPIN_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getSpinButton(key).should(beVisible).should(enableCheck)
    })

  getTabButton(TAB.IOS).click()

  Object.keys(IOS_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })
  getTabButton(TAB.ANDROID).click()
}

const validateUpdateEnabled = (enabled: boolean) => {
  const enableCheck: string = enabled ? beEnabled : beDisabled
  getTabButton(TAB.ANDROID).click()
  Object.keys(NEUTRAL_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })

  Object.keys(NEUTRAL_TEXT_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getTextBox(key).should(enableCheck)
    })

  Object.keys(DATA_PRIVACY_FORM_SETTINGS)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })

  Object.keys(NEUTRAL_SPIN_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getSpinButton(key).should(enableCheck)
    })

  validateEnumButtonEnabled(
    POLICY_WARNING_NOTIFICATION_INTERVAL,
    'warningNotificationsIntervalType',
    MtdPolicyMock.warningNotificationsIntervalType,
    enabled,
  )

  validateEnumButtonEnabled(
    POLICY_SMS_SCANNING_OPTIONS,
    'androidMessageScanningOption',
    MtdPolicyMock.androidMessageScanningOption,
    enabled,
  )

  validateEnumButtonEnabled(
    POLICY_HW_ATTESTATION_SECURITY_LEVEL,
    'androidHwAttestationSecurityLevel',
    MtdPolicyMock.androidHwAttestationSecurityLevel,
    enabled,
  )

  validateEnumButtonEnabled(
    POLICY_SMS_SCANNING_OPTIONS,
    'iosMessageScanningOption',
    MtdPolicyMock.iosMessageScanningOption,
    enabled,
  )

  Object.keys(ANDROID_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })

  Object.keys(ANDROID_SPIN_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getSpinButton(key).should(beVisible).should(enableCheck)
    })

  getTabButton(TAB.IOS).click()

  Object.keys(IOS_TOGGLE_NAMES)
    .filter(key => isNaN(Number(key)))
    .forEach(key => {
      getCheckbox(key).should(enableCheck)
    })
}

const validateNoAccess = () => {
  I.findByText(noPermission).scrollIntoView().should(exist).should(beVisible)
  I.findByText(noAccessMessage).scrollIntoView().should(exist).should(beVisible)
}
describe('MTD policy create RBAC testcases', () => {
  before(() => {
    loadStrings()
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MockDataBypassMode, 'false')
    // Single visit for all create tests
    I.visit('#/protectMobile/create')
  })
  beforeEach(() => {
    // Reset permissions setting between tests
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MockDataBypassMode, 'false')
    const overridePermissionsObj = {}
    I.overridePermissions({ ...overridePermissionsObj })
  })
  it('testing Permission.MTD_POLICY_CREATE', () => {
    validateCreateEnabled(true)

    // remove policy create and verify access denied message exists
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_POLICY_CREATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    validateNoAccess()
  })
  // This testcase MUST be the last one executed in this describe
  it('testing Permission.ECS_USERS_UPDATE', () => {
    I.reload() // Needed page reload to fetch new features
    // Add some history to navigate back from (required in Chrome browser)
    window.history.pushState(
      { urlPath: `#/protectMobile/update/${mockPolicyGuid}` },
      '',
      `#/protectMobile/update/${mockPolicyGuid}`,
    )
    // remove ECS_USERS_UPDATE and verify policy create does NOT get redirected to assign
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    getNameField().clear().type(policyNameForUpdateCreate2)
    getSubmitButton(true).click()
    I.findByText(getLabel('createPolicyAssignConfirmationDialog.title')).should(notExist)
  })
})
describe('MTD policy update RBAC testcases', () => {
  before(() => {
    loadStrings()
    setLocalStorageState()
    window.localStorage.setItem(FeatureName.MockDataBypassMode, 'false')
    // Single visit for all update tests
    I.visit(`#/protectMobile/update/${mockPolicyGuid}`)
  })
  beforeEach(() => {
    // Reset permissions setting between tests
    setLocalStorageState()
    const overridePermissionsObj = {}
    I.overridePermissions({ ...overridePermissionsObj })
  })
  it('testing Permission.MTD_POLICY_UPDATE', () => {
    // Remove policy update and verify page properties are diabled
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_POLICY_UPDATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    validateUpdateEnabled(false)
  })
  it('testing Permission.MTD_POLICY_CREATE', () => {
    validateUpdateEnabled(true)

    // Make the form dirty and verify saveas button
    getNameField().clear().type(policyNameForUpdateCreate)
    getSaveAsButton().should(beVisible)
    getNameField().clear().type(MtdPolicyMock.name)
    getSaveAsButton().should(notExist)

    // Remove policy create and verify no saveas button when form dirty
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_POLICY_CREATE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    getNameField().clear().type(policyNameForUpdateCreate)
    getSaveAsButton().should(notExist)
  })
  it('testing Permission.MTD_POLICY_DELETE', () => {
    getButton('updateFormDeletePolicyTooltip').scrollIntoView().should(beVisible)
    // Remove policy delete and verify delete button is not displayed
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_POLICY_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    getButton('updateFormDeletePolicyTooltip').should(notExist)
  })
  it('testing Permission.MTD_POLICY_READ', () => {
    // Remove policy read and verify no access message is displayed
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.MTD_POLICY_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })
    // Verify "no access" message is displayed
    validateNoAccess()
  })
})
