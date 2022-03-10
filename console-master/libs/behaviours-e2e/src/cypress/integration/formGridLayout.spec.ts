//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
describe('Input Groups', () => {
  before(() => {
    I.loadI18nNamespaces('components')
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=form-grid-layout--text-fields-with-initial-values&viewMode=story')
  })

  const GRID_KEYS = ['00', '01', '10', '11']

  const gridItems = GRID_KEYS.map(gridKey => `grid-item-${gridKey}`)

  it('should render an initial grid layout', () => {
    I.findByRole('grid').should('exist')

    for (const gridItem of gridItems) {
      I.findByRole('gridcell', { name: gridItem }).should('exist')
    }

    I.findByRole('button', { name: 'remove-grid-row-button-0' }).should('exist')
    I.findByRole('button', { name: 'remove-grid-row-button-1' }).should('exist')
  })

  it('should add a new row', () => {
    I.findByRole('gridcell', { name: 'grid-item-20' }).should('not.exist')
    I.findByRole('gridcell', { name: 'grid-item-21' }).should('not.exist')
    I.findByRole('button', { name: I.translate('inputGroups.buttonAdd') }).click()
    I.findByRole('gridcell', { name: 'grid-item-20' }).should('exist')
    I.findByRole('gridcell', { name: 'grid-item-21' }).should('exist')
    I.findByRole('button', { name: 'remove-grid-row-button-2' }).should('exist')
  })

  it('should remove the last row', () => {
    I.findByRole('gridcell', { name: 'grid-item-10' }).should('exist')
    I.findByRole('gridcell', { name: 'grid-item-11' }).should('exist')
    I.findByRole('button', { name: 'remove-grid-row-button-1' }).click()
    I.findByRole('gridcell', { name: 'grid-item-10' }).should('not.exist')
    I.findByRole('gridcell', { name: 'grid-item-11' }).should('not.exist')
  })
})
