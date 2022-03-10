import { I } from '@ues-behaviour/shared-e2e'

import {
  findInputByLabelText,
  getAlert,
  getCheckboxInTable,
  getColumnRowsCells,
  haveText,
  ROLE_BUTTON,
  ROLE_DIALOG,
} from './constants'

// values
export const MOCK_TENANT_ID = 'V10118177'
export const TYPE_RESTRICTED = 'RESTRICTED'
export const TYPE_APPROVED = 'APPROVED'
export const ADDRESS_TYPE_HOST = 'HOST'
export const ADDRESS_TYPE_IP = 'IP'
export const SORT_BY_CREATED_DESC = 'created desc'

// add/edit form fields
export const domainAddressField = 'domainAddress'
export const descriptionField = 'description'

const DOMAIN_KEY = 'mtd/common:exclusion.domains.domain'

// You MUST call class functions only in a scope of it('some test case', ...), otherwise Error occurred: "> tFunction is not a function"
export class DomainPage {
  static findDomainValueLinkByText = (linkText): Cypress.Chainable<JQuery<HTMLElement>> => {
    return getColumnRowsCells(I.translate(DOMAIN_KEY)).findAllByText(linkText).first()
  }

  static selectFirstNRows = rowCount => {
    for (let i = 0; i < rowCount; i++) {
      getCheckboxInTable(i).check({ force: true })
    }
  }

  static findSortByDomain = () => {
    return I.findSortButtonByInfiniteTableColumnLabel(I.translate(DOMAIN_KEY))
  }

  static findAddButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByText(I.translate('mtd/common:exclusion.domains.addDomain'))
  }

  static findDeleteButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByRole(ROLE_BUTTON, { name: I.translate('mtd/common:common.delete') })
  }

  static findExportButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByRole(ROLE_BUTTON, { name: I.translate('general/form:commonLabels.export') })
  }

  static findAddManuallyOption = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return DomainPage.findAddButton()
      .click({ force: true })
      .then(() => {
        I.findByText(I.translate('mtd/common:exclusion.domains.addManually'))
      })
  }

  static findAddViaImportOption = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return DomainPage.findAddButton()
      .click({ force: true })
      .then(() => {
        I.findByText(I.translate('mtd/common:exclusion.domains.addViaImport'))
      })
  }

  static verifyAndCloseAlertMessage = (message: string) => {
    getAlert().should(haveText, message).find('[type="button"]').trigger('click')
  }
}

// You MUST call class functions only in a scope of it('some test case', ...), otherwise Error occurred: "> tFunction is not a function"
export class DeleteConfirmation {
  static findDeleteButton = () => {
    return I.findByRole(ROLE_DIALOG).findByRole(ROLE_BUTTON, { name: I.translate('mtd/common:common.delete') })
  }
}

// You MUST call class functions only in a scope of it('some test case', ...), otherwise Error occurred: "> tFunction is not a function"
export class ExportConfirmation {
  static findExportButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByRole(ROLE_DIALOG).findByRole(ROLE_BUTTON, { name: I.translate('general/form:commonLabels.export') })
  }
}

export class ImportDialog {
  static findInputTypeFile = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByLabelText('labeled-file-upload-button')
  }

  static findUploadButton = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByRole(ROLE_BUTTON, { name: 'Upload' })
  }
}

// You MUST call class functions only in a scope of it('some test case', ...), otherwise Error occurred: "> tFunction is not a function"
export class DomainForm {
  static findFromDialog = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return I.findByRole(ROLE_DIALOG)
  }

  static findAddressField = () => {
    return findInputByLabelText(I.translate(DOMAIN_KEY))
  }

  static findDescriptionField = () => {
    return findInputByLabelText(I.translate('mtd/common:common.description'))
  }

  static findAddButton = () => {
    return I.findByRole(ROLE_BUTTON, { name: I.translate('mtd/common:common.add') })
  }

  static findSaveButton = () => {
    return I.findByRole(ROLE_BUTTON, { name: I.translate('mtd/common:common.save') })
  }

  static findCancelButton = () => {
    return I.findByRole(ROLE_BUTTON, { name: I.translate('mtd/common:common.cancel') })
  }
}
