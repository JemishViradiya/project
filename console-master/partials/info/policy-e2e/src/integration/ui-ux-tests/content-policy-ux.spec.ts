import { CONDITIONS } from '../../support/constants/conditions'
import { FLAGS } from '../../support/constants/selectors'
import { ContentPoliciesTable } from '../../support/pages/policies-pages/content-policies-table.page'
import { ContentPolicy } from '../../support/pages/policies-pages/content-policy.page'
import { Helper } from '../../support/utils/helper'

const testPolicyData = {
  DEFAULT_POLICY_NAME: 'Test Policy',
  DEFAULT_POLICY_DESCRIPTION: 'Test Description Policy',
  DEFAULT_MOKS_POLICIES: 9,
}

const policy = `${FLAGS.DLP_POLICY}:policy`
const columns = `${policy}.table.columns`

describe('Content policy functional tests', () => {
  const enableOrDisableFilterColumn = (checkboxName: string, columnNumber: number) => {
    ContentPoliciesTable.getColumnFilter().click()
    ContentPoliciesTable.getCheckboxByName(I.translate(checkboxName)).click()
    ContentPoliciesTable.clickOutsideTheDialogWindow()
    return ContentPoliciesTable.getColumnsOfTableHeaders().should(CONDITIONS.HAVE_LENGTH, columnNumber)
  }
  before(() => {
    I.loadI18nNamespaces(FLAGS.DLP_POLICY, 'profiles', 'tables')
  })
  // #TODO: Must to add a check in the condition builder after adding functionality to the mocks
  describe('Cases for creating, updating, and checking display of policy', () => {
    before(() => {
      Helper.initializeBrowserFeatures()
      Helper.fillRequiredFieldsOfNewPolicyAndSave(testPolicyData.DEFAULT_POLICY_NAME, testPolicyData.DEFAULT_POLICY_DESCRIPTION)
    })

    it('Attempts to create a policy, and verify it checks by Alert messages', () => {
      ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.create`))
    })
    it('Attempts to create a policy, and verify it displayed on the table. Check by Name Policy...', () => {
      ContentPoliciesTable.getPolicyByLabel(testPolicyData.DEFAULT_POLICY_NAME).should(CONDITIONS.BE_VISIBLE)
    })

    it('Attempts to create a policy, and verify it displayed on the table. Check by Description Policy...', () => {
      ContentPoliciesTable.getPolicyByLabel(testPolicyData.DEFAULT_POLICY_DESCRIPTION).should(CONDITIONS.BE_VISIBLE)
    })
  })
  describe('Deleting of policies from a table. And check displayed them in the table.', () => {
    const deleteMessage = `${policy}.success.delete`
    let data
    it(`Delete the created policy by using table delete button, and check it for display...`, () => {
      Helper.initializeBrowserFeatures()
      data = Helper.defaultPolicy
      Helper.addContentPolicyToListView(data)
      ContentPoliciesTable.getGridcellByName(data.policyName).parent().find('[type="checkbox"]').should(CONDITIONS.EXIST).click()
      ContentPoliciesTable.getDeleteButton().click()
      ContentPoliciesTable.getDeleteButton().click()
      ContentPoliciesTable.checkAlert(I.translate(deleteMessage))
      ContentPoliciesTable.getPolicyByLabel(data.policyName).should(CONDITIONS.NOT_EXIST)
    })

    it(`Delete the created policy by name: using delete icon button on policy page , and check it for display...`, () => {
      Helper.initializeBrowserFeatures()
      data = Helper.defaultPolicy
      Helper.addContentPolicyToListView(data)
      ContentPoliciesTable.getPolicyByLabel(data.policyName).click()
      ContentPolicy.getDeletePolicyIcon().click()
      ContentPolicy.getDeleteConfirmButton().click().hash().should(CONDITIONS.EQUAL, ContentPoliciesTable.hash)
      ContentPoliciesTable.checkAlert(I.translate(deleteMessage))
      ContentPoliciesTable.getPolicyByLabel(data.policyName).should(CONDITIONS.NOT_EXIST)
    })
  })
  describe('Cases for filtering of policies in a table, enable and disable "Table columns" filter.', () => {
    before(() => {
      Helper.initializeBrowserFeatures()
      ContentPoliciesTable.visit()
    })
    const description = `${columns}.description`
    const policyType = `${columns}.policyType`
    const userCount = `${columns}.userCount`
    const groupCount = `${columns}.groupCount`
    const added = `${columns}.added`
    const modified = `${columns}.modified`
    describe('Disable all filter buttons from "Table columns" filter. And check undisplayed header columns.', () => {
      it('Disable filter button "Description" from "Table columns" filter and check undisplayed "Description" header column...', () => {
        enableOrDisableFilterColumn(description, 6).each($column => {
          expect($column.text()).to.not.equal(description)
        })
      })

      it('Disable filter button "Policy Type" from "Table columns" filter and check undisplayed "Policy Type" header column...', () => {
        enableOrDisableFilterColumn(policyType, 5).each($column => {
          expect($column.text()).to.not.equal(policyType)
        })
      })

      it('Disable filter button "Users" from "Table columns" filter and check undisplayed "Users" header column...', () => {
        enableOrDisableFilterColumn(userCount, 4).each($column => {
          expect($column.text()).to.not.equal(userCount)
        })
      })

      it('Disable filter button "Groups" from "Table columns" filter and check undisplayed "Groups" header column...', () => {
        enableOrDisableFilterColumn(groupCount, 3).each($column => {
          expect($column.text()).to.not.equal(groupCount)
        })
      })

      it('Disable filter button "Added" from "Table columns" filter and check undisplayed "Added" header column...', () => {
        enableOrDisableFilterColumn(added, 2).each($column => {
          expect($column.text()).to.not.equal(added)
        })
      })

      it('Disable filter button "Modified" from "Table columns" filter and check undisplayed "Modified" header column...', () => {
        enableOrDisableFilterColumn(modified, 1).each($column => {
          expect($column.text()).to.not.equal(modified)
        })
      })
    })
    describe('Enable all filter buttons from "Table columns" filter. And check displayed header columns.', () => {
      it('Enable filter button "Description" from "Table columns" filter and check displayed "Description" header column...', () => {
        enableOrDisableFilterColumn(description, 2)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(description)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Enable filter button "Policy Type" from "Table columns" filter and check displayed "Policy Type" header column...', () => {
        enableOrDisableFilterColumn(policyType, 3)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(policyType)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Enable filter button "Users" from "Table columns" filter and check displayed "Users" header column...', () => {
        enableOrDisableFilterColumn(userCount, 4)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(userCount)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Enable filter button "Groups" from "Table columns" filter and check displayed "Groups" header column...', () => {
        enableOrDisableFilterColumn(groupCount, 5)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(groupCount)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Enable filter button "Added" from "Table columns" filter and check displayed "Added" header column...', () => {
        enableOrDisableFilterColumn(added, 6)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(added)).should(CONDITIONS.BE_VISIBLE)
      })

      it('Enable filter button "Modified" from "Table columns" filter and check displayed "Modified" header column...', () => {
        enableOrDisableFilterColumn(modified, 7)
        ContentPoliciesTable.getColumnHeaderByName(I.translate(modified)).should(CONDITIONS.BE_VISIBLE)
      })
    })
  })
})
