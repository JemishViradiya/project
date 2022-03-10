export const AppShell = {
  // TODO: main
  main: 'main',
  navigation: 'navigation',
  navigationMenuitems: 'link',
  loading: '[role=progressbar]',
  pageTitle: {
    root: 'banner',
    title: 'heading',
    userMenu: 'header button + div',
    userMenuLogoff: `a[href='/Account/Logoff']`,
  },

  waitForPage({ title }, { timeout = 1000 } = {}) {
    const nav = I.findByRole(this.navigation, { timeout: timeout * 10 }).as('navMenu')
    // assert.isTrue(!!nav)
    nav.should('exist')

    nav.findAllByRole(this.navigationMenuitems, { timeout })

    I.findByRole(this.pageTitle.root, { timeout })
      .as('pageTitle')
      // page title text
      .findAllByRole(this.pageTitle.title, { name: title, timeout })

    I.findAllByRole('progressbar', { log: true, timeout: 1000 }).as('progressbar').should('not.exist')
  },
}
