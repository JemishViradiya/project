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

declare namespace Cypress {
  interface Chainable<Subject> {
    login(email: string, password: string): void
  }
}
declare global {
  namespace Cypress {
    interface Chainable {
      setMocks: typeof setMocks
    }
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password)
})
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
export const emm_connection_json = 'EmmConnections.json'

Cypress.Commands.add('setMocks', setMocks)

function setMocks() {
  window.localStorage.setItem('UES_DATA_MOCK', 'true')
  window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
  window.localStorage.setItem('ues.emmconnector.enabled', 'true')
  window.localStorage.setItem('ues.uemconnector.enabled', 'true')
}
