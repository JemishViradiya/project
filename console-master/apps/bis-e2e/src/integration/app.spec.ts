describe('bis', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })

  beforeEach(() => {
    I.visit('/')
  })

  it('should display side nav', () => {
    I.findByRole('navigation').should('be.visible')
    I.findByRole('main').should('not.be.empty')
  })
})
