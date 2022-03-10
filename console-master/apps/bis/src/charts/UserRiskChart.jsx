import 'react-vis/dist/style.css'

import PropTypes from 'prop-types'
import React, { memo, useContext, useMemo } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { RiskLevel } from '../components/RiskLevel'
import BucketedUserEventsProvider from '../providers/BucketedUserEventsProvider'
import { default as RiskChart } from './RiskChart'

// Those are scores to determine how tall each bar should be.
const riskScore = {
  [RiskLevel.CRITICAL]: 100,
  [RiskLevel.HIGH]: 75,
  [RiskLevel.MEDIUM]: 50,
  [RiskLevel.LOW]: 25,
  [RiskLevel.UNKNOWN]: 13,
}

const getChartData = (bucket, interval, highlightEvent) => {
  const { datetime, critical, unknown, medium, high, low, lastEventInBucket } = bucket
  const x0 = datetime
  const x = x0 + interval

  let behaviorRiskLevel = ''
  if (critical > 0) {
    behaviorRiskLevel = RiskLevel.CRITICAL
  } else if (high > 0) {
    behaviorRiskLevel = RiskLevel.HIGH
  } else if (medium > 0) {
    behaviorRiskLevel = RiskLevel.MEDIUM
  } else if (low > 0) {
    behaviorRiskLevel = RiskLevel.LOW
  } else if (unknown > 0) {
    behaviorRiskLevel = RiskLevel.UNKNOWN
  }

  const behaviorScore = riskScore[behaviorRiskLevel]
  const highlightId = highlightEvent ? highlightEvent.id : undefined

  // TODO maybe: should the opacity change if the selected event is in the bucket, too?
  // this is up for discussion: the selected event is drawn with a marker on the chart,
  // so it's acutally being indicated...
  const opacity = bucket.lastEventInBucket.id === highlightId ? 1 : 0.5

  // Return risk chart data.
  return {
    x0,
    x,
    y0: 0,
    y: behaviorScore,
    opacity,
    color: RiskLevel.color(behaviorRiskLevel),
    riskLevel: behaviorRiskLevel.toLowerCase(),
    riskEvent: lastEventInBucket,
  }
}

const inBucketRange = (bucket, interval, time) => {
  const bot = bucket.datetime
  const top = bot + interval
  return time >= bot && time < top
}

const RenderDataConsumer = memo(props => {
  const theme = useTheme()
  const { riskEvent, highlightEvent, width, height, range, onHighlightChanged, onRiskEventSelected } = props
  const { loading, data } = useContext(BucketedUserEventsProvider.Context)

  const [buckets, interval] = useMemo(() => {
    if (loading || !data) {
      return [[], 0]
    }
    const {
      bucketedUserEvents: { buckets, interval },
    } = data
    return [buckets, interval]
  }, [data, loading])

  const [chartData, riskData] = useMemo(() => {
    const chartData = new Array(buckets.length)
    const riskData = []
    buckets.forEach((bucket, ind) => {
      const data = getChartData(bucket, interval, highlightEvent)
      chartData[ind] = data
      if (riskEvent && inBucketRange(bucket, interval, riskEvent.assessment.datetime)) {
        riskData.push({
          ...data,
          color: RiskLevel.color(riskEvent.assessment.behavioralRiskLevel),
          x0: riskEvent.assessment.datetime,
        })
      }
    })
    return [chartData, riskData]
  }, [buckets, highlightEvent, interval, riskEvent])

  // TODO: chartData doesn't have to be an array-of-array's anymore
  // since there's just one set of data being passed in always.
  // propagate that through...
  return (
    <RiskChart
      chartData={[chartData, []]}
      width={width}
      height={height}
      riskData={riskData}
      range={range}
      onHighlightChanged={onHighlightChanged}
      onRiskEventSelected={onRiskEventSelected}
      theme={theme}
    />
  )
})

// wrapper to fetch query data
const UserRiskChart = ({ eEcoId, range, ...props }) => {
  const variables = {
    eEcoId,
    range,
    numberOfBuckets: 100,
  }
  return (
    <BucketedUserEventsProvider variables={variables}>
      <RenderDataConsumer {...props} range={range} />
    </BucketedUserEventsProvider>
  )
}

UserRiskChart.propTypes = {
  eEcoId: PropTypes.string.isRequired,
  riskEvent: PropTypes.object,
  highlightEvent: PropTypes.object,
  range: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  onHighlightChanged: PropTypes.func,
  onRiskEventSelected: PropTypes.func,
}
UserRiskChart.displayName = 'UserRiskChart'

export default UserRiskChart
