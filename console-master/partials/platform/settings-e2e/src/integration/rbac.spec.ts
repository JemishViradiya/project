import { Permission } from '@ues-data/shared-types'

import { BasePage } from '../support/pages/basePage'
import { getBCNTab, getDirectoryConnectionsTab } from '../support/pages/settingsPage'

const baseUrl = '#/settings/directory-connections'
describe('Directory Connections RBAC Test Cases', () => {
  before(() => {
    BasePage.setLocalStorageState()
    BasePage.setLocalStoragePermissionCheck('true')
    I.loadI18nNamespaces('platform/common', 'console', 'access').then(() => I.visit(baseUrl))
  })

  describe('Permissions: Directory: Read, BCN: Read', () => {
    it('Both Directory and BCN tabs should be visible', () => {
      BasePage.setLocalStoragePermissionCheck('true')
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = true
      overridePermissionsObj[Permission.ECS_BCN_READ] = true
      I.overridePermissions({ ...overridePermissionsObj })
      getBCNTab().should('exist')
      getDirectoryConnectionsTab().should('exist')
    })

    it('Directory connections content should be visible', () => {
      I.findByText(I.translate('platform/common:directory.description')).should('be.visible')
    })

    it('BCN conent should be visible', () => {
      getBCNTab().click()
      I.findByText(I.translate('platform/common:bcn.table.description')).should('be.visible')
    })
  })

  describe('Permissions: Directory: None, BCN: Read', () => {
    it('Verify tabs and content', () => {
      BasePage.setLocalStoragePermissionCheck('true')
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = false
      overridePermissionsObj[Permission.ECS_BCN_READ] = true
      I.overridePermissions({ ...overridePermissionsObj })
      getBCNTab().should('exist')
      getDirectoryConnectionsTab().should('exist').click()

      BasePage.verifyPermissionDeniedCard('Directory connections content should not be visible', 'access:Ues_Ecs_Directory_Read')

      I.say('BCN conent should be visible')
      getBCNTab().click()
      I.findByText(I.translate('platform/common:bcn.table.description')).should('be.visible')
    })
  })

  describe('Permissions: Directory: Read, BCN: None', () => {
    it('Verify tabs and content', () => {
      BasePage.setLocalStoragePermissionCheck('true')
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = true
      overridePermissionsObj[Permission.ECS_BCN_READ] = false
      I.overridePermissions({ ...overridePermissionsObj })

      getBCNTab().should('exist')

      getDirectoryConnectionsTab().should('exist').click()
      I.findByText(I.translate('platform/common:directory.description')).should('be.visible')

      getBCNTab().click()
      BasePage.verifyPermissionDeniedCard('BCN content should not be visible', 'access:Ues_Ecs_Bcn_Read')
    })
  })

  describe('Permissions: Directory: None, BCN: None', () => {
    it('Verify tabs and content', () => {
      BasePage.setLocalStoragePermissionCheck('true')
      const overridePermissionsObj = {}
      overridePermissionsObj[Permission.ECS_DIRECTORY_READ] = false
      overridePermissionsObj[Permission.ECS_BCN_READ] = false
      I.overridePermissions({ ...overridePermissionsObj })

      getDirectoryConnectionsTab().should('exist').click()
      BasePage.verifyPermissionDeniedCard('Directory connections content should not be visible', 'access:Ues_Ecs_Directory_Read')

      getBCNTab().should('exist').click()
      BasePage.verifyPermissionDeniedCard('BCN content should not be visible', 'access:Ues_Ecs_Bcn_Read')
    })
  })
})
