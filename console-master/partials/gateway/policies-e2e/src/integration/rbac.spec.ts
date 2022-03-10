//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { FeatureName, Permission } from '@ues-data/shared-types'
import {
  ADD_GATEWAY_SERVICE_POLICY_URL,
  ADD_NAC_POLICY_URL,
  AriaElementLabel,
  COMMON_NAME_LABEL,
  CommonFns,
  EDIT_GATEWAY_SERVICE_POLICY_URL,
  EDIT_NAC_POLICY_URL,
  POLICIES_ADD_USER_OR_GROUPS,
  POLICIES_ANDROID_PER_APP_SWITCH_LABEL,
  POLICIES_APPLIED_USERS_GROUPS,
  POLICIES_CREATE_CONFIRMATION,
  POLICIES_DELETE_BUTTON,
  POLICIES_DELETE_TOOLTIP,
  POLICIES_GATEWAY_SERVICE_TAB,
  POLICIES_MACOS_CONTROL,
  POLICIES_MACOS_SWITCH_LABEL,
  POLICIES_NETWORK_ACCESS_CONTROL_TAB,
  POLICIES_NEW_POLICY_BUTTON_ADD,
  POLICIES_RANK,
  POLICIES_SPLIT_TUNNEL_SWITCH_LABEL,
  POLICIES_SUCCESS_CREATION,
  POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL,
  POLICIES_WINDOWS_CONTROL,
  POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL,
  POLICIES_WINDOWS_PROTECT_SWITCH_LABEL,
  RbacFns,
  TABLE_SELECT_ALL,
} from '@ues/assets-e2e'

const {
  alertMessageShouldBeEqual,
  getButton,
  getTextbox,
  getSwitchButton,
  validateAccess,
  validateNoEditOrDeleteTableIcon,
  validateResourceNotFound,
} = CommonFns(I)

const {
  withoutCreatePermissionAction,
  withoutDeletePermissionAction,
  withoutReadPermissionAction,
  withoutUpdatePermissionAction,
  beforeAction,
  beforeEachAction,
} = RbacFns(I)

describe('RBAC: policies list', () => {
  before(() => {
    beforeAction('/', ['profiles', 'tables', 'access', 'general/form'], { [FeatureName.UESBigAclEnabled]: false })
  })

  beforeEach(() => {
    beforeEachAction({})
  })

  it('should show no permissions without policy read', () => {
    withoutReadPermissionAction(
      {
        [Permission.BIG_GATEWAYAPPPROFILE_READ]: false,
        [Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ]: false,
      },
      false,
      [POLICIES_NETWORK_ACCESS_CONTROL_TAB, POLICIES_GATEWAY_SERVICE_TAB],
    )

    withoutReadPermissionAction(
      {
        [Permission.BIG_GATEWAYAPPPROFILE_READ]: true,
        [Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ]: true,
      },
      true,
      [POLICIES_NETWORK_ACCESS_CONTROL_TAB, POLICIES_GATEWAY_SERVICE_TAB],
    )
  })

  it('should not show add button without policy create', () => {
    // remove read access and verify access denied message exists
    withoutCreatePermissionAction(
      {
        [Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE]: false,
        [Permission.BIG_GATEWAYAPPPROFILE_CREATE]: false,
      },
      [
        { tab: POLICIES_NETWORK_ACCESS_CONTROL_TAB, button: POLICIES_NEW_POLICY_BUTTON_ADD },
        { tab: POLICIES_GATEWAY_SERVICE_TAB, button: POLICIES_GATEWAY_SERVICE_TAB },
      ],
    )
  })

  it('should not show rank button without policy update', () => {
    // remove read access and verify access denied message exists
    withoutUpdatePermissionAction(
      {
        [Permission.BIG_NETWORKACCESSCONTROLPROFILE_UPDATE]: false,
        [Permission.BIG_GATEWAYAPPPROFILE_UPDATE]: false,
      },
      true,
    )

    I.findByRole('tab', { name: I.translate(POLICIES_NETWORK_ACCESS_CONTROL_TAB) }).click()
    I.findByRole('toolbar', { name: '' })
      .findAllByRole('button', { name: I.translate(POLICIES_RANK) })
      .should('not.exist')

    I.findByRole('tab', { name: I.translate(POLICIES_GATEWAY_SERVICE_TAB) }).click()
    I.findByRole('toolbar', { name: '' })
      .findAllByRole('button', { name: I.translate(POLICIES_RANK) })
      .should('not.exist')
  })

  it('should not show selection without policy delete', () => {
    // remove read access and verify access denied message exists
    withoutDeletePermissionAction(
      {
        [Permission.BIG_GATEWAYAPPPROFILE_DELETE]: false,
        [Permission.BIG_NETWORKACCESSCONTROLPROFILE_DELETE]: false,
      },
      true,
    )

    I.findByRole('tab', { name: I.translate(POLICIES_NETWORK_ACCESS_CONTROL_TAB) }).click()
    I.findByRole('columnheader', { name: I.translate(TABLE_SELECT_ALL) }).should('not.exist')
    getButton(I.translate(POLICIES_DELETE_BUTTON)).should('not.exist')

    I.findByRole('tab', { name: I.translate(POLICIES_GATEWAY_SERVICE_TAB) }).click()
    I.findByRole('columnheader', { name: I.translate(TABLE_SELECT_ALL) }).should('not.exist')
    getButton(I.translate(POLICIES_DELETE_BUTTON)).should('not.exist')
  })
})

