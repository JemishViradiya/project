export class AddIntuneConnectionPage {
  getAzureTenantID() {
    return I.findByRole('textbox')
  }

  getAzureTenantIDPlaceholder() {
    return I.findByRole('textbox').parent().prev().findByText(I.translate('emm.intune.add.tenantId'))
  }

  inputAzureTenantID(text: string) {
    return I.findByRole('textbox').should('exist').and('be.visible').type(text)
  }

  getAzureTenantIDHeading() {
    return I.findByRole('heading', { name: I.translate('emm.intune.add.azureInfoTitle') })
  }

  getIntuneIntegrationHeading() {
    return I.findByRole('heading', { name: I.translate('emm.intune.add.integration') })
  }

  getAzureInfoDescription() {
    return I.findByText(I.translate('emm.intune.add.azureInfoDescription'))
  }

  getSuccessAlertMessage() {
    return I.findByRole('alert').findByText(I.translate('emm.intune.add.success'))
  }

  getFailureOnInavlidTenantIDAlertMessage() {
    return I.findByRole('alert').findByText(I.translate('server.error.intune.add.11004'))
  }

  getEmptyTenantIDFieldError() {
    return I.findByText(I.translate('emm.validation.emptyField'))
  }

  getFailureAlertMessage() {
    return I.findByRole('alert').findByText(I.translate('server.error.intune.add.500'))
  }

  getErrorPopUpForConnectionExists() {
    return I.findByRole('alert').findByText(I.translate('server.error.intune.add.13002'))
  }

  getErrorPopUpForDefault() {
    return I.findByRole('alert').findByText(I.translate('server.error.default'))
  }
  getErrorPopUpForTenantIsWithoutIntuneLicense() {
    return I.findAllByRole('alert').findAllByText(I.translate('server.error.intune.add.11031'))
  }
  getErrorPopUpForInvalidAuthCode() {
    return I.findAllByRole('alert').findAllByText(I.translate('server.error.intune.add.7002'))
  }
}
