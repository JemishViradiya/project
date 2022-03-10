import { CONDITIONS } from '../../support/constants/conditions'
import { FLAGS } from '../../support/constants/selectors'
import { HeaderPanel } from '../../support/pages/header-panel.page'
import { NavigationPanel } from '../../support/pages/navigation-panel.page'
import { ContentPoliciesTable } from '../../support/pages/policies-pages/content-policies-table.page'
import { Helper } from '../../support/utils/helper'

const dlpPolicyFlag = FLAGS.DLP_POLICY
const policy = `${dlpPolicyFlag}:policy`

describe('Content policy Table', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'tables')
  })

  describe('Verify render components on the /policies/content', () => {
    before(() => {
      Helper.initializeBrowserFeatures()
      ContentPoliciesTable.visit()
    })

    it('Checking for the side navigation to display', () => {
      NavigationPanel.getNavigation().should(CONDITIONS.BE_VISIBLE)
    })

    it('Checking display title of the header', () => {
      HeaderPanel.getHeadingByName(`${policy}.pageTitle`).should(CONDITIONS.BE_VISIBLE)
      HeaderPanel.getHeadingByName(`${dlpPolicyFlag}:navigation.title`).should(CONDITIONS.BE_VISIBLE)
    })

    it('Checking display of Content and Mobile tab.. Content tab should be active selected. Mobile tab should not be active selected.', () => {
      ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
        .should(CONDITIONS.BE_VISIBLE)
        .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
      ContentPoliciesTable.getTabByName(`${policy}.tabTitle.mobile`)
        .should(CONDITIONS.BE_VISIBLE)
        .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'false')
    })

    describe('Verify the display for buttons in the table header:', () => {
      it('Verify that left "+ ADD POLICY" button must be present', () => {
        ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).should(CONDITIONS.BE_VISIBLE)
      })

      it('Verify that left "Search" button must be present, and has expected attribute', () => {
        ContentPoliciesTable.getSearchButton().click()
        ContentPoliciesTable.getTextFieldByName('').should(CONDITIONS.HAVE_ATTRIBUTE, 'type', 'text')
      })
    })

    describe('Verify for the display content table and policies rows in the table.', () => {
      it('Table of content policies must be exist.', () => {
        ContentPoliciesTable.policiesTable().should(CONDITIONS.EXIST)
      })
    })

    describe('Verify all header rows of content policies table ( from left to right ) :', () => {
      const table = `${policy}.table`
      const column = `${table}.columns`
      const filterIcon = 'tables:filterIcon'
      it('Checkbox input for selected all of the policies must be presented.', () => {
        ContentPoliciesTable.getCheckboxForSelectAll().should(CONDITIONS.BE_VISIBLE)
      })

      describe('Verify for the display of Name row.', () => {
        it('Name row should be present (sort button is present after the row name)', () => {
          const name = `${column}.name`
          ContentPoliciesTable.getColumnHeaderByName(I.translate(name))
            .should(CONDITIONS.BE_VISIBLE)
            .find('button')
            .click({ force: true })
            .should(CONDITIONS.HAVE_ATTRIBUTE, 'title', I.translate(filterIcon))
          ContentPoliciesTable.getHeadingByName(`${table}.filter.name`).should(CONDITIONS.BE_VISIBLE)
          ContentPoliciesTable.clickOutsideTheDialogWindow()
        })
      })

      describe('Verify for the display of Description row', () => {
        it('Description row should be present (sort button is present after the row description)', () => {
          const description = `${column}.description`
          ContentPoliciesTable.getColumnHeaderByName(I.translate(description))
            .should(CONDITIONS.BE_VISIBLE)
            .find('button')
            .click({ force: true })
            .should(CONDITIONS.HAVE_ATTRIBUTE, 'title', I.translate(filterIcon))
          ContentPoliciesTable.getHeadingByName(`${table}.filter.description`).should(CONDITIONS.BE_VISIBLE)
          ContentPoliciesTable.clickOutsideTheDialogWindow()
        })
      })
      describe('Verify for the display of Policy Type row', () => {
        it('Description row should be present (sort button is present after the row policy type)', () => {
          const policyType = `${column}.policyType`
          ContentPoliciesTable.getColumnHeaderByName(I.translate(policyType))
            .should(CONDITIONS.BE_VISIBLE)
            .find('button')
            .click()
            .should(CONDITIONS.HAVE_ATTRIBUTE, 'title', I.translate(filterIcon))
          ContentPoliciesTable.getHeadingByName(`${column}.policyType`).should(CONDITIONS.BE_VISIBLE)
          ContentPoliciesTable.clickOutsideTheDialogWindow()
        })
      })
      it('Policy Type row should be present', () => {
        ContentPoliciesTable.getColumnHeaderByName(I.translate(`${column}.policyType`)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Users row should be present and must be clickable', () => {
        ContentPoliciesTable.getColumnHeaderByName(I.translate(`${column}.userCount`))
          .should(CONDITIONS.BE_VISIBLE)
          .click()
      })

      it('Groups row should be present and must be clickable', () => {
        ContentPoliciesTable.getColumnHeaderByName(I.translate(`${column}.groupCount`))
          .should(CONDITIONS.BE_VISIBLE)
          .click()
      })

      it('Added row should be present and must be clickable', () => {
        ContentPoliciesTable.getColumnHeaderByName(I.translate(`${column}.added`))
          .should(CONDITIONS.BE_VISIBLE)
          .click()
      })

      it('Modified row should be present and must be clickable', () => {
        ContentPoliciesTable.getColumnHeaderByName(I.translate(`${column}.modified`))
          .should(CONDITIONS.BE_VISIBLE)
          .click()
      })

      it('Filter row should be present', () => {
        ContentPoliciesTable.getColumnFilter().should(CONDITIONS.BE_VISIBLE)
      })
    })
  })
})
