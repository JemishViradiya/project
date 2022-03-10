import { AppShell } from '@ues-behaviour/shared-e2e/pages'

describe('dashboard', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')

    I.loadI18nNamespaces('dashboard').then(() => {
      I.visit('/')
    })
  })

  it('should display side nav', () => {
    AppShell.waitForPage({ title: I.translate('dashboard:pageTitle') })

    I.findByRole('main').should('not.be.empty')
  })
})
