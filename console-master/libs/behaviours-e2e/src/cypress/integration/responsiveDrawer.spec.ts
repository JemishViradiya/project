describe('responsive drawer', () => {
  let navApps

  before(() => {
    I.loadI18nNamespaces('navigation')

    I.fixture('responsiveDrawer/apps').then(apps => {
      navApps = JSON.parse(apps).navigation
    })
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=navigation-responsive-drawer--responsive-drawer&viewMode=story')
  })

  it('should display side nav', () => {
    I.findByRole('navigation').should('be.visible')
    I.findByRole('main').should('not.be.empty')
  })

  it('should display hover text', () => {
    for (const item of navApps) {
      const name = new RegExp('^' + I.translate(item['name']), 'i')
      I.findByRoleWithin('navigation', 'link', { name }).trigger('mouseover')
      I.findByRole('tooltip', { name }).should('be.visible')
      I.findByRoleWithin('navigation', 'link', { name }).trigger('mouseout')
      I.findByRole('tooltip', { name }).should('not.exist')
    }
  })

  it('should display expanded content', () => {
    I.findByRoleWithin('navigation', 'button', { name: 'Menu' }).click()
    for (const item of navApps) {
      const name = new RegExp('^' + I.translate(item['name']), 'i')
      I.findByRole('navigation').findByText(name).should('be.visible')
    }

    I.findByRole('button', { name: 'Menu' }).click()
    for (const item of navApps) {
      const name = new RegExp('^' + I.translate(item['name']), 'i')
      I.findByRole('navigation').findByText(name).should('not.be.visible')
    }
  })
})
