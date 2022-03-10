import { CONDITIONS } from '../constants/conditions'
import { ARIA_LABELS, COMMON_BUTTONS, FLAGS, ROLES } from '../constants/selectors'

const STANDARD_TIMEOUT = { timeout: 500 }
const BASE_FLAGS = {
  POLICY: `${FLAGS.DLP_POLICY}:policy`,
  BUTTONS: FLAGS.POLICY_BUTTON,
  SECTIONS: FLAGS.SECTIONS,
}

const getHeadingByName = name => I.findByRole(ROLES.HEADING, { name: I.translate(name) })

const getButtonByLabel = label => I.findByRole(ROLES.BUTTON, { name: I.translate(label) })

const getTabByName = tab => I.findByRoleWithin(ROLES.TABLIST, ROLES.TAB, { name: I.translate(tab) })

const getTextFieldByName = fieldName => I.findByRole(ROLES.TEXTBOX, { name: I.translate(fieldName) })

const getCheckboxByName = name => I.findByRole(ROLES.CHECKBOX, { name: I.translate(name) })

const clickOutsideTheDialogWindow = () => I.findByRole(ROLES.PRESENTATION).click()

const checkAlert = message => I.findByRole(ROLES.ALERT, STANDARD_TIMEOUT).should(CONDITIONS.CONTAIN, message).dismissAlert()

const checkNoPermissionHeading = title => I.findByText(I.translate(title))

const checkNoPermissionDescription = description => I.findByText(I.translate(description))

export const BasePage = {
  CONDITIONS,
  BASE_FLAGS,
  ARIA_LABELS,
  COMMON_BUTTONS,
  FLAGS,
  ROLES,
  getHeadingByName,
  getButtonByLabel,
  getTabByName,
  getTextFieldByName,
  getCheckboxByName,
  clickOutsideTheDialogWindow,
  checkAlert,
  checkNoPermissionHeading,
  checkNoPermissionDescription,
}
