import React from 'react'

import { cleanup, render } from '@testing-library/react'

import Tooltip from './Tooltip'

describe('Tooltip tests', () => {
  afterEach(() => cleanup())

  it('renders children', () => {
    const testID = 'testID'
    const testElement = <span data-testid={testID} />

    const { getByTestId } = render(<Tooltip>{testElement}</Tooltip>)

    expect(getByTestId(testID)).not.toBeNull()
  })
})
