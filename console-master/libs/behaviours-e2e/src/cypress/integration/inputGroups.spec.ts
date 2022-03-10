//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

describe('Input Groups', () => {
  before(() => {
    I.visit('/iframe.html?id=input-groups--input-groups&viewMode=story')
  })

  it('should render an initial input group', () => {
    I.findByLabelText('Port').should('exist')
    I.findByRole('button', { name: 'remove-input-group-button-0' }).should('not.exist')
  })

  it('should add an input group', () => {
    I.findAllByLabelText('Port').should('have.length', 1)
    I.findByRole('button', { name: 'add-input-group-button' }).click()
    I.findAllByLabelText('Port').should('have.length', 2)
  })

  it('should remove the input group', () => {
    I.findByRole('button', { name: 'add-input-group-button' }).click()
    I.findAllByLabelText('Port').should('have.length', 3)
    I.findByRole('button', { name: 'remove-input-group-button-1' }).click()
    I.findAllByLabelText('Port').should('have.length', 2)
  })

  it('should show a validation error message', () => {
    const VALIDATION_MESSAGE = 'Port must be an integer!'

    I.findByRole('button', { name: 'add-input-group-button' }).click()

    I.findAllByLabelText('Port').each((input, idx) => {
      if (idx === 0) I.wrap(input).type('test')
    })
    I.findByText(VALIDATION_MESSAGE).should('exist')
  })
})
