import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

const ALERT_MESSAGE = {
  SUCCESS: 'users.message.success.create',
}

const BUTTONS = {
  GO_BACK: 'button.goBackText',
  CLEAR: 'general/form:commonLabels.clear',
  ADD_USER: 'users.actions.add',
  SEARCH: 'general/form:commonLabels.search',
  SAVE: 'general/form:commonLabels.save',
  SAVE_AND_NEW: 'button.saveAndNew',
  ADDITIONAL_USER_DETAILS: 'users.add.additionalUserDetails',
}

const TEXT = {
  PAGE_TITLE: 'users.add.title',
  SEARCHBAR_TITLE: 'users.add.search',
  NO_USERS_FOUND: 'users.message.noUsersFound',
  TOOLTIP: 'users.add.addNewUser',
  DATA_SOURCE_AZURE: 'users.add.dataSource.azure',
  USER_DETAILS: 'users.add.userDetails',
  GROUPS_HEADING: 'users.add.groups.heading',
  LIST_LABEL: 'users.add.groups.subHeading',
  RIGHT_LABEL: 'users.add.groups.selectedGroups',
  LEFT_LABEL: 'users.add.groups.available',
  SELECT_ALL_LEFT_LABEL: 'transferList.selectAllLeftLabel',
  SELECT_ALL_RIGHT_LABEL: 'transferList.selectAllRightLabel',
  TRANSFER_ITEMS_LEFT_LABEL: 'transferList.transferItemsLeftLabel',
  TRANSFER_ITEMS_RIGHT_LABEL: 'transferList.transferItemsRightLabel',
}

const USER_DETAILS_INPUTS_NAMES = {
  FIRST_NAME: 'users.add.input.firstName',
  LAST_NAME: 'users.add.input.lastName',
  DISPLAY_NAME: 'users.add.input.displayName',
  EMAIL_ADDRESS: 'users.add.input.emailAddress',
  DEPARTMENT: 'users.add.input.department',
  COMPANY: 'users.add.input.company',
  PHONE_NUMBER: 'users.add.input.companyPhoneNumber',
  HOME_PHONE_NUMBER: 'users.add.input.homePhoneNumber',
  MOBILE_NUMBER: 'users.add.input.mobilePhoneNumber',
  STREET: 'users.add.input.street',
  PO_BOX: 'users.add.input.poBox',
  CITY: 'users.add.input.city',
  STATE: 'users.add.input.state',
  POSTAL_CODE: 'users.add.input.postalCode',
  COUNTRY: 'users.add.input.country',
}

const LABELS = {
  SEARCH_INPUT: 'users.add.input.search',
}

const restrictUserCreate = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

export const UsersPage = {
  BUTTONS,
  TEXT,
  LABELS,
  USER_DETAILS_INPUTS_NAMES,
  ALERT_MESSAGE,
  restrictUserCreate,
  ...BasePage,
}
