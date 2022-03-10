import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'

import {
  aNewValue,
  beVisible,
  clearInputByName,
  clearInputByNameAndType,
  clickAddButtonByName,
  exist,
  FacebookRestricted,
  FIELD_MAX_256,
  FIELD_MAX_2048,
  FIELD_PLATFORM_VALUE_ANDROID,
  FIELD_REQUIRED_SYMBOL,
  FIELD_SOURCE_VALUE_MANUAL,
  FIELD_TENANT_VALUE,
  FIELD_TYPE_VALUE_RESTRICTED,
  FIELD_VALUE_257_CHARS,
  FIELD_VALUE_2049_CHARS,
  fieldDescriptionForUpdate,
  fieldVendorForUpdate,
  findAllInputByLabelText as findAllInputByLabelStart,
  findDialogWithHeading,
  findInputByLabelText as findInputByLabelStart,
  findInputByLabelText,
  getAlert,
  getMtdCommonMessage,
  haveValue,
  include,
  MOCK_APP_HASH_FOR_EDIT,
  notExist,
  ROLE_BUTTON,
  ROLE_DIALOG,
  selectItemFromAddEntityOptionList,
  verifyAlertMessageAndDismiss,
  verifyErrorFieldMessage,
  verifyErrorFieldMessageAbsent,
} from '../support/constants'

let addAppButtonText
let addRestrictedAppLabelText
let addManuallyListOption
let addButtonText, cancelButtonText
let UI_REQUIRED_FIELD
let restrictedAppsString, restrictedAppsTitle
let nameColumn, vendorColumn, versionColumn

const FIELD_APP_NAME_VALUE_ANY = 'Some app name'
const FIELD_VENDOR_VALUE_ANY = 'Some vendor name'
const FIELD_VERSION_VALUE_ANY = '2.0.0.1'

const SORTBY_NAME = 'name'
const SORTBY_VENDOR_NAME = 'vendorName'
const SORTBY_VERSION = 'version'
const DESC = 'desc'

const Fixtures = require('../fixtures/restricted-apps.json')

const clickAddManuallyOption = () => {
  selectItemFromAddEntityOptionList(addAppButtonText, addManuallyListOption, addRestrictedAppLabelText)
}

const clickCancelOnAddManuallyForm = () => {
  I.findByRole(ROLE_BUTTON, { name: cancelButtonText })
    .click({ force: true })
    .then(() => {
      getAlert().should(notExist)
    })
}

const openRestrictedAppsTab = () => {
  I.findByText(restrictedAppsString)
    .click({ force: true })
    .then(() => {
      I.url().should(include, `#/settings/global-list/restricted/apps`)
      I.findByText(restrictedAppsTitle).should(beVisible)
    })
}

const interceptGet = (sortBy, direction) => {
  return I.intercept(
    {
      pathname: '**/api/mtd/v1/mtd-exclusion/application',
      query: {
        max: '25',
        offset: '0',
        query: 'type=RESTRICTED',
        sortBy: `${sortBy} ${direction}`,
      },
    },
    req => {
      req.reply(200, Fixtures.responses.list.empty)
    },
  )
}

const clickAddButton = thenFunction => {
  clickAddButtonByName(addButtonText, thenFunction)
}

