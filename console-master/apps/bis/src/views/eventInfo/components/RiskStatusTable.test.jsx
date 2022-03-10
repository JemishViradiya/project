import '@testing-library/jest-dom/extend-expect'

import React from 'react'

import { act, render, screen } from '@testing-library/react'

import { FixupDetailsQuery, RiskEnginesSettingsQuery } from '@ues-data/bis'

import { MockedApolloProvider } from '../../../../tests/utils'
import useClientParams from '../../../components/hooks/useClientParams'
import { default as RiskEngineSettingsProvider } from '../../../providers/RiskEngineSettingsProvider'
import { createRiskEngineSettingsQueryResultMock } from '../../settingsRiskEngines/__fixtures__/RiskEngineSettings.fixture'
import RiskStatusTable from './RiskStatusTable'

const { query: fixupDetailsQuery } = FixupDetailsQuery

const features = { RiskScoreResponseFormat: true, AppAnomalyDetection: true }

jest.mock('../../components/hooks/useClientParams')

const getDefaultMocks = features => [
  {
    request: {
      query: RiskEnginesSettingsQuery(features.AppAnomalyDetection, features.IpAddressRisk, features.NetworkAnomalyDetection).query,
    },
    result: createRiskEngineSettingsQueryResultMock(features),
  },
  {
    request: { query: fixupDetailsQuery, variables: { datapointId: 'DATAPOINT_ID' } },
    result: { loading: false, data: { fixupDetails: null } },
  },
]

const defaultProps = {
  riskLevel: 'MEDIUM',
  riskScore: 94.65080155849842,
  appAnomalyRiskScore: 20,
  geozoneRiskLevel: 'HIGH',
  geozoneName: 'Downtown Office',
  datapointId: 'DATAPOINT_ID',
  behavioralRiskScore: 80,
}

const testedComponent = (mocks, props) => (
  <MockedApolloProvider mocks={mocks}>
    <RiskEngineSettingsProvider>
      <RiskStatusTable {...props} />
    </RiskEngineSettingsProvider>
  </MockedApolloProvider>
)

const renderComponent = (mocks = getDefaultMocks(features), props = defaultProps) => render(testedComponent(mocks, props))

const waitForData = () => act(async () => new Promise(resolve => setTimeout(resolve, 1)))

describe('RiskStatusTable', () => {
  beforeAll(() => {
    useClientParams.mockImplementation(() => ({
      features,
    }))
  })

  it('renders app anomaly row with safe string', async () => {
    renderComponent()
    await waitForData()

    expect(screen.getByText('App anomaly')).toBeTruthy()
    expect(screen.getByText('Safe. 20% app anomaly risk score. App usage is consistent with past behavior.')).toBeTruthy()
  })

  it('renders app anomaly row with at risk string', async () => {
    const props = { ...defaultProps, appAnomalyRiskScore: 66 }
    renderComponent(undefined, props)
    await waitForData()

    expect(screen.getByText('App anomaly')).toBeTruthy()
    expect(screen.getByText('At risk. 66% app anomaly risk score. App usage is inconsistent with past behavior.')).toBeTruthy()
  })

  it('doesnt render app anomaly row when score is not available', async () => {
    const props = { ...defaultProps, appAnomalyRiskScore: undefined }
    renderComponent(undefined, props)
    await waitForData()

    expect(screen.queryByText('App anomaly')).toBeFalsy()
  })

  it('doesnt render app anomaly score when app anomaly seetings range is not available', async () => {
    const features = { RiskScoreResponseFormat: true, AppAnomalyDetection: false }
    useClientParams.mockImplementation(() => ({
      features,
    }))
    renderComponent(getDefaultMocks(features))
    await waitForData()

    expect(screen.getByText('App anomaly')).toBeTruthy()
    expect(screen.queryByText('Safe. 20% app anomaly risk score. App usage is consistent with past behavior.')).toBeFalsy()
  })
})
