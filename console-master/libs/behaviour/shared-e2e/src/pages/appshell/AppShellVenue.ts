export const AppShellVenue = {
  root: 'main',
  navigation: ['#root-ues-nav', 'menubar'],
  navigationMenuitems: 'menuitem',
  loading: '[aria-label=Loading]',
  pageTitle: 'heading',

  waitForPage({ title }, { timeout = 1000 } = {}) {
    const nav = I.findByLocator(this.navigation[0]).as('navMfe')
    // console.warn('nav', nav)
    const menubar = nav.findByRole(this.navigation[1], { timeout }).as('navMenu')
    // console.warn('menubar', m, nav.findByRole.toString())
    menubar.findAllByRole('menuitem', { timeout })

    I.findAllByRole(this.pageTitle, { name: title })
  },

  clickUserMenu({ name }: { name: string }) {
    I
      // adminInfo
      .findByRole('menuitem', { name })
      .as('userMenuLink')
      .click()
  },
}
