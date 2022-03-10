import { groupsMock } from '@ues-data/platform/mocks'
import { Permission } from '@ues-data/shared-types'

import { GroupDetails } from '../support/pages/groupDetailsPage'
import { GroupTable } from '../support/pages/groupTablePage'

const groupCount = groupsMock.length

describe('RBAC - platform group table', () => {
  before(() => {
    GroupDetails.clearLocalStorage()
    GroupDetails.setLocalStorageMock('true')
    GroupDetails.setLocalStoragePermissionCheck('true')

    I.loadI18nNamespaces('platform/common', 'access').then(() => {
      I.visit('#/groups')
    })
  })

  it('Full access - group table', () => {
    GroupTable.setFullAccess()

    const addGroupButton = GroupTable.getAddGroupButton()
    addGroupButton.should('exist')
    addGroupButton.should('be.enabled')

    const rows = GroupTable.getRows()
    rows.should('have.length', groupCount)

    rows.each((cell, index) => {
      if (index === 0) {
        I.wrap(cell).findByRole('checkbox').should('exist')
      } else if (index === 1) {
        I.wrap(cell).findByRole('link').should('exist')
      }
    })
  })

  it('Readonly access - group table', () => {
    GroupTable.setReadOnlyAccess()
    const addGroupButton = GroupTable.getAddGroupButton()
    addGroupButton.should('not.exist')

    const rows = GroupTable.getRows()
    rows.should('have.length', groupCount)
    rows.each((cell, index) => {
      if (index === 0) {
        I.wrap(cell).findByRole('checkbox').should('not.exist')
      } else if (index === 1) {
        I.wrap(cell).findByRole('link').should('exist')
      }
    })
  })

  it('Read and create permissions', () => {
    GroupTable.setReadAndCreateAccess()

    const addGroupButton = GroupTable.getAddGroupButton()
    addGroupButton.should('exist')
    addGroupButton.should('be.enabled')

    const rows = GroupTable.getRows()
    rows.each((cell, index) => {
      if (index === 0) {
        I.wrap(cell).findByRole('checkbox').should('not.exist')
      } else if (index === 1) {
        I.wrap(cell).findByRole('link').should('exist')
      }
    })
  })
  it('Read and delete permissions', () => {
    GroupTable.setReadAndDeleteAccess()

    const addGroupButton = GroupTable.getAddGroupButton()
    addGroupButton.should('not.exist')

    const rows = GroupTable.getRows()
    rows.each((cell, index) => {
      if (index === 0) {
        I.wrap(cell).findByRole('checkbox').should('exist')
      } else if (index === 1) {
        I.wrap(cell).findByRole('link').should('exist')
      }
    })
  })

  it('No access', () => {
    GroupTable.setNoAccess()
    GroupDetails.findNotFoundMessage().should('exist').and('be.visible')
    I.findByRole('generic').contains(Permission.ECS_USERS_READ)
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
