describe('filter table', () => {
  const filterCol = /dessert/i

  before(() => {
    I.loadI18nNamespaces('tables')
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=table--filter&viewMode=story')
    I.findByRole('table').should('not.contain.text', I.translate('noData')) // wait for table data to load
  })

  it('filter contains', () => {
    const containsStr = 'sandwich'
    const filterChip = /^dessert.*sandwich$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button').click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('contains') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(containsStr)
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    I.findAllByTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell).should('contain.text', containsStr)
      }
    })
  })

  it('filter does not contain', () => {
    const filterCol = /dessert/i
    const notContainStr = 'eclair'
    const filterChip = /^dessert.*eclair$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button').click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('doesNotContain') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(notContainStr)
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    I.findAllByTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell).should('not.contain.text', notContainStr)
      }
    })
  })

  it('filter starts with', () => {
    const startsWithStr = 'cake'
    const filterChip = /^dessert.*cake$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button').click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('startsWith') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(startsWithStr)
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    I.findAllByTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell)
          .contains(new RegExp('^' + startsWithStr, 'i'))
          .should('be.visible')
      }
    })
  })

  it('filter ends with', () => {
    const endsWithStr = '15'
    const filterChip = /^dessert.*15$/i

    I.findByRoleOptionsWithin('columnheader', { name: filterCol }, 'button').click()
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('endsWith') }).click()
    I.findByRoleWithin('presentation', 'textbox').type(endsWithStr)
    I.clickOutsideModal()

    I.findByRole('button', { name: filterChip }).should('be.visible')
    I.findAllByTableColumnLabel(filterCol).each((cell, index) => {
      // skip header
      if (index !== 0) {
        I.wrap(cell)
          .contains(new RegExp(endsWithStr + '$'))
          .should('be.visible')
      }
    })
  })
})
