Cypress.on('uncaught:exception', err => {
  if (err.message.includes('ServiceWorker')) {
    return false
  }
})

describe('filter table', () => {
  const filterCol = /dessert/i
  let filterIcon: string

  before(() => {
    I.loadI18nNamespaces('tables').then(() => {
      filterIcon = I.translate('filterIcon')
    })
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=table--filter-infinite-with-export&viewMode=story')
    I.findByRole('grid', { timeout: 15000 }).should('not.contain.text', I.translate('noData')) // wait for table data to load
  })

  it('filter contains', () => {
    const containsStr = 'sandwich'
    const filterChip = /^dessert.*sandwich$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('contains') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(containsStr)
    I.findByRoleWithin('presentation', 'textbox').type('{enter}')
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    // find the ones we want to cypress waits for the table to update
    I.findAllByRole('gridcell', { name: new RegExp(containsStr, 'i'), timeout: 3000 }).should('be.visible')
    I.wait(3000)
    I.findAllByInfiniteTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell).should('contain.text', containsStr)
      }
    })
  })

  it('filter does not contain', () => {
    const notContainStr = 'Eclair'
    const filterChip = /^dessert.*eclair$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('doesNotContain') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(notContainStr)
    I.findByRoleWithin('presentation', 'textbox').type('{enter}')
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    // find the ones we want to cypress waits for the table to update
    I.findAllByRole('gridcell', { name: new RegExp(`^((?!${notContainStr}).)*$`, 'i'), timeout: 3000 }).should('be.visible')
    I.wait(3000)
    I.findAllByInfiniteTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell).should('not.contain.text', notContainStr)
      }
    })
  })

  it('filter starts with', () => {
    const startsWithStr = 'cake'
    const filterChip = /^dessert.*cake$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('startsWith') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(startsWithStr)
    I.findByRoleWithin('presentation', 'textbox').type('{enter}')
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    // find the ones we want to cypress waits for the table to update
    I.findAllByRole('gridcell', { name: new RegExp('^' + startsWithStr, 'i'), timeout: 3000 }).should('be.visible')

    I.findAllByInfiniteTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell)
          .invoke('text')
          .should('match', new RegExp('^' + startsWithStr, 'i'))
      }
    })
  })

  it('filter ends with', () => {
    const endsWithStr = '15'
    const filterChip = /^dessert.*15$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button', { name: filterIcon }).click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('endsWith') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(endsWithStr)
    I.findByRoleWithin('presentation', 'textbox').type('{enter}')
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    // find the ones we want to cypress waits for the table to update
    I.findAllByRole('gridcell', { name: new RegExp(endsWithStr + '$'), timeout: 3000 }).should('be.visible')

    I.findAllByInfiniteTableColumnLabel(filterCol)
      .should('have.length.lessThan', 20)
      .each((cell, index) => {
        // skip header
        if (index !== 0) {
          I.wrap(cell)
            .invoke('text')
            .should('match', new RegExp(endsWithStr + '$'))
        }
      })
  })
})
