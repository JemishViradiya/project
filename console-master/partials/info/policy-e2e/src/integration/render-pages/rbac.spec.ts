import { v4 as uuidv4 } from 'uuid'

import type { Policy } from '@ues-data/dlp/mocks'
import { CLASSIFICATION, POLICY_TYPE, policyTest } from '@ues-data/dlp/mocks'
import { Permission } from '@ues-data/shared-types'

import { CONDITIONS } from '../../support/constants/conditions'
import { FLAGS } from '../../support/constants/selectors'
import { ContentPoliciesTable } from '../../support/pages/policies-pages/content-policies-table.page'
import { ContentPolicy } from '../../support/pages/policies-pages/content-policy.page'
import { Helper } from '../../support/utils/helper'

const dlpPolicyFlag = FLAGS.DLP_POLICY
const policy = `${dlpPolicyFlag}:policy`
const errorTitle = `access:errors.noPermission.title`
const errorDescription = `access:errors.noPermission.description`
const conditions = `${policy}.sections.conditions`
const selectDataEntity = `${conditions}.builder.select.placeholderText`
const permissionValues = {
  LISTABLE: true,
  NON_LISTABLE: false,
  READABLE: true,
  NON_READABLE: false,
  CREATABLE: true,
  NON_CREATABLE: false,
  UPDATABLE: true,
  NON_UPDATABLE: false,
  DELATABLE: true,
  NON_DELATABLE: false,
}

const setLocalStoragePermissionState = () => {
  Helper.initializeBrowserFeatures()
  Helper.setLocalStoragePermissionCheck('true')
}

const overridePermissionsObj = {}
const initializePermissions = (list, read, create, update, deleted) => {
  overridePermissionsObj[Permission.BIP_POLICY_LIST] = list
  overridePermissionsObj[Permission.BIP_POLICY_READ] = read
  overridePermissionsObj[Permission.BIP_POLICY_CREATE] = create
  overridePermissionsObj[Permission.BIP_POLICY_UPDATE] = update
  overridePermissionsObj[Permission.BIP_POLICY_DELETE] = deleted
}