describe('MTD-3104: Admin - UES Console - UI for Application Blacklist', () => {
  let appNameLabelText
  let osFieldLabelText
  let vendorFieldLabelText
  let versionFieldLabelText
  let hashFieldLabelText
  let descriptionFieldLabelText
  before(() => {
    I.loadI18nNamespaces('mtd/common', 'components', 'general/form').then(() => {
      restrictedAppsString = I.translate(getMtdCommonMessage('exclusion.restrictedApps.itemName'))
      restrictedAppsTitle = I.translate(getMtdCommonMessage('exclusion.restrictedApps.title'))
      addRestrictedAppLabelText = I.translate(getMtdCommonMessage('exclusion.restrictedApps.addFormName'))

      addAppButtonText = I.translate(getMtdCommonMessage('exclusion.apps.addApp'))
      addManuallyListOption = I.translate(getMtdCommonMessage('exclusion.apps.addManually'))

      addButtonText = I.translate(getMtdCommonMessage('common.add'))
      cancelButtonText = I.translate(getMtdCommonMessage('common.cancel'))
      UI_REQUIRED_FIELD = I.translate(getMtdCommonMessage('exclusion.form.requiredField'))

      appNameLabelText = I.translate(getMtdCommonMessage('exclusion.apps.name'))
      osFieldLabelText = I.translate(getMtdCommonMessage('exclusion.apps.os'))
      vendorFieldLabelText = I.translate(getMtdCommonMessage('exclusion.apps.vendor'))
      versionFieldLabelText = I.translate(getMtdCommonMessage('exclusion.apps.version'))
      hashFieldLabelText = I.translate(getMtdCommonMessage('exclusion.apps.hashValue'))
      descriptionFieldLabelText = I.translate(getMtdCommonMessage('exclusion.apps.description'))

      nameColumn = I.translate(getMtdCommonMessage('exclusion.apps.name'))
      vendorColumn = I.translate(getMtdCommonMessage('exclusion.apps.vendor'))
      versionColumn = I.translate(getMtdCommonMessage('exclusion.apps.version'))
    })
  })

  describe('Verify UI using mock data', () => {
    before(() => {
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.ExclusionIosRestricted, 'true')

      I.visit(`#/settings/global-list`)
      I.url().should(include, `#/settings/global-list/restricted/developers`)

      openRestrictedAppsTab()
    })
    describe('Test Cases to verify basic options of Restricted Apps list', () => {
      let osColumn, hashColumn, descriptionColumn

      before(() => {
        osColumn = I.translate(getMtdCommonMessage('exclusion.apps.os'))
        hashColumn = I.translate(getMtdCommonMessage('exclusion.apps.hashValue'))
        descriptionColumn = I.translate(getMtdCommonMessage('exclusion.apps.description'))
      })
      it('84221310 Verify that "Restricted apps" page is present under Restricted tab ', () => {
        //Verify that Check boxes in the list
        I.findByText(nameColumn).should(beVisible)
        I.findByText(osColumn).should(beVisible)
        I.findByText(vendorColumn).should(beVisible)
        I.findByText(versionColumn).should(beVisible)
        I.findByText(hashColumn).should(beVisible)
        I.findByText(descriptionColumn).should(beVisible)

        //Verify that the 'Add app' button is present
        I.findByText(addAppButtonText).should(beVisible)

        //Verify that the 'Export' button is present
        I.findByRole(ROLE_BUTTON, { name: I.translate('general/form:commonLabels.export') }).should(beVisible)
      })

      it('84221322 Verify that description of "Restricted apps" page is displayed on the page', () => {
        I.findByText(I.translate(getMtdCommonMessage('exclusion.restrictedApps.description')))
      })

      it('84221340 Verify that "OS" value is displayed as an icon ', () => {
        // TODO find a way to search for columns using custom methods in 'cypress.d.ts'
        /*
        I.findAllByRole(`row`)
          .get(`[aria-rowindex=0]`)
          .within(() => {
            I.get('div[role=gridcell][aria-colindex=2]').find('svg').should(beVisible)
          })
          */
      })
    })

    describe('Test cases to check "Manually Enter Certificate Information" option', () => {
      it('84221311 Verify that "Manually enter certificate information" option is available ', () => {
        clickAddManuallyOption()
        I.findByRole(ROLE_DIALOG).within(() => {
          //Verify that "App name" field is present
          findInputByLabelStart(appNameLabelText).should(beVisible)
          //Verify that "Vendor" field is present
          findInputByLabelStart(vendorFieldLabelText).should(beVisible)
          //Verify that "Version" field is present
          findInputByLabelStart(versionFieldLabelText).should(beVisible)
          //Verify that "Hash value" field is present
          findInputByLabelStart(hashFieldLabelText).should(beVisible)
          //Verify that "Description" field is present
          findInputByLabelStart(descriptionFieldLabelText).should(beVisible)
          // Verify Add/Cancel buttons present
          I.findByRole(ROLE_BUTTON, { name: addButtonText }).should(beVisible)
          I.findByRole(ROLE_BUTTON, { name: cancelButtonText }).should(beVisible)

          clickCancelOnAddManuallyForm()
        })
      })

      describe('Verify validation', () => {
        afterEach(() => {
          clickCancelOnAddManuallyForm()
        })

        beforeEach(() => {
          clickAddManuallyOption()
        })

        it('84221315 Verify that "App name" field is required', () => {
          // Fill all the fields except of "App name"
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(versionFieldLabelText, fieldVendorForUpdate)
            clearInputByNameAndType(versionFieldLabelText, '1.0')
            clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)
            clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

            clickAddButton(() => {
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84311607 Verify min/max size of "App name" value ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(appNameLabelText, 'F')
            clearInputByName(vendorFieldLabelText)

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(appNameLabelText)
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
            })

            clearInputByNameAndType(appNameLabelText, FIELD_VALUE_257_CHARS)

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(appNameLabelText)
              findInputByLabelText(appNameLabelText)
                .invoke('val')
                .then(text => {
                  expect(text.length).is.eq(FIELD_MAX_256)
                })
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84221316 Verify that "OS" field is required ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            I.findByText(osFieldLabelText).findByText(FIELD_REQUIRED_SYMBOL)
            // for OS field, next() is the right input
            findAllInputByLabelStart(osFieldLabelText).next().should(haveValue, FIELD_PLATFORM_VALUE_ANDROID)
          })
        })

        it('84221318 Verify that "Vendor" field is required', () => {
          // Fill all the fields except of "Vendor"
          clearInputByNameAndType(appNameLabelText, 'Facebook')
          clearInputByName(vendorFieldLabelText)
          clearInputByNameAndType(versionFieldLabelText, '1.0')
          clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)
          clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clickAddButton(() => {
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84318594 Verify min/max size of "Vendor" value ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(vendorFieldLabelText, 'F')

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(vendorFieldLabelText)
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })

            clearInputByNameAndType(vendorFieldLabelText, FIELD_VALUE_257_CHARS)

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(vendorFieldLabelText)
              findInputByLabelText(vendorFieldLabelText)
                .invoke('val')
                .then(text => {
                  expect(text.length).is.eq(FIELD_MAX_256)
                })
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84221319 Verify that "Version" field is required', () => {
          // Fill all the fields except of "Version"
          clearInputByNameAndType(appNameLabelText, 'Facebook')
          clearInputByNameAndType(vendorFieldLabelText, fieldVendorForUpdate)
          clearInputByName(versionFieldLabelText)
          clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)
          clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clickAddButton(() => {
              verifyErrorFieldMessage(versionFieldLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84311608 Verify min/max size of "Version" value ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(versionFieldLabelText, 'F')

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(versionFieldLabelText)
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
            })

            clearInputByNameAndType(versionFieldLabelText, FIELD_VALUE_257_CHARS)

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(versionFieldLabelText)
              findInputByLabelText(versionFieldLabelText)
                .invoke('val')
                .then(text => {
                  expect(text.length).is.eq(FIELD_MAX_256)
                })
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84221320 Verify that "Hash value" field is required ', () => {
          // Fill all the fields except of "Version"
          clearInputByNameAndType(appNameLabelText, 'Facebook')
          clearInputByNameAndType(vendorFieldLabelText, fieldVendorForUpdate)
          clearInputByNameAndType(versionFieldLabelText, '1.0')
          clearInputByName(hashFieldLabelText)
          clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clickAddButton(() => {
              verifyErrorFieldMessage(hashFieldLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84311609 Verify min/max size of "Hash" value ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(hashFieldLabelText, FIELD_VALUE_257_CHARS)

            clickAddButton(() => {
              verifyErrorFieldMessage(
                hashFieldLabelText,
                I.translate(getMtdCommonMessage('exclusion.apps.applicationHashErrorMsg')),
              )
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84221321 Verify that "Description" field is NOT required', () => {
          // Fill all the fields except of "Description"
          clearInputByNameAndType(appNameLabelText, 'Facebook')
          clearInputByNameAndType(versionFieldLabelText, '1.0')
          // clear 2 fields to verify that 1 field required and description is not
          clearInputByName(vendorFieldLabelText)
          clearInputByName(hashFieldLabelText)
          clearInputByName(descriptionFieldLabelText)

          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clickAddButton(() => {
              verifyErrorFieldMessage(vendorFieldLabelText, UI_REQUIRED_FIELD)
              verifyErrorFieldMessage(hashFieldLabelText, UI_REQUIRED_FIELD)

              I.findByText(descriptionFieldLabelText).next().next('p').should(notExist)
            })
          })
        })

        it('84311610 Verify min/max size of "Description" value ', () => {
          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clearInputByNameAndType(descriptionFieldLabelText, 'F')

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(descriptionFieldLabelText)
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })

            clearInputByNameAndType(descriptionFieldLabelText, FIELD_VALUE_2049_CHARS)

            clickAddButton(() => {
              verifyErrorFieldMessageAbsent(descriptionFieldLabelText)
              findInputByLabelText(descriptionFieldLabelText)
                .invoke('val')
                .then(text => {
                  expect(text.length).is.eq(FIELD_MAX_2048)
                })
              verifyErrorFieldMessage(appNameLabelText, UI_REQUIRED_FIELD)
            })
          })
        })

        it('84221323 Verify "hash" value can be specified in SHA256 format only', () => {
          //it('Specify "hash" value not in SHA 256 format', () => {
          clearInputByNameAndType(appNameLabelText, 'Facebook')
          clearInputByNameAndType(vendorFieldLabelText, fieldVendorForUpdate)
          clearInputByNameAndType(versionFieldLabelText, '1.0')
          clearInputByNameAndType(hashFieldLabelText, 'IncorrectHash')
          clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

          findDialogWithHeading(addRestrictedAppLabelText).within(() => {
            clickAddButton(() => {
              I.findByText(I.translate('exclusion.apps.applicationHashErrorMsg')).should(beVisible)
            })
          })
        })
      })

      it('84221314 Verify that Restricted app can be added manually', () => {
        clickAddManuallyOption()

        I.findByRole(ROLE_DIALOG).within(() => {
          // Specify "App name" value
          I.findByText(appNameLabelText).should(exist)
          clearInputByNameAndType(appNameLabelText, FIELD_APP_NAME_VALUE_ANY)
          // Specify "OS" value
          I.findByText(osFieldLabelText).should(exist)

          // Specify "Vendor"
          I.findByText(vendorFieldLabelText).should(exist)
          clearInputByNameAndType(vendorFieldLabelText, FIELD_VENDOR_VALUE_ANY)

          // Specify "Version"
          I.findByText(versionFieldLabelText).should(exist)
          clearInputByNameAndType(versionFieldLabelText, FIELD_VERSION_VALUE_ANY)

          // Specify "Hash value"
          I.findByText(hashFieldLabelText).should(exist)
          clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)

          // Specify "Description"
          I.findByText(descriptionFieldLabelText).should(exist)
          clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

          clickAddButton(() => {})
        })
        verifyAlertMessageAndDismiss(I.translate('exclusion.apps.applicationCreateSuccessMsg'))
      })

      it('82281348 Verify that addition of Restricted app can be canceled during manual addition of app ', () => {
        clickAddManuallyOption()

        // Specify "App name" value
        clearInputByNameAndType(appNameLabelText, 'Facebook')

        // Specify "OS" value
        // OS cannot be specified for this step as combobox is disabled

        // Specify "Vendor"
        clearInputByNameAndType(vendorFieldLabelText, fieldVendorForUpdate)

        // Specify "Version"
        clearInputByNameAndType(versionFieldLabelText, '1.0')

        // Specify "Hash value"
        clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)

        // Specify "Description"
        clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

        // Click on "Cancel" button
        clickCancelOnAddManuallyForm()
      })
    })

    it('Verify that "Select an app for certificate information" option is present for "Restricted apps"', () => {
      // Click on 'Add app' button
      I.findByText(addAppButtonText)
        .click({ force: true })
        .then(() => {
          I.findByText(I.translate('exclusion.apps.addViaSelect'))
            .should(beVisible)
            .click()
            .then(() => {
              I.findByText(I.translate('common.close')).click({ force: true })
            })
        })
    })

    describe('Test cases for "Delete" action', () => {
      it('84221324 Verify that one or several apps can be deleted from Restricted apps list', () => {
        // Check the box for one app
        I.findByRole(`cell`, { name: `select-0` }).click()

        // Click on "Delete" button
        I.findByRole(ROLE_BUTTON, { name: 'Delete' })
          .click({ force: true })
          .then(() => {
            I.findByRole(ROLE_DIALOG).within(() => {
              I.findByText(I.translate('exclusion.deleteConfirmation')).should(beVisible)

              const deleteConfMessage = I.translate(getMtdCommonMessage('exclusion.deleteConfirmationMsg'), {
                entities: I.translate(getMtdCommonMessage('exclusion.entitiesAppsLowerCase')),
              })
              I.findByText(deleteConfMessage).should(beVisible)
              I.findByText(FacebookRestricted.name).should(beVisible)
              I.findByRole(ROLE_BUTTON, { name: 'Cancel' }).should(beVisible)

              I.findByRole(ROLE_BUTTON, { name: 'Delete' }).click({ force: true })
            })
            const appDeletedMessage = I.translate(getMtdCommonMessage('exclusion.singleDeleteSuccessMsg'), {
              entity: I.translate(getMtdCommonMessage('exclusion.entityAppLowerCase')),
            })
            verifyAlertMessageAndDismiss(appDeletedMessage)
          })
      })
    })

    it('84221331 Verify that manually added app can be edited', () => {
      I.findByText(FacebookRestricted.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.restrictedApps.editFormName')).should(beVisible)

              findInputByLabelStart(appNameLabelText).should(haveValue, FacebookRestricted.name).clear().type(aNewValue)
              // for OS Combobox, next() element is the input
              findAllInputByLabelStart(osFieldLabelText).next().should(haveValue, FacebookRestricted.platform)
              findInputByLabelStart(vendorFieldLabelText).should(haveValue, FacebookRestricted.vendorName).clear().type(aNewValue)
              findInputByLabelStart(versionFieldLabelText).should(haveValue, FacebookRestricted.version).clear().type(aNewValue)
              findInputByLabelStart(hashFieldLabelText)
                .should(haveValue, FacebookRestricted.hash)
                .clear()
                .type(MOCK_APP_HASH_FOR_EDIT)
              findInputByLabelStart(descriptionFieldLabelText)
                .should(haveValue, FacebookRestricted.description)
                .clear()
                .type('hello descr')

              I.findByRole(ROLE_BUTTON, { name: 'Cancel' }).should(beVisible)

              I.findByRole(ROLE_BUTTON, { name: 'Save' }).should(beVisible).click({ force: true })
            })
          verifyAlertMessageAndDismiss(I.translate('exclusion.apps.applicationEditSuccessMsg'))
        })
    })

    it('84221332 Verify that editing of manually added app can be canceled ', () => {
      I.findByText(FacebookRestricted.name)
        .should(beVisible)
        .click({ force: true })
        .then(() => {
          I.findByRole(ROLE_DIALOG)
            .should(beVisible)
            .within(() => {
              I.findByText(I.translate('exclusion.restrictedApps.editFormName')).should(beVisible)
              findInputByLabelStart(appNameLabelText).should(haveValue, FacebookRestricted.name).clear().type(aNewValue)
              // OS combobox has input as next() element
              findAllInputByLabelStart(osFieldLabelText).next().should(haveValue, FacebookRestricted.platform)
              findInputByLabelStart(vendorFieldLabelText).should(haveValue, FacebookRestricted.vendorName).clear().type(aNewValue)
              findInputByLabelStart(versionFieldLabelText).should(haveValue, '1.2.2').clear().type(aNewValue)
              findInputByLabelStart(hashFieldLabelText)
                .should(haveValue, FacebookRestricted.hash)
                .clear()
                .type(MOCK_APP_HASH_FOR_EDIT)

              findInputByLabelStart(descriptionFieldLabelText)
                .should(haveValue, FacebookRestricted.description)
                .clear()
                .type('hello descr')

              I.findByRole(ROLE_BUTTON, { name: 'Save' }).should(beVisible)

              I.findByRole(ROLE_BUTTON, { name: 'Cancel' })
                .should(beVisible)
                .click({ force: true })
                .then(() => {
                  getAlert().should(notExist)
                })
            })
        })
    })

    it('84221336 Verify that "OS" value cannot be changed for manually added apps ', () => {
      // TODO: find an approach to make sure Combobox is not editable
    })
  })

  describe('Verify UI using interceptions', () => {
    before(() => {
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      I.intercept(
        {
          method: 'GET',
          url: '**/api/mtd/v1/mtd-exclusion/application*',
        },
        Fixtures.responses.list.empty,
      ).as('initialApps')

      I.visit('#/settings/global-list/restricted/apps').then(() => {
        I.wait(['@initialApps'])
        I.findByText(restrictedAppsTitle).should(beVisible)
      })
    })

    it('84221327 Verify that ASC/DESC sorting works correctly for "Name" field ', () => {
      interceptGet(SORTBY_NAME, DESC).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(nameColumn).click()
        I.wait('@query')
      })
    })

    it('84221328 Verify that ASC/DESC sorting works correctly for "Vendor" field', () => {
      interceptGet(SORTBY_VENDOR_NAME, DESC).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(vendorColumn).click()
        I.wait('@query')
      })
    })

    it('84221330 Verify that sorting by Version works correctly', () => {
      interceptGet(SORTBY_VERSION, DESC).as('query')

      I.findByLabelText('infinite-table').within(() => {
        I.findByText(versionColumn).click()
        I.wait('@query')
      })
    })

    it('84221335 	Verify that app can not be manually added with already existing "hash" value to the "Restricted apps" list ', () => {
      // The same test case based on 409-Conflict response: 84240756 Verify that duplicate cannot be added to the Restricted app list
      clickAddManuallyOption()

      I.findByRole(ROLE_DIALOG).within(() => {
        // Specify "App name" value
        I.findByText(appNameLabelText).should(exist)
        clearInputByNameAndType(appNameLabelText, FIELD_APP_NAME_VALUE_ANY)
        // Specify "OS" value
        I.findByText(osFieldLabelText).should(exist)

        // Specify "Vendor"
        I.findByText(vendorFieldLabelText).should(exist)
        clearInputByNameAndType(vendorFieldLabelText, FIELD_VENDOR_VALUE_ANY)

        // Specify "Version"
        I.findByText(versionFieldLabelText).should(exist)
        clearInputByNameAndType(versionFieldLabelText, FIELD_VERSION_VALUE_ANY)

        // Specify "Hash value"
        I.findByText(hashFieldLabelText).should(exist)
        clearInputByNameAndType(hashFieldLabelText, MOCK_APP_HASH_FOR_EDIT)

        // Specify "Description"
        I.findByText(descriptionFieldLabelText).should(exist)
        clearInputByNameAndType(descriptionFieldLabelText, fieldDescriptionForUpdate)

        I.intercept('POST', '**/api/mtd/v1/mtd-exclusion/application', req => {
          req.reply(409, Fixtures.responses.create.duplicateHash)
        }).as('duplicateHash')

        clickAddButton(() => {})
      })
      I.wait('@duplicateHash')
        .its('request.body')
        .then(body => {
          expect(body).to.deep.equals({
            name: FIELD_APP_NAME_VALUE_ANY,
            vendorName: FIELD_VENDOR_VALUE_ANY,
            version: FIELD_VERSION_VALUE_ANY,
            hash: MOCK_APP_HASH_FOR_EDIT,
            description: fieldDescriptionForUpdate,
            platform: FIELD_PLATFORM_VALUE_ANDROID,
            source: FIELD_SOURCE_VALUE_MANUAL,
            tenantGuid: FIELD_TENANT_VALUE,
            type: FIELD_TYPE_VALUE_RESTRICTED,
          })
        })
      I.findByText(I.translate(getMtdCommonMessage('exclusion.apps.duplicateAppErrorMsg')))
        .parent()
        .invoke('attr', 'role')
        .should('equal', 'alert')
      // TODO: find out why 'getAlert()' can't find alert, but findByText() does
      // verifyAlertMessageAndDismiss(I.translate(getMtdCommonMessage('exclusion.apps.duplicateAppErrorMsg')))
    })
  })
})
