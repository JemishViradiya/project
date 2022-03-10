import { flatten } from 'lodash-es'

import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

const USER_ACTION = {
  REMOVE: 'users.details.actions.removeTOTPEnrollment',
  VIEW: 'users.details.actions.viewUserDetails',
  EDIT: 'users.details.actions.editUserDetails',
  DELETE: 'users.details.actions.deleteUser',
}

const USER_TABS = {
  ALERTS: 'users.details.panels.alerts',
  EVENTS: 'users.details.panels.events',
  DEVICES: 'users.details.panels.devices',
  CONFIG: 'users.details.panels.configuration',
}

const BUTTONS = {
  CLOSE: 'general/form:commonLabels.close',
  DELETE: 'general/form:commonLabels.delete',
  CANCEL: 'general/form:commonLabels.cancel',
  SAVE: 'general/form:commonLabels.save',
  CONFIRM: 'general/form:commonLabels.confirm',
  GO_BACK: 'button.goBackText',
  OPEN_ASSIGN_POLICY_DIALOG: 'users.details.configuration.policies.assignButton',
  ASSIGN_GROUP: 'general/form:commonLabels.assign',
  UNASSIGN_GROUP: 'general/form:commonLabels.unassign',
  OPEN_ASSIGN_GROUP_DIALOG: 'users.details.configuration.groups.assignButton',
  ASSIGN_POLICY: 'general/form:commonLabels.assign',
  UNASSIGN_POLICY: 'general/form:commonLabels.unassign',
  REMOVE_DEVICE: 'general/form:commonLabels.delete',
  UNSAVED_CHANGES: 'general/form:commonLabels.leavePage',
}

const ALERT_MESSAGE = {
  SUCCESS: 'form.success',
  SUCCESS_GROUP_ASSIGN: 'users.details.configuration.groups.success.assign.single',
  SUCCESS_GROUP_UNASSIGN: 'users.details.configuration.groups.success.unassign',
  SUCCESS_POLICY_ASSIGN_SINGLE: 'users.details.configuration.policies.success.assign.single',
  SUCCESS_POLICY_ASSIGN_MULTIPLE: 'users.details.configuration.policies.success.assign.multiple',
  SUCCESS_POLICY_UNASSIGN: 'users.details.configuration.policies.success.unassign',
  ERROR_DEVICE_REMOVE: 'users.details.devices.error.remove',
  DELETE_SUCCESS: 'users.message.success.delete',
  REMOVE_SUCCESS: 'users.totp.removeSuccess',
  UNSAVED_CHANGES: 'users.add.unsaved.title',
}
const LABELS = {
  groupType: isDirectory =>
    isDirectory
      ? I.translate('users.details.configuration.groups.directoryGroup')
      : I.translate('users.details.configuration.groups.localGroup'),
  policyType: type => I.translate(`groups.policyAssign.type.${type}`),
  unassignGroupDescription: (user, group) =>
    I.translate('users.details.configuration.groups.dialogs.unassign.description', {
      displayName: user,
      groupName: group,
    }),
  unassignPolicyDescription: (user, policy) =>
    I.translate('users.details.configuration.policies.dialogs.unassign.description', {
      displayName: user,
      policyName: policy,
    }),
  userDelete: user => I.translate('users.delete.description', { user }),
  removeTOTPDescription: user => I.translate('users.remove.description', { user }),
  removeDevice: () => I.translate('users.details.devices.dialogs.remove.title'),
}

const STANDARD_TIMEOUT = { timeout: 300 }

const tabPanelLabel = tabName => I.translate('components:tabPanel.ariaLabel', { name: I.translate(tabName) })

const getAlertsPanel = () =>
  // eslint-disable-next-line sonarjs/no-duplicate-string
  I.findByRole('tabpanel', { name: tabPanelLabel('users.userTabs') }).within(() =>
    I.findByRole('tablist', { name: I.translate('users.alertsTabs') }),
  )

const getAllRows = () => I.findAllByRole('row')

const getUserDetailsHeading = () => I.findByRole('heading', { name: I.translate('users.details.title') })

const getUserSource = dataSource => I.findByText(I.translate(`users.add.dataSource.${dataSource}`))

const clickActionButton = () => I.findByText(I.translate('users.details.actions.title')).click()

const selectAction = action =>
  I.findByRole('listbox').within(() => {
    I.findByText(I.translate(action)).click()
  })

const checkAction = (action, exists) => {
  I.findByRole('listbox').within(() => {
    I.findByText(I.translate(action)).should(exists ? 'exist' : 'not.exist')
  })
}

const checkActionsOrder = (orderedActionsKeys: string[]) => {
  I.findAllByRole('option').each(($element, index) => {
    I.wrap($element).should('contain', I.translate(USER_ACTION[orderedActionsKeys[index]]))
  })
}

const getUserFormField = fieldName => I.findByRole('textbox', { name: I.translate(`users.add.input.${fieldName}`) })

const getGroupsPanelHeading = () =>
  I.findByRoleWithin('tabpanel', 'heading', { name: I.translate('users.details.configuration.groups.title') })

const getProfilesPanelHeading = () =>
  I.findByRoleWithin('tabpanel', 'heading', { name: I.translate('users.details.configuration.policies.title') })

const getDevicesPanelHeading = () => I.findByRoleWithin('tabpanel', 'heading', { name: I.translate('users.details.devices.title') })

const getDeviceCard = device =>
  I.findByRole('region', {
    name: I.translate('users.details.devices.label', { deviceName: device.deviceInfo?.deviceModelName }).trim(),
  })

