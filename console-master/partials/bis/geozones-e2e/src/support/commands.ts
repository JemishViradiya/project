import '@testing-library/cypress/add-commands'
import '@ues-behaviour/shared-e2e'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Chainable<Subject> {}
  }
}

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('LatLng')) {
    return false
  }
})
