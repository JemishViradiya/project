describe.skip('dlp-e2e', () => {
  before(() => {
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
  })

  beforeEach(() => {
    I.visit('/')
  })

  it('should display side nav', () => {
    I.findByRole('navigation').should('be.visible')
  })
})
