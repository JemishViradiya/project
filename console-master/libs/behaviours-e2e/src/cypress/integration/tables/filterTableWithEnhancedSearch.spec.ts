//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

const getEnhancedSearchChip = name => {
  return I.findByRoleWithin('combobox', 'button', { name })
}

const openTableColFilter = colName => {
  I.findByRoleOptionsWithin('columnheader', { name: colName }, 'button').click()
}

const getSlider = () => I.findByRoleWithin('presentation', 'slider')

const getCheckboxByName = name => I.findByRole('checkbox', { name })

describe('filter table with enhanced search', () => {
  const tableCols = [/^calories.*/i, /^fat.*/i]
  const fatColValues = ['6.0%', '9.0%']

  before(() => {
    I.loadI18nNamespaces('tables', 'components').then(() => {
      I.visit('/iframe.html?id=table--filter-with-enhanced-search&viewMode=story')
      I.findByRole('table').should('not.contain.text', I.translate('noData'))
    })
  })

  it('added table filter should be displayed as enhanced search chip', () => {
    openTableColFilter(tableCols[0])
    I.findByRoleWithin('presentation', 'button').click()
    I.findByRoleWithin('presentation', 'button', { name: I.translate('greater') }).click()

    getSlider()
      .click(50, 0, { force: true })
      .invoke('attr', 'aria-valuenow')
      .then(sliderValue => {
        I.clickOutsideModal()
        I.findByLabelText('comparison').should('contain', '>')
        I.findByLabelText('chipValue').should('contain', sliderValue)
      })
  })

  it('enhanced search chip changing should change table filter', () => {
    I.findByLabelText('comparison').click()

    I.findByRole('presentation').within(() => {
      I.findByText(I.translate('components:enhancedSearch.comparisons.less')).click()
    })

    I.findByLabelText('chipValue').click()
    getSlider().click(30, 0, { force: true })

    I.findByLabelText('chipValue')
      .invoke('text')
      .then(chipValue => {
        openTableColFilter(tableCols[0])
        I.findByRoleWithin('presentation', 'button', { name: I.translate('less') }).should(
          'have.class',
          'MuiChip-outlinedSecondary',
        )
        getSlider().should('have.attr', 'aria-valuenow', chipValue)
      })
    I.clickOutsideModal()
  })

  it('removing table filter should romove enhanced search chip as well', () => {
    openTableColFilter(tableCols[0])
    I.findByText(I.translate('clear')).click()
    I.clickOutsideModal()
    getEnhancedSearchChip(tableCols[0]).should('not.exist')
  })

  it('added enhanced search chip should add table filter', () => {
    I.findByRole('combobox').click()
    I.findByRole('presentation').within(() => {
      I.findByText(tableCols[1]).click()
    })
    I.findByRole('presentation').within(() => {
      I.findByLabelText(fatColValues[0]).click()
    })
    I.clickOutsideModal()

    openTableColFilter(tableCols[1])
    getCheckboxByName(fatColValues[0]).should('be.checked')
    I.clickOutsideModal()
  })

  it('table filter changing should change enhanced search chip value', () => {
    openTableColFilter(tableCols[1])
    getCheckboxByName(fatColValues[1]).click()
    I.clickOutsideModal()

    getEnhancedSearchChip(tableCols[1]).should('be.visible')
    I.findByLabelText('chipValue').should('contain', fatColValues.join(', '))
    I.clickOutsideModal()
  })

  it('removing enhanced search chip should romove table filter as well', () => {
    getEnhancedSearchChip(tableCols[1]).find('svg').click()
    I.clickOutsideModal()

    openTableColFilter(tableCols[1])
    fatColValues.forEach(value => {
      getCheckboxByName(value).should('not.be.checked')
    })
    I.clickOutsideModal()
  })
})