const createPolicyUseAddButton = (policyData: Policy) => {
  ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).click()
  ContentPolicy.getPolicyNameField().type(policyData.policyName, { force: true })
  ContentPolicy.getPolicyDescriptionField().type(policyData.description, { force: true })
  ContentPolicy.conditions.getAddFromTemplateButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
  ContentPolicy.conditions.template.getAllCheckbox().click({ multiple: true })
  ContentPolicy.conditions.template.getSaveButton().click()
  ContentPolicy.getAddButton().click()
  ContentPolicy.getRejectConfirmationButton().click().log('Rejecting assign policy')
  ContentPoliciesTable.getButtonByLabel('close').click()
  ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.create`))
}

let policyData
let updatedPolicyData

describe('Policy table protection page use - Ues:Bip:Policy:Read = true', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    policyData = Helper.defaultPolicy
    Helper.addContentPolicyToListView(policyData)
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
  })
  it('The button "Add Button" in DOM must not exist.', () => {
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).should(CONDITIONS.NOT_EXIST)
  })
  it('The "Select All" checkbox in DOM must not exist.', () => {
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getCheckboxForSelectAll().should(CONDITIONS.NOT_EXIST)
  })
  it('The policies checkboxes must not exist in DOM.', () => {
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getCheckboxByIndex(1).should(CONDITIONS.NOT_EXIST)
  })
  it('The button "Delete" on policy page must not exist', () => {
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).children().click({ force: true })
    ContentPolicy.getDeletePolicyIcon().should(CONDITIONS.NOT_EXIST)
  })
  it('All fields on policy page must not exist.', () => {
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).children().click({ force: true })
    ContentPolicy.getPolicyNameField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
    ContentPolicy.getPolicyDescriptionField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
  })
})
describe('Policy table protection page use - Ues:Bip:Policy:Read = false', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'conditions', 'profiles', 'tables', 'bis/ues', 'access')
  })
  it('Policies list content must not exist in DOM and must not be visible.', () => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.NON_READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.checkNoPermissionHeading(`access:errors.noPermission.title`)
    ContentPoliciesTable.checkNoPermissionDescription(`access:errors.noPermission.description`)
  })
})
describe('Policy table protection page use - Ues:Bip:Policy:Create = true', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'conditions', 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
  })
  // #TODO: Need to clarify why in this test all policy fields are disabled.
  it.skip('It must be possible to create a policy.', () => {
    policyData = Helper.defaultPolicy
    ContentPoliciesTable.visit()
    I.location().wait(Helper.WAIT_TIMEOUT.threeSeconds).log('Waiting render the page.')
    ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPolicy.getPolicyNameField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .type(policyData.policyName, { force: true })
    ContentPolicy.getPolicyDescriptionField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .type(policyData.description, { force: true })
    ContentPolicy.conditions.getAddFromTemplateButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPolicy.conditions.template.getAllCheckbox().click({ multiple: true })
    ContentPolicy.conditions.template.getSaveButton().click()
    ContentPolicy.conditions.getAddItemButton().click()
    ContentPolicy.conditions.dropdown.getFieldByName(I.translate(selectDataEntity)).click({ force: true })
    ContentPolicy.getAddButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPolicy.getRejectConfirmationButton()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .click()
      .log('Rejecting assign policy')
    ContentPoliciesTable.getButtonByLabel('close').should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.create`))
  })
  it('It must not possible to update the created policy.', () => {
    policyData = Helper.defaultPolicy
    Helper.addContentPolicyToListView(policyData)
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).children().click({ force: true })
    ContentPolicy.getPolicyNameField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
    ContentPolicy.getPolicyDescriptionField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
  })
  it('The "Select All" checkbox in DOM must not exist.', () => {
    ContentPoliciesTable.visit()
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getCheckboxForSelectAll().should(CONDITIONS.NOT_EXIST)
  })
  it('The button "Delete" on policy page must not exist', () => {
    policyData = Helper.defaultPolicy
    Helper.addContentPolicyToListView(policyData)
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).children().click({ force: true })
    ContentPolicy.getDeletePolicyIcon().should(CONDITIONS.NOT_EXIST)
  })
  it('Change flag "Ues:Bip:Policy:Read" to false and all content on the policies list must not exist in DOM and must not be visible.', () => {
    ContentPoliciesTable.visit()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.NON_READABLE,
      permissionValues.CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.checkNoPermissionHeading(errorTitle)
    ContentPoliciesTable.checkNoPermissionDescription(errorDescription)
  })
})

