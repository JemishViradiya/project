import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'

import {
  aNewValue,
  beVisible,
  CertFaceBookRestricted,
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
  FIELD_PLATFORM_VALUE_ANDROID,
  FIELD_REQUIRED_SYMBOL,
  FIELD_SOURCE_VALUE_MANUAL,
  FIELD_SUBJECT_VALUE,
  FIELD_TENANT_VALUE,
  FIELD_TYPE_VALUE_RESTRICTED,
  FIELD_VALUE_257_CHARS,
  FIELD_VALUE_2049_CHARS,
  findAllInputByLabelText,
  findDialogWithHeading,
  findInputByLabelText,
  getAlert,
  getMtdCommonMessage,
  haveValue,
  include,
  MOCK_IDENTIFIER_FOR_EDIT,
  notExist,
  ROLE_BUTTON,
  ROLE_DIALOG,
  selectItemFromAddEntityOptionList,
  SORT_BY_DEFAULT,
  SORT_BY_DESC,
  SORT_BY_IDENTIFIER,
  SORT_BY_ISSUER,
  SORT_BY_NAME,
  SORT_BY_SUBJECT,
  verifyAlertMessageAndDismiss,
  verifyErrorFieldMessage,
  verifyErrorFieldMessageAbsent,
  waitForRequestAndCheckBody,
} from '../support/constants'

const Fixtures = require('../fixtures/restricted-certs.json')

const FacebookCert = Fixtures.responses.list.default.elements[0]

const PLATFORM_ANDROID = 'Android'

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

