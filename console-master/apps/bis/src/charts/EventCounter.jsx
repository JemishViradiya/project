import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import EventCountProvider from '../providers/EventCountProvider'
import StateProvider from '../providers/StateProvider'
import styles from './Common.module.less'

const useRenderDataFn = () => {
  const { t } = useTranslation()

  return useCallback(
    ({ data }) => {
      if (!data) {
        return null
      }

      return (
        <span className={styles.counter} aria-label={t('dashboard.totalEventsCounter')}>
          {data.eventCount}
        </span>
      )
    },
    [t],
  )
}

const EventCount = memo(({ range }) => {
  const variables = useMemo(() => ({ range }), [range])

  return (
    <EventCountProvider variables={variables}>
      <EventCountProvider.Consumer>{useRenderDataFn()}</EventCountProvider.Consumer>
    </EventCountProvider>
  )
})

const renderStateConsumer = ({ currentTimePeriod: range }) => <EventCount range={range} />

const EventCounter = memo(() => {
  return <StateProvider.Consumer>{renderStateConsumer}</StateProvider.Consumer>
})

export default EventCounter
