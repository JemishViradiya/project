import { ROLES } from '../constants/selectors'

const getFieldByName = name => I.findByRole(ROLES.BUTTON, { name: name })

const getOptionsByName = name => I.findByRoleWithin(ROLES.LISTBOX, 'option', { name: name })

const selectValueFromDropdown = (menuName, option) => {
  getFieldByName(menuName).click()
  getOptionsByName(option).click()
}

export const DropDownModel = {
  getFieldByName,
  getOptionsByName,
  selectValueFromDropdown,
}
