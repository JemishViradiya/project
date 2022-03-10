import React from 'react'

import { render } from '@testing-library/react'

import { useStatefulApolloQuery } from '@ues-data/shared'

jest.mock('@ues-data/shared', () => ({
  ...jest.requireActual('@ues-data/shared'),
  useStatefulApolloQuery: jest.fn(),
}))

const mockMapOptionsProvider = () => {
  jest.doMock('../../providers/MapOptionsProvider', () => {
    const Context = React.createContext([])
    const { Provider } = Context
    return {
      Context,
      Provider,
    }
  })
  return require('../../providers/MapOptionsProvider').Provider
}

const prepareComponent = (props, providedValue) => {
  const ProviderMock = mockMapOptionsProvider()
  const EventInfoView = require('./EventInfoView').default
  return () => (
    <ProviderMock value={providedValue}>
      <EventInfoView {...props} />
    </ProviderMock>
  )
}

const createSut = (props, providedValue) => {
  const Component = prepareComponent(props, providedValue)
  return render(<Component />)
}

// TODO Fix this test - missing behaviours provider
describe.skip('EventInfoView', () => {
  it('should call event details query with proper parameters', () => {
    useStatefulApolloQuery.mockReturnValueOnce({ loading: 'true', data: {}, error: {} })
    const eventId = 'EVENT_ID'
    const mapOptions = [{ riskTypes: ['RISK_TYPE'] }]

    createSut({ eventId }, mapOptions)

    expect(useStatefulApolloQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({
          definitions: [expect.objectContaining({ name: expect.objectContaining({ value: 'eventDetails' }) })],
        }),
      }),
      {
        variables: { id: 'EVENT_ID', riskTypes: ['RISK_TYPE'] },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      },
    )
  })
})
