import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'

import { useEventHandler } from '@ues-behaviour/react'

import Placeholder from '../components/widgets/Placeholder'
import GeozoneRiskLineProvider from '../providers/GeozoneRiskLineProvider'
import { Context as StateContext } from '../providers/StateProvider'
import PlaceholderLine from '../static/PlaceholderLine.svg'
import LineChart from './LineChart'

export const GeozoneRiskLine = memo(({ width, height }) => {
  const navigate = useNavigate()
  const {
    palette: {
      bis: { risk: riskTheme },
    },
  } = useTheme()
  const onLineSelected = useEventHandler(
    (ev, series) => {
      ev.stopPropagation()
      navigate(`/events?geozoneRiskLevel=${series.riskLevel}`)
    },
    [navigate],
  )

  const colorFor = useMemo(
    () => ({
      high: riskTheme.high,
      medium: riskTheme.medium,
      low: riskTheme.low,
    }),
    [riskTheme],
  )

  const GeozonePlaceholder = useCallback(
    () => (
      <Placeholder
        graphic={PlaceholderLine}
        heading="dashboard.noGeozoneRisk"
        description="dashboard.noGeozoneRiskDescription"
        width={width}
        height={height}
      />
    ),
    [height, width],
  )

  const renderData = useMemo(
    () => ({ data }) => {
      if (!data || !data.geozoneRiskLine) {
        return null
      }

      let yMax = 0
      const firstSeries = data.geozoneRiskLine[0].data
      if (firstSeries.length === 0) {
        return <GeozonePlaceholder />
      }

      const startDate = new Date(firstSeries[0].time * 1000)
      const endDate = new Date(firstSeries[firstSeries.length - 1].time * 1000)
      const chartData = data.geozoneRiskLine.map(series => {
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
        return <GeozonePlaceholder />
      }
    },
    [GeozonePlaceholder, colorFor, width, height, onLineSelected],
  )

  const { currentTimePeriod: range } = useContext(StateContext)
  const variables = useMemo(
    () => ({
      range,
    }),
    [range],
  )
  return (
    <GeozoneRiskLineProvider variables={variables}>
      <GeozoneRiskLineProvider.Consumer>{renderData}</GeozoneRiskLineProvider.Consumer>
    </GeozoneRiskLineProvider>
  )
})

GeozoneRiskLine.displayName = 'GeozoneRiskLine'
GeozoneRiskLine.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}
