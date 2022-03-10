describe.skip('dashboard', () => {
  const newDashboardTitle = 'New dashboard title'
  const dupliateDashboardTitle = 'Duplicate dashboard title'

  let add: string
  let addDashboard: string
  let addWidgets: string
  let deleteDashboard: string
  let duplicateDashboard: string
  let duplicateTitleError: string
  let editButton: string
  let editTitle: string
  let emptyTitleError: string
  let help: string
  let last24Hours: string
  let placeHolderMessage: string
  let save: string
  let titleTextbox: string

  before(() => {
    window.localStorage.clear()
    I.loadI18nNamespaces('dashboard', 'general/form').then(() => {
      add = I.translate('general/form:commonLabels.add')
      addDashboard = I.translate('addNewDashboard')
      addWidgets = I.translate('addWidgets')
      deleteDashboard = I.translate('deleteDashboard')
      duplicateDashboard = I.translate('duplicateDashboard')
      duplicateTitleError = I.translate('duplicateTitleError')
      editButton = I.translate('general/form:commonLabels.edit')
      editTitle = I.translate('editTitle')
      emptyTitleError = I.translate('emptyTitleError')
      help = I.translate('general/form:commonLabels.help')
      last24Hours = I.translate('last24Hours')
      placeHolderMessage = I.translate('placeHolderMessage')
      save = I.translate('general/form:commonLabels.save')
      titleTextbox = I.translate('dashboardTitle')
    })
  })

  beforeEach(() => {
    window.localStorage.setItem('ues.nav.cronos.enabled', 'true')
    window.localStorage.setItem('UES_DATA_MOCK', 'true')
    window.localStorage.setItem('ues.single.nx.app.enabled', 'true')
    I.intercept('**/uc/api/ui/apps.console').as('loaded')
    I.visit('#/dashboard').wait('@loaded', { timeout: 30000 })
  })

  it('should display side nav and page header', () => {
    I.findByRole('navigation').should('be.visible')
    I.findByRole('main').should('not.be.empty')
    I.findByRole('button', { name: last24Hours }).should('be.visible')
    I.findByRole('button', { name: add }).should('be.visible')
    I.findByRole('button', { name: editButton }).should('be.visible')
    I.findByRole('link', { name: help }).should('be.visible')
  })

  it('edit title', () => {
    I.findByRole('button', { name: editButton }).should('be.visible')
    I.findByRole('button', { name: editButton }).click()
    I.findByRole('menuitem', { name: editTitle }).click()
    I.findByRoleWithin('dialog', 'heading', { name: editTitle }).should('be.visible')

    // test blank title
    I.findByRole('textbox', { name: titleTextbox }).type('   ')
    I.findByRole('button', { name: save }).click()
    I.findByText(emptyTitleError).should('be.visible')

    // test duplicate title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(emptyTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(dupliateDashboardTitle)
    I.findByRole('button', { name: save }).click()
    I.findByText(duplicateTitleError).should('be.visible')

    // test valid title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(duplicateTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(newDashboardTitle)
    I.findByRole('button', { name: save }).click()
    I.findByRole('heading', { name: newDashboardTitle }).should('be.visible')
  })

  it('delete option should be disabled', () => {
    I.findByRole('button', { name: editButton }).should('be.visible')
    I.findByRole('button', { name: editButton }).click()
    I.findByRole('menuitem', { name: deleteDashboard }).should('have.attr', 'aria-disabled', 'true')
  })

  it('add new dashboard', () => {
    I.findByRole('button', { name: add }).should('be.visible')
    I.findByRole('button', { name: add }).click()
    I.findByRole('menuitem', { name: addDashboard }).click()
    I.findByRoleWithin('dialog', 'heading', { name: addDashboard }).should('be.visible')

    // test blank title
    I.findByRole('textbox', { name: titleTextbox }).type('   ')
    I.findByRole('button', { name: add }).click()
    I.findByText(emptyTitleError).should('be.visible')

    // test duplicate title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(emptyTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(dupliateDashboardTitle)
    I.findByRole('button', { name: add }).click()
    I.findByText(duplicateTitleError).should('be.visible')

    // test valid title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(duplicateTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(newDashboardTitle)
    I.findByRole('button', { name: add }).click()

    I.findByRole('img', { name: placeHolderMessage }).should('be.visible')
    I.findByRole('heading', { name: addWidgets }).should('be.visible')
  })

  it('copy this dashboard', () => {
    I.findByRole('button', { name: add }).should('be.visible')
    I.findByRole('button', { name: add }).click()
    I.findByRole('menuitem', { name: duplicateDashboard }).click()
    I.findByRoleWithin('dialog', 'heading', { name: duplicateDashboard }).should('be.visible')

    // test blank title
    I.findByRole('textbox', { name: titleTextbox }).type('   ')
    I.findByRole('button', { name: save }).click()
    I.findByText(emptyTitleError).should('be.visible')

    // test duplicate title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(emptyTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(dupliateDashboardTitle)
    I.findByRole('button', { name: save }).click()
    I.findByText(duplicateTitleError).should('be.visible')

    // test valid title
    I.findByRole('textbox', { name: titleTextbox }).clear()
    I.findByText(duplicateTitleError).should('not.exist')
    I.findByRole('textbox', { name: titleTextbox }).type(newDashboardTitle)
    I.findByRole('button', { name: save }).click()

    I.findByRole('img', { name: placeHolderMessage }).should('be.visible')
    I.findByRole('heading', { name: addWidgets }).should('be.visible')
  })
})
