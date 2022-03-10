import { CommonFns } from '@ues/assets-e2e'

const { visitView } = CommonFns(I)

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('No data')) {
    return false
  }
})

describe('Gateway Dashboard', () => {
  before(() => {
    visitView('#/static/gateway')
  })

  it('should load Dashboard', () => {
    I.findByRole('navigation').should('exist')
    I.findByRole('main').should('not.be.empty')
    I.findByRole('heading', { name: I.translate('dashboard.title') }).should('exist')
  })
})