describe('Policy table protection page use - Ues:Bip:Policy:Udpade = true. Verify the possibility of updating the policy when the flag "Ues:Bip:Policy:Create" is true.', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.CREATABLE,
      permissionValues.UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
    policyData = Helper.defaultPolicy
    updatedPolicyData = policyTest(
      POLICY_TYPE.CONTENT,
      CLASSIFICATION.ORGANIZATIONAL,
      uuidv4(),
      'Updated Test Policy',
      'Updated Test Description',
    )
  })
  it('Trying the possibility of updating the policy after creation.', () => {
    I.location().wait(Helper.WAIT_TIMEOUT.threeSeconds).log('Waiting render the page.')
    createPolicyUseAddButton(policyData)
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).children().click({ force: true })
    ContentPolicy.getPolicyNameField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.policyName)
    ContentPolicy.getPolicyDescriptionField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.description)
    ContentPolicy.getSaveButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click().log('Saving updated policy')
    ContentPolicy.getCancelResendMailButton()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .click()
      .log('Canceling resend email to users.')
    ContentPoliciesTable.getButtonByLabel('close').should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPoliciesTable.checkAlert(I.translate(`bis/ues:detectionPolicies.snackbars.successfulUpdate`))
    ContentPoliciesTable.getPolicyByLabel(updatedPolicyData.policyName).children().contains(updatedPolicyData.policyName)
  })
  it('Trying the possibility of updating any policy from table.', () => {
    ContentPoliciesTable.getTableRowByIndex(1).find('a').first().click()
    ContentPolicy.getPolicyNameField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.policyName)
    ContentPolicy.getPolicyDescriptionField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.description)
    ContentPolicy.getSaveButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click().log('Saving updated policy')
    ContentPolicy.getCancelResendMailButton()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .click()
      .log('Canceling resend email to users.')
    ContentPoliciesTable.getButtonByLabel('close').should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPoliciesTable.checkAlert(I.translate(`bis/ues:detectionPolicies.snackbars.successfulUpdate`))
    ContentPoliciesTable.getPolicyByLabel(updatedPolicyData.policyName).children().contains(updatedPolicyData.policyName)
  })
})
describe('Verify the possibility of updating the policy when the flag "Ues:Bip:Policy:Create" is false.', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    updatedPolicyData = policyTest(
      POLICY_TYPE.CONTENT,
      CLASSIFICATION.ORGANIZATIONAL,
      uuidv4(),
      'Updated Test Policy',
      'Updated Test Description',
    )
    ContentPoliciesTable.visit()
    I.location().wait(Helper.WAIT_TIMEOUT.threeSeconds).log('Waiting render the page.')
  })
  it('The button "Add Button" in DOM must not exist.', () => {
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).should(CONDITIONS.NOT_EXIST)
  })
  it('Trying the possibility of updating any policy from table.', () => {
    ContentPoliciesTable.getTableRowByIndex(1).find('a').first().click()
    ContentPolicy.getPolicyNameField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.policyName)
    ContentPolicy.getPolicyDescriptionField()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .clear()
      .type(updatedPolicyData.description)
    ContentPolicy.getSaveButton().should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click().log('Saving updated policy')
    ContentPolicy.getCancelResendMailButton()
      .should(CONDITIONS.EXIST)
      .should(CONDITIONS.BE_VISIBLE)
      .click()
      .log('Canceling resend email to users.')
    ContentPoliciesTable.getButtonByLabel('close').should(CONDITIONS.EXIST).should(CONDITIONS.BE_VISIBLE).click()
    ContentPoliciesTable.checkAlert(I.translate(`bis/ues:detectionPolicies.snackbars.successfulUpdate`))
    ContentPoliciesTable.getPolicyByLabel(updatedPolicyData.policyName).children().contains(updatedPolicyData.policyName)
  })
})
describe('Change flag "Ues:Bip:Policy:Read" to false, flag "Ues:Bip:Policy:Update" still is true.', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  it('All content on the policies list must not exist in DOM and must not be visible.', () => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.NON_READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.UPDATABLE,
      permissionValues.NON_DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.checkNoPermissionHeading(`access:errors.noPermission.title`)
    ContentPoliciesTable.checkNoPermissionDescription(`access:errors.noPermission.description`)
  })
})
describe('Policy table protection page use - Ues:Bip:Policy:Delete = true', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.NON_LISTABLE,
      permissionValues.READABLE,
      permissionValues.CREATABLE,
      permissionValues.UPDATABLE,
      permissionValues.DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
  })
  it('Trying the possibility of deleting the policy after creation use the "Delete" button on policies list table.', () => {
    policyData = Helper.defaultPolicy
    createPolicyUseAddButton(policyData)
    ContentPoliciesTable.getGridcellByName(policyData.policyName)
      .parent()
      .find('[type="checkbox"]')
      .should(CONDITIONS.EXIST)
      .click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.delete`))
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).should(CONDITIONS.NOT_EXIST)
  })
  // #TODO: Need to clarify why in this test all policy fields are disabled.
  it.skip('Trying the possibility of deleting the policy after creation use the delete icon button on policy page.', () => {
    policyData = Helper.defaultPolicy
    createPolicyUseAddButton(policyData)
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).click()
    ContentPolicy.getDeletePolicyIcon().should(CONDITIONS.BE_VISIBLE).should(CONDITIONS.EXIST).click()
    ContentPolicy.getDeleteConfirmButton().click().hash().should(CONDITIONS.EQUAL, ContentPoliciesTable.hash)
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.delete`))
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).should(CONDITIONS.NOT_EXIST)
  })
})
// #TODO: Need to clarify why in this test all policy fields are disabled.
describe.skip('Change flag "Ues:Bip:Policy:Update" to false, flag "Ues:Bip:Policy:Delete" still is true', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
  })
  it('Trying the possibility of updating policy after change flag "Ues:Bip:Policy:Update" to false', () => {
    ContentPoliciesTable.getTableRowByIndex(1).find('a').first().click()
    ContentPolicy.getPolicyNameField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
    ContentPolicy.getPolicyDescriptionField().should(CONDITIONS.HAVE_ATTRIBUTE, 'disabled')
  })
  it('Trying the possibility of deleting policy after change flag "Ues:Bip:Policy:Update" to false', () => {
    policyData = Helper.defaultPolicy
    createPolicyUseAddButton(policyData)
    ContentPoliciesTable.getGridcellByName(policyData.policyName)
      .parent()
      .find('[type="checkbox"]')
      .should(CONDITIONS.EXIST)
      .click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.delete`))
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).should(CONDITIONS.NOT_EXIST)
    createPolicyUseAddButton(policyData)
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).click()
    ContentPolicy.getDeletePolicyIcon().should(CONDITIONS.BE_VISIBLE).should(CONDITIONS.EXIST).click()
    ContentPolicy.getDeleteConfirmButton().click().hash().should(CONDITIONS.EQUAL, ContentPoliciesTable.hash)
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.delete`))
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).should(CONDITIONS.NOT_EXIST)
  })
})
describe('Change flag "Ues:Bip:Policy:Create" to false, flag "Ues:Bip:Policy:Delete" still is true', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  beforeEach(() => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
  })
  // #TODO: Need to clarify why in this test all policy fields are disabled.
  it.skip('The button "Add Button" in DOM must not exist.', () => {
    ContentPoliciesTable.visit()
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.getAddPolicyButton(`${policy}.buttons.add`).should(CONDITIONS.NOT_EXIST)
  })
  it('Trying the possibility of deleting policy after change flag "Ues:Bip:Policy:Create" to false', () => {
    policyData = Helper.defaultPolicy
    Helper.addContentPolicyToListView(policyData)
    ContentPoliciesTable.getGridcellByName(policyData.policyName)
      .parent()
      .find('[type="checkbox"]')
      .should(CONDITIONS.EXIST)
      .click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.getDeleteButton().click()
    ContentPoliciesTable.checkAlert(I.translate(`${policy}.success.delete`))
    ContentPoliciesTable.getPolicyByLabel(policyData.policyName).should(CONDITIONS.NOT_EXIST)
  })
})
describe('Change flag "Ues:Bip:Policy:Read" to false, flag "Ues:Bip:Policy:Delete" still is true.', () => {
  before(() => {
    I.loadI18nNamespaces(dlpPolicyFlag, 'profiles', 'tables', 'bis/ues', 'access')
  })
  it('All content on the policies list must not exist in DOM and must not be visible.', () => {
    setLocalStoragePermissionState()
    initializePermissions(
      permissionValues.LISTABLE,
      permissionValues.NON_READABLE,
      permissionValues.NON_CREATABLE,
      permissionValues.NON_UPDATABLE,
      permissionValues.DELATABLE,
    )
    I.overridePermissions({ ...overridePermissionsObj })
    ContentPoliciesTable.visit()
    ContentPoliciesTable.getTabByName(`${policy}.tabTitle.content`)
      .should(CONDITIONS.BE_VISIBLE)
      .should(CONDITIONS.HAVE_ATTRIBUTE, 'aria-selected', 'true')
    ContentPoliciesTable.checkNoPermissionHeading(`access:errors.noPermission.title`)
    ContentPoliciesTable.checkNoPermissionDescription(`access:errors.noPermission.description`)
  })
})
