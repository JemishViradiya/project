import { directoryInstanceMock, groupsMock } from '@ues-data/platform/mocks'

import { groupPolicyAssignments, policyDefinitions, policyEntities } from '../commands'
import { BasePage } from './basePage'
import { GroupBasePage } from './groupBasePage'

const LABELS = {
  deleteGroup: group => I.translate('groups.delete.messageSingle', { name: group }),
  assignPolicyTitle: () => I.translate('groups.policyAssign.assign'),
  replacePolicyTitle: () => I.translate('groups.policyAssign.replace'),
  policyType: type => I.translate('groups.policyAssign.type.' + type),
  unassignPolicyDescription: (type, name) =>
    I.translate('groups.policyAssign.removePolicyNote', {
      type: I.translate('groups.policyAssign.type.' + type),
      name,
    }),
  selected: value => I.translate('groups.table.selectedCount', { value }),
  required: () => I.translate(`groups.add.local.required`),
}

const ALERT_MESSAGE = {
  SUCCESS_GROUP_DELETE: 'groups.delete.successMessage',
  SUCCESS_GROUP_UPDATE: 'groups.update.successMessage',
  SUCCESS_ADD_USER: 'groups.usersTable.addUserSuccess',
  SUCCESS_USER_REMOVE: 'groups.usersTable.delete.successMessage',
}

const getGroupFormField = fieldName => I.findByLabelText(I.translate(`groups.${fieldName}`))

const switchToUsersTab = () => I.findByRole('tab', { name: I.translate('groups.tabs.users') }).click()

const switchToSettingsTab = () => I.findByRole('tab', { name: I.translate('groups.tabs.settings') }).click()

const getAddUserButton = () => I.findByRoleWithin('tabpanel', 'button', { name: I.translate('groups.usersTable.addUser') })

const getTableRow = name => I.findByRole('row', { name })

const getDeleteGroupButton = () => I.findByRoleWithin('banner', 'button', { name: I.translate(BasePage.COMMON_BUTTONS.DELETE) })

const clickDeleteGroupButton = () => BasePage.clickButton(BasePage.COMMON_BUTTONS.DELETE)

const getGeneralInformationSection = () => I.findByRole('region', { name: I.translate('groups.generalInformation') })

const getOnboardingSection = () => I.findByRole('region', { name: I.translate('groups.onboarding') })

const getPoliciesSection = () => I.findByRole('region', { name: I.translate('groups.policyAssign.policies') })

const getAddPolicyButton = () => BasePage.findButton('groups.policyAssign.addPolicy')

const clickAddPolicyIcon = () => BasePage.clickButton('groups.policyAssign.addPolicy')

const clickRemovePolicyIcon = () => BasePage.clickButton('groups.policyAssign.removePolicy')

const selectPolicyType = type => I.findByRoleWithin('list', 'button', { name: LABELS.policyType(type) }).click()

const openProfileDropdown = () => I.findByLabelText(I.translate('groups.policyAssign.policy')).click()

const selectProfileFromDropdown = name => I.findByRoleWithin('listbox', 'option', { name }).click()

const saveAssignedPolicy = () => BasePage.clickButton(BasePage.COMMON_BUTTONS.SAVE)

const getSearchField = () => I.findByRole('search')

const selectAssignableUser = name => I.findByRoleWithin('tooltip', 'button', { name }).click()

const getSelectedUser = name => I.findByRole('button', { name })

const selectCheckbox = () => I.findByRole('checkbox').click()

const getTableToolbar = () => I.findByRole('toolbar')

const getSaveButton = () => I.findByRole('button', { name: I.translate(BasePage.COMMON_BUTTONS.SAVE) })

const interceptAssignedPolicies = () => {
  const directoryGroupId = groupsMock[0].id
  const localGroupId = groupsMock[1].id

  // Intercept relevant API calls and provide updated response with an assigned policy to test RBAC related appearance
  I.fixture(groupPolicyAssignments).then(assignments => {
    I.intercept('GET', `/**/platform/v1/reconciliation/assignments/groups/${directoryGroupId}`, {
      statusCode: 200,
      body: assignments.directory,
    })
    I.intercept('GET', `/**/platform/v1/reconciliation/assignments/groups/${localGroupId}`, {
      statusCode: 200,
      body: assignments.local,
    })
  })
  I.fixture(policyEntities).then(entities => {
    I.intercept('GET', '/**/platform/v1/reconciliation/entities?max=1000&query=&sortBy=name', {
      statusCode: 200,
      body: entities,
    })
  })
  I.fixture(policyDefinitions).then(definitions => {
    I.intercept('GET', '/**/platform/v1/reconciliation/definitions?*', { statusCode: 200, body: definitions })
  })
}

const interceptDirectoryInstance = () => {
  I.intercept('GET', `/**/api/platform/v1/directory/instance/*`, {
    statusCode: 200,
    body: directoryInstanceMock[0],
  })
}

export const GroupDetails = {
  LABELS,
  ALERT_MESSAGE,
  clickAddPolicyIcon,
  clickDeleteGroupButton,
  clickRemovePolicyIcon,
  getAddPolicyButton,
  getAddUserButton,
  getDeleteGroupButton,
  getGeneralInformationSection,
  getGroupFormField,
  getOnboardingSection,
  getPoliciesSection,
  getSaveButton,
  getSearchField,
  getSelectedUser,
  getTableRow,
  getTableToolbar,
  interceptAssignedPolicies,
  interceptDirectoryInstance,
  openProfileDropdown,
  saveAssignedPolicy,
  selectAssignableUser,
  selectCheckbox,
  selectPolicyType,
  selectProfileFromDropdown,
  switchToSettingsTab,
  switchToUsersTab,
  ...GroupBasePage,
}
