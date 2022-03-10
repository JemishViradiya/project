import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

const STANDARD_TIMEOUT = { timeout: 300 }

const BUTTONS = {
  ADD_USER: 'users.actions.add',
  RESEND_INVITATION: () => I.translate('users.actions.resendInvitation'),
  DELETE_USERS: 'users.actions.delete',
  DELETE: 'general/form:commonLabels.delete',
}

const getBBSourceTranslation = () => I.translate('users.add.dataSource.cur')

const getAzureSourceTranslation = () => I.translate('users.add.dataSource.azure')

const getLDAPSourceTranslation = () => I.translate('users.add.dataSource.ldap')

const getADSourceTranslation = () => I.translate('users.add.dataSource.active_directory')

const SOURCE_VALUES = {
  BB: getBBSourceTranslation,
  AZURE: getAzureSourceTranslation,
  LDAP: getLDAPSourceTranslation,
  ACTIVE_DIRECTORY: getADSourceTranslation,
}

const TEXT = {
  INVITATION_SEND_SUCCESS: () => I.translate('users.message.success.resendInvitation'),
  DELETE_SUCCESS: 'users.message.success.delete',
  SECTION_TITLE_GATEWAY: 'navigation.gateway',
  SECTION_TITLE_ASSETS: 'navigation.assets',
  SECONDARY_SECTION_TITLE: 'users.grid.allUsers',
  NO_DATA: () => I.translate('noData'),
  SOURCE_BB: getBBSourceTranslation,
  SOURCE_AZURE: getAzureSourceTranslation,
  SOURCE_LDAP: getLDAPSourceTranslation,
  SOURCE_AD: getADSourceTranslation,
  CLEAR: '',
  FILTER_BTN_TITLE: '',
}

const COLUMN_PICKER_BTN_INDEX = 5

const TABLE_CONTENT_COLUMNS = ['displayName', 'emailAddress', 'dataSource']

const loadStrings = () => {
  I.loadI18nNamespaces('tables', 'general/form').then(() => {
    TEXT.FILTER_BTN_TITLE = I.translate('filterIcon')
    TEXT.CLEAR = I.translate('clear')
  })
}

const getGrid = () => I.findByRole('grid')

const getPresentation = () => I.findByRole('presentation')

const getAllRows = () => I.findAllByRole('row')

const waitForDialog = () => I.findByRole('dialog', STANDARD_TIMEOUT)

const getAddButton = () => I.findByText(I.translate(BUTTONS.ADD_USER))

const getResendInvitationButton = () => I.findByText(BUTTONS.RESEND_INVITATION())

const getDeleteUsersButton = () => I.findByText(I.translate(BUTTONS.DELETE_USERS))

const getColumnPickerBtn = () => I.findByXGridHeader(COLUMN_PICKER_BTN_INDEX)

const getSelectAllUsersCheckbox = () => I.findByXGridHeader(1).findByRole('checkbox')

const getHeaderCell = (columnIndex: number) =>
  I.findByXGridHeader(columnIndex).findByRole('button', { name: TEXT.FILTER_BTN_TITLE })

const getMenuItem = name => I.findByRoleWithin('presentation', 'menuitem', { name })

const getElementByText = text => I.findByText(I.translate(text))

const getButtonByText = text => I.findAllByRole('button').should('contain.text', text)

const getElementFromContainerByText = (popup, text) => I.wrap(popup).findAllByText(I.translate(text))

const getRandomCheckbox = randomRowCount => I.findAllByRole('cell').get(`[aria-rowindex=${randomRowCount}]`).findByRole('checkbox')

const clickUserLink = (rowIndex, colIndex, text) => {
  I.findByInfiniteTableCell(rowIndex, colIndex).within(() => {
    I.findByText(text).click()
  })
}

const setReadonlyUserPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const setNoUserPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

export const UserGrid = {
  getGrid,
  getAllRows,
  getAddButton,
  getButtonByText,
  getSelectAllUsersCheckbox,
  getResendInvitationButton,
  getDeleteUsersButton,
  getRandomCheckbox,
  getColumnPickerBtn,
  getPresentation,
  getHeaderCell,
  getElementByText,
  getMenuItem,
  clickUserLink,
  waitForDialog,
  getElementFromContainerByText,
  loadStrings,
  setReadonlyUserPermissions,
  setNoUserPermissions,
  SOURCE_VALUES,
  BUTTONS,
  TEXT,
  TABLE_CONTENT_COLUMNS,
  ...BasePage,
}
