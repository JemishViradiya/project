import { groupsMock, profilesMock } from '@ues-data/platform/mocks'
import { Permission } from '@ues-data/shared-types'

import { GroupBasePage } from '../support/pages/groupBasePage'
import { GroupDetails } from '../support/pages/groupDetailsPage'

const directoryGroup = groupsMock[0]
const localGroup = groupsMock[1]
const profileToAssign = profilesMock.elements[0]

describe('Local group details', () => {
  describe('Settings tab', () => {
    before(() => {
      GroupDetails.clearLocalStorage()
      GroupDetails.setLocalStoragePermissionCheck('true')
      GroupDetails.setLocalStorageMock('true')
      GroupDetails.setLocalStorageBypassMock('true')
      GroupDetails.interceptAssignedPolicies()

      I.loadI18nNamespaces('platform/common', 'access', 'general/form').then(() => {
        I.visit(`#/groups/local/${localGroup.id}`)
      })
    })

    it('Full access', () => {
      GroupBasePage.setFullAccess()

      GroupDetails.getDeleteGroupButton().should('exist')

      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('groupName').should('be.enabled')
        GroupDetails.getGroupFormField('description').should('be.enabled')
      })

      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('be.enabled')
        })
      })
    })

    it('Read, delete and create permissions', () => {
      GroupBasePage.setReadCreateAndDeleteAccess()

      GroupDetails.getDeleteGroupButton().should('exist')

      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('groupName').should('be.disabled')
        GroupDetails.getGroupFormField('description').should('be.disabled')
      })

      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getAddPolicyButton().should('not.exist')
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('not.exist')
        })
      })
    })

    it('Read, update and create permissions', () => {
      GroupBasePage.setReadCreateAndUpdateAccess()

      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('groupName').should('be.enabled')
        GroupDetails.getGroupFormField('description').should('be.enabled')
      })

      GroupDetails.getDeleteGroupButton().should('not.exist')

      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getAddPolicyButton().should('be.enabled')
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('be.enabled')
        })
      })
    })

    it('Read and delete permissions', () => {
      GroupBasePage.setReadAndDeleteAccess()
      GroupDetails.getAddUserButton().should('not.exist')
    })

    it('Readonly access', () => {
      GroupBasePage.setReadOnlyAccess()

      GroupDetails.getDeleteGroupButton().should('not.exist')

      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('groupName').should('be.disabled')
        GroupDetails.getGroupFormField('description').should('be.disabled')
      })

      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getAddPolicyButton().should('not.exist')
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('not.exist')
        })
      })
    })
  })

  describe('Users tab', () => {
    before(() => {
      GroupDetails.clearLocalStorage()
      GroupDetails.setLocalStoragePermissionCheck('true')
      GroupDetails.setLocalStorageMock('true')

      I.loadI18nNamespaces('platform/common', 'general/form').then(() => {
        I.visit(`#/groups/local/${localGroup.id}`)
      })
    })

    it('Full access', () => {
      GroupDetails.switchToUsersTab()
      GroupBasePage.setFullAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')
      GroupDetails.getAddUserButton().should('be.enabled')

      GroupDetails.getTableRowByIndex(1).within(() => {
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
          GroupDetails.clickButton(GroupDetails.COMMON_BUTTONS.CANCEL)
        })
      GroupDetails.getTableRowByIndex(1).within(() => {
        GroupDetails.selectCheckbox()
      })
    })

    it('Read, update and create permissions', () => {
      GroupBasePage.setReadCreateAndUpdateAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')
      GroupDetails.getAddUserButton().should('be.enabled')

      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('be.enabled')
      })
    })

    it('Read, delete and create permissions', () => {
      GroupBasePage.setReadCreateAndDeleteAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')

      GroupDetails.getAddUserButton().should('be.enabled')

      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
    })

    it('No access', () => {
      GroupBasePage.setNoAccess()
      GroupDetails.findNotFoundMessage().should('exist').and('be.visible')
      I.findByRole('generic').contains(Permission.ECS_USERS_READ)
    })
  })
})

describe('Directory group details', () => {
  describe('Settings tab', () => {
    before(() => {
      GroupDetails.clearLocalStorage()
      GroupDetails.setLocalStoragePermissionCheck('true')
      GroupDetails.setLocalStorageMock('true')
      GroupDetails.setLocalStorageBypassMock('true')
      GroupDetails.interceptAssignedPolicies()
      GroupDetails.interceptDirectoryInstance()

      I.loadI18nNamespaces('platform/common', 'access', 'general/form').then(() => {
        I.visit(`#/groups/directory/${directoryGroup.id}`)
      })
    })

    it('Full access', () => {
      GroupBasePage.setFullAccess()
      GroupDetails.getDeleteGroupButton().should('exist')

      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('directorySource').should('be.disabled')
        GroupDetails.getGroupFormField('directoryGroupName').should('be.disabled')
        GroupDetails.getGroupFormField('description').should('be.enabled')
      })
      GroupDetails.getOnboardingSection().within(() => {
        GroupDetails.getGroupFormField('nestedDirectoryGroups').should('be.enabled')
        GroupDetails.getGroupFormField('enableOnboarding').should('be.enabled')
      })

      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('be.enabled')
        })
      })
    })

    it('Readonly access', () => {
      GroupBasePage.setReadOnlyAccess()
      GroupDetails.getDeleteGroupButton().should('not.exist')
      GroupDetails.getGeneralInformationSection().within(() => {
        GroupDetails.getGroupFormField('directorySource').should('be.disabled')
        GroupDetails.getGroupFormField('directoryGroupName').should('be.disabled')
        GroupDetails.getGroupFormField('description').should('be.disabled')
      })

      GroupDetails.getOnboardingSection().within(() => {
        GroupDetails.getGroupFormField('nestedDirectoryGroups').should('be.disabled')
        GroupDetails.getGroupFormField('enableOnboarding').should('be.disabled')
      })
      GroupDetails.getPoliciesSection().within(() => {
        GroupDetails.getTableRow(profileToAssign.entityId).within(() => {
          I.findByRole('button', { name: I.translate('platform/common:groups.policyAssign.removePolicy') }).should('not.exist')
        })
      })
    })
  })

  describe('Users tab', () => {
    before(() => {
      GroupDetails.clearLocalStorage()
      GroupDetails.setLocalStoragePermissionCheck('true')
      GroupDetails.setLocalStorageMock('true')
      GroupDetails.setLocalStorageBypassMock('true')
    })

    it('Full access', () => {
      GroupDetails.switchToUsersTab()
      GroupBasePage.setFullAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')

      GroupDetails.getDeleteGroupButton().should('exist')
      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
    })

    it('Read, update and create permissions', () => {
      GroupBasePage.setReadCreateAndUpdateAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')

      GroupDetails.getDeleteGroupButton().should('not.exist')
      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
    })

    it('Read, delete and create permissions', () => {
      GroupBasePage.setReadCreateAndDeleteAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')

      GroupDetails.getDeleteGroupButton().should('exist')

      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
    })

    it('Read and delete permissions', () => {
      GroupBasePage.setReadAndDeleteAccess()

      I.findByRole('tablist').should('exist')
      I.findByRole('progressbar').should('not.exist')

      GroupDetails.getDeleteGroupButton().should('exist')
      GroupDetails.getTableRowByIndex(1).within(() => {
        I.findByRole('checkbox').should('not.exist')
      })
    })

    it('No access', () => {
      GroupBasePage.setNoAccess()
      GroupDetails.findNotFoundMessage().should('exist').and('be.visible')
      I.findByRole('generic').contains(Permission.ECS_USERS_READ)
    })
  })
})
