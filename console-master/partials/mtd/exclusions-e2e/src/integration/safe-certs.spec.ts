import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'

import {
  aNewValue,
  beDisabled,
  beVisible,
  clearInputByName,
  clearInputByNameAndType,
  clickAddButtonByName,
  clickCancelButtonByName,
  FIELD_DESCRIPTION_VALUE,
  FIELD_IDENTIFIER_VALUE,
  FIELD_ISSUER_VALUE,
  FIELD_MAX_256,
  FIELD_MAX_2048,
  FIELD_NAME_VALUE,
  FIELD_PLATFORM_VALUE,
  FIELD_SOURCE_VALUE_MANUAL,
  FIELD_SUBJECT_VALUE,
  FIELD_TENANT_VALUE,
  FIELD_TYPE_VALUE_APPROVED,
  FIELD_VALUE_257_CHARS,
  FIELD_VALUE_2049_CHARS,
  findAllInputByLabelText,
  findDialogWithHeading,
  findInputByLabelText,
  getCheckboxInTable,
  getMtdCommonMessage,
  haveValue,
  include,
  MOCK_IDENTIFIER_FOR_EDIT,
  ROLE_BUTTON,
  ROLE_DIALOG,
  selectItemFromAddEntityOptionList,
  SORT_BY_DEFAULT,
  SORT_BY_DESC,
  SORT_BY_IDENTIFIER,
  SORT_BY_ISSUER,
  SORT_BY_NAME,
  SORT_BY_PLATFORM,
  SORT_BY_SUBJECT,
  verifyAlertMessageAndDismiss,
  verifyErrorFieldMessage,
  verifyErrorFieldMessageAbsent,
  waitForRequestAndCheckBody,
} from '../support/constants'

const Fixtures = require('../fixtures/safe-certs.json')

const SafeDevCertificate_1 = Fixtures.responses.list.default.elements[0]
const SafeDevCertificate_2 = Fixtures.responses.list.default.elements[1]
const SystemCertificate = Fixtures.responses.list.system.elements[1]

// ui strings
let safeCertsTitle

let addCertificateButtonText
let manuallyEnterCertInfoOptionText
let addDevCertFormText

let developerNameFieldLabelText
let platformFieldLabelText
let subjectFieldLabelText
let issuerFieldLabelText
let identifierFieldLabelText
let descriptionFieldLabelText

let UI_REQUIRED_FIELD

let addButtonText
let cancelButtonText
let saveButtonText
let deleteButtonText

const clickAddManuallyOption = () => {
  selectItemFromAddEntityOptionList(addCertificateButtonText, manuallyEnterCertInfoOptionText, addDevCertFormText)
}

const clickAddButton = thenFunction => {
  clickAddButtonByName(addButtonText, thenFunction)
}

const clickCancelButton = () => {
  clickCancelButtonByName(cancelButtonText)
}

