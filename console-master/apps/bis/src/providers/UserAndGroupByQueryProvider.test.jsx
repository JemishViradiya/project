import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { cleanup, render } from '@testing-library/react'

import { useStatefulApolloQuery } from '@ues-data/shared'

import { MockedApolloProvider } from '../../tests/utils'
import { ContextConsumer, EMPTY_DATA, REQUEST, TEST_DATA } from './__fixtures__/UserAndGroupByQueryProvider.fixture'
import { UserAndGroupByQueryProvider as StateProvider } from './UserAndGroupByQueryProvider'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn().mockImplementation(() => ({ data: [] })),
}))

jest.useFakeTimers()

describe('UserAndGroupByQueryProvider', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  const mock = [
    {
      request: REQUEST,
      result: {
        loading: false,
        error: false,
        data: EMPTY_DATA,
      },
    },
  ]

  const testedComponent = mock => {
    return (
      <MockedApolloProvider mocks={mock}>
        <StateProvider searchText="searchText">
          <ContextConsumer />
        </StateProvider>
      </MockedApolloProvider>
    )
  }
  const createSut = mock => {
    return render(testedComponent(mock))
  }

  it('can return empty data set without error', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: false, error: undefined, data: EMPTY_DATA }))
    const sut = createSut(mock)
    expect(sut).not.toBeNull()
    expect(sut.getByText('data')).not.toBeNull()
  })

  it('can return loading indicator', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: true, error: undefined, data: EMPTY_DATA }))
    const sut = createSut(mock)
    expect(sut).not.toBeNull()
    expect(sut.getByText('loading')).not.toBeNull()
  })

  it('can return error indicator', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: false, error: { errorMsg: 'errorMsg' }, data: EMPTY_DATA }))
    const sut = createSut(mock)
    expect(sut).not.toBeNull()
    expect(sut.getByText('error')).not.toBeNull()
  })

  it('can return data without error', async () => {
    useStatefulApolloQuery.mockImplementationOnce(() => ({ loading: false, error: undefined, data: TEST_DATA }))
    const sut = createSut(mock)
    expect(sut).not.toBeNull()
    expect(sut.getByText('data')).not.toBeNull()
    expect(sut.getByText('total: 2')).not.toBeNull()
  })
})
