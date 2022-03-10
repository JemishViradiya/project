import { TableModel } from '../../models/table.model'
import { BasePage } from '../base.page'

const visit = () => I.visit(ContentPoliciesTable.hash)

const policiesTable = () => TableModel.table(BasePage.ARIA_LABELS.INFINITE_TABLE)

const getAddPolicyButton = label => BasePage.getButtonByLabel(label)

const getSearchButton = () => BasePage.getButtonByLabel('').find('svg')

const getPolicyByLabel = label => TableModel.getCellByName(label)

const getAllCheckboxes = () => I.findAllByRole(BasePage.ROLES.CHECKBOX)

const getDeleteButton = () => BasePage.getButtonByLabel(BasePage.COMMON_BUTTONS.DELETE)

export const ContentPoliciesTable = {
  hash: '#/policies/content',
  visit,
  policiesTable,
  getAddPolicyButton,
  getSearchButton,
  getPolicyByLabel,
  getAllCheckboxes,
  getDeleteButton,
  ...BasePage,
  ...TableModel,
}
