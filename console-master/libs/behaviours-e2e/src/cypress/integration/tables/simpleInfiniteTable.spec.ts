describe('simple table', () => {
  before(() => {
    I.loadI18nNamespaces('tables')
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=table--simple-infinite&viewMode=story')
    I.findByRole('grid', { timeout: 10000 }).should('not.contain.text', I.translate('noData')) // wait for table data to load
  })

  it('table column picker', () => {
    const columnPicker = 'columnPicker'
    const showCol = /calories/i
    const hideCol = /protein/i

    // check column shows
    I.findByRole('cell', { name: columnPicker }).click()
    I.findByRoleWithin('presentation', 'button', { name: showCol }).click()
    I.clickOutsideModal()
    I.findByRole('columnheader', { name: showCol }).should('be.visible')

    // check column hides
    I.findByRole('cell', { name: columnPicker }).click()
    I.findByRoleWithin('presentation', 'button', { name: hideCol }).click()
    I.clickOutsideModal()
    I.findByRole('columnheader', { name: hideCol }).should('not.exist')
  })

  it('checkbox single selection', () => {
    const name = /primary action/i

    I.findByRole('button', { name }).should('not.exist')

    I.findByRoleOptionsWithin('cell', { name: 'select-1' }, 'checkbox').check()
    I.findByRole('button', { name }).should('be.visible')

    I.findByRoleOptionsWithin('cell', { name: 'select-1' }, 'checkbox').click()
    I.findByRole('button', { name }).should('not.exist')
  })

  it('checkbox all selection', () => {
    const name = /primary action/i

    I.findByRole('button', { name }).should('not.exist')
    I.findByRole('progressbar').should('not.exist')
    I.findByRoleOptionsWithin('cell', { name: I.translate('selectAll') }, 'checkbox')
      .check()
      .should('be.checked')
    I.findByRole('button', { name }).should('be.visible')
    I.findAllByRole('cell', { name: /select-*/ }).each((item, index) => {
      I.wrap(item).findByRole('checkbox').should('be.checked')
    })

    I.findByRoleOptionsWithin('cell', { name: I.translate('selectAll') }, 'checkbox')
      .uncheck()
      .should('not.be.checked')
    I.findByRole('button', { name }).should('not.exist')
    I.findAllByRole('cell', { name: /select-*/ }).each((item, index) => {
      I.wrap(item).findByRole('checkbox').should('not.be.checked')
    })
  })
})
