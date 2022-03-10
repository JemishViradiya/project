import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { act, cleanup, render, waitFor } from '@testing-library/react'

import { EventDetailsQuery, FixupDetailsQuery, RiskEnginesSettingsQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../../tests/utils'
import { testMockEvent } from '../../providers/__fixtures__/eventDetails.fixture'
import MapOptionsProvider from '../../providers/MapOptionsProvider'
import ThemeProvider from '../../theme/ThemeProvider'
import { createGeozoneListQueryMock } from '../geozones/__fixtures__/geozoneListQuery.fixture'
import { createRiskEngineSettingsQueryResultMock } from '../settingsRiskEngines/__fixtures__/RiskEngineSettings.fixture'
import EventInfoDashboard from './index'

const { query: fixupDetailsQuery } = FixupDetailsQuery
const { query: riskEnginesSettingsQuery } = RiskEnginesSettingsQuery()

jest.mock('../../providers/OperatingModeProvider', () => () => ({
  operatingMode: 'ACTIVE',
}))
jest.mock('../../providers/AddressLookupProvider', () => () => <div />)
jest.mock('../../components/hooks/useClientParams', () => () => ({
  privacyMode: { mode: false },
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ id: 'ID' }),
}))

const mocks = [
  {
    request: { query: fixupDetailsQuery, variables: { datapointId: 'DATAPOINT_ID' } },
    result: { loading: false, data: { fixupDetails: null } },
  },
  {
    request: { query: EventDetailsQuery().query, variables: { id: 'ID', riskTypes: ['RISK_TYPE'] } },
    result: {
      loading: false,
      data: {
        eventDetails: testMockEvent,
      },
    },
  },
  {
    request: { query: riskEnginesSettingsQuery },
    result: createRiskEngineSettingsQueryResultMock(),
  },
  createGeozoneListQueryMock(),
]

describe('EventInfoDashBoard', () => {
  afterEach(cleanup)

  it('should render without crash', async () => {
    // given
    let sut

    // when
    await act(async () => {
      sut = render(
        <MemoryRouter>
          <MockedApolloProvider mocks={mocks}>
            <ThemeProvider>
              <MapOptionsProvider.Context.Provider value={[{ riskTypes: ['RISK_TYPE'] }, jest.fn()]}>
                <EventInfoDashboard />
              </MapOptionsProvider.Context.Provider>
            </ThemeProvider>
          </MockedApolloProvider>
        </MemoryRouter>,
      )
      await waitFor(() => sut.getByText('Risk status'))
    })

    // then
    expect(sut.getByText('Risk status')).toBeTruthy()
    expect(sut.getByText('Assigned action')).toBeTruthy()
    expect(sut.getByText('User information')).toBeTruthy()
    expect(sut.getByRole('application')).toBeTruthy()
  })
})
