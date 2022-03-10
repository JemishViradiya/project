import path from 'path'

import { exportFileName } from '@ues-behaviour/export/mocks'
import { I } from '@ues-behaviour/shared-e2e'
import { apps, MOCK_APP_HASH_FOR_EDIT } from '@ues-data/mtd/exclusions/applications/mocks'
import { devCertsMockData, MOCK_IDENTIFIER_FOR_EDIT } from '@ues-data/mtd/exclusions/dev-certs/mocks'

export { MOCK_APP_HASH_FOR_EDIT }

export const beEnabled = 'be.enabled'
export const beDisabled = 'be.disabled'
export const beVisible = 'be.visible'
export const notBeVisible = 'not.be.visible'
export const notExist = 'not.exist'
export const exist = 'exist'
export const equal = 'equal'
export const include = 'include'
export const haveText = 'have.text'
export const haveValue = 'have.value'
export const haveAttr = 'have.attr'
export const required = 'required'

// request/response constants
export const RESTRICTED_APPS_UI_URL = '#/settings/global-list/restricted/apps'
export const SAFE_APPS_UI_URL = '#/settings/global-list/Safe/apps'
export const APPS_API_URL = '**/api/mtd/v1/mtd-exclusion/application'

export const RESTRICTED_CERTS_UI_URL = '#/settings/global-list/restricted/developers'
export const SAFE_CERTS_UI_URL = '#/settings/global-list/Safe/developers'
export const CERTS_API_URL = '**/api/mtd/v1/mtd-exclusion/certificate'

export const RESTRICTED_IP_UI_URL = '#/settings/global-list/restricted/ipAddresses'
export const SAFE_IP_UI_URL = '#/settings/global-list/Safe/ipAddresses'
export const WEB_ADDRESS_API_URL = '**/api/mtd/v1/mtd-exclusion/webAddress'
export const RESTRICTED_DOMAINS_UI_URL = '#/settings/global-list/restricted/domains'
export const SAFE_DOMAINS_UI_URL = '#/settings/global-list/Safe/domains'

export const FIELD_TYPE_VALUE_RESTRICTED = 'RESTRICTED'
export const FIELD_TYPE_VALUE_APPROVED = 'APPROVED'
export const FIELD_TENANT_VALUE = 'V10118177'
export const FIELD_SOURCE_VALUE_MANUAL = 'MANUAL'
export const FIELD_PLATFORM_VALUE_ANDROID = 'ANDROID'
export const FIELD_REQUIRED_SYMBOL = '*'

export const LARGE_RANDOM_TEXT = Array(2000)
  .fill(null)
  .map(() => Math.random().toString(36).substr(2))
  .join('')
export const FIELD_VALUE_257_CHARS = LARGE_RANDOM_TEXT.substring(0, 257) // will be 257 chars
export const FIELD_MAX_256 = 256
export const FIELD_MAX_2048 = 2048

export const FIELD_VALUE_2049_CHARS = LARGE_RANDOM_TEXT.substring(0, 2049) // will be 2049 chars

export const FIELD_NAME_VALUE = 'Facebook'
export const FIELD_DESCRIPTION_VALUE = 'Description of Facebook app'
export const FIELD_IDENTIFIER_VALUE = '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac'
export const FIELD_ISSUER_VALUE = 'Facebook Inc'
export const FIELD_PLATFORM_VALUE = 'ANDROID'
export const FIELD_SUBJECT_VALUE = 'Subject'

export const SORT_BY_SUBJECT = 'subject'
export const SORT_BY_ISSUER = 'issuer'
export const SORT_BY_IDENTIFIER = 'identifier'
export const SORT_BY_PLATFORM = 'platform'

export const SORT_BY_CREATED = 'created'
export const SORT_BY_NAME = 'name'
export const SORT_BY_ASC = 'asc'
export const SORT_BY_DESC = 'desc'
export const SORT_BY_DEFAULT = `${SORT_BY_CREATED} ${SORT_BY_DESC}`

const mockApps = apps
export const FacebookRestricted = mockApps[2]
export const hashForEdit = MOCK_APP_HASH_FOR_EDIT

