//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import { FeatureName, Permission } from '@ues-data/shared-types'
import {
  CLIENT_DNS_TAB,
  CLIENT_DNS_URL,
  CommonFns,
  CONNECTOR_URL,
  CONNECTORS_TAB,
  DNS_SUFFIX_ADD_BUTTON_LABEL,
  DNS_SUFFIX_SWITCH_LABEL,
  NETWORK_PROTECTION_TAB,
  NETWORK_PROTECTION_URL,
  NETWORK_SERVICES_TAB,
  NETWORK_SERVICES_URL,
  PRIVATE_DNS_ADD_BUTTON_TEXT,
  PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT,
  PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT,
  PRIVATE_DNS_ADD_SERVER_TAB_TEXT,
  PRIVATE_DNS_FORWARD_ZONE_TAB_TEXT,
  PRIVATE_DNS_REVERSE_ZONE_TAB_TEXT,
  PRIVATE_NETWORK_DNS_TAB,
  PRIVATE_NETWORK_DNS_URL,
  PRIVATE_NETWORK_IP_RANGE_URL,
  PRIVATE_NETWORK_ROUTING_URL,
  PRIVATE_ROUTE_ADD_BUTTON,
  PROTECTION_SWITCH_LABEL,
  RbacFns,
  SOURCE_IP_ANCHORING_TAB,
  SOURCE_IP_ANCHORING_URL,
} from '@ues/assets-e2e'

const { getButton, getSwitchButton, loadingIconShould, validateAccess, validateNoEditOrDeleteTableIcon } = CommonFns(I)

const {
  withoutDeletePermissionAction,
  withoutUpdatePermissionAction,
  withoutCreatePermissionAction,
  withoutReadPermissionAction,
  beforeAction,
  beforeEachAction,
} = RbacFns(I)

context('Settings: RBAC', () => {
  describe('Network Services', () => {
    before(() => {
      beforeAction(NETWORK_SERVICES_URL, ['access'])
    })

    beforeEach(() => {
      loadingIconShould('not.exist')
    })

    it('should show no permission without network services read', () => {
      withoutReadPermissionAction({ [Permission.BIG_NETWORKSERVICES_READ]: false }, false, [NETWORK_SERVICES_TAB])
    })

    it('should not show add button with network services create', () => {
      withoutCreatePermissionAction(
        {
          [Permission.BIG_NETWORKSERVICES_CREATE]: false,
        },
        [],
      )
    })

    it('should not show edit or delete button without network services delete and update ', () => {
      withoutDeletePermissionAction(
        {
          [Permission.BIG_NETWORKSERVICES_DELETE]: false,
          [Permission.BIG_NETWORKSERVICES_UPDATE]: false,
        },
        true,
      )

      validateNoEditOrDeleteTableIcon()
    })
  })

  describe('Network Protection', () => {
    before(() => {
      beforeAction(NETWORK_PROTECTION_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [NETWORK_PROTECTION_TAB])
    })

    it('should not show toggle button without tenant update', () => {
      withoutUpdatePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)
      getSwitchButton(PROTECTION_SWITCH_LABEL).should('be.disabled')
    })
  })

  describe('Connectors', () => {
    before(() => {
      beforeAction(CONNECTOR_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [CONNECTORS_TAB])
    })

    it('should not show edit or delete button without tenant update', () => {
      withoutDeletePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)
      validateNoEditOrDeleteTableIcon()
    })
  })

  describe('Client DNS', () => {
    before(() => {
      beforeAction(CLIENT_DNS_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [CLIENT_DNS_TAB])
    })

    it('should not show edit or delete button without tenant update', () => {
      withoutDeletePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)

      validateNoEditOrDeleteTableIcon()
      getSwitchButton(DNS_SUFFIX_SWITCH_LABEL).should('be.disabled')
      getButton(DNS_SUFFIX_ADD_BUTTON_LABEL).should('not.exist')
    })
  })

  describe('Source IP Anchoring', () => {
    before(() => {
      beforeAction(SOURCE_IP_ANCHORING_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [SOURCE_IP_ANCHORING_TAB])
    })

    it('should show table without tenant update', () => {
      withoutUpdatePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)
    })
  })

  describe('Private Network Routing', () => {
    before(() => {
      beforeAction(PRIVATE_NETWORK_ROUTING_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [SOURCE_IP_ANCHORING_TAB])
    })

    it('should not show edit or delete button without tenant update', () => {
      withoutUpdatePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)

      validateNoEditOrDeleteTableIcon()
      getButton(I.translate(PRIVATE_ROUTE_ADD_BUTTON)).should('not.exist')
    })
  })

  describe('Private Network DNS', () => {
    before(() => {
      beforeAction(PRIVATE_NETWORK_DNS_URL, ['access'])
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      withoutReadPermissionAction({ [Permission.BIG_TENANT_READ]: false }, false, [PRIVATE_NETWORK_DNS_TAB])
    })

    it('should not show edit or delete button without tenant update', () => {
      withoutUpdatePermissionAction({ [Permission.BIG_TENANT_UPDATE]: false }, true)

      getButton(I.translate(PRIVATE_DNS_ADD_SERVER_TAB_TEXT)).click()
      validateAccess(true)
      validateNoEditOrDeleteTableIcon()
      getButton(I.translate(PRIVATE_DNS_ADD_BUTTON_TEXT)).should('not.exist')

      getButton(I.translate(PRIVATE_DNS_FORWARD_ZONE_TAB_TEXT)).click()
      validateAccess(true)
      validateNoEditOrDeleteTableIcon()
      getButton(I.translate(PRIVATE_DNS_ADD_FORWARD_ZONE_BUTTON_TEXT)).should('not.exist')

      getButton(I.translate(PRIVATE_DNS_REVERSE_ZONE_TAB_TEXT)).click()
      validateAccess(true)
      validateNoEditOrDeleteTableIcon()
      getButton(I.translate(PRIVATE_DNS_ADD_REVERSE_ZONE_BUTTON_TEXT)).should('not.exist')
    })
  })

  describe('Private Network Agent IP Range', () => {
    before(() => {
      beforeAction(PRIVATE_NETWORK_IP_RANGE_URL, ['access'], { [FeatureName.PermissionChecksEnabled]: true })
    })

    beforeEach(() => {
      beforeEachAction({})
    })

    it('should show no permission without tenant read', () => {
      // remove read access and verify access denied message exists
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.BIG_TENANT_READ] = false
      I.overridePermissions(overridePermissionsObj)

      validateAccess(false)
    })

    it('should not allow to edit without tenant update', () => {
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.BIG_TENANT_UPDATE] = false
      I.overridePermissions(overridePermissionsObj)

      validateAccess(true)
      I.findByRole('textbox', { name: I.translate('privateNetwork.ipRangeLabel') }).should('be.disabled')
    })
  })
})