describe('RBAC: network access control - create', () => {
  before(() => {
    beforeAction(ADD_NAC_POLICY_URL, ['profiles', 'access'], { [FeatureName.UESBigAclEnabled]: false })
  })
  it('should see no resource found without create', () => {
    validateAccess(true)

    I.overridePermissions({
      [Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE]: false,
    })

    validateResourceNotFound()
  })

  it('should not see prompt to add users without user update permission', () => {
    //ERROR - MODAL SHOWS BUT IT SHOULDN'T
    I.overridePermissions({
      [Permission.BIG_NETWORKACCESSCONTROLPROFILE_CREATE]: true,
      [Permission.ECS_USERS_UPDATE]: false,
    })

    getTextbox(I.translate(COMMON_NAME_LABEL)).type('test new policy')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    I.findByText(I.translate(POLICIES_CREATE_CONFIRMATION)).should('not.exist')
    alertMessageShouldBeEqual(I.translate(POLICIES_SUCCESS_CREATION))
  })
})

describe('RBAC: network access control - update', () => {
  before(() => {
    beforeAction(EDIT_NAC_POLICY_URL, ['profiles', 'access'], { [FeatureName.UESBigAclEnabled]: false })
  })

  beforeEach(() => {
    // Reset permissions setting between tests
    beforeEachAction({})
  })

  it('should see no add, edit, delete buttons without update', () => {
    const overridePermissionsObj = {
      [Permission.BIG_GATEWAYAPPPROFILE_UPDATE]: false,
      [Permission.BIG_NETWORKACCESSCONTROLPROFILE_UPDATE]: false,
    }
    I.overridePermissions({ ...overridePermissionsObj })

    getButton(I.translate('policies.allowedNetworkConnections')).click()
    validateAccess(true)
    getButton(AriaElementLabel.StickyActionsSaveButton).should('not.exist')
    validateNoEditOrDeleteTableIcon()

    getButton(I.translate('policies.blockedNetworkConnections')).click()
    validateAccess(true)
    getButton(AriaElementLabel.StickyActionsSaveButton).should('not.exist')
    validateNoEditOrDeleteTableIcon()
  })

  it('should see no delete button without delete permission', () => {
    const overridePermissionsObj = {
      [Permission.BIG_NETWORKACCESSCONTROLPROFILE_DELETE]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })
    getButton(I.translate(POLICIES_DELETE_TOOLTIP)).should('not.exist')
  })

  it('should see no resource found without read', () => {
    validateAccess(true)

    // remove policy read and verify resource not found message exists
    const overridePermissionsObj = {
      [Permission.BIG_NETWORKACCESSCONTROLPROFILE_READ]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })
    validateResourceNotFound()
  })

  it('should see assigned users and groups tab without ECS read', () => {
    const overridePermissionsObj = { [Permission.ECS_USERS_READ]: false }

    I.overridePermissions({ ...overridePermissionsObj })

    I.findByRoleWithin('tablist', 'tab', { name: I.translate(POLICIES_APPLIED_USERS_GROUPS) })
      .should('be.visible')
      .click()
    validateAccess(true)
  })

  it('should not see add button in assigned users and groups tab without ECS update', () => {
    const overridePermissionsObj = {
      [Permission.ECS_USERS_READ]: true,
      [Permission.ECS_USERS_UPDATE]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })

    validateAccess(true)
    getButton(I.translate(POLICIES_ADD_USER_OR_GROUPS)).should('not.exist')
  })
})

