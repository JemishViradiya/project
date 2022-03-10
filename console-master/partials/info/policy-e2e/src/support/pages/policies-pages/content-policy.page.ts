import { ConditionsBuilder } from '../../models/conditions-builder.model'
import { DropDownModel } from '../../models/dropdown.model'
import { BasePage } from '../base.page'

const hash = '#/content/create'
const buttons = BasePage.BASE_FLAGS.BUTTONS
const dropdown = DropDownModel
const conditions = ConditionsBuilder

const visit = () => I.visit(hash)

const getPolicyNameField = () => BasePage.getTextFieldByName(BasePage.ARIA_LABELS.POLICY_NAME)

const getPolicyDescriptionField = () => BasePage.getTextFieldByName(BasePage.ARIA_LABELS.DESCRIPTION)

const getAddFromTemplateButton = () => BasePage.getButtonByLabel(`${BasePage.BASE_FLAGS.SECTIONS}.conditions.addFromTemplate`)

const getAddButton = () => BasePage.getButtonByLabel(`${buttons}.addNew`)

const getCancelButton = () => BasePage.getButtonByLabel(`${buttons}.cancel`)

const getSaveButton = () => BasePage.getButtonByLabel(`${buttons}.save`)

const getCancelResendMailButton = () => BasePage.getButtonByLabel(`${buttons}.cancelResendMail`)

const getConfirmButton = () => BasePage.getButtonByLabel(`${buttons}.confirm`)

const getDeleteConfirmButton = () => BasePage.getButtonByLabel(`${buttons}.delete`)

const getRejectConfirmationButton = () => BasePage.getButtonByLabel(`${buttons}.rejectConfirm`)

const getDeletePolicyIcon = () => I.findByTitle(I.translate(`${BasePage.BASE_FLAGS.POLICY}.updateFormDeletePolicyTooltip`))

export const ContentPolicy = {
  dropdown,
  conditions,
  visit,
  getPolicyNameField,
  getPolicyDescriptionField,
  getAddFromTemplateButton,
  getAddButton,
  getCancelButton,
  getSaveButton,
  getCancelResendMailButton,
  getConfirmButton,
  getDeleteConfirmButton,
  getRejectConfirmationButton,
  getDeletePolicyIcon,
  ...BasePage,
}
