export class AddUemConnectionPage {
  getUEMTenantID() {
    return I.findByRole('textbox', { name: I.translate('emm.uem.add.srpid') })
  }
  inputUEMTenantID(text: string) {
    return this.getUEMTenantID().should('exist').and('be.visible').type(text)
  }
  getUEMAuthKey() {
    return I.findByRole('textbox', { name: I.translate('emm.uem.add.authKey') })
  }
  inputUEMAuthKey(text: string) {
    return this.getUEMAuthKey().should('exist').and('be.visible').type(text)
  }
  getUEMTenantHeading() {
    return I.findByRole('heading', { name: I.translate('emm.uem.add.tenantTitle') })
  }
  getUemTenantDescriptionHeading() {
    return I.findByText(I.translate('emm.uem.add.tenantDescription'))
  }
  getCancelButton() {
    return I.findByRole('button', { name: I.translate('button.cancel') })
  }
  getSaveButton() {
    return I.findByRole('button', { name: I.translate('button.save') })
  }
  getSuccessAlertMessage() {
    return I.findByRole('alert').findByText(I.translate('emm.uem.success'))
  }
  getNoUEMTenantsError() {
    return I.findByRole('alert').findByText(I.translate('server.error.tenantlist.404'))
  }
  getErrorPopUpForConnectionExists() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.13002'))
  }
  getErrorPopUpForUemTenantAlreadyAssociated() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.31003'))
  }
  getErrorPopUpForServerError() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.500'))
  }
  getErrorPopUpForUnknownInternalError() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.31500'))
  }
  getErrorPopUpForUEMIntersectFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.31510'))
  }
  getErrorPopUpForUEMPCEFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.31520'))
  }
  getErrorPopUpForTenantServiceFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.uem.add.31530'))
  }
  getErrorPopUpForGeneralFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.default'))
  }
  getErrorPopUpForUEMRetrievalFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.tenantlist.31500'))
  }
  getErrorPopUpForUEMTenantServiceFailure() {
    return I.findByRole('alert').findByText(I.translate('server.error.tenantlist.31530'))
  }
}
