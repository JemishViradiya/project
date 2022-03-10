//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
describe('Risk Slider', () => {
  before(() => {
    I.loadI18nNamespaces('components')
  })

  beforeEach(() => {
    I.visit('/iframe.html?id=risk--risk-slider&viewMode=story')
  })

  it('should show a default risk (Low - High)', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMin') }).should('exist')
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMax') }).should('exist')
    I.findByText(I.translate('riskSlider.step.1-3')).should('exist')
  })

  it('should set a risk to Low', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMax') })
      .trigger('mousedown')
      .trigger('mousemove', -200, 0, { force: true })
      .trigger('mouseup')

    I.findByText(I.translate('riskSlider.step.1-1')).should('exist')
  })

  it('should set a risk to Low - Medium', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMax') })
      .trigger('mousedown')
      .trigger('mousemove', -100, 0, { force: true })
      .trigger('mouseup')

    I.findByText(I.translate('riskSlider.step.1-2')).should('exist')
  })

  it('should set a risk to Medium', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMin') })
      .trigger('mousedown')
      .trigger('mousemove', 100, 0, { force: true })
      .trigger('mouseup')

    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMax') })
      .trigger('mousedown')
      .trigger('mousemove', -100, 0, { force: true })
      .trigger('mouseup')

    I.findByText(I.translate('riskSlider.step.2-2')).should('exist')
  })

  it('should set a risk to Medium - High', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMin') })
      .trigger('mousedown')
      .trigger('mousemove', 100, 0, { force: true })
      .trigger('mouseup')

    I.findByText(I.translate('riskSlider.step.2-3')).should('exist')
  })

  it('should set a risk to High', () => {
    I.findByRole('slider', { name: I.translate('riskSlider.ariaLabelSliderMin') })
      .trigger('mousedown')
      .trigger('mousemove', 200, 0, { force: true })
      .trigger('mouseup')

    I.findByText(I.translate('riskSlider.step.3-3')).should('exist')
  })
})
