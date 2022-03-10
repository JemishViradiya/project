import { apolloQuery } from '@ues-behaviour/shared-e2e'
import { PolicySchema } from '@ues-data/bis/model'

export const TranslationKeys = {
  addNewPolicyButton: 'profiles:policy.list.add',
  nameTextFieldLabel: 'bis/ues:policies.form.labels.name',
  descriptionTextFieldLabel: 'bis/ues:policies.form.labels.description',
  highRiskLevel: 'bis/shared:risk.level.HIGH',
  networkAnomaly: 'bis/shared:risk.common.networkAnomaly',
  saveButton: 'bis/shared:common.save',
  addButton: 'bis/shared:common.add',
  cancelButton: 'bis/shared:common.cancel',
  deleteButton: 'bis/shared:common.delete',
  identityRiskResponseActionsHeading: 'bis/ues:risk.common.identityRiskResponseActions',
  automaticRiskReductionCheckbox: 'bis/ues:risk.common.automaticRiskReduction',
  automaticRiskReductionDescription: 'bis/ues:risk.common.automaticRiskReductionDescription',
  riskFactorTableHeader: 'bis/ues:policies.tableHeader.factor',
  detectionTableHeader: 'bis/ues:policies.tableHeader.detection',
  responseActionsTableHeader: 'bis/ues:policies.tableHeader.responseActions',
  assignNetworkAccessPolicyDialogTitle: 'bis/ues:actions.assignNetworkAccessPolicy.dialog.title',
  assignNetworkAccessPolicyDialogLabel: 'bis/ues:actions.assignNetworkAccessPolicy.dialog.label',
  notNowButton: 'bis/ues:policies.create.successReject',
  overrideNetworkAccessPolicyChip: 'bis/ues:actions.selected.networkAccessPolicy.chip',
  modifiedPolicyConfirmationDialogTitle: 'bis/ues:policies.modifiedPolicyConfirmationDialog.title',
  modifiedPolicyConfirmationDialogDescription: 'bis/ues:policies.modifiedPolicyConfirmationDialog.description',
  modifiedPolicyConfirmationDialogCancel: 'bis/ues:policies.modifiedPolicyConfirmationDialog.cancelButton',
  modifiedPolicyConfirmationDialogConfirm: 'bis/ues:policies.modifiedPolicyConfirmationDialog.confirmButton',
  successfulCreation: 'bis/ues:policies.snackbars.successfulCreation',
  successfulUpdate: 'bis/ues:policies.snackbars.successfulUpdate',
  successfulDeletion: 'bis/ues:policies.snackbars.successfulDeletion',
  deletionConfirmationHeader: 'bis/ues:policies.delete.deleteConfirmation',
  deletionConfirmationNote: 'bis/ues:policies.delete.deleteNote',
  deletionConfirmationSingle: 'bis/ues:policies.delete.deleteSingle',
  formButtonPanel: 'components:drawer.formButtonPanel',
  gateway: 'navigation:gateway',
  policies: 'navigation:policies',
  adaptiveResponse: 'gateway-settings:adaptiveResponse',
  assignedUsersAndGroups: 'profiles:policy.detail.appliedUsersAndGroups',
  addUserOrGroup: 'profiles:policy.assignment.add',
  searchUsersOrGroupsLabel: 'profiles:policy.assignment.dialog.searchText',
  successfulAssignment: 'profiles:policy.assignment.successfulAssignment',
  copyPolicy: 'bis/ues:policies.common.tooltips.copyPolicy',
  noPermissionCardTitle: 'access:errors.noPermission.title',
  noPermissionCardDescription: 'access:errors.noPermission.description',
}

const BE_VISIBLE = 'be.visible'
export const verifyConfirmationModal = () => {
  I.findByRoleWithin('dialog', 'heading', { name: I.translate(TranslationKeys.modifiedPolicyConfirmationDialogTitle) }).should(
    BE_VISIBLE,
  )
  I.findByText(I.translate(TranslationKeys.modifiedPolicyConfirmationDialogDescription)).should(BE_VISIBLE)
  I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.modifiedPolicyConfirmationDialogConfirm) }).should(
    'be.enabled',
  )
  I.findByRoleWithin('dialog', 'button', { name: I.translate(TranslationKeys.modifiedPolicyConfirmationDialogCancel) }).should(
    'be.enabled',
  )
}
export const verifyHashEquals = hash => {
  I.location().should(loc => {
    expect(loc.hash).to.eq(hash)
  })
}
export const getPolicyNameTextField = () => {
  return I.findByText(I.translate(TranslationKeys.nameTextFieldLabel)).should(BE_VISIBLE).next().findByRole('textbox')
}
export const getPolicyDescriptionTextField = () => {
  return I.findByText(I.translate(TranslationKeys.descriptionTextFieldLabel)).should(BE_VISIBLE).next().findByRole('textbox')
}
export const getPolicyFormCancelButton = () => {
  return I.findByRoleOptionsWithin('generic', { name: I.translate(TranslationKeys.formButtonPanel) }, 'button', {
    name: I.translate(TranslationKeys.cancelButton),
  })
}
export const getPolicyFormAddButton = () => {
  return I.findByRoleOptionsWithin('generic', { name: I.translate(TranslationKeys.formButtonPanel) }, 'button', {
    name: I.translate(TranslationKeys.addButton),
  })
}
export const getPolicyFormSaveButton = () => {
  return I.findByRoleOptionsWithin('generic', { name: I.translate(TranslationKeys.formButtonPanel) }, 'button', {
    name: I.translate(TranslationKeys.saveButton),
  })
}
export const getSnackbar = (text: string) => {
  return I.findByRole('alert').should('contain', text).should(BE_VISIBLE).findByRole('button', { name: 'close' }).click()
}
export const getAddNewPolicyButton = () => {
  return I.findByRole('button', { name: I.translate(TranslationKeys.addNewPolicyButton) })
}
export const getPolicyDescriptionTextFieldContents = () => {
  return new Promise((resolve, reject) => {
    getPolicyDescriptionTextField()
      .invoke('val')
      .then(description => {
        resolve(description)
      })
  })
}
export const getResponseActionContents = () => {
  return new Promise((resolve, reject) => {
    I.findByRole('cell', { name: I.translate(TranslationKeys.networkAnomaly) })
      .next()
      .invoke('text')
      .then(responseAction => {
        resolve(responseAction)
      })
  })
}

export const visitPage = (pageUrl: string, callback?) => {
  I.visit(pageUrl, {
    onBeforeLoad: contentWindow => {
      contentWindow.model.mockAll({
        id: 'bis.policySchema',
        data: apolloQuery({
          queryName: 'policySchema',
          result: PolicySchema.OldPolicy,
        }),
      })
      callback?.(contentWindow)
    },
  })
}
