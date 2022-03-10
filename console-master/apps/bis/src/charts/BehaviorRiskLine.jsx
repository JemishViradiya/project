import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'

import { useEventHandler } from '@ues-behaviour/react'

import Placeholder from '../components/widgets/Placeholder'
import BehaviorRiskLineProvider from '../providers/BehaviorRiskLineProvider'
import { Context as StateContext } from '../providers/StateProvider'
import PlaceholderLine from '../static/PlaceholderLine.svg'
import LineChart from './LineChart'

export const BehaviorRiskLine = memo(({ width, height }) => {
  const navigate = useNavigate()
  const {
    palette: {
      bis: { risk: riskTheme },
    },
  } = useTheme()
  const onLineSelected = useEventHandler(
    (ev, series) => {
      ev.stopPropagation()
      navigate(`/events?behavioralRiskLevel=${series.riskLevel}`)
    },
    [navigate],
  )

  const colorFor = useMemo(
    () => ({
      critical: riskTheme.critical,
      high: riskTheme.high,
      medium: riskTheme.medium,
      low: riskTheme.low,
    }),
    [riskTheme],
  )

  const BehaviorRiskPlaceholder = useCallback(
    () => (
      <Placeholder
        heading="dashboard.noIdentityRisk"
        description="dashboard.noIdentityRiskDescription"
        graphic={PlaceholderLine}
        width={width}
        height={height}
      />
    ),
    [height, width],
  )

  const renderData = useMemo(
    () => ({ data }) => {
      if (!data || !data.behaviorRiskLine) {
        return null
      }

      let yMax = 0
      const firstSeries = data.behaviorRiskLine[0].data
      if (firstSeries.length === 0) {
        return <BehaviorRiskPlaceholder />
      }

      const startDate = new Date(firstSeries[0].time * 1000)
      const endDate = new Date(firstSeries[firstSeries.length - 1].time * 1000)
      const chartData = data.behaviorRiskLine.map(series => {
        return {
          riskLevel: series.bucket.toUpperCase(),
          color: colorFor[series.bucket],
          data: series.data.map(point => {
            if (yMax < point.count) {
              yMax = point.count
            }
            return {
              x: new Date(point.time * 1000),
              y: point.count,
            }
          }),
        }
      })

      // Check for existence of line with non-zero data
      const hasValidData = chartData.some(line => line.data.some(point => point.y !== 0))

      if (hasValidData) {
        return (
          <LineChart
            data={chartData}
            yMax={yMax}
            width={width}
            height={height}
            start={startDate}
            end={endDate}
            onLineSelected={onLineSelected}
          />
        )
      } else {
        return <BehaviorRiskPlaceholder />
      }
    },
    [BehaviorRiskPlaceholder, colorFor, width, height, onLineSelected],
  )

  const { currentTimePeriod: range } = useContext(StateContext)
  const variables = useMemo(
    () => ({
      range,
    }),
    [range],
  )
  return (
    <BehaviorRiskLineProvider variables={variables}>
      <BehaviorRiskLineProvider.Consumer>{renderData}</BehaviorRiskLineProvider.Consumer>
    </BehaviorRiskLineProvider>
  )
})

BehaviorRiskLine.displayName = 'BehaviorRiskLine'
BehaviorRiskLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

export default BehaviorRiskLine