describe('RBAC: Gateway service - create', () => {
  before(() => {
    beforeAction(ADD_GATEWAY_SERVICE_POLICY_URL, ['profiles', 'access'], {
      [FeatureName.UESCronosNavigation]: true,
      [FeatureName.UESBigWindowsTunnelEnabled]: true,
      [FeatureName.UESBigMacOSProtectEnabled]: true,
    })
  })

  it('should see no resource found without create', () => {
    // remove policy create and verify resource not found message exists
    const overridePermissionsObj = {
      [Permission.BIG_GATEWAYAPPPROFILE_CREATE]: false,
    }

    validateAccess(true)

    I.overridePermissions({ ...overridePermissionsObj })

    validateResourceNotFound()
  })

  it('should not see prompt to add users without user update permission', () => {
    // remove ECS_USERS_UPDATE and verify policy create does NOT get redirected to assign
    const overridePermissionsObj = {
      [Permission.BIG_GATEWAYAPPPROFILE_CREATE]: true,
      [Permission.ECS_USERS_UPDATE]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })

    validateAccess(true)

    getTextbox(I.translate(COMMON_NAME_LABEL)).type('test new policy')
    getButton(AriaElementLabel.StickyActionsSaveButton).click()
    I.findByText(I.translate(POLICIES_CREATE_CONFIRMATION)).should('not.exist')
    alertMessageShouldBeEqual(I.translate(POLICIES_SUCCESS_CREATION))
  })
})

describe('RBAC: Gateway service - update', () => {
  before(() => {
    beforeAction(EDIT_GATEWAY_SERVICE_POLICY_URL, ['profiles', 'access'], {
      [FeatureName.UESCronosNavigation]: true,
      [FeatureName.UESBigWindowsTunnelEnabled]: true,
      [FeatureName.UESBigMacOSProtectEnabled]: true,
    })
  })

  beforeEach(() => {
    // Reset permissions setting between tests
    beforeEachAction({})
  })

  it('should see no add, edit, delete buttons without update', () => {
    const overridePermissionsObj = {
      [Permission.BIG_GATEWAYAPPPROFILE_UPDATE]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })

    validateAccess(true)

    getSwitchButton(POLICIES_ANDROID_PER_APP_SWITCH_LABEL).should('be.disabled')
    getSwitchButton(POLICIES_SPLIT_TUNNEL_SWITCH_LABEL).should('be.disabled')

    getButton(I.translate(POLICIES_MACOS_CONTROL)).click()
    getSwitchButton(POLICIES_MACOS_SWITCH_LABEL).should('be.disabled')

    getButton(I.translate(POLICIES_WINDOWS_CONTROL)).click()
    getSwitchButton(POLICIES_WINDOWS_AUTH_APP_SWITCH_LABEL).should('be.disabled')
    getSwitchButton(POLICIES_WINDOWS_INCOMING_CONNECTIONS_SWITCH_LABEL).should('be.disabled')
    getSwitchButton(POLICIES_WINDOWS_PROTECT_SWITCH_LABEL).should('be.disabled')

    validateNoEditOrDeleteTableIcon()
  })

  it('should see no delete button without delete permission', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.BIG_GATEWAYAPPPROFILE_DELETE] = false
    I.overridePermissions({ ...overridePermissionsObj })
    getButton(I.translate(POLICIES_DELETE_TOOLTIP)).should('not.exist')
  })

  it('should see no resource found without read', () => {
    validateAccess(true)

    // remove policy read and verify resource not found message exists
    const overridePermissionsObj = {
      [Permission.BIG_GATEWAYAPPPROFILE_READ]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })

    validateResourceNotFound()
  })

  it('should see assigned users and groups tab without ECS read', () => {
    const overridePermissionsObj = {}
    overridePermissionsObj[Permission.ECS_USERS_READ] = false
    I.overridePermissions({ ...overridePermissionsObj })
    I.findByRoleWithin('tablist', 'tab', { name: I.translate(POLICIES_APPLIED_USERS_GROUPS) })
      .should('be.visible')
      .click()
    validateAccess(true)
  })

  it('should not see add button in assigned users and groups tab without ECS update', () => {
    const overridePermissionsObj = {
      [Permission.ECS_USERS_READ]: true,
      [Permission.ECS_USERS_UPDATE]: false,
    }

    I.overridePermissions({ ...overridePermissionsObj })

    validateAccess(true)
    getButton(I.translate(POLICIES_ADD_USER_OR_GROUPS)).should('not.exist')
  })
})
