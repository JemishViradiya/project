import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, cleanup, render } from '@testing-library/react'

import { AddressLookupQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../tests/utils'
import AddressLookupProvider from './AddressLookupProvider'

const { query } = AddressLookupQuery

let mocks = []
const wrapper = ({ children }) => {
  return <MockedApolloProvider mocks={mocks}>{children}</MockedApolloProvider>
}

describe('AddressLookupProvider', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders location', async () => {
    const location = {
      lat: 45,
      lon: -65,
    }
    mocks = [
      {
        request: { query, variables: location },
        result: { data: { geocode: 'Somewhere nice' } },
      },
    ]
    const { container } = render(<AddressLookupProvider location={location} />, { wrapper })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1))
    })
    expect(container.textContent).toEqual('Somewhere nice')
  })

  it('renders nothing on no data', async () => {
    const location = {
      lat: 45,
      lon: -65,
    }
    mocks = [
      {
        request: { query, variables: location },
        result: { data: {} },
      },
    ]
    const { container } = render(<AddressLookupProvider location={location} />, { wrapper })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1))
    })
    expect(container.textContent).toEqual('')
  })

  it('renders nothing on error', async () => {
    const location = {
      lat: 45,
      lon: -65,
    }
    mocks = [
      {
        request: { query, variables: location },
        result: { error: new Error('test') },
      },
    ]
    const { container } = render(<AddressLookupProvider location={location} />, { wrapper })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1))
    })
    expect(container.textContent).toEqual('')
  })

  it('renders nothing while loading', async () => {
    const location = {
      lat: 45,
      lon: -65,
    }
    mocks = [
      {
        request: { query, variables: location },
        result: { loading: true },
      },
    ]
    const { container } = render(<AddressLookupProvider location={location} />, { wrapper })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1))
    })
    expect(container.textContent).toEqual('')
  })

  it('renders nothing even with bad return value', async () => {
    const location = {
      lat: 45,
      lon: -65,
    }
    mocks = [
      {
        request: { query, variables: location },
        result: {},
      },
    ]
    const { container } = render(<AddressLookupProvider location={location} />, { wrapper })
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1))
    })
    expect(container.textContent).toEqual('')
  })
})
