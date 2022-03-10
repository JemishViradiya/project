describe('dashboard', () => {
  let add: string
  let addWidgets: string
  let close: string
  let customTime: string
  let deleteCard: string
  let editButton: string
  let help: string
  let last24Hours: string
  let last7Days: string
  let totalCount: string

  before(() => {
    I.loadI18nNamespaces('dashboard', 'general/form').then(() => {
      add = I.translate('general/form:commonLabels.add')
      addWidgets = I.translate('addWidgets')
      close = I.translate('general/form:commonLabels.close')
      customTime = I.translate('cardMenu.customTime')
      deleteCard = I.translate('cardMenu.deleteCard')
      editButton = I.translate('general/form:commonLabels.edit')
      help = I.translate('general/form:commonLabels.help')
      last24Hours = I.translate('last24Hours')
      last7Days = I.translate('last7Days')
      totalCount = I.translate('cardMenu.totalCount')
    })

    I.visit('/iframe.html?id=dashboard-dashboard--dashboard&viewMode=story')
  })

  it('header', () => {
    I.findByText('Sample Dashboard').should('be.visible')
    I.findByRole('button', { name: last24Hours }).should('be.visible')
    I.findByRole('button', { name: add }).should('be.visible')
    I.findByRole('button', { name: editButton }).should('be.visible')
    I.findByRole('link', { name: help }).should('be.visible')
  })

  it('add widgets drawer', () => {
    I.findByRole('button', { name: add }).click()
    I.findByRole('menuitem', { name: addWidgets }).click()
    I.findByRole('heading', { name: addWidgets }).should('be.visible')

    // check 'selected' icon is present if chart is in dashboard
    I.findByRole('menubar')
      .findAllByRole('figure', { hidden: true })
      .each((icon, index) => {
        const label = icon[0]['ariaLabel']
        if (label.includes('_selected')) {
          I.findByRoleWithin('grid', 'gridcell', { name: label.replace('_selected', '') })
            .scrollIntoView()
            .should('be.visible')
        } else {
          I.findByRoleWithin('grid', 'gridcell', { name: label }).should('not.exist')
        }
      })

    I.findByRole('button', { name: close }).click()
    I.findByRole('heading', { name: addWidgets }).should('not.be.visible')
  })

  it('card menu', () => {
    const cardTitle = 'Card title 5 Line'
    const totalCountText = '99,999description'

    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'button', { name: '', hidden: true }).click({
      force: true,
    })

    // total count
    I.findByRole('menuitem', { name: totalCount }).click()
    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'heading', { name: totalCountText })
      .scrollIntoView()
      .should('be.visible')
    I.findByRole('menuitem', { name: totalCount }).click()
    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'heading', { name: totalCountText }).should('not.exist')

    // custom time
    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'button', { name: last7Days }).scrollIntoView().should('exist')
    I.findByRole('menuitem', { name: customTime }).click()
    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'button', { name: last7Days }).should('not.exist')
    I.findByRole('menuitem', { name: customTime }).click()
    I.findByRoleOptionsWithin('gridcell', { name: cardTitle }, 'button', { name: last24Hours }).scrollIntoView().should('exist')

    // delete
    I.findByRole('menuitem', { name: deleteCard }).click()
    I.findByRole('gridcell', { name: cardTitle }).should('not.exist')
  })
})
