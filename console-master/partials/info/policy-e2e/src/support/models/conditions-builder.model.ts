import { COMMON_BUTTONS, FLAGS, ROLES } from '../constants/selectors'
import { DropDownModel } from './dropdown.model'
import { TemplateModel } from './template.model'

const flags = {
  POLICY: `${FLAGS.DLP_POLICY}:policy`,
  BUTTONS: FLAGS.POLICY_BUTTON,
}

const template = TemplateModel
const dropdown = DropDownModel

const getAddFromTemplateButton = () => I.findByRole(ROLES.BUTTON, { name: COMMON_BUTTONS.ADD_TEMPLATE })

const getTemplateDialog = () => I.findByRole(ROLES.DIALOG)

const getContinueButton = () => I.findByRole(ROLES.BUTTON, { name: I.translate(`${flags.BUTTONS}.continue`) })

const getAddItemButton = () => I.findAllByRole(ROLES.BUTTON, { name: COMMON_BUTTONS.ADD_ITEM })

export const ConditionsBuilder = {
  template,
  dropdown,
  getAddFromTemplateButton,
  getTemplateDialog,
  getContinueButton,
  getAddItemButton,
}
