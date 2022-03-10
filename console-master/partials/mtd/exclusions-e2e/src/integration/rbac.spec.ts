import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName, Permission } from '@ues-data/shared-types'

import { beEnabled, getCheckboxInTable, notExist, ROLE_BUTTON, ROLE_DIALOG } from '../support/constants'
import { entityTypeSetupData, entityTypesList, getShortenPermissionsNames, permissionsSet } from '../support/constants-rbac'

// load mock data from fixtures
const TD = require('../fixtures/rbac.json')

const setLocalStorageState = win => {
  win.localStorage.setItem('UES_DATA_MOCK', 'true')
  win.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
  win.localStorage.setItem(FeatureName.UESCronosNavigation, 'true')
  win.localStorage.setItem(FeatureName.PermissionChecksEnabled, 'true')
  win.localStorage.setItem(FeatureName.MobileThreatDetection, 'true')
}

const loadPage = (setupData, entityType) => {
  I.interceptEntityListGet(setupData.api_url, setupData.query, setupData.sortBy, TD.responses.GET[entityType].success2Items).as(
    'initialSearch',
  )
  I.visit(setupData.ui_url)
  I.wait('@initialSearch')
}

//  test cases set from https://testrail.rim.net/index.php?/suites/view/25792&group_by=cases:section_id&group_id=7433271&group_order=asc
describe('RBAC permissions test suite for exclusion pages', () => {
  entityTypesList.forEach(entityType => {
    const setupData = entityTypeSetupData[entityType]

    context(`${setupData.itTitle.grantDelete} for ${entityType}`, () => {
      let deleteBtnTitle

      before(() => {
        I.loadI18nNamespaces('mtd/common').then(() => {
          deleteBtnTitle = I.translate('mtd/common:common.delete')
        })
      })

      beforeEach(() => {
        //set the local storage state
        window.localStorage.clear()
        setLocalStorageState(window)
      })

      // check all permissions combinations for grantDelete cases
      permissionsSet.grantDelete.forEach(permissions => {
        it(`Check permissions set ${getShortenPermissionsNames(permissions)}`, () => {
          //window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
          Cypress.log({ message: `Setting next permissions to local storage: ${getShortenPermissionsNames(permissions)}` })
          I.overridePermissions({ ...permissions })

          loadPage(setupData, entityType)

          //select first item in table
          getCheckboxInTable(0).check({ force: true })
          //find delete button on page
          Cypress.log({ message: `Checking delete button is enabled on the ${entityType} page` })
          I.findByRole(ROLE_BUTTON, { name: deleteBtnTitle }).should(beEnabled).click()
          //find delete button on delete confirmation dialog
          Cypress.log({ message: `Checking delete button is enabled inside delete confirmation dialog` })
          I.findByRole(ROLE_DIALOG).findByRole(ROLE_BUTTON, { name: deleteBtnTitle }).should(beEnabled)
        })
      })
    })

    context(`${setupData.itTitle.deleteForbidden} for ${entityType}`, () => {
      let deleteBtnTitle

      before(() => {
        I.loadI18nNamespaces('mtd/common').then(() => {
          deleteBtnTitle = I.translate('mtd/common:common.delete')
        })
      })

      beforeEach(() => {
        //set the local storage state
        window.localStorage.clear()
        setLocalStorageState(window)
      })

      // check all permissions combinations for delete forbidden cases
      permissionsSet.deleteForbidden.forEach(permissions => {
        it(`Check permissions set ${getShortenPermissionsNames(permissions)}`, () => {
          Cypress.log({ message: `Setting next permissions to local storage: ${getShortenPermissionsNames(permissions)}` })
          I.overridePermissions({ ...permissions })

          loadPage(setupData, entityType)

          //select first item in table
          getCheckboxInTable(0).check({ force: true })
          //find delete button on page
          Cypress.log({ message: `Checking delete button isn't present on the ${entityType} page` })
          I.findByRole(ROLE_BUTTON, { name: deleteBtnTitle }).should(notExist)
        })
      })
    })
  })
})