const getAgentDisplayName = (appBundleId: string) => {
  switch (appBundleId) {
    case 'com.blackberry.big':
    case 'com.blackberry.big1':
    case 'com.blackberry.big2':
    case 'com.blackberry.big3':
    case 'com.blackberry.protect':
      return I.translate('users.details.devices.agentBundleId.' + appBundleId.replace(/\./g, '_'))
  }
  return appBundleId
}

const getDeviceAgent = (bundleId, version) =>
  I.findByText(I.translate('users.details.devices.agent', { agent: `${getAgentDisplayName(bundleId)} ${version}` }))

const clickDeviceDeleteAction = () =>
  I.findByRoleWithin('menu', 'menuitem', { name: I.translate('users.details.devices.actions.remove') }).click()

const getGroupCell = colName => I.findByRole('cell', { name: colName })

const getPoliciesCell = colName => I.findByRole('cell', { name: colName })

const searchForGroup = search =>
  I.findByLabelText(I.translate('users.details.configuration.groups.dialogs.assign.searchText')).type(search)

const getItemInSearchList = label => I.findByRoleWithin('listbox', 'button', { name: label })

const checkItemAmongSelected = label =>
  I.findByRole('group', { name: I.translate('chosenItems') }).within(() => {
    I.findByText(label).should('be.visible')
  })

const selectPolicyType = type =>
  I.findByRoleWithin('listbox', 'button', { name: I.translate('groups.policyAssign.type.' + type) }).click()

const searchForPolicy = search =>
  I.findByLabelText(I.translate('users.details.configuration.policies.dialogs.assign.searchText')).type(search)

const clearSearchForPolicy = () =>
  I.findByLabelText(I.translate('users.details.configuration.policies.dialogs.assign.searchText')).clear()

const getAssignedProfilesFlatten = profiles => {
  const effectiveEntities = flatten(Object.values(profiles).map(e => e['effectiveEntities']))
  effectiveEntities.forEach(e => e.details.forEach(d => (d['entityType'] = e['entityType'])))

  return flatten(effectiveEntities.map(e => e.details))
}

const setReadonlyPermissions = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.ECS_USERS_UPDATE] = false
  overridePermissionsObj[Permission.ECS_USERS_DELETE] = false
  overridePermissionsObj[Permission.ECS_USERS_CREATE] = false
  overridePermissionsObj[Permission.ECS_DEVICES_DELETE] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const restrictEventsAndAlerts = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = true
  overridePermissionsObj[Permission.BIS_EVENTS_READ] = false
  overridePermissionsObj[Permission.MTD_EVENTS_READ] = false
  overridePermissionsObj[Permission.BIG_REPORTING_READ] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const restrictUserAccess = () => {
  const overridePermissionsObj = {}
  overridePermissionsObj[Permission.ECS_USERS_READ] = false
  I.overridePermissions({ ...overridePermissionsObj })
}

const getUserTab = tab =>
  I.findByRole('tablist', { name: I.translate('users.userTabs') }).findByRole('tab', { name: I.translate(tab) })
const getAlertsTab = tab =>
  I.findByRole('tablist', { name: I.translate('users.alertsTabs') }).findByRole('tab', { name: I.translate(tab) })
const getEventsTab = tab =>
  I.findByRole('tablist', { name: I.translate('users.eventsTabs') }).findByRole('tab', { name: I.translate(tab) })

const getSaveButton = () => I.findByRole('button', { name: I.translate(BUTTONS.SAVE) })
const getConfirmButton = () => I.findByRole('button', { name: I.translate(BUTTONS.CONFIRM) })
const getCancelButton = () => I.findByRole('button', { name: I.translate(BUTTONS.CANCEL) })
const getGoBackButton = () => I.findByRole('button', { name: I.translate(BUTTONS.GO_BACK) })

const getEditDialogTitle = () => I.findByText(I.translate(USER_ACTION.EDIT))
const getRemoveDialogTitle = () => I.findByText(I.translate(USER_ACTION.REMOVE))

const getTOTPEnrollmentAlert = () => I.findByText(I.translate(UserDetails.ALERT_MESSAGE.REMOVE_SUCCESS))

const closePresentation = () => I.findByRole('presentation').type('{esc}')

const getUserDetailsTab = (tabKey: string) => {
  return I.findByRole('tablist', { name: I.translate('users.userTabs') }).findByRole('tab', {
    name: I.translate(tabKey),
  })
}
export const UserDetails = {
  ALERT_MESSAGE,
  BUTTONS,
  LABELS,
  USER_ACTION,
  USER_TABS,
  checkAction,
  checkActionsOrder,
  checkItemAmongSelected,
  clearSearchForPolicy,
  clickActionButton,
  clickDeviceDeleteAction,
  closePresentation,
  getAlertsPanel,
  getAlertsTab,
  getAllRows,
  getAssignedProfilesFlatten,
  getCancelButton,
  getDeviceAgent,
  getDeviceCard,
  getDevicesPanelHeading,
  getEditDialogTitle,
  getEventsTab,
  getGoBackButton,
  getGroupCell,
  getGroupsPanelHeading,
  getItemInSearchList,
  getPoliciesCell,
  getProfilesPanelHeading,
  getSaveButton,
  getUserDetailsHeading,
  getUserDetailsTab,
  getUserFormField,
  getUserSource,
  selectPolicyType,
  searchForPolicy,
  setReadonlyPermissions,
  restrictEventsAndAlerts,
  getUserTab,
  restrictUserAccess,
  searchForGroup,
  selectAction,
  getConfirmButton,
  getRemoveDialogTitle,
  getTOTPEnrollmentAlert,
  ...BasePage,
}
