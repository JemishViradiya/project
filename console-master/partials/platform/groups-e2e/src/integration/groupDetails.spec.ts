import { directoryInstanceMock, groupsMock, profilesMock, usersInGroupMock, usersMock } from '@ues-data/platform/mocks'

import { GroupDetails } from '../support/pages/groupDetailsPage'

const haveCheckedState = isChecked => (isChecked ? 'be.checked' : 'not.be.checked')

describe('platform group details', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')

    I.loadI18nNamespaces('platform/common', 'access', 'general/form').then(() => {
      I.visit('#/groups')
    })
  })

  const directory = directoryInstanceMock[0]
  const directoryGroup = groupsMock.find(g => g.isDirectoryGroup)
  const localGroup = groupsMock.find(g => !g.isDirectoryGroup)
  const profileToAssign = profilesMock.elements[0]
  const userToAssign = usersMock.elements[0]
  const userToRemove = usersInGroupMock.elements[0]

  it('Should navigate to directory group and check info', () => {
    GroupDetails.navigateToGroup(directoryGroup.name)

    GroupDetails.getGeneralInformationSection().within(() => {
      GroupDetails.getGroupFormField('directorySource').should('have.value', directory.name).should('be.disabled')
      GroupDetails.getGroupFormField('directoryGroupName').should('have.value', directoryGroup.name).should('be.disabled')
      GroupDetails.getGroupFormField('description').should('have.value', directoryGroup.description)
    })
    if (directory.syncEnableOnboarding) {
      GroupDetails.getGroupFormField('enableOnboarding')
        .should('exist')
        .should(haveCheckedState(directoryGroup.isOnboardingEnabled))
    }
    GroupDetails.getGroupFormField('nestedDirectoryGroups').should(haveCheckedState(directoryGroup.isNestingEnabled))
  })

  it('Should have users assigned', () => {
    GroupDetails.switchToUsersTab()

    usersInGroupMock.elements.forEach((u, index) => {
      GroupDetails.getTableRowByIndex(index).within(() => {
        I.findByText(u.displayName).should('exist')
        I.findByText(u.emailAddress).should('exist')
      })
    })

    GroupDetails.getAddUserButton().should('not.exist')
  })

  it('Should delete group', () => {
    GroupDetails.clickDeleteGroupButton()

    GroupDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(GroupDetails.LABELS.deleteGroup(directoryGroup.name)).should('exist')
        GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.DELETE)
      })
    GroupDetails.checkAlert(GroupDetails.ALERT_MESSAGE.SUCCESS_GROUP_DELETE)
    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/groups`)
    })
  })

  it('Should navigate to local group and check info', () => {
    GroupDetails.navigateToGroup(localGroup.name)

    GroupDetails.getGeneralInformationSection().within(() => {
      GroupDetails.getGroupFormField('groupName').should('have.value', localGroup.name)
      GroupDetails.getGroupFormField('description').should('have.value', localGroup.description)
    })
  })

  it('Should assign policy to group', () => {
    GroupDetails.clickAddPolicyIcon()
    GroupDetails.selectPolicyType(profileToAssign.entityType)

    GroupDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(GroupDetails.LABELS.assignPolicyTitle()).should('exist')
        GroupDetails.openProfileDropdown()
      })
    GroupDetails.selectProfileFromDropdown(profileToAssign.name)
    GroupDetails.saveAssignedPolicy()

    GroupDetails.getPoliciesSection().within(() => {
      GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
        I.findByText(profileToAssign.name).should('exist')
        I.findByText(GroupDetails.LABELS.policyType(profileToAssign.entityType)).should('exist')
      })
    })
  })

  it('Should unassign policy from group', () => {
    GroupDetails.getPoliciesSection().within(() => {
      GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
        GroupDetails.clickRemovePolicyIcon()
      })
    })

    GroupDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(GroupDetails.LABELS.unassignPolicyDescription(profileToAssign.entityType, profileToAssign.name)).should(
          'exist',
        )
        GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.REMOVE)
      })

    GroupDetails.getPoliciesSection().within(() => {
      GroupDetails.getTableRow(profileToAssign.entityId).should('not.exist')
    })
  })

  it('Should add users to group', () => {
    GroupDetails.switchToUsersTab()

    GroupDetails.getAddUserButton().click()
    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/groups/addUsers/${localGroup.id}`)
    })

    GroupDetails.getSearchField().get('input').type(userToAssign.displayName)
    GroupDetails.selectAssignableUser(userToAssign.displayName)
    GroupDetails.getSearchField().within(() => {
      GroupDetails.getSelectedUser(userToAssign.displayName).should('be.visible')
    })
    GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.SAVE)

    GroupDetails.checkAlert(GroupDetails.ALERT_MESSAGE.SUCCESS_ADD_USER)

    I.location().should(loc => {
      expect(loc.hash).to.eq(`#/groups/local/${localGroup.id}?tabId=1`)
    })
  })

  it('Should remove user from group', () => {
    GroupDetails.getTableRowByIndex(0).within(() => {
      GroupDetails.selectCheckbox()
    })

    GroupDetails.getTableToolbar()
      .should('contain', GroupDetails.LABELS.selected(1))
      .within(() => {
        GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.REMOVE)
      })

    GroupDetails.waitForDialog()
      .should('be.visible')
      .within(() => {
        I.findByText(userToRemove.displayName).should('exist')
        GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.REMOVE)
      })

    GroupDetails.checkAlert(GroupDetails.ALERT_MESSAGE.SUCCESS_USER_REMOVE)
  })

  it('Should validate group name', () => {
    GroupDetails.switchToSettingsTab()

    GroupDetails.getGeneralInformationSection().within(() => {
      GroupDetails.getGroupFormField('groupName').clear()
    })

    GroupDetails.getSaveButton().should('be.visible').click()

    GroupDetails.getGeneralInformationSection().within(() => {
      GroupDetails.getGroupFormField('groupName').parent().parent().should('contain', GroupDetails.LABELS.required())
      GroupDetails.getGroupFormField('groupName').type('New name')
    })

    GroupDetails.getSaveButton().should('be.visible').click()
    GroupDetails.checkAlert(GroupDetails.ALERT_MESSAGE.SUCCESS_GROUP_UPDATE)
  })
})

describe('User groups help link', () => {
  before(() => {
    GroupDetails.setLocalStorageMock('true')
    GroupDetails.setLocalStorageCronos('true')
    I.loadI18nNamespaces('components').then(() => {
      I.visit(`#/groups`)
    })
  })

  it('Should have correct help link', () => {
    GroupDetails.getHelpLink().should('exist').should('have.attr', 'href', GroupDetails.HELP_LINKS.GROUPS)
  })
})
