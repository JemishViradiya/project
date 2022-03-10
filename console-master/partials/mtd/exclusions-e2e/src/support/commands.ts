// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import '@testing-library/cypress/add-commands'

import { I } from '@ues-behaviour/shared-e2e'
import type { EntitiesPageableResponse, IDeveloperCertificate, IWebAddress } from '@ues-data/mtd'

import { WEB_ADDRESS_API_URL } from './constants'
import { ADDRESS_TYPE_HOST, TYPE_APPROVED, TYPE_RESTRICTED } from './util-domains'

const CERTIFICATE_API_URL = '**/api/mtd/v1/mtd-exclusion/certificate'

const mockRestrictedDomainsGet = (sortByQueryParam, httpResponseCode, responseBody) => {
  return I.intercept(
    {
      method: 'GET',
      pathname: WEB_ADDRESS_API_URL,
      query: {
        max: '25',
        offset: '0',
        query: 'type=RESTRICTED,addressType=HOST',
        sortBy: sortByQueryParam,
      },
    },
    req => {
      req.reply(httpResponseCode, responseBody)
    },
  )
}

//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password)
})

Cypress.Commands.add('mockRestrictedDomainsGet', mockRestrictedDomainsGet)
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * This command will help to speed up typing in text fields
 */
Cypress.Commands.add(
  'fill',
  {
    prevSubject: 'element',
  },
  ($subject, value) => {
    const el = $subject[0]
    el.value = value.substring(0, value.length - 1)
    return I.wrap($subject).type(value.substr(value.length - 1))
  },
)

Cypress.Commands.add('interceptApprovedDomainsGet', (sortBy: string, response: EntitiesPageableResponse<IWebAddress>) => {
  const queryApproved = `type=${TYPE_APPROVED},addressType=${ADDRESS_TYPE_HOST}`
  return interceptEntityListGet(WEB_ADDRESS_API_URL, queryApproved, sortBy, response)
})

Cypress.Commands.add('interceptRestrictedDomainsGet', (sortBy: string, response: EntitiesPageableResponse<IWebAddress>) => {
  const queryRestricted = `type=${TYPE_RESTRICTED},addressType=${ADDRESS_TYPE_HOST}`
  return interceptEntityListGet(WEB_ADDRESS_API_URL, queryRestricted, sortBy, response)
})

Cypress.Commands.add('interceptCertificateRequest', (method, responseCode, response) => {
  return I.intercept(method, CERTIFICATE_API_URL, req => {
    req.reply(responseCode, response)
  })
})

Cypress.Commands.add('interceptRestrictedCertsGet', (sortBy, response) => {
  const queryRestricted = 'type=RESTRICTED'
  return interceptEntityListGet(CERTIFICATE_API_URL, queryRestricted, sortBy, response)
})

Cypress.Commands.add('interceptSafeCertsGet', (sortBy, response) => {
  const querySafe = 'type=APPROVED'
  return interceptEntityListGet(CERTIFICATE_API_URL, querySafe, sortBy, response)
})

Cypress.Commands.add('interceptEntityListGet', (url, query: string, sortBy: string, response) => {
  return interceptEntityListGet(url, query, sortBy, response)
})

const interceptEntityListGet = (url, query: string, sortBy: string, response) => {
  return I.intercept(
    {
      method: 'GET',
      pathname: url,
      query: {
        max: '25',
        offset: '0',
        query: query,
        sortBy: sortBy,
      },
    },
    response,
  )
}
