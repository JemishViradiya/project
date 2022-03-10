import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useEventHandler } from '@ues-behaviour/react'

import Placeholder from '../components/widgets/Placeholder'
import RiskSummaryProvider from '../providers/RiskSummaryProvider'
import { Context as StateContext } from '../providers/StateProvider'
import PlaceholderBars from '../static/PlaceholderBars.svg'
import styles from './RiskSummary.module.less'

const SummaryItem = memo(({ index, filterKey, filterValue, bucket, count }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const label = useMemo(() => {
    const bucketKey = `dashboard.riskSummaryServerBuckets.${bucket}`
    return `${t('dashboard.riskSummary')} - ${count} ${t(bucketKey)}`
  }, [t, count, bucket])
  const onClick = useEventHandler(
    ev => {
      ev.stopPropagation()
      navigate(`/events?${filterKey}=${filterValue}`)
    },
    [navigate, filterKey, filterValue],
  )

  return (
    <div className={styles.row} role="button" tabIndex={index} onClick={onClick} aria-label={label}>
      <div className={styles.name}>{t(`dashboard.riskSummaryServerBuckets.${bucket}`)}</div>
      <div className={styles.value}>{count}</div>
    </div>
  )
})

const RiskSummary = ({ resizing, width, height }) => {
  const renderData = useCallback(
    ({ data }) => {
      if (resizing) {
        return null
      }

      if (!data || !data.riskSummary) {
        return null
      }

      // no non-zero values
      if (!data.riskSummary.some(x => x.count !== 0)) {
        return (
          <Placeholder
            graphic={PlaceholderBars}
            heading="dashboard.noRiskData"
            description="dashboard.noRiskDataDescription"
            width={width}
            height={height}
          />
        )
      }

      const chartData = data.riskSummary
      const riskList = chartData.map((row, index) => (
        <SummaryItem
          key={row.bucket}
          index={index}
          filterKey={row.key}
          filterValue={row.value}
          bucket={row.bucket}
          count={row.count}
        />
      ))

      return <div className={styles.list}>{riskList}</div>
    },
    [height, resizing, width],
  )

  const { currentTimePeriod: range } = useContext(StateContext)
  const variables = useMemo(
    () => ({
      range,
    }),
    [range],
  )
  return (
    <RiskSummaryProvider variables={variables}>
      <RiskSummaryProvider.Consumer>{renderData}</RiskSummaryProvider.Consumer>
    </RiskSummaryProvider>
  )
}

RiskSummary.propTypes = {
  resizing: PropTypes.bool,
}
RiskSummary.displayName = 'RiskSummary'

export default RiskSummary
