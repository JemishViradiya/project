/* eslint-disable sonarjs/no-duplicate-string */

export class setting_emmconnections {
  getIntuneConnection() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.intune') })
  }

  getUEMConnection() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.uem') })
  }

  getTableHeader(tableHeader: string) {
    return I.findByRole('columnheader', { name: tableHeader })
  }

  getDeleteButtonForIntuneConnection() {
    return I.findByRole('cell', { name: I.translate('emm.page.connection.type.intune') })
      .parent()
      .find('[aria-colindex=5]')
      .findByRole('button')
  }
  getDeleteButtonForUEMConnection() {
    return I.findByRole('cell', { name: I.translate('emm.page.connection.type.uem') })
      .parent()
      .findByRole('button')
  }
  checkConnectionServerNameForUEM() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.uem') }).prev()
  }
  checkConnectionServerNameForIntune() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.intune') }).prev()
  }
  getGenerateAppButton() {
    return I.findByRole('button', { name: I.translate('emm.page.connection.generateAppConfigButton') })
  }

  getAddConnectionButton() {
    return I.findByRole('button', { name: I.translate('emm.page.connection.add') })
  }

  getAddConnectionButtonForUEM() {
    return I.findByRole('menuitem', { name: I.translate('emm.page.connection.type.uem') })
    //return I.findByRole('menu').findAllByRole('menuitem', { name: I.translate('emm.page.connection.type.uem') })
  }

  getAddConnectionButtonForIntune() {
    return I.findByRole('menuitem', { name: I.translate('emm.page.connection.type.intune') })
    //return I.findByRole('menu').findByRole('menuitem', { name: I.translate('emm.page.connection.type.intune') })
  }
  getErrorAlertCloseButton() {
    return I.findByRoleWithin('alert', 'button')
  }

  getErrorMessageForRetrieveConnectionUEM() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.uem') })
      .parent()
      .findByRole('cell', { name: I.translate('emm.page.error.default') })
  }
  getErrorMessageForRetrieveConnectionINTUNE() {
    return I.findAllByRole('cell', { name: I.translate('emm.page.connection.type.intune') })
      .parent()
      .findByRole('cell', { name: I.translate('emm.page.error.default') })
  }
  getNoDataMessageWhenNoConnectionExist() {
    return I.findByRole('cell', { name: I.translate('noData') })
  }
  getDialogBoxForDeleteConnection() {
    return I.findByRole('dialog')
  }
  getHeaderMessageForDeleteButtonDialogBox() {
    return I.findByRoleWithin('dialog', 'heading', { name: I.translate('emm.page.removeConnection') })
  }
  getDescriptionMessageForDeleteButtonDialogBox() {
    return this.getDialogBoxForDeleteConnection().findByText(I.translate('emm.page.deleteConnectionDialog.confirm'))
  }
  getCancelButtonForDeleteConnectionDialogBox() {
    return I.findAllByRole('button', { name: I.translate('button.cancel') })
  }
  getDeleteButtonForDeleteConnectionDialogBox() {
    return I.findByRole('button', { name: I.translate('button.delete') })
  }
  clickAnywhereAfterAddConnectionButton() {
    return I.findByRole('presentation').click()
  }
  getErrorMessageForIntuneConnectionDeleteFailure() {
    return I.findByRole('alert').findByText(I.translate('emm.page.error.deleteConnection', { connectionName: 'INTUNE' }))
  }
  getErrorMessageForUEMConnectionDeleteFailure() {
    return I.findByRole('alert').findByText(I.translate('emm.page.error.deleteConnection', { connectionName: 'UEM' }))
  }
  getSuccessMessageAfterConnectionDelete() {
    return I.findByRole('alert').findByText(I.translate('emm.delete.success'))
  }
  getSuccessMessageAfterForceDeleteConnection() {
    return I.findAllByRole('alert').eq(1).findByText(I.translate('emm.delete.success'))
  }
  getRBAC_ResourceNotFound(resourceNotFound: string) {
    return I.findByRole('heading', { name: resourceNotFound })
  }
  getRBAC_ResourceNotFoundMessage(resourceNotFoundMessage: string) {
    return I.findByText(resourceNotFoundMessage)
  }
  getDialogBoxForForceDeleteConnection() {
    return I.findByRole('dialog', { name: I.translate('emm.page.forceDeleteConnectionDialog.title') })
  }
  getHeaderMessageForForceDeleteDialogBox() {
    return this.getDialogBoxForForceDeleteConnection().findByRole('heading', {
      name: I.translate('emm.page.forceDeleteConnectionDialog.title'),
    })
  }
  getDescriptionMessageForForceDeleteDialogBox() {
    return this.getDialogBoxForForceDeleteConnection().findByText(I.translate('emm.page.forceDeleteConnectionDialog.confirm'))
  }
  getNoButtonForForceDeleteDialogBox() {
    return I.findAllByRole('button', { name: I.translate('button.no') })
  }
  getYesButtonForDeleteDialogBox() {
    return I.findByRole('button', { name: I.translate('button.yes') })
  }
  getUEMConnectionStatusInProgressMessage() {
    return I.findByRole('cell', { name: I.translate('emm.table.data.state.inProgress') })
  }
  getUEMConnectionStatusInProgressProgressBar() {
    return I.findByRole('progressbar')
  }
  getUEMConnectionStatusSuccessful() {
    return I.findByRole('cell', { name: I.translate('emm.table.data.state.success') })
  }
  getUEMConnectionStatusError() {
    return I.findByRole('cell', {
      name: I.translate('emm.table.data.state.error.default') + ' ' + I.translate('emm.table.data.state.retry'),
    }).findByRole('generic', { name: I.translate('emm.table.data.state.error.default') })
  }
  getUEMConnectionStatusRetry() {
    return I.findByRole('cell', {
      name: I.translate('emm.table.data.state.error.default') + ' ' + I.translate('emm.table.data.state.retry'),
    }).findAllByText(I.translate('emm.table.data.state.retry'))
  }
  getUEMConnectionStatusErrorAndFailedTOAuthorized(uemtenantid) {
    return I.findByRole('alert').findByText(
      I.translate('emm.table.data.state.error.message.FAILURE_TO_AUTHORIZE_OIDC_CLIENT', { uemTenantId: uemtenantid }),
    )
  }

  getUEMConnectionStatusErrorAndFailedTOEnableConnection(uemtenantid) {
    return I.findByRole('alert').findByText(
      I.translate('emm.table.data.state.error.message.FAILURE_TO_ENABLE_CONNECTION_WITHIN_UEM', { uemTenantId: uemtenantid }),
    )
  }
  getUEMConnectionStatusErrorAndFailedTOEnableUESService(uemtenantid) {
    return I.findByRole('alert').findByText(
      I.translate('emm.table.data.state.error.message.FAILURE_TO_ENABLE_UES_SERVICES', { uemTenantId: uemtenantid }),
    )
  }
  TryAgainFailedForUEMConnection() {
    return I.findByRole('alert', { name: I.translate('server.error.retry.default') })
  }
}
