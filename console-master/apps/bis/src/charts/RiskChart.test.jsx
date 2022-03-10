import React from 'react'
import { I18nextProvider } from 'react-i18next'

import { cleanup, render } from '@testing-library/react'

import { useTheme } from '@material-ui/core/styles'

import i18n from '../i18n'
import { RiskChart } from './RiskChart'

const testDate = new Date('2018-11-20T20:00:00')

const chartData = [
  [
    {
      x0: 1542719280000,
      x: 1542721110000,
      y0: 51,
      y: 75,
      opacity: 0.5,
      color: '#f58330',
      riskLevel: 'high',
      riskEvent: {
        assessment: {
          id: 'AWblI8du9IdZoby47RKQ',
          behaviorRisk: 49,
          behavioralRiskLevel: 'HIGH',
          geozoneRiskLevel: 'HIGH',
          location: {
            lat: 37.40203728638555,
            lon: -122.05186152904757,
            geohash: '9q9hy8ud9mpf',
          },
          datetime: 1542719280000,
          ip: '157.120.151.151',
          userId: 'u4',
        },
      },
    },
    {
      x0: 1542744900000,
      x: 1542762000000,
      y0: 76,
      y: 100,
      opacity: 0.5,
      color: '#d52c16',
      riskLevel: 'critical',
      riskEvent: {
        assessment: {
          id: 'AWcN9r9sbqhPxVmeG0Fv',
          behaviorRisk: 98,
          behavioralRiskLevel: 'CRITICAL',
          geozoneRiskLevel: 'LOW',
          location: {
            lat: -34.90290182037353,
            lon: -56.1615236094348,
            geohash: '6cb16n07vesb',
          },
          datetime: 1542744900000,
          reason: 'Failed geo-velocity',
          ip: '224.172.228.77',
        },
      },
    },
  ],
  // For location risk bars:
  [
    {
      x0: 1542719280000,
      x: 1542721110000,
      y0: 0,
      y: 50,
      opacity: 0.5,
      color: '#fdc841',
      riskLevel: 'medium',
      riskEvent: {
        assessment: {
          id: 'AWblI8du9IdZoby47RKQ',
          behaviorRisk: 49,
          behaviorRiskLevel: 'HIGH',
          geozoneRiskLevel: 'HIGH',
          location: {
            lat: 37.40203728638555,
            lon: -122.05186152904757,
            geohash: '9q9hy8ud9mpf',
          },
          datetime: 1542719280000,
          reason: 'Red zone',
          ip: '157.120.151.151',
          userId: 'u4',
        },
      },
    },
    {
      x0: 1542744900000,
      x: 1542762000000,
      y0: 0,
      y: 75,
      opacity: 0.5,
      color: '#f58330',
      riskLevel: 'high',
      riskEvent: {
        assessment: {
          id: 'AWcN9r9sbqhPxVmeG0Fv',
          behaviorRisk: 98,
          behavioralRiskLevel: 'CRITICAL',
          geozoneRiskLevel: 'LOW',
          location: {
            lat: -34.90290182037353,
            lon: -56.1615236094348,
            geohash: '6cb16n07vesb',
          },
          datetime: 1542744900000,
          reason: 'Failed geo-velocity',
          ip: '224.172.228.77',
        },
      },
    },
  ],
]

const defaultProps = {
  t: key => key,
  height: 150,
  width: 800,
  range: { last: 'LAST_DAY' },
}

const createSut = props =>
  render(
    <I18nextProvider i18n={i18n}>
      <RiskChart {...defaultProps} {...props} />
    </I18nextProvider>,
  )

describe('RiskChart', () => {
  let originalDate
  const theme = useTheme()

  beforeAll(() => {
    originalDate = Date
  })

  beforeEach(() => {
    Date.now = jest.fn().mockReturnValue(testDate)
  })

  afterEach(() => {
    cleanup()
  })

  afterAll(() => {
    global.Date = originalDate
  })

  it('check full DOM rendered components and their properties', () => {
    const props = {
      chartData,
      riskData: [chartData[0][1], chartData[1][1]],
      theme,
    }
    const { container, getByText } = createSut(props)

    expect(container.querySelector('.rv-xy-plot.chart')).toBeTruthy()
    expect(container.querySelectorAll('.rv-xy-plot__axis.rv-xy-plot__axis--horizontal').length).toBe(1)
    expect(container.querySelectorAll('.rv-xy-plot__series.rv-xy-plot__series--rect').length).toBe(2)
    expect(container.querySelectorAll('.rv-xy-plot__grid-lines').length).toBe(2)
    expect(container.querySelector('.rv-xy-plot__series.rv-xy-plot__series--line')).toBeTruthy()
    expect(container.querySelector('.rv-xy-plot__series.rv-xy-plot__series--mark')).toBeTruthy()
    expect(getByText('3:15 pm')).toBeTruthy()
  })

  it('empty chart should be rendered properly', () => {
    const props = { chartData: [], theme }
    const { container } = createSut(props)

    expect(container.querySelector('.rv-xy-plot.chart')).toBeTruthy()
    expect(container.querySelectorAll('.rv-xy-plot__axis.rv-xy-plot__axis--horizontal').length).toBe(1)
    expect(container.querySelectorAll('.rv-xy-plot__series.rv-xy-plot__series--rect').length).toBe(0)
    expect(container.querySelectorAll('.rv-xy-plot__grid-lines').length).toBe(2)
    expect(container.querySelector('.rv-xy-plot__series.rv-xy-plot__series--line')).toBeFalsy()
    expect(container.querySelector('.rv-xy-plot__series.rv-xy-plot__series--mark')).toBeFalsy()
  })
})
