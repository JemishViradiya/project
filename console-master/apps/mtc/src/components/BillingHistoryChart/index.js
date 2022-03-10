import { withLDConsumer } from 'launchdarkly-react-client-sdk'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { CHART_COLORS } from '../../constants/Colors'

require('./BillingHistoryChart.scss')

const chartColors = {
  protect: CHART_COLORS.default.chart1,
  protectMobile: CHART_COLORS.default.chart2,
  optics: CHART_COLORS.default.chart5,
  persona: CHART_COLORS.default.chart4,
  personaMobile: CHART_COLORS.default.chart10,
  gateway: CHART_COLORS.default.chart8,
  dlp: CHART_COLORS.default.chart11,
}

class BillingHistoryChart extends PureComponent {
  render() {
    const { data } = this.props
    const { mtcBilling, uesTenantProvisioning } = this.props.flags
    const hasProtectMobile = mtcBilling.protectMobile.enabled && uesTenantProvisioning
    const hasPersona = mtcBilling.persona.enabled
    const hasPersonaMobile = hasPersona && mtcBilling.personaMobile.enabled && uesTenantProvisioning
    const hasGateway = mtcBilling.blackBerryGateway.enabled && uesTenantProvisioning
    const hasDLP = mtcBilling.dataLossPrevention.enabled && uesTenantProvisioning

    if (data !== null && data.length > 1) {
      // We dont want to display chart data with just one month
      const chartData = []

      data.forEach(listItem => {
        // Reformat data to match shape chart expects
        chartData.push({
          date: moment(listItem.reportDate).format('MMM YY'),
          protect: listItem.protectCount,
          protectMobile: listItem.mtdCount,
          optics: listItem.opticsCount,
          persona: listItem.personaCount,
          personaMobile: listItem.sisCount,
          gateway: listItem.gatewayCount,
          dlp: listItem.dlpCount,
        })
      })

      return (
        <div id="billing-history-chart">
          <ResponsiveContainer height={330} width="100%">
            <LineChart data={chartData}>
              <Legend />
              <XAxis dataKey="date" padding={{ left: 30, right: 30 }} reversed />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="protect" name="Protect" stroke={chartColors.protect} strokeWidth={2} />
              {hasProtectMobile && (
                <Line
                  type="monotone"
                  dataKey="protectMobile"
                  name="Protect Mobile"
                  stroke={chartColors.protectMobile}
                  strokeWidth={2}
                />
              )}
              <Line type="monotone" dataKey="optics" name="Optics" stroke={chartColors.optics} strokeWidth={2} />
              {hasPersona && <Line type="monotone" dataKey="persona" name="Persona" stroke={chartColors.persona} strokeWidth={2} />}
              {hasPersonaMobile && (
                <Line
                  type="monotone"
                  dataKey="personaMobile"
                  name="Persona Mobile"
                  stroke={chartColors.personaMobile}
                  strokeWidth={2}
                />
              )}
              {hasGateway && <Line type="monotone" dataKey="gateway" name="Gateway" stroke={chartColors.gateway} strokeWidth={2} />}
              {hasDLP && <Line type="monotone" dataKey="dlp" name="Avert" stroke={chartColors.dlp} strokeWidth={2} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    } else {
      return <div />
    }
  }
}

BillingHistoryChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      reportDate: PropTypes.string,
      protect: PropTypes.number,
      optics: PropTypes.number,
    }),
  ),
}

export default withLDConsumer()(BillingHistoryChart)