describe('MTD-3344: Admin - UES Console - UI for Developer Certificates Blacklist', () => {
  let restrictedCertsTitle

  before(() => {
    window.localStorage.clear()
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')
    window.localStorage.setItem(FeatureName.ExclusionIosRestricted, 'true')

    I.loadI18nNamespaces('mtd/common', 'components').then(() => {
      addCertificateButtonText = I.translate(getMtdCommonMessage('exclusion.developers.addDevCert'))
      manuallyEnterCertInfoOptionText = I.translate(getMtdCommonMessage('exclusion.developers.addManually'))
      addDevCertFormText = I.translate(getMtdCommonMessage('exclusion.restrictedDevelopers.addFormName'))
      UI_REQUIRED_FIELD = I.translate(getMtdCommonMessage('exclusion.form.requiredField'))

      developerNameFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.name'))
      platformFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.os'))
      subjectFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.subject'))
      issuerFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.issuer'))
      identifierFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.identifier'))
      descriptionFieldLabelText = I.translate(getMtdCommonMessage('exclusion.developers.description'))

      restrictedCertsTitle = I.translate(getMtdCommonMessage('exclusion.restrictedDevelopers.title'))

      addButtonText = I.translate(getMtdCommonMessage('common.add'))
      cancelButtonText = I.translate(getMtdCommonMessage('common.cancel'))
      saveButtonText = I.translate(getMtdCommonMessage('common.save'))
      deleteButtonText = I.translate(getMtdCommonMessage('common.delete'))

      I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

      I.visit('#/settings/global-list/').then(() => {
        I.wait(['@initialCerts'])
        I.findByText(restrictedCertsTitle).should(beVisible)
        I.url().should(include, `#/settings/global-list/restricted/developers`)
      })
    })
  })

  describe('Verify controls in Restricted Developers list', () => {
    let developerNameColumn
    let osColumn
    let subjectColumn
    let issuerColumn
    let identifierColumn
    let descriptionColumn

    before(() => {
      developerNameColumn = I.translate(getMtdCommonMessage('exclusion.developers.name'))
      osColumn = I.translate(getMtdCommonMessage('exclusion.developers.os'))
      subjectColumn = I.translate(getMtdCommonMessage('exclusion.developers.subject'))
      issuerColumn = I.translate(getMtdCommonMessage('exclusion.developers.issuer'))
      identifierColumn = I.translate(getMtdCommonMessage('exclusion.developers.identifier'))
      descriptionColumn = I.translate(getMtdCommonMessage('exclusion.developers.description'))
    })

    it('84318601 Verify that "Restricted developers" tab is present ', () => {
      I.findByText(developerNameColumn).should(beVisible)
      I.findByText(osColumn).should(beVisible)
      I.findByText(subjectColumn).should(beVisible)
      I.findByText(issuerColumn).should(beVisible)
      I.findByText(identifierColumn).should(beVisible)
      I.findByText(descriptionColumn).should(beVisible)

      I.findByText(addCertificateButtonText).should(beVisible).should('not.be.disabled')
      I.findByRole(ROLE_BUTTON, { name: deleteButtonText }).should(notExist)
      // other steps like '"Delete" button is placed on the right of "Add" button
    })

    it('84318611 Verify that description of "Restricted developers" page is displayed on the page ', () => {
      I.findByText(I.translate(getMtdCommonMessage('exclusion.restrictedDevelopers.description')))
    })

    it('84318613 Verify that checkbox is present on "Restricted developers" page ', () => {
      // TODO verify that all entries have checkboxes
      // I.findByRole(`cell`, { name: `select-0` }).click()
    })

    it('84318625 Verify that "OS" value is displayed as an icon ', () => {
      // TODO: verify image is displayed in each cell in the table
      // see possible approach in 'restricted-apps-spec.ts'
    })

    it('84318615 Verify that ASC/DESC sorting works correctly for "Developer name" field ', () => {
      I.interceptRestrictedCertsGet(`${SORT_BY_NAME} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(developerNameColumn).click()
        I.wait('@query')
      })
    })

    it('84318616 Verify that ASC/DESC sorting works correctly for "Subject" field ', () => {
      I.interceptRestrictedCertsGet(`${SORT_BY_SUBJECT} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(subjectColumn).click()
        I.wait('@query')
      })
    })

    it('84318617 Verify that ASC/DESC sorting works correctly for "Issuer" field ', () => {
      I.interceptRestrictedCertsGet(`${SORT_BY_ISSUER} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(issuerColumn).click()
        I.wait('@query')
      })
    })

    it('84318618 Verify that ASC/DESC sorting works correctly for "Identifier" field ', () => {
      I.interceptRestrictedCertsGet(`${SORT_BY_IDENTIFIER} ${SORT_BY_DESC}`, Fixtures.responses.list.default).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(identifierColumn).click()
        I.wait('@query')
      })
    })
  })

  describe('Verify "Manually Enter certificate" option', () => {
    let addButtonText
    let cancelButtonText

    before(() => {
      addButtonText = I.translate(getMtdCommonMessage('common.add'))
      cancelButtonText = I.translate(getMtdCommonMessage('common.cancel'))
    })
    it('84318602 Verify that "Manually enter certificate information" option is available', () => {
      clickAddManuallyOption()

      I.findByRole(ROLE_DIALOG).within(() => {
        findInputByLabelText(developerNameFieldLabelText).should(beVisible)
        I.findByText(PLATFORM_ANDROID)
        findInputByLabelText(subjectFieldLabelText).should(beVisible)
        findInputByLabelText(issuerFieldLabelText).should(beVisible)
        findInputByLabelText(identifierFieldLabelText).should(beVisible)
        findInputByLabelText(descriptionFieldLabelText).should(beVisible)

        I.findByRole(ROLE_BUTTON, { name: addButtonText }).should(beVisible)
        clickCancelButton()
      })
    })

    it('84318604 Verify that "Restricted developer certificate" can be added manually ', () => {
      clickAddManuallyOption()
      clearInputByNameAndType(developerNameFieldLabelText, 'Facebook')
      clearInputByNameAndType(subjectFieldLabelText, 'Subject')
      clearInputByNameAndType(issuerFieldLabelText, 'Facebook Inc')
      clearInputByNameAndType(identifierFieldLabelText, '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac')
      clearInputByNameAndType(descriptionFieldLabelText, 'Description of Facebook app')

      I.interceptCertificateRequest('POST', 201, Fixtures.responses.create.success).as('createSuccess')

      I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

      I.findByRole(ROLE_BUTTON, { name: addButtonText })
        .click({ force: true })
        .then(() => {
          waitForRequestAndCheckBody('@createSuccess', {
            name: FIELD_NAME_VALUE,
            description: FIELD_DESCRIPTION_VALUE,
            identifier: FIELD_IDENTIFIER_VALUE,
            issuer: FIELD_ISSUER_VALUE,
            platform: FIELD_PLATFORM_VALUE,
            source: FIELD_SOURCE_VALUE_MANUAL,
            subject: FIELD_SUBJECT_VALUE,
            tenantGuid: FIELD_TENANT_VALUE,
            type: FIELD_TYPE_VALUE_RESTRICTED,
          })

          verifyAlertMessageAndDismiss(I.translate('exclusion.developers.devCertCreateSuccessMsg'))
        })
    })

    describe('Verify fields validation', () => {
      beforeEach(() => {
        clickAddManuallyOption()
        findDialogWithHeading(addDevCertFormText)
      })

      it('84318605 Verify that "Developer name" field is required', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(subjectFieldLabelText, 'Subject')
          clearInputByNameAndType(issuerFieldLabelText, 'Facebook Inc')
          clearInputByNameAndType(identifierFieldLabelText, '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac')
          clearInputByNameAndType(descriptionFieldLabelText, 'Description of Facebook app')

          I.findByRole(ROLE_BUTTON, { name: addButtonText })
            .click({ force: true })
            .then(() => {
              verifyErrorFieldMessage(developerNameFieldLabelText, UI_REQUIRED_FIELD)
            })
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible).click({ force: true })
        })
      })

      it('84318632 Verify min/max size of "Developer name" value ', () => {
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

      it('84318606 Verify that "OS" field is required ', () => {
        // for OS field, next() is the right input
        findDialogWithHeading(addDevCertFormText).within(() => {
          I.findByText(platformFieldLabelText).findByText(FIELD_REQUIRED_SYMBOL)
          findAllInputByLabelText(platformFieldLabelText).next().should(haveValue, FIELD_PLATFORM_VALUE_ANDROID)
        })
        I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible).click({ force: true })
      })

      it('84318607 Verify that "Subject" field is NOT required', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(developerNameFieldLabelText, FIELD_NAME_VALUE)
          clearInputByNameAndType(issuerFieldLabelText, FIELD_ISSUER_VALUE)
          clearInputByNameAndType(identifierFieldLabelText, FIELD_IDENTIFIER_VALUE)
          clearInputByNameAndType(descriptionFieldLabelText, FIELD_DESCRIPTION_VALUE)
        })

        I.interceptCertificateRequest('POST', 201, Fixtures.responses.create.success).as('createSuccess')

        I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

        I.findByRole(ROLE_BUTTON, { name: addButtonText })
          .click({ force: true })
          .then(() => {
            waitForRequestAndCheckBody('@createSuccess', {
              name: FIELD_NAME_VALUE,
              description: FIELD_DESCRIPTION_VALUE,
              identifier: FIELD_IDENTIFIER_VALUE,
              issuer: FIELD_ISSUER_VALUE,
              platform: FIELD_PLATFORM_VALUE,
              source: FIELD_SOURCE_VALUE_MANUAL,
              subject: '',
              tenantGuid: FIELD_TENANT_VALUE,
              type: FIELD_TYPE_VALUE_RESTRICTED,
            })

            verifyAlertMessageAndDismiss(I.translate('exclusion.developers.devCertCreateSuccessMsg'))
          })
      })

      it('84318633 Verify max size of "Subject" value ', () => {
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

      it('84318608 Verify that "Issuer" field is required ', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(developerNameFieldLabelText, 'Facebook')
          clearInputByNameAndType(subjectFieldLabelText, 'Subject')
          clearInputByNameAndType(identifierFieldLabelText, '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac')
          clearInputByNameAndType(descriptionFieldLabelText, 'Description of Facebook app')

          I.findByRole(ROLE_BUTTON, { name: addButtonText })
            .click({ force: true })
            .then(() => {
              verifyErrorFieldMessage(issuerFieldLabelText, UI_REQUIRED_FIELD)
            })
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible).click({ force: true })
        })
      })

      it('84318634 	Verify max size of "Issuer" value ', () => {
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

      it('84318609 Verify that "Identifier" field is required ', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(developerNameFieldLabelText, 'Facebook')
          clearInputByNameAndType(subjectFieldLabelText, 'Subject')
          clearInputByNameAndType(issuerFieldLabelText, 'Facebook Inc')
          clearInputByNameAndType(descriptionFieldLabelText, 'Description of Facebook app')

          I.findByRole(ROLE_BUTTON, { name: addButtonText })
            .click({ force: true })
            .then(() => {
              verifyErrorFieldMessage(identifierFieldLabelText, UI_REQUIRED_FIELD)
            })
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible).click({ force: true })
        })
      })

      it('84318635 Verify min/max size of "Identifier" value ', () => {
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

      it('84318622 Verify that certificate can not be manually added with already existing "identifier" value and Platform to the "Restricted developers" list ', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(developerNameFieldLabelText, 'Facebook')
          clearInputByNameAndType(subjectFieldLabelText, 'Subject')
          clearInputByNameAndType(identifierFieldLabelText, '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac')
          clearInputByNameAndType(issuerFieldLabelText, 'Facebook Inc')
          clearInputByNameAndType(descriptionFieldLabelText, 'Description of Facebook app')

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
          type: FIELD_TYPE_VALUE_RESTRICTED,
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

      it('84318610 Verify that "Description" field is NOT required ', () => {
        findDialogWithHeading(addDevCertFormText).within(() => {
          clearInputByNameAndType(developerNameFieldLabelText, 'Facebook')
          clearInputByNameAndType(subjectFieldLabelText, 'Subject')
          clearInputByNameAndType(issuerFieldLabelText, 'Facebook Inc')
          clearInputByNameAndType(identifierFieldLabelText, '2b 7a 60 11 7a 1c ff 00 ba 17 80 ac')
        })

        I.interceptCertificateRequest('POST', 201, Fixtures.responses.create.success).as('createSuccess')

        I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

        I.findByRole(ROLE_BUTTON, { name: addButtonText })
          .click({ force: true })
          .then(() => {
            waitForRequestAndCheckBody('@createSuccess', {
              name: FIELD_NAME_VALUE,
              description: '',
              identifier: FIELD_IDENTIFIER_VALUE,
              issuer: FIELD_ISSUER_VALUE,
              platform: FIELD_PLATFORM_VALUE,
              source: FIELD_SOURCE_VALUE_MANUAL,
              subject: FIELD_SUBJECT_VALUE,
              tenantGuid: FIELD_TENANT_VALUE,
              type: FIELD_TYPE_VALUE_RESTRICTED,
            })

            verifyAlertMessageAndDismiss(I.translate('exclusion.developers.devCertCreateSuccessMsg'))
          })
      })

      it('84318636 Verify min/max size of "Description" value ', () => {
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

          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible).click({ force: true })
        })
      })
    })
  })

  describe('Verify "Select app for certificate information" option', () => {
    let selectAppForCertificateInformationListOptionText
    before(() => {
      selectAppForCertificateInformationListOptionText = I.translate(getMtdCommonMessage('exclusion.developers.addViaSelect'))
    })
    it('84318603 Verify that "Select an app for certificate information" option is present for "Restricted developers"', () => {
      I.findByText(addCertificateButtonText)
        .click({ force: true })
        .then(() => {
          I.findByText(selectAppForCertificateInformationListOptionText)
            .should(beVisible)
            .click()
            .then(() => {
              I.findByText(I.translate('common.close')).click({ force: true })
            })
        })
    })
  })

  describe('Test cases for "Delete" action', () => {
    it('84318612 Verify that one or several certificates can be deleted from Restricted developers list ', () => {
      I.findByRole(`cell`, { name: `select-0` }).click()

      I.findByRole(ROLE_BUTTON, { name: deleteButtonText })
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG).within(() => {
            I.findByText(I.translate('exclusion.deleteConfirmation')).should(beVisible)

            const deleteConfMessage = I.translate(getMtdCommonMessage('exclusion.deleteConfirmationMsg'), {
              entities: I.translate(getMtdCommonMessage('exclusion.entitiesCertsLowerCase')),
            })
            I.findByText(deleteConfMessage).should(beVisible)
            I.findByText(CertFaceBookRestricted.name).should(beVisible)
            I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible)

            I.interceptCertificateRequest('DELETE', 200, '').as('deleteSuccess')
            I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

            I.findByRole(ROLE_BUTTON, { name: deleteButtonText })
              .click({ force: true })
              .then(() => {
                waitForRequestAndCheckBody('@deleteSuccess', [FacebookCert.guid])
              })
          })

          const certDeletedMessage = I.translate(getMtdCommonMessage('exclusion.singleDeleteSuccessMsg'), {
            entity: I.translate(getMtdCommonMessage('exclusion.entityCertLowerCase')),
          })
          verifyAlertMessageAndDismiss(certDeletedMessage)
        })
    })

    it.skip('84318614 Verify that "Remove" button works correctly according to checked boxes ', () => {
      // TODO: verify behavior of the Remove button when clicking several times on checkboxes
    })
  })

  describe('Test Cases for Edit action', () => {
    it('84318620 Verify that manually added сertificate can be edited ', () => {
      // 84318631 Verify that 'The developer certificate was edited.' success toast is shown when changes were successfully saved
      I.findByText(CertFaceBookRestricted.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.restrictedDevelopers.editFormName')).should(beVisible)

              findInputByLabelText(developerNameFieldLabelText)
                .should(haveValue, CertFaceBookRestricted.name)
                .clear()
                .type(aNewValue)
              findAllInputByLabelText(platformFieldLabelText).next().should(haveValue, CertFaceBookRestricted.platform)
              findInputByLabelText(subjectFieldLabelText).should(haveValue, CertFaceBookRestricted.subject).clear().type(aNewValue)
              findInputByLabelText(issuerFieldLabelText).should(haveValue, CertFaceBookRestricted.issuer).clear().type(aNewValue)
              findInputByLabelText(identifierFieldLabelText)
                .should(haveValue, CertFaceBookRestricted.identifier)
                .clear()
                .type(MOCK_IDENTIFIER_FOR_EDIT)
              findInputByLabelText(descriptionFieldLabelText)
                .should(haveValue, 'Lorem Ipsum is simply dummy text of the printing some other')
                .clear()
                .type(aNewValue)

              I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible)

              I.interceptRestrictedCertsGet(SORT_BY_DEFAULT, Fixtures.responses.list.default).as('initialCerts')

              I.intercept('PUT', '**/api/mtd/v1/mtd-exclusion/certificate/' + FacebookCert.guid, req => {
                req.reply(201, Fixtures.responses.create.success)
              }).as('updateSuccess')

              I.findByRole(ROLE_BUTTON, { name: saveButtonText })
                .should(beVisible)
                .click({ force: true })
                .then(() => {
                  waitForRequestAndCheckBody('@updateSuccess', {
                    name: aNewValue,
                    guid: FacebookCert.guid,
                    description: aNewValue,
                    identifier: MOCK_IDENTIFIER_FOR_EDIT,
                    issuer: aNewValue,
                    platform: FacebookCert.platform,
                    source: FIELD_SOURCE_VALUE_MANUAL,
                    subject: aNewValue,
                    tenantGuid: FIELD_TENANT_VALUE,
                    type: FIELD_TYPE_VALUE_RESTRICTED,
                  })
                })
            })
          verifyAlertMessageAndDismiss(I.translate('exclusion.developers.devCertEditSuccessMsg'))
        })
    })

    it('84318621 Verify that editing of manually added certificate can be canceled ', () => {
      I.findByText(CertFaceBookRestricted.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.restrictedDevelopers.editFormName')).should(beVisible)

              findInputByLabelText(developerNameFieldLabelText)
                .should(haveValue, CertFaceBookRestricted.name)
                .clear()
                .type(aNewValue)
              findAllInputByLabelText(platformFieldLabelText).next().should(haveValue, CertFaceBookRestricted.platform)
              findInputByLabelText(subjectFieldLabelText).should(haveValue, CertFaceBookRestricted.subject).clear().type(aNewValue)
              findInputByLabelText(issuerFieldLabelText).should(haveValue, CertFaceBookRestricted.issuer).clear().type(aNewValue)
              findInputByLabelText(identifierFieldLabelText)
                .should(haveValue, CertFaceBookRestricted.identifier)
                .clear()
                .type(MOCK_IDENTIFIER_FOR_EDIT)
              findInputByLabelText(descriptionFieldLabelText)
                .should(haveValue, 'Lorem Ipsum is simply dummy text of the printing some other')
                .clear()
                .type('hello descr')
              I.findByRole(ROLE_BUTTON, { name: saveButtonText }).should(beVisible)
            })
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText })
            .should(beVisible)
            .click({ force: true })
            .then(() => {
              getAlert().should(notExist)
            })
        })
    })
  })
})
