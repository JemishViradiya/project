import { FLAGS, ROLES } from '../constants/selectors'
import { BasePage } from '../pages/base.page'

const flags = {
  POLICY: `${FLAGS.DLP_POLICY}:policy`,
  BUTTONS: FLAGS.POLICY_BUTTON,
}

const getCheckboxByName = name => I.findByRole(ROLES.CHECKBOX, { name: I.translate(name) })

const getAllCheckbox = () => I.findAllByRole(ROLES.CHECKBOX)

const getSaveButton = () => I.findByRole(ROLES.BUTTON, { name: I.translate(`${flags.BUTTONS}.save`) })

export const TemplateModel = {
  getCheckboxByName,
  getAllCheckbox,
  getSaveButton,
  ...BasePage,
}
