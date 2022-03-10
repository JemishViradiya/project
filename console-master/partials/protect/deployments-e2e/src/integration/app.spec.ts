describe('deployments', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')

    I.loadI18nNamespaces('navigation').then(() => {
      I.visit('/')
    })
  })

  it('Should load left nav', () => {
    I.findByRole('navigation').should('exist')
  })
})