const mockCerts = devCertsMockData
export const CertFaceBookRestricted = mockCerts[2]
export { MOCK_IDENTIFIER_FOR_EDIT }

// values
export const fieldVendorForUpdate = 'Facebook corp'
export const fieldDescriptionForUpdate = 'Description of Facebook app'
export const aNewValue = 'New value'

// roles
export const ROLE_BUTTON = 'button'
export const ROLE_DIALOG = 'dialog'
export const ROLE_TAB = 'tab'

// export
export const EXPORT_FILENAME_PREFIX = {
  RestrictedDomains: 'RestrictedDomains',
  SafeDomains: 'SafeDomains',
}

// run only from cypress context (from it, before, beforeEach)
export const getDownloadFolderPath = () => {
  return `${path.join(Cypress.config('downloadsFolder'))}`
}

// run only from cypress context (from it, before, beforeEach)
export const getDownloadedFilePath = (fileNamePrefix: string, fileExt) => {
  return `${getDownloadFolderPath()}/${exportFileName(fileNamePrefix, {
    filtered: false,
  })}.${fileExt}`
}

export const verifyAlertMessageAndDismiss = (message: string) => {
  getAlert().should(beVisible).should(haveText, message)
  I.dismissAlert().then(() => {
    getAlert().should(notExist)
  })
}

export const getAlert = () => {
  return I.findByRole('alert')
}

export const findInputByLabelText = labelText => {
  const regex = new RegExp(labelText, 'i')
  return I.findByLabelText(regex)
}

export const findAllInputByLabelText = labelText => {
  const regex = new RegExp(labelText, 'i')
  return I.findAllByLabelText(regex)
}

export const clearInputByNameAndType = (labelText, value) => {
  clearInputByName(labelText).fillField(value)
}

export const clearInputByName = labelText => {
  return findInputByLabelText(labelText).clear()
}

export const verifyErrorFieldMessageAbsent = labelText => {
  findInputHelperText(labelText).should(notExist)
}

export const verifyErrorFieldMessage = (labelText, message) => {
  findInputHelperText(labelText).should(haveText, message)
}

export const findInputHelperText = labelText => {
  return findInputByLabelText(labelText).parent().next()
}

export const getMtdCommonMessage = message => {
  return `mtd/common:${message}`
}

export const waitForRequestAndCheckBody = (requestId, expectedBody) => {
  I.wait(requestId)
    .its('request.body')
    .then(body => {
      expect(body).to.deep.equals(expectedBody)
    })
}

export const clickAddButtonByName = (addButtonText, thenFunction) => {
  I.findByRole(ROLE_BUTTON, { name: addButtonText })
    .click({ force: true })
    .then(() => {
      thenFunction()
    })
}

export const clickCancelButtonByName = clickCancelButtonByName => {
  I.findByRole(ROLE_BUTTON, { name: clickCancelButtonByName }).click({ force: true })
}

export const selectItemFromAddEntityOptionList = (addButtonText, optionText, formHeading) => {
  I.findByText(addButtonText)
    .click({ force: true })
    .then(() => {
      I.findByText(optionText)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByText(formHeading).should(beVisible)
        })
    })
}

export const getCheckboxInTable = (rowIndex: number, parentElement?: Cypress.Chainable<JQuery<HTMLElement>>) => {
  return (parentElement ? parentElement : I).findByRoleOptionsWithin('cell', { name: `select-${rowIndex}` }, 'checkbox')
}

export const getColumnRowsCells = (colLabel: RegExp | string) =>
  I.findAllByInfiniteTableColumnLabel(colLabel).filter(index => {
    return index !== 0
  })

export const getColumnHeaderCell = (colLabel: RegExp | string) => I.findAllByInfiniteTableColumnLabel(colLabel).first()

export const findTabByName = (tabName: string): Cypress.Chainable<JQuery<HTMLElement>> => {
  return I.findByRole(ROLE_TAB, { name: tabName })
}

export const findDialogWithHeading = headingText => {
  return I.findByRole(ROLE_DIALOG, { heading: headingText } as any)
}
