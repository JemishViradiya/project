import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, fireEvent, render } from '@testing-library/react'

import { MockedApolloProvider } from '../../tests/utils'
import { Header } from './Header'

describe('Header', () => {
  afterEach(cleanup)

  test('can render', async () => {
    jest.useFakeTimers()
    const props = {
      title: <span>Title</span>,
      onSearchChange: jest.fn(),
      showMap: false,
      onHideMap: jest.fn(),
      onShowMap: jest.fn(),
      searchText: '',
      onExport: jest.fn(),
    }

    const wrapper = render(
      <MockedApolloProvider>
        <Header {...props} />
      </MockedApolloProvider>,
    )
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    expect(wrapper).not.toBeNull()
  })

  test('triggers callbacks', async () => {
    jest.useFakeTimers()
    const props = {
      title: <span>Title</span>,
      onSearchChange: jest.fn(),
      showMap: false,
      onHideMap: jest.fn(),
      onShowMap: jest.fn(),
      searchText: '',
      onExport: jest.fn(),
    }

    const wrapper = render(
      <MockedApolloProvider>
        <Header {...props} />
      </MockedApolloProvider>,
    )
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    expect(wrapper).not.toBe(null)

    // input should trigger a callback
    const input = wrapper.getByRole('searchbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: 'new text' } })
    })
    expect(props.onSearchChange).toHaveBeenCalledWith('new text')

    // export button should trigger callback
    expect(props.onExport).not.toHaveBeenCalled()
    const exportButton = wrapper.getByTitle('Export')
    await act(async () => {
      fireEvent.click(exportButton)
    })
    expect(props.onExport).toHaveBeenCalled()
  })
})