describe('MTD-3116: Admin - UES Console - UI for Developer Certificates Whitelist', () => {
  before(() => {
    window.localStorage.clear()
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
    window.localStorage.setItem(FeatureName.ExclusionIosRestricted, 'true')

    I.loadI18nNamespaces('mtd/common', 'components').then(() => {
      safeCertsTitle = I.translate(getMtdCommonMessage('exclusion.approvedDevelopers.title'))

      addCertificateButtonText = I.translate(getMtdCommonMessage('exclusion.developers.addDevCert'))
      manuallyEnterCertInfoOptionText = I.translate(getMtdCommonMessage('exclusion.developers.addManually'))
      addDevCertFormText = I.translate(getMtdCommonMessage('exclusion.approvedDevelopers.addFormName'))

      UI_REQUIRED_FIELD = I.translate(getMtdCommonMessage('exclusion.form.requiredField'))

      developerNameFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.name'))
      platformFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.os'))
      subjectFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.subject'))
      issuerFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.issuer'))
      identifierFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.identifier'))
      descriptionFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.description'))

      addButtonText = I.translate(getMtdCommonMessage('common.add'))
      cancelButtonText = I.translate(getMtdCommonMessage('common.cancel'))
      saveButtonText = I.translate(getMtdCommonMessage('common.save'))
      deleteButtonText = I.translate(getMtdCommonMessage('common.delete'))
    })

    I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

    I.visit('#/settings/global-list/safe/developers').then(() => {
      I.wait(['@initialCerts'])
      I.findByText(safeCertsTitle).should(beVisible)
      I.url().should(include, `#/settings/global-list/safe/developers`)
    })
  })

  describe('Test cases to verify list of Safe certificates', () => {
    let developerNameColumn
    let subjectColumn
    let issuerColumn
    let identifierColumn
    let osColumn

    before(() => {
      developerNameColumn = I.translate(getMtdCommonMessage('exclusion.developers.name'))
      subjectColumn = I.translate(getMtdCommonMessage('exclusion.developers.subject'))
      issuerColumn = I.translate(getMtdCommonMessage('exclusion.developers.issuer'))
      identifierColumn = I.translate(getMtdCommonMessage('exclusion.developers.identifier'))
      osColumn = I.translate(getMtdCommonMessage('exclusion.developers.os'))
    })
    it('84281728 Verify that description of "Approved developers" page is displayed on the page ', () => {
      I.findByText(I.translate(getMtdCommonMessage('exclusion.approvedDevelopers.description')))
    })

    it('84281730 Verify that checkbox is present on "Approved developers" page ', () => {
      // TODO verify that all entries have checkboxes
      // I.findByRole(`cell`, { name: `select-0` }).click()
    })

    it('84281732 Verify that ASC/DESC sorting works correctly for "Developer name" field ', () => {
      I.interceptSafeCertsGet(`${SORT_BY_NAME} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(developerNameColumn).click()
        I.wait('@query')
      })
    })

    it('84281733 Verify that ASC/DESC sorting works correctly for "Subject" field ', () => {
      I.interceptSafeCertsGet(`${SORT_BY_SUBJECT} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(subjectColumn).click()
        I.wait('@query')
      })
    })

    it('84300808 Verify that ASC/DESC sorting works correctly for "Issuer" field ', () => {
      I.interceptSafeCertsGet(`${SORT_BY_ISSUER} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(issuerColumn).click()
        I.wait('@query')
      })
    })

    it('84300809 Verify that ASC/DESC sorting works correctly for "Identifier" field', () => {
      I.interceptSafeCertsGet(`${SORT_BY_IDENTIFIER} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(identifierColumn).click()
        I.wait('@query')
      })
    })

    it('84281734 Verify that sorting by OS works correctly ', () => {
      I.interceptSafeCertsGet(`${SORT_BY_PLATFORM} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(osColumn).click()
        I.wait('@query')
      })
    })

    it('84299060 Verify that "OS" value is displayed as an icon ', () => {
      // TODO: verify image is displayed in each cell in the table
      // see possible approach in 'restricted-apps-spec.ts'
    })
  })

  describe('Test cases describing validation of Safe certificates', () => {
    beforeEach(() => {
      clickAddManuallyOption()
    })

    after(() => {
      clickCancelButton()
    })

    it('84311613 Verify min/max size of "Developer name" value ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByNameAndType(developerNameFieldLabelText, 'F')
        clearInputByName(issuerFieldLabelText)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(developerNameFieldLabelText)
          verifyErrorFieldMessage(issuerFieldLabelText, UI_REQUIRED_FIELD)
        })

        clearInputByNameAndType(developerNameFieldLabelText, FIELD_VALUE_257_CHARS)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(developerNameFieldLabelText)
          findInputByLabelText(developerNameFieldLabelText)
            .invoke('val')
            .then(text => {
              expect(text.length).is.eq(FIELD_MAX_256)
            })
          verifyErrorFieldMessage(issuerFieldLabelText, UI_REQUIRED_FIELD)
        })
      })
    })

    it('84311615 Verify max size of "Subject" value ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByName(issuerFieldLabelText)

        clearInputByNameAndType(subjectFieldLabelText, FIELD_VALUE_257_CHARS)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(subjectFieldLabelText)
          findInputByLabelText(subjectFieldLabelText)
            .invoke('val')
            .then(text => {
              expect(text.length).is.eq(FIELD_MAX_256)
            })
          verifyErrorFieldMessage(issuerFieldLabelText, UI_REQUIRED_FIELD)
        })
      })
    })

    it('84318593 Verify max size of "Issuer" value ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByName(developerNameFieldLabelText)

        clearInputByNameAndType(issuerFieldLabelText, FIELD_VALUE_257_CHARS)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(issuerFieldLabelText)
          findInputByLabelText(issuerFieldLabelText)
            .invoke('val')
            .then(text => {
              expect(text.length).is.eq(FIELD_MAX_256)
            })
          verifyErrorFieldMessage(developerNameFieldLabelText, UI_REQUIRED_FIELD)
        })
      })
    })

    it('84311616 Verify min/max size of "Identifier" value ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByName(developerNameFieldLabelText)

        clearInputByNameAndType(identifierFieldLabelText, FIELD_VALUE_2049_CHARS)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(identifierFieldLabelText)
          findInputByLabelText(identifierFieldLabelText)
            .invoke('val')
            .then(text => {
              expect(text.length).is.eq(FIELD_MAX_2048)
            })
          verifyErrorFieldMessage(developerNameFieldLabelText, UI_REQUIRED_FIELD)
        })
      })
    })

    it('84311617 Verify min/max size of "Description" value ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByName(developerNameFieldLabelText)
        clearInputByNameAndType(descriptionFieldLabelText, FIELD_VALUE_2049_CHARS)

        clickAddButton(() => {
          verifyErrorFieldMessageAbsent(descriptionFieldLabelText)
          findInputByLabelText(descriptionFieldLabelText)
            .invoke('val')
            .then(text => {
              expect(text.length).is.eq(FIELD_MAX_2048)
            })
          verifyErrorFieldMessage(developerNameFieldLabelText, UI_REQUIRED_FIELD)
        })
      })
    })

    it('84299057 Verify that certificate can not be manually added with already existing "identifier" value to the "Approved developers" list ', () => {
      findDialogWithHeading(addDevCertFormText).within(() => {
        clearInputByNameAndType(developerNameFieldLabelText, FIELD_NAME_VALUE)
        clearInputByNameAndType(subjectFieldLabelText, FIELD_SUBJECT_VALUE)
        clearInputByNameAndType(identifierFieldLabelText, FIELD_IDENTIFIER_VALUE)
        clearInputByNameAndType(issuerFieldLabelText, FIELD_ISSUER_VALUE)
        clearInputByNameAndType(descriptionFieldLabelText, FIELD_DESCRIPTION_VALUE)

        I.interceptCertificateRequest('POST', 409, '').as('conflict')

        I.findByRole(ROLE_BUTTON, { name: addButtonText }).click({ force: true })
      })
      waitForRequestAndCheckBody('@conflict', {
        name: FIELD_NAME_VALUE,
        description: FIELD_DESCRIPTION_VALUE,
        identifier: FIELD_IDENTIFIER_VALUE,
        issuer: FIELD_ISSUER_VALUE,
        platform: FIELD_PLATFORM_VALUE,
        source: FIELD_SOURCE_VALUE_MANUAL,
        subject: FIELD_SUBJECT_VALUE,
        tenantGuid: FIELD_TENANT_VALUE,
        type: FIELD_TYPE_VALUE_APPROVED,
      })
      const alert = I.findByText(I.translate(getMtdCommonMessage('exclusion.developers.duplicateDevCertErrorMsg'))).parent()
      alert.invoke('attr', 'role').should('equal', 'alert')
      I.findByText(I.translate(getMtdCommonMessage('exclusion.developers.duplicateDevCertErrorMsg')))
        .parent()
        .parent()
        .find('button')
        .click({ force: true })
      // TODO: find out why 'getAlert()' can't find alert, but findByText() does
      // verifyAlertMessageAndDismiss(I.translate(getMtdCommonMessage('exclusion.developers.duplicateDevCertErrorMsg')))
    })
  })

  describe('Test cases for manual adding of a Safe certificate', () => {
    it('84299066 Verify that addition of Approved certificate can be canceled during manual addition ', () => {
      clickAddManuallyOption()
      clearInputByNameAndType(developerNameFieldLabelText, FIELD_NAME_VALUE)
      clearInputByNameAndType(subjectFieldLabelText, FIELD_SUBJECT_VALUE)
      clearInputByNameAndType(identifierFieldLabelText, FIELD_IDENTIFIER_VALUE)
      clearInputByNameAndType(issuerFieldLabelText, FIELD_ISSUER_VALUE)
      clearInputByNameAndType(descriptionFieldLabelText, FIELD_DESCRIPTION_VALUE)
      clickCancelButton()
    })
  })

  describe('Test cases for editing a manually added certificate', () => {
    it('84281735 Verify that manually added сertificate can be edited', () => {
      // 84299068 	Verify that 'Changes has been saved.' success toast is shown when changes were successfully saved
      I.findByText(SafeDevCertificate_1.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.approvedDevelopers.editFormName')).should(beVisible)

              findInputByLabelText(developerNameFieldLabelText).should(haveValue, SafeDevCertificate_1.name).clear().type(aNewValue)
              findAllInputByLabelText(platformFieldLabelText).next().should(haveValue, SafeDevCertificate_1.platform)
              findInputByLabelText(subjectFieldLabelText).should(haveValue, SafeDevCertificate_1.subject).clear().type(aNewValue)
              findInputByLabelText(issuerFieldLabelText).should(haveValue, SafeDevCertificate_1.issuer).clear().type(aNewValue)
              findInputByLabelText(identifierFieldLabelText)
                .should(haveValue, SafeDevCertificate_1.identifier)
                .clear()
                .type(MOCK_IDENTIFIER_FOR_EDIT)
              findInputByLabelText(descriptionFieldLabelText)
                .should(haveValue, SafeDevCertificate_1.description)
                .clear()
                .type(aNewValue)

              I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible)

              I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

              I.intercept('PUT', '**/api/mtd/v1/mtd-exclusion/certificate/' + SafeDevCertificate_1.guid, req => {
                req.reply(201, Fixtures.responses.create.success)
              }).as('updateSuccess')

              I.findByRole(ROLE_BUTTON, { name: saveButtonText })
                .should(beVisible)
                .click({ force: true })
                .then(() => {
                  waitForRequestAndCheckBody('@updateSuccess', {
                    name: aNewValue,
                    guid: SafeDevCertificate_1.guid,
                    description: aNewValue,
                    identifier: MOCK_IDENTIFIER_FOR_EDIT,
                    issuer: aNewValue,
                    platform: SafeDevCertificate_1.platform,
                    source: FIELD_SOURCE_VALUE_MANUAL,
                    subject: aNewValue,
                    tenantGuid: FIELD_TENANT_VALUE,
                    type: FIELD_TYPE_VALUE_APPROVED,
                  })
                })
            })
          verifyAlertMessageAndDismiss(I.translate('exclusion.developers.devCertEditSuccessMsg'))
        })
    })

    it('84281736 +Verify that editing of manually added certificate can be canceled ', () => {
      I.findByText(SafeDevCertificate_1.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.approvedDevelopers.editFormName')).should(beVisible)

              findAllInputByLabelText(developerNameFieldLabelText)
                .should(haveValue, SafeDevCertificate_1.name)
                .clear()
                .type(aNewValue)

              clickCancelButton()
            })
        })
    })

    it('84299061 Verify that system certificate can NOT be edited', () => {
      I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.system).as('systemCerts')

      I.findByText(I.translate(getMtdCommonMessage('tabs.safe.label'))).click()
      I.wait(['@systemCerts'])

      I.findByText(SystemCertificate.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          findAllInputByLabelText(developerNameFieldLabelText).should(beDisabled)
        })

      clickCancelButton()

      I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('defaultCerts')

      I.findByText(I.translate(getMtdCommonMessage('tabs.safe.label'))).click()
      I.wait(['@defaultCerts'])
    })
  })

  describe('Test cases for delete certificates', () => {
    describe('84281729 Verify that one or several certificates can be deleted from Approved developers list ', () => {
      // 84281731 Verify that "Delete" button works correctly according to checked boxes
      it('Verify single certificate delete', () => {
        getCheckboxInTable(0).check()

        I.interceptCertificateRequest('DELETE', 200, '').as('deleteSuccess')
        I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

        I.findByRole(ROLE_BUTTON, { name: 'Delete' }).click({ force: true })

        I.findByRole(ROLE_DIALOG).within(() => {
          I.findByText(I.translate('exclusion.deleteConfirmation')).should(beVisible)

          const deleteConfMessage = I.translate(getMtdCommonMessage('exclusion.deleteConfirmationMsg'), {
            entities: I.translate(getMtdCommonMessage('exclusion.entitiesCertsLowerCase')),
          })
          I.findByText(deleteConfMessage).should(beVisible)
          I.findByText(SafeDevCertificate_1.name).should(beVisible)
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible)

          I.interceptCertificateRequest('DELETE', 200, '').as('deleteSuccess')
          I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

          I.findByRole(ROLE_BUTTON, { name: deleteButtonText })
            .click({ force: true })
            .then(() => {
              waitForRequestAndCheckBody('@deleteSuccess', [SafeDevCertificate_1.guid])
            })
        })

        const certDeletedMessage = I.translate(getMtdCommonMessage('exclusion.singleDeleteSuccessMsg'), {
          entity: I.translate(getMtdCommonMessage('exclusion.entityCertLowerCase')),
        })
        verifyAlertMessageAndDismiss(certDeletedMessage)
      })
      it('Verify multiple certificates delete', () => {
        getCheckboxInTable(0).check()
        getCheckboxInTable(1).check()

        I.interceptCertificateRequest('DELETE', 200, '').as('deleteSuccess')
        I.interceptSafeCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

        I.findByRole(ROLE_BUTTON, { name: 'Delete' }).click({ force: true })

        I.findByRole(ROLE_DIALOG).within(() => {
          I.findByText(SafeDevCertificate_1.name)
          I.findByText(SafeDevCertificate_2.name)
          I.findByRole(ROLE_BUTTON, { name: I.translate(getMtdCommonMessage('common.delete')) })
            .click({ force: true })
            .then(() => {
              waitForRequestAndCheckBody('@deleteSuccess', [SafeDevCertificate_1.guid, SafeDevCertificate_2.guid])
            })
        })
        const certsDeletedMessage = I.translate(getMtdCommonMessage('exclusion.multipleDeleteSuccessMsg'), {
          entities: I.translate(getMtdCommonMessage('exclusion.entitiesCertsUpperCase')),
        })
        verifyAlertMessageAndDismiss(certsDeletedMessage)
      })
    })
  })
})
