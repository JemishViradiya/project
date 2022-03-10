describe('Total Analyzed Files Widget', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    I.loadI18nNamespaces('epp/protect')
    I.visit('/')
  })

  it('should display title', () => {
    I.findByRole('heading', { name: I.translate('widget.totalAnalyzedFiles') }).should('exist')
  })
})
