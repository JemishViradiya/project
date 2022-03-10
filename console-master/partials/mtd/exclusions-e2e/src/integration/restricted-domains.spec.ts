import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'

import {
  beDisabled,
  beEnabled,
  beVisible,
  equal,
  EXPORT_FILENAME_PREFIX,
  getDownloadedFilePath,
  getDownloadFolderPath,
  haveAttr,
  include,
  required,
  RESTRICTED_DOMAINS_UI_URL,
  waitForRequestAndCheckBody,
  WEB_ADDRESS_API_URL,
} from '../support/constants'
import {
  ADDRESS_TYPE_HOST,
  DeleteConfirmation,
  DomainForm,
  DomainPage,
  ExportConfirmation,
  ImportDialog,
  MOCK_TENANT_ID,
  TYPE_RESTRICTED,
} from '../support/util-domains'

// load mock data from fixtures
const TD = require('../fixtures/restricted-domains.json')

// test cases set from https://testrail.rim.net//index.php?/runs/view/113503&group_by=cases:section_id&group_order=asc
describe('Restricted domains e2e test suite ', () => {
  context('Verify that Restricted domain navigation works', () => {
    let restrictedDomainsText: string

    before(() => {
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      I.loadI18nNamespaces('mtd/common').then(() => {
        restrictedDomainsText = I.translate('exclusion.restrictedDomains.itemName')
        I.visit('#/settings/global-list')
      })
    })

    it('Should load restricted domains list', () => {
      // default tab should be opened by default
      I.url().should(include, `#/settings/global-list/restricted/developers`)
      // open restricted domains tab
      I.findByText(restrictedDomainsText).click({ force: true })
      I.url().should(include, `#/settings/global-list/restricted/domains`)
    })
  })

  context('T516682094 - Verify that sorting works correctly on the Restricted Domains screen', () => {
    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Table header column "domain" has sortable button', () => {
      DomainPage.findSortByDomain().should(beVisible)
    })

    it('Check sorted field in request query with desc order', () => {
      I.interceptRestrictedDomainsGet('value desc', TD.responses.GET.success2Items).as('sortedDescSearchDomain')
      // once @sortedDescSearchDomain finished it means that sorting by 'value desc' has been applied in server request
      DomainPage.findSortByDomain().should(beVisible).click({ force: true }).wait('@sortedDescSearchDomain')
    })

    it('Check sorted field in request query with asc order', () => {
      I.interceptRestrictedDomainsGet('value asc', TD.responses.GET.success2Items).as('sortedAscSearchDomain')
      // once @sortedAscSearchDomain finished it means that sorting by 'value asc' has been applied in server request
      DomainPage.findSortByDomain().should(beVisible).click({ force: true }).wait('@sortedAscSearchDomain')
    })
  })

  context('T516682243 - Verify that Restricted domain can be created', () => {
    let domainCreateSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainCreateSuccessMsg = I.translate('exclusion.domains.domainCreateSuccessMsg')
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Verify disabled add button when empty inputs', () => {
      DomainPage.findAddManuallyOption().should(beVisible).click({ force: true })
      DomainForm.findAddButton().should(beDisabled)
    })

    it('Fill form with valid values', () => {
      DomainForm.findAddressField().should(beEnabled).type(TD.validDomain1.domainAddress).should(haveAttr, required)
      DomainForm.findDescriptionField().should(beEnabled).type(TD.validDomain1.description)
    })

    it('Submit form and check success toast', () => {
      I.intercept('POST', WEB_ADDRESS_API_URL, req => {
        req.reply(200, TD.responses.POST.successBody)
      }).as('createDomainSuccess')
      // please call .wait(delay) before .click to allow intercept take in action, otherwise some unstable behaviour observed
      DomainForm.findAddButton()
        .should(beEnabled)
        .wait(2000)
        .click({ force: true })
        .wait('@createDomainSuccess')
        .its('request.body')
        .then(body => {
          expect(body).to.deep.equals({
            addressType: ADDRESS_TYPE_HOST,
            description: TD.validDomain1.description,
            name: TD.validDomain1.description,
            tenantGuid: MOCK_TENANT_ID,
            type: TYPE_RESTRICTED,
            value: TD.validDomain1.domainAddress,
          })
        })
      DomainPage.verifyAndCloseAlertMessage(domainCreateSuccessMsg)
    })
  })

  context('T516682244 - Verify that one Restricted domain can be deleted', () => {
    let domainDeleteSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainDeleteSuccessMsg = I.translate('exclusion.singleDeleteSuccessMsg', {
          entity: I.translate('exclusion.entityDomainLowerCase'),
        })
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Delete one and verify request', () => {
      I.intercept('DELETE', WEB_ADDRESS_API_URL, req => {
        req.reply(200, TD.responses.DELETE.deleteSingleResponseSuccess)
      }).as('deleteDomainSuccess')

      I.findByLabelText('infinite-table').should(beVisible)
      DomainPage.selectFirstNRows(1)
      DomainPage.findDeleteButton().should(beEnabled).click()
      DeleteConfirmation.findDeleteButton().should(beEnabled).wait(2000).click()
      I.wait('@deleteDomainSuccess')
        .its('request.body')
        .then(body => {
          expect(body).to.deep.equals(TD.responses.DELETE.deleteSingleRequestBody)
        })
      DomainPage.verifyAndCloseAlertMessage(domainDeleteSuccessMsg)
    })
  })

  context('T516682245 - Verify that Restricted domain can be edited', () => {
    let domainEditSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainEditSuccessMsg = I.translate('exclusion.domains.domainEditSuccessMsg')
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Edit and verify request', () => {
      I.intercept('PUT', `${WEB_ADDRESS_API_URL}/${TD.responses.GET.success2Items.elements[0].guid}`, req => {
        req.reply(200, TD.responses.PUT.editResponseSuccess)
      }).as('editDomainSuccess')

      I.findByLabelText('infinite-table').should(beVisible)
      DomainPage.findDomainValueLinkByText(TD.responses.GET.success2Items.elements[0].value).click()

      DomainForm.findSaveButton().should(beDisabled) // by default button disabled until we change some fields
      DomainForm.findAddressField().should(beEnabled).clear().type(TD.validDomain1.domainAddress)
      DomainForm.findDescriptionField().should(beEnabled).clear().type(TD.validDomain1.description)
      DomainForm.findSaveButton().should(beEnabled).wait(2000).click()

      I.wait('@editDomainSuccess')
        .its('request.body')
        .then(body => {
          expect(body).to.deep.equals({
            ...TD.responses.PUT.editRequestBody,
            value: TD.validDomain1.domainAddress,
            description: TD.validDomain1.description,
            name: TD.validDomain1.description,
          })
        })
      DomainPage.verifyAndCloseAlertMessage(domainEditSuccessMsg)
    })
  })

  context('T516682246 - Verify that duplicated Restricted domain can not be added', () => {
    let duplicateWebAddressErrorMsg: string

    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        duplicateWebAddressErrorMsg = I.translate('exclusion.domains.duplicateDomainErrorMsg')
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Verify disabled add button when empty inputs', () => {
      DomainPage.findAddManuallyOption().should(beVisible).click({ force: true })
      DomainForm.findAddButton().should(beDisabled)
    })

    it('Fill form with valid values', () => {
      DomainForm.findAddressField().should(beEnabled).type(TD.validDomain1.domainAddress).should(haveAttr, required)
      DomainForm.findDescriptionField().should(beEnabled).type(TD.validDomain1.description)
      //add button should become enabled
      DomainForm.findAddButton().should(beEnabled)
    })

    it('Submit form, check payload and error toast for duplicate message', () => {
      I.intercept('POST', WEB_ADDRESS_API_URL, req => {
        req.reply(409, TD.responses.POST.duplicate)
      }).as('createDomainFailDuplicate')
      // please call .wait(delay) before .click to allow intercept take in action, otherwise some unstable behaviour observed
      DomainForm.findAddButton().should(beEnabled).wait(2000).click({ force: true })

      waitForRequestAndCheckBody('@createDomainFailDuplicate', {
        addressType: ADDRESS_TYPE_HOST,
        description: TD.validDomain1.description,
        name: TD.validDomain1.description,
        tenantGuid: MOCK_TENANT_ID,
        type: TYPE_RESTRICTED,
        value: TD.validDomain1.domainAddress,
      })

      DomainForm.findFromDialog().should(beVisible) //we do not close the dialog in case off error
      DomainForm.findCancelButton().click()
      DomainPage.verifyAndCloseAlertMessage(duplicateWebAddressErrorMsg)
    })
  })

  //Test pass on local env, but marked as skipped because of gitlab service worker pipeline run differently than locally
  //After discussion with Isaac it was agreed to skip this test until gitlab pipeline is revised
  context.skip('T516682202 - Verify that exporting works correctly on the Restricted Domains screen', () => {
    beforeEach(() => {
      I.deleteFolder(getDownloadFolderPath())
    })

    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common', 'components', 'general/form').then(() => {
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Press export and check payload', () => {
      // export request doesn't have sortBy query param but first request should have header export: true
      I.intercept(
        {
          method: 'GET',
          pathname: WEB_ADDRESS_API_URL,
          query: {
            max: '25',
            offset: '0',
            query: 'type=RESTRICTED,addressType=HOST',
          },
          headers: {
            export: 'true',
          },
        },
        req => {
          req.reply(200, TD.responses.GET.success2Items)
        },
      ).as('exportRequest')

      DomainPage.findExportButton().should(beVisible).click()
      ExportConfirmation.findExportButton().should(beEnabled).wait(2000).click()

      // once @exportRequest finished it means that header should be applied but we double check
      I.wait('@exportRequest')
        .its('request.headers')
        .then(headers => {
          expect(headers.export).equals('true')
        })

      const exportedFilePath = getDownloadedFilePath(EXPORT_FILENAME_PREFIX.RestrictedDomains, 'csv')
      I.seeDownloadedFile(exportedFilePath).should(equal, true)
    })
  })

  //Test pass on local env, but marked as skipped because of gitlab service worker pipeline run differently than locally
  //After discussion with Isaac it was agreed to skip this test until gitlab pipeline is revised
  context.skip('T516682206 - Verify that importing works correctly on the Restricted Domains screen ', () => {
    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptRestrictedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common', 'components', 'general/form').then(() => {
        I.visit(RESTRICTED_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Select Add Domain -> Import domain list from .csv file', () => {
      const IMPORT_FILE_NAME = 'importDomains.csv'
      I.intercept(
        {
          method: 'POST',
          pathname: WEB_ADDRESS_API_URL + '/import/HOST/RESTRICTED',
        },
        req => {
          req.reply(200, { successes: 1, failures: [] })
        },
      ).as('importPost')

      DomainPage.findAddViaImportOption().should(beVisible).click({ force: true })

      ImportDialog.findInputTypeFile().uploadFile(IMPORT_FILE_NAME, 'text/csv')
      ImportDialog.findUploadButton().should(beEnabled).click({ force: true })
    })
  })
})
