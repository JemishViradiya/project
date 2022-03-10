describe('Partials Protect Dashboard', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    I.loadI18nNamespaces('epp/protect')
    I.visit('/')
  })

  it('should display title', () => {
    // Function helper example, see `../support/app.po.ts` file
    I.findByRole('heading', { name: I.translate('protectDashboard') }).should('exist')
  })
})
