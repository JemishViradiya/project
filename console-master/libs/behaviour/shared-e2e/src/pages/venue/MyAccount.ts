export const MyAccount = {
  root: 'main',
  navigation: ['#root-ues-nav', 'menubar'],
  navigationMenuitems: 'menuitem',
  loading: '[aria-label=Loading]',
  pageTitle: 'heading',

  waitForPage() {
    I
      // admin account page
      .findByRole(this.pageTitle, { name: 'My Account' })
      .as('myaccountPageTitle')
      .should('exist')
  },
}
