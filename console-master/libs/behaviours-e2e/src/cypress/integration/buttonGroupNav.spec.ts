//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

describe('Button Group Nav', () => {
  const BUTTON_1_NAME = 'Button1'
  const BUTTON_1_CONTENT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec ultricies tellus, sed sollicitudin urna. Quisque condimentum placerat interdum. Pellentesque non ornare purus. Sed consequat elementum ante, a placerat tellus volutpat nec. Suspendisse potenti. Mauris posuere diam id velit lacinia cursus quis sed diam. Vivamus pretium sapien a tortor tempus dapibus. In hac habitasse platea dictumst. Morbi pellentesque sollicitudin quam, at tincidunt arcu lacinia a. Vestibulum dolor turpis, eleifend vel est a, dignissim vestibulum nisi. In tristique urna ac elit pulvinar, sit amet lacinia ipsum sodales. Ut dignissim mauris posuere enim cursus lacinia. Donec venenatis justo non enim aliquet euismod.'

  const BUTTON_2_NAME = 'Button2'
  const BUTTON_2_CONTENT =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas imperdiet velit. Ut vel volutpat tellus. Fusce efficitur felis eu ligula facilisis dictum.'

  const BUTTON_3_NAME = 'Button3'
  const BUTTON_3_DESCRIPTION = 'Integer ac felis porttitor, elementum erat ut, tincidunt eros.'

  before(() => {
    I.visit('/iframe.html?id=layout-page-elements-button-group-nav--button-group-nav&viewMode=story')
  })

  it('should render an input group nav with initial content for the button 1', () => {
    I.findByRole('button', { name: BUTTON_1_NAME }).should('exist')
    I.findByRole('button', { name: BUTTON_2_NAME }).should('exist')
    I.findByRole('button', { name: BUTTON_3_NAME }).should('exist')
    I.findByText(BUTTON_1_CONTENT).should('exist')
    I.findByText(BUTTON_2_CONTENT).should('not.exist')
    I.findByText(BUTTON_3_DESCRIPTION).should('not.exist')
  })

  it('should update a content for the button 2', () => {
    I.findByRole('button', { name: BUTTON_2_NAME }).click()
    I.findByText(BUTTON_1_CONTENT).should('not.exist')
    I.findByText(BUTTON_2_CONTENT).should('exist')
    I.findByText(BUTTON_3_DESCRIPTION).should('not.exist')
  })

  it('should update a content for the button 3', () => {
    I.findByRole('button', { name: BUTTON_3_NAME }).click()
    I.findByText(BUTTON_1_CONTENT).should('not.exist')
    I.findByText(BUTTON_2_CONTENT).should('exist')
    I.findByText(BUTTON_3_DESCRIPTION).should('exist')
  })
})
