import { apolloQuery, asyncQuery } from '@ues-behaviour/shared-e2e'
import {
  devicesMock,
  EffectiveUsersPolicyMock,
  groupsMock,
  mockUser,
  profilesMock,
  userGroupsMock,
  usersMock,
} from '@ues-data/platform/mocks'
import { makePageableResponse } from '@ues-data/shared-types'

import { users as userMocks } from '../../support/commands'
import { UserDetails } from '../../support/pages/userDetailsPage'
import { UserGrid } from '../../support/pages/userGridPage'

describe('Read only/Denied access User Details', () => {
  const user = usersMock.elements[0]
  const deviceToDelete = devicesMock.elements[0]
  const fullUserData = mockUser({ id: user.id })
  const groupToUnassign = userGroupsMock[0]
  const assignedProfilesWithDetails = UserDetails.getAssignedProfilesFlatten(EffectiveUsersPolicyMock)
  const policyToUnassign = assignedProfilesWithDetails.find(p => p.appliedVia === 'USER')

  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    UserDetails.setReadonlyPermissions()

    I.loadI18nNamespaces('platform/common', 'access', 'bis/ues', 'gateway/common', 'general/form').then(() => {
      I.visit(`#/users/${user.id}/alerts/gateway-alerts`).then(() => {
        UserDetails.setReadonlyPermissions()
      })
    })
  })

  it('Should see only view action', () => {
    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/users/${user.id}/alerts/gateway-alerts`)
    })

    UserDetails.clickActionButton()
    UserDetails.checkAction(UserDetails.USER_ACTION.DELETE, false)
    UserDetails.checkAction(UserDetails.USER_ACTION.VIEW, true)

    UserDetails.selectAction(UserDetails.USER_ACTION.VIEW)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        const fields = ['firstName', 'lastName', 'displayName', 'emailAddress']
        fields.forEach(fieldId => {
          return UserDetails.getUserFormField(fieldId)
            .should('be.disabled')
            .and('have.value', fullUserData[fieldId])
            .and('not.have.attr', 'required')
        })
      })
    UserDetails.clickButton(UserDetails.BUTTONS.CLOSE)
  })

  it('Should not be able to remove device', () => {
    UserDetails.getUserTab(UserDetails.USER_TABS.DEVICES).click()
    UserDetails.getDeviceCard(deviceToDelete).should('exist')
    UserDetails.setReadonlyPermissions()

    UserDetails.getDeviceCard(deviceToDelete).within(() => {
      I.findByRole('button').should('not.exist')
    })
  })

  it('Should not be able to update configs', () => {
    UserDetails.getUserTab(UserDetails.USER_TABS.CONFIG).click()
    UserDetails.getTableRow(groupToUnassign.id).should('exist')
    UserDetails.setReadonlyPermissions()

    UserDetails.findButton(UserDetails.BUTTONS.OPEN_ASSIGN_GROUP_DIALOG).should('not.exist')

    UserDetails.getTableRow(groupToUnassign.id).within(() => {
      I.findByRole('button').should('not.exist')
    })

    UserDetails.getTableRow(policyToUnassign.entityId).should('exist')
    UserDetails.findButton(UserDetails.BUTTONS.OPEN_ASSIGN_POLICY_DIALOG).should('not.exist')
    UserDetails.getTableRow(policyToUnassign.entityId).within(() => {
      I.findByRole('button').should('not.exist')
    })
  })

  it('Should not be able to see alerts', () => {
    UserDetails.getUserTab(UserDetails.USER_TABS.ALERTS).click()
    UserDetails.getAlertsTab('bis/ues:gatewayAlertDetails.pageTitle').should('exist')
    UserDetails.restrictEventsAndAlerts()

    UserDetails.findNoPermissionMessage().should('exist')
  })

  it('Should not be able to see events', () => {
    UserDetails.getUserTab(UserDetails.USER_TABS.EVENTS).click()
    UserDetails.getEventsTab('platform/common:users.details.events.networkEventsTitle').should('exist')
    UserDetails.restrictEventsAndAlerts()

    UserDetails.findNoPermissionMessage().should('exist')
  })

  it('Should not be able to see user', () => {
    UserDetails.restrictUserAccess()

    UserDetails.findNotFoundMessage().should('exist')
  })
})

describe('Full access User Details', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')

    I.loadI18nNamespaces('platform/common', 'general/form', 'gateway/common', 'bis/ues', 'components').then(() => {
      I.fixture(userMocks).then(mocks => {
        I.visit('#/users/', {
          onBeforeLoad: contentWindow => {
            contentWindow.model.mockAll({
              id: 'platform.users.queryUserById',
              data: asyncQuery({
                result: mocks.userDetails.activeDirectory.data,
              }),
            })
            contentWindow.model.mockAll({
              id: 'platform.users.queryUsers',
              data: apolloQuery({
                queryName: 'queryUsers',
                result: makePageableResponse(mocks.users.data),
              }),
            })
          },
        })
      })
    })
  })

  // TODO: use alerts mock
  //const mockAlertCount = 9

  const user = usersMock.elements[2]
  const fullUserData = mockUser({ id: user.id })
  const deviceToDelete = devicesMock.elements[0]
  const groupToAssign = groupsMock.find(g => !g.isDirectoryGroup && !userGroupsMock.map(a => a.id).includes(g.id))
  const groupToUnassign = userGroupsMock[0]
  const assignedProfilesWithDetails = UserDetails.getAssignedProfilesFlatten(EffectiveUsersPolicyMock)

  const policyToAssign = profilesMock.elements.find(e => !assignedProfilesWithDetails.map(p => p.entityId).includes(e.entityId))
  const policyToUnassign = assignedProfilesWithDetails.find(p => p.appliedVia === 'USER')

  const addPolicyForAssignment = (policyName: string) => {
    UserDetails.clearSearchForPolicy()
    UserDetails.searchForPolicy(policyName)
    UserDetails.getItemInSearchList(policyName).should('exist').click()
    UserDetails.checkItemAmongSelected(policyName)
  }

  it('Should load user table', () => {
    I.fixture(userMocks).then(mocks => {
      UserGrid.getAllRows()
        .its('length', { timeout: 1000 })
        .should('be.eq', mocks.users.data.length + 1, { timeout: 1000 }) // Header is a row as well
    })
  })

  it('Should navigate to user details', () => {
    I.fixture(userMocks).then(mocks => {
      const user = mocks.userDetails.activeDirectory.data
      I.findByText(user.displayName).click()

      I.location().should(loc => {
        expect(loc.hash).to.eq(`#/users/${user.id}/alerts`)
      })
      UserDetails.getAlertsPanel().should('exist')
    })
  })

  it('Should check actions order', () => {
    const actions = ['VIEW', 'DELETE']

    UserDetails.clickActionButton()
    UserDetails.checkActionsOrder(actions)
    UserDetails.closePresentation()
  })

  it.skip('Should display selected user info', () => {
    // --NOTE: skipping due to flake
    UserDetails.getUserDetailsHeading().within(() => {
      I.findByText(user.displayName).should('exist')
      I.findByText(user.emailAddress).should('exist')
      I.findByRole('button').click()
      UserDetails.getUserSource(user.dataSource).should('exist')
    })

    UserDetails.clickActionButton()
    UserDetails.selectAction(UserDetails.USER_ACTION.VIEW)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        const fields = ['firstName', 'lastName', 'displayName', 'emailAddress']
        fields.forEach(fieldId => {
          return UserDetails.getUserFormField(fieldId)
            .should('be.disabled')
            .and('have.value', fullUserData[fieldId])
            .and('not.have.attr', 'required')
        })
      })
    UserDetails.clickButton(UserDetails.BUTTONS.CLOSE)
  })

  it.skip('Should load default Alerts tab', () => {
    // --NOTE: skipping due to flake
    UserDetails.getAlertsTab(UserDetails.USER_TABS.ALERTS)
    UserDetails.getAlertsPanel().should('exist')
  })

  it.skip('Should load Events tab', () => {
    // --NOTE: skipping due to flake
    UserDetails.getUserDetailsTab(UserDetails.USER_TABS.EVENTS).click()
    I.fixture(userMocks).then(mocks => {
      const user = mocks.userDetails.activeDirectory.data
      I.location().should(loc => {
        expect(loc.hash.startsWith(`#/users/${user.id}/events`))
      })
    })
  })

  it.skip('Should load Devices tab', () => {
    // --NOTE: skipping due to flake
    UserDetails.getUserDetailsTab(UserDetails.USER_TABS.DEVICES).click()

    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/users/${user.id}/devices`)
    })

    UserDetails.getDevicesPanelHeading().should('exist')
  })

  it.skip('Should display devices info', () => {
    // --NOTE: skipping due to flake
    devicesMock.elements
      .filter(e => e.deviceInfo?.deviceModelName)
      .forEach(d => {
        UserDetails.getDeviceCard(d).within(() => {
          if (d.deviceInfo) I.findByText(d.deviceInfo.deviceModelName).should('exist')
          UserDetails.getDeviceAgent(d.appBundleId, d.appVersion).should('exist')
        })
      })
  })

  it.skip('Should get error removing device', () => {
    // --NOTE: skipping due to flake
    UserDetails.getDeviceCard(deviceToDelete).within(() => {
      I.findByRole('button').click()
    })
    UserDetails.clickDeviceDeleteAction()

    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(UserDetails.LABELS.removeDevice()).should('exist')
        UserDetails.clickButton(UserDetails.BUTTONS.REMOVE_DEVICE)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.ERROR_DEVICE_REMOVE)
  })

  it.skip('Should load configuration tab', () => {
    // --NOTE: skipping due to flake
    UserDetails.getTab(UserDetails.USER_TABS.CONFIG).click()

    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/users/${user.id}/configuration`)
    })

    UserDetails.getGroupsPanelHeading().should('exist')
    UserDetails.getProfilesPanelHeading().should('exist')
  })

  it.skip('Should show assigned groups', () => {
    // --NOTE: skipping due to flake
    userGroupsMock.forEach(g => {
      UserDetails.getTableRow(g.id).within(() => {
        UserDetails.getGroupCell(g.name).should('be.visible')
        UserDetails.getGroupCell(UserDetails.LABELS.groupType(g.isDirectoryGroup)).should('be.visible')
      })
    })
  })

  it.skip('Should assign group', () => {
    // --NOTE: skipping due to flake
    UserDetails.clickButton(UserDetails.BUTTONS.OPEN_ASSIGN_GROUP_DIALOG)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        UserDetails.searchForGroup(groupToAssign.name)
        UserDetails.getItemInSearchList(groupToAssign.name).should('exist').click()
        UserDetails.checkItemAmongSelected(groupToAssign.name)
        UserDetails.clickButton(UserDetails.BUTTONS.ASSIGN_GROUP)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.SUCCESS_GROUP_ASSIGN)
  })

  it.skip('Should unassign group', () => {
    // --NOTE: skipping due to flake
    UserDetails.getTableRow(groupToUnassign.id).within(() => {
      I.findByRole('button').click()
    })
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(UserDetails.LABELS.unassignGroupDescription(user.displayName, groupToUnassign.name)).should('be.visible')
        UserDetails.clickButton(UserDetails.BUTTONS.UNASSIGN_GROUP)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.SUCCESS_GROUP_UNASSIGN)
  })

  it.skip('Should show assigned policies', () => {
    // --NOTE: skipping due to flake
    assignedProfilesWithDetails.forEach(p => {
      UserDetails.getTableRow(p.entityId).within(() => {
        UserDetails.getPoliciesCell(p.name).should('be.visible')
        UserDetails.getPoliciesCell(UserDetails.LABELS.policyType(p.entityType))
      })
    })
  })

  it.skip('Should assign single policy', () => {
    // --NOTE: skipping due to flake
    UserDetails.clickButton(UserDetails.BUTTONS.OPEN_ASSIGN_POLICY_DIALOG)
    UserDetails.selectPolicyType(policyToAssign.entityType)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        addPolicyForAssignment(policyToAssign.name)

        UserDetails.clickButton(UserDetails.BUTTONS.ASSIGN_POLICY)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.SUCCESS_POLICY_ASSIGN_SINGLE)
  })

  it.skip('Should unassign policy', () => {
    // --NOTE: skipping due to flake
    UserDetails.getTableRow(policyToUnassign.entityId).within(() => {
      I.findByRole('button').click()
    })
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(UserDetails.LABELS.unassignPolicyDescription(user.displayName, policyToUnassign.name)).should('be.visible')
        UserDetails.clickButton(UserDetails.BUTTONS.UNASSIGN_POLICY)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.SUCCESS_POLICY_UNASSIGN)
  })

  it.skip('Should assign multiple policies', () => {
    // --NOTE: skipping due to flake
    const definitionsMock = {
      totals: {
        pages: 1,
        elements: 1,
      },
      count: 1,
      elements: [
        {
          tenantId: 'V73324241',
          serviceId: 'com.blackberry.ecs.ecm',
          entityType: 'ENROLLMENT',
          reconciliationType: 'CUMULATIVE',
        },
      ],
    }

    const profilesMock = {
      totals: {
        pages: 1,
        elements: 2,
      },
      count: 2,
      elements: [
        {
          serviceId: 'com.blackberry.ecs.ecm',
          entityType: 'ENROLLMENT',
          entityId: 'f9ccsdf61d9-4f03-4921-9502-22743a5e580d',
          name: 'profileMock_first',
          rank: 0,
          created: '2021-02-02T12:14:02.874004',
          description: '',
        },
        {
          serviceId: 'com.blackberry.ecs.ecm',
          entityType: 'ENROLLMENT',
          entityId: 'f9ccsdf61d9-4f03-4921-9502-22743a5sdfdsfe580d',
          name: 'profileMock_second',
          rank: 0,
          created: '2021-02-02T12:14:02.874004',
          description: '',
        },
      ],
    }

    window.localStorage.setItem('UES.MockDataBypassMode.Enabled', 'true')

    I.intercept('GET', '/**/api/platform/v1/reconciliation/definitions', {
      statusCode: 200,
      body: definitionsMock,
    })

    I.intercept('GET', '/**/api/platform/v1/reconciliation/entities*', {
      statusCode: 200,
      body: profilesMock,
    })

    I.reload()

    UserDetails.clickButton(UserDetails.BUTTONS.OPEN_ASSIGN_POLICY_DIALOG)
    UserDetails.selectPolicyType(definitionsMock.elements[0].entityType)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        profilesMock.elements.forEach(({ name }) => addPolicyForAssignment(name))

        UserDetails.clickButton(UserDetails.BUTTONS.ASSIGN_POLICY)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.SUCCESS_POLICY_ASSIGN_MULTIPLE)
  })

  it('Should remove user', () => {
    UserDetails.clickActionButton()
    UserDetails.selectAction(UserDetails.USER_ACTION.DELETE)

    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(UserDetails.LABELS.userDelete(user.displayName)).should('exist')
        UserDetails.clickButton(UserDetails.BUTTONS.DELETE)
      })
    UserDetails.checkAlert(UserDetails.ALERT_MESSAGE.DELETE_SUCCESS)
    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/users/`)
    })
  })
})

describe('Update BlackBerry Online User Details', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'false')

    I.loadI18nNamespaces('platform/common', 'components', 'general/form').then(() => {
      I.visit('#/users/')
    })
  })

  const firstColumnIndex = 2
  const editableFields = ['firstName', 'lastName', 'displayName']

  it('Should display editable details form', () => {
    const userRowIndex = 2
    const user = usersMock.elements[0]
    const fullUserData = mockUser({ id: user.id })

    UserGrid.clickUserLink(userRowIndex, firstColumnIndex, user.displayName)

    UserDetails.clickActionButton()
    UserDetails.selectAction(UserDetails.USER_ACTION.EDIT)
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        UserDetails.getEditDialogTitle().should('exist').and('be.visible')

        editableFields.forEach(fieldId => {
          UserDetails.getUserFormField(fieldId)
            .should('not.be.disabled')
            .and('have.value', fullUserData[fieldId])
            .and('have.attr', 'required')
        })

        UserDetails.getUserFormField('emailAddress')
          .should('be.disabled')
          .and('have.value', fullUserData['emailAddress'])
          .and('have.attr', 'required')
      })

    UserDetails.getSaveButton().should('exist').and('be.visible')
    UserDetails.getCancelButton().should('exist').and('be.visible')
  })

  it('Should edit user details', () => {
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        editableFields.forEach(field => {
          UserDetails.getUserFormField(field).clear().type(field)
        })
      })

    UserDetails.getSaveButton().click()
    I.findByRole('dialog').should('not.exist')
  })

  it('Should block edit capability for non BBO users', () => {
    const activeDirectoryUser = usersMock.elements[2]
    const LDAPUser = usersMock.elements[4]
    const microsoftAzureUser = usersMock.elements[6]
    const users = [activeDirectoryUser, LDAPUser, microsoftAzureUser]

    UserDetails.getGoBackButton().click()

    users.forEach(user => {
      I.findByText(user.displayName).click()
      UserDetails.clickActionButton()
      UserDetails.checkAction(UserDetails.USER_ACTION.EDIT, false)
      UserDetails.closePresentation()
      UserDetails.getGoBackButton().click()
    })
  })
})

describe('Users help link', () => {
  const user = usersMock.elements[0]

  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    I.loadI18nNamespaces('components', 'general/form').then(() => {
      I.visit(`#/users/${user.id}/alerts/gateway-alerts`)
    })
  })

  it('Should have correct help link', () => {
    UserDetails.getHelpLink().should('exist').should('have.attr', 'href', UserDetails.HELP_LINKS.USERS)
  })
})

