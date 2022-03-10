/* global cy */
/* eslint-disable no-restricted-globals */

Cypress.Commands.add('say', cy.log)

Cypress.Commands.add(
  'findByLocator',
  { prevSubject: 'optional' } as Cypress.CommandOptions,
  (subject: Cypress.Chainable<JQuery<unknown>> | undefined, id: string, options) => {
    // todo: throw on not found
    return (subject || cy).get(id, options)
  },
)
Cypress.Commands.add(
  'findAllByLocator',
  { prevSubject: 'optional' } as Cypress.CommandOptions,
  (subject: Cypress.Chainable<JQuery<unknown>> | undefined, id: string, options) => {
    // todo: throw on none found
    return (subject || cy).get(id, options)
  },
)

Cypress.Commands.add(
  'fillField',
  { prevSubject: true },
  (subject: Cypress.Chainable<JQuery<unknown>> | undefined, value: string, opts) =>
    cy.get(subject).type(value, { parseSpecialCharSequences: true, ...opts }),
)
