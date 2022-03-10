import { FeatureName } from '@ues-data/shared-types'

const STANDARD_TIMEOUT = { timeout: 600 }

const COMMON_BUTTONS = {
  CLOSE: 'general/form:commonLabels.close',
  DELETE: 'general/form:commonLabels.delete',
  SAVE: 'general/form:commonLabels.save',
  REMOVE: 'general/form:commonLabels.remove',
  CANCEL: 'general/form:commonLabels.cancel',
}

const HELP_LINKS = {
  USERS: 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/assets-users',
  GROUPS: 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/assets-user-groups',
  DIRECTORY_CONNECTIONS: 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/connect-directory',
  CONNECTIVITY_NODE: 'https://docs.blackberry.com/en/unified-endpoint-security/console/help/connectivity-node',
}

const getHelpLink = () => I.findByRole('link', { name: I.translate('components:helpLink.helpLinkText') })

const clickButton = label => I.findByRole('button', { name: I.translate(label) }).click()

const findButton = label => I.findByRole('button', { name: I.translate(label) })

const getTableRow = name => I.findByRole('row', { name })

const getTableRowByIndex = index => I.findAllByRole('row').get(`[aria-rowindex=${index}]`)

const getTab = tab => I.findByRoleWithin('tablist', 'tab', { name: I.translate(tab) })

const waitForDialog = () => I.findByRole('dialog', STANDARD_TIMEOUT)

const checkAlert = message => I.findByRole('alert').should('contain', I.translate(message)).dismissAlert()

const findNoPermissionMessage = () => I.findByText(I.translate('access:errors.noPermission.title'))

const findNoPermissionDescription = () => I.findByText(I.translate('access:errors.noPermission.description'))

const findNotFoundMessage = () => I.findByText(I.translate('access:errors.notFound.title'))

const getGoBackButton = () => I.findByLabelText(I.translate('components:button.goBackText'))

const clearLocalStorage = () => {
  window.localStorage.clear()
}

const setLocalStoragePermissionCheck = (enabled: string) => {
  window.localStorage.setItem(FeatureName.PermissionChecksEnabled, enabled)
}

const setLocalStorageMock = (enabled: string) => {
  window.localStorage.setItem('UES_DATA_MOCK', enabled)
}

const setLocalStorageCronos = (enabled: string) => {
  window.localStorage.setItem(FeatureName.UESCronosNavigation, enabled)
}

const setLocalStorageBypassMock = (enabled: string) => {
  window.localStorage.setItem(FeatureName.MockDataBypassMode, enabled)
}

const checkLocationHashWithCurrent = (hash: string) => {
  I.location().should(loc => {
    expect(loc.hash).to.eq(hash)
  })
}
const setLocalStorageState = () => {
  BasePage.setLocalStorageMock('true')
  BasePage.setLocalStorageCronos('true')
  BasePage.setLocalStoragePermissionCheck('true')
}

const verifyPermissionDeniedCard = (message, permissionKey) => {
  I.say(message)
  BasePage.findNoPermissionMessage().should('exist')
  BasePage.findNoPermissionDescription().should('exist')
  I.findByText(I.translate(permissionKey)).should('exist')
}

export const BasePage = {
  COMMON_BUTTONS,
  HELP_LINKS,
  checkAlert,
  checkLocationHashWithCurrent,
  clearLocalStorage,
  clickButton,
  findButton,
  findNoPermissionDescription,
  findNoPermissionMessage,
  findNotFoundMessage,
  getGoBackButton,
  getHelpLink,
  getTab,
  getTableRow,
  getTableRowByIndex,
  setLocalStorageBypassMock,
  setLocalStorageCronos,
  setLocalStorageMock,
  setLocalStoragePermissionCheck,
  setLocalStorageState,
  verifyPermissionDeniedCard,
  waitForDialog,
}