describe('TOTP Enrollment Removal', () => {
  const user = usersMock.elements[0]
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'false')
    window.localStorage.setItem('ues.eid.totp.enrollment.enabled', 'true')

    I.loadI18nNamespaces('platform/common', 'general/form').then(() => {
      I.visit(`#/users/${user.id}/alerts/gateway-alerts`)
    })
  })

  it('Should display TOTP enrollment dialog', () => {
    // select user who is enrolled in TOTP
    const user = usersMock.elements[0]

    // select option to remove TOTP enrollment
    UserDetails.clickActionButton()
    UserDetails.checkAction(UserDetails.USER_ACTION.REMOVE, true)
    UserDetails.selectAction(UserDetails.USER_ACTION.REMOVE)

    // ensure title and description is correct in dialog screen
    UserDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        UserDetails.getRemoveDialogTitle().should('exist').and('be.visible')
        I.findByText(UserDetails.LABELS.removeTOTPDescription(user.displayName)).should('exist')
      })

    // ensure that both confirm and cancel buttons are present
    UserDetails.getConfirmButton().should('exist').and('be.visible')
    UserDetails.getCancelButton().should('exist').and('be.visible')
  })

  it('Should remove TOTP enrollment', () => {
    // ensure success alert is not present yet
    UserDetails.getTOTPEnrollmentAlert().should('not.exist')

    // click on confirm button
    UserDetails.getConfirmButton().click()

    // dialog screen should disappear
    I.findByRole('dialog').should('not.exist')

    // ensure success alert for totp enrollment removal appears
    UserDetails.getTOTPEnrollmentAlert().should('exist').and('be.visible')

    // 'Remove TOTP enrollment' option should hide
    UserDetails.clickActionButton()
    UserDetails.checkAction(UserDetails.USER_ACTION.REMOVE, false)
    UserDetails.closePresentation()
  })
})

describe('TOTP Enrollment Update Permission Check', () => {
  const user = usersMock.elements[0]
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    window.localStorage.setItem('ues.permission.checks.enabled', 'true')
    window.localStorage.setItem('ues.eid.totp.enrollment.enabled', 'true')
    UserDetails.setReadonlyPermissions()

    I.loadI18nNamespaces('platform/common', 'general/form').then(() => {
      I.visit(`#/users/${user.id}/alerts/gateway-alerts`).then(() => {
        UserDetails.setReadonlyPermissions()
      })
    })
  })

  after(() => {
    window.localStorage.setItem('ues.eid.totp.enrollment.enabled', 'false')
  })

  it('totp enrollment option should be hidden', () => {
    UserDetails.clickActionButton()
    UserDetails.checkAction(UserDetails.USER_ACTION.REMOVE, false)
    UserDetails.closePresentation()
  })
})
