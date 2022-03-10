import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import CollapsibleInfo from './CollapsibleInfo'

describe('CollapsibleInfo', () => {
  const Foo = () => <div data-testid="Foo" />

  afterEach(cleanup)

  test('uncollapse/collapse lifecycle', () => {
    const tree = (
      <CollapsibleInfo title="title">
        <Foo />
      </CollapsibleInfo>
    )
    const { queryByRole, queryByTestId, rerender } = render(tree)

    const btn = queryByRole('button')
    expect(btn).toBeTruthy()

    // starts uncollapsed
    expect(queryByTestId('Foo')).toBeTruthy()

    // click to collapse
    act(() => {
      fireEvent.click(btn, { preventDefault: jest.fn() })
    })
    rerender()
    expect(queryByTestId('Foo')).toBeFalsy()

    // click to uncollapse again
    act(() => {
      fireEvent.click(btn, { preventDefault: jest.fn() })
    })
    rerender()
    expect(queryByTestId('Foo')).toBeFalsy()
  })
})
