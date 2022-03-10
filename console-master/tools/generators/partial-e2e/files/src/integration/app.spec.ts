describe('platform', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')

    I.loadI18nNamespaces('access').then(() => {
      I.visit('/')
    })
  })

  it('Should load left nav', () => {
    I.findByRole('navigation').should('exist')
  })
})
