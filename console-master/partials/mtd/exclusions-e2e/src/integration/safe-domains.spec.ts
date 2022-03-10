import { I } from '@ues-behaviour/shared-e2e'
import { FeatureName } from '@ues-data/shared-types'

import {
  beDisabled,
  beEnabled,
  beVisible,
  equal,
  EXPORT_FILENAME_PREFIX,
  findTabByName,
  getDownloadedFilePath,
  getDownloadFolderPath,
  haveAttr,
  include,
  required,
  SAFE_DOMAINS_UI_URL,
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
  TYPE_APPROVED,
} from '../support/util-domains'

// load mock data from fixtures
const TD = require('../fixtures/approved-domains.json')

// test cases set from https://testrail.rim.net//index.php?/runs/view/113503&group_by=cases:section_id&group_order=asc
describe('Safe domains e2e test suite ', () => {
  context('Verify that Safe domain navigation works', () => {
    let safeDomainsText, tabSafe: string

    before(() => {
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      I.loadI18nNamespaces('mtd/common').then(() => {
        safeDomainsText = I.translate('exclusion.approvedDomains.itemName')
        tabSafe = I.translate('tabs.safe.label')
        I.visit('#/settings/global-list')
      })
    })

    it('Should load Safe domains list', () => {
      // default tab should be opened by default
      I.url().should(include, `#/settings/global-list/restricted/developers`)
      // switch to Safe top tab
      findTabByName(tabSafe).should(beVisible).click()
      // open Safe domains tab
      I.findByText(safeDomainsText).click({ force: true })
      I.url().should(include, `#/settings/global-list/safe/domains`)
    })
  })

  context('T516682093 - Verify that sorting works correctly on the Safe Domains screen', () => {
    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        I.visit(SAFE_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Table header column "domain" has sortable button', () => {
      DomainPage.findSortByDomain().should(beVisible)
    })

    it('Check sorted field in request query with desc order', () => {
      I.interceptApprovedDomainsGet('value desc', TD.responses.GET.success2Items).as('sortedDescSearchDomain')
      // once @sortedDescSearchDomain finished it means that sorting by 'value desc' has been applied in server request
      DomainPage.findSortByDomain().should(beVisible).click({ force: true }).wait('@sortedDescSearchDomain')
    })

    it('Check sorted field in request query with asc order', () => {
      I.interceptApprovedDomainsGet('value asc', TD.responses.GET.success2Items).as('sortedAscSearchDomain')
      // once @sortedAscSearchDomain finished it means that sorting by 'value asc' has been applied in server request
      DomainPage.findSortByDomain().should(beVisible).click({ force: true }).wait('@sortedAscSearchDomain')
    })
  })

  context('T516682222 - Verify that Safe domain can be created', () => {
    let domainCreateSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainCreateSuccessMsg = I.translate('exclusion.domains.domainCreateSuccessMsg')
        I.visit(SAFE_DOMAINS_UI_URL)
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
            type: TYPE_APPROVED,
            value: TD.validDomain1.domainAddress,
          })
        })
      DomainPage.verifyAndCloseAlertMessage(domainCreateSuccessMsg)
    })
  })

  context('T516682223 - Verify that one Approved domain can be deleted', () => {
    let domainDeleteSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainDeleteSuccessMsg = I.translate('exclusion.singleDeleteSuccessMsg', {
          entity: I.translate('exclusion.entityDomainLowerCase'),
        })
        I.visit(SAFE_DOMAINS_UI_URL)
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

  context('T516682224 - Verify that Safe domain can be edited', () => {
    let domainEditSuccessMsg: string

    before(() => {
      //set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      //load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        domainEditSuccessMsg = I.translate('exclusion.domains.domainEditSuccessMsg')
        I.visit(SAFE_DOMAINS_UI_URL)
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

  context('T516682225 - Verify that duplicated Safe domain can not be added', () => {
    let duplicateWebAddressErrorMsg: string

    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common').then(() => {
        duplicateWebAddressErrorMsg = I.translate('exclusion.domains.duplicateDomainErrorMsg')
        I.visit(SAFE_DOMAINS_UI_URL)
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
        type: TYPE_APPROVED,
        value: TD.validDomain1.domainAddress,
      })

      DomainForm.findFromDialog().should(beVisible) //we do not close the dialog in case off error
      DomainForm.findCancelButton().click()
      DomainPage.verifyAndCloseAlertMessage(duplicateWebAddressErrorMsg)
    })
  })

  //Test pass on local env, but marked as skipped because of gitlab service worker pipeline run differently than locally
  //After discussion with Isaac it was agreed to skip this test until gitlab pipeline is revised
  context.skip('T516682201 - Verify that exporting works correctly on the Safe Domains screen', () => {
    beforeEach(() => {
      I.deleteFolder(getDownloadFolderPath())
    })

    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common', 'components', 'general/form').then(() => {
        I.visit(SAFE_DOMAINS_UI_URL)
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
            query: 'type=APPROVED,addressType=HOST',
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

      const exportedFilePath = getDownloadedFilePath(EXPORT_FILENAME_PREFIX.SafeDomains, 'csv')
      I.seeDownloadedFile(exportedFilePath).should(equal, true)
    })
  })

  //Test pass on local env, but marked as skipped because of gitlab service worker pipeline run differently than locally
  //After discussion with Isaac it was agreed to skip this test until gitlab pipeline is revised
  context.skip('T516682205 - Verify that importing works correctly on the Safe Domains screen', () => {
    before(() => {
      // set the local storage state
      window.localStorage.clear()
      window.localStorage.setItem('UES_DATA_MOCK', 'true')
      window.localStorage.setItem(FeatureName.MockDataBypassMode, 'true')

      //intercept api requests
      I.interceptApprovedDomainsGet('created desc', TD.responses.GET.success2Items).as('initialSearch')

      // load localization and revisit page to pick up local storage settings
      I.loadI18nNamespaces('mtd/common', 'components', 'general/form').then(() => {
        I.visit(SAFE_DOMAINS_UI_URL)
        I.wait('@initialSearch')
      })
    })

    it('Select Add Domain -> Import domain list from .csv file', () => {
      const IMPORT_FILE_NAME = 'importDomains.csv'
      I.intercept(
        {
          method: 'POST',
          pathname: WEB_ADDRESS_API_URL + '/import/HOST/APPROVED',
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
