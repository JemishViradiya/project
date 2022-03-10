import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DashboardTime } from '@ues-behaviour/dashboard'
import { ChartHeader, Count, getDateRangeISOString, prevDateOfEqualPeriod } from '@ues-behaviour/dashboard'
import { MobileProtectData, queryMobileDevicesWithThreats } from '@ues-data/mtd'
import { useStatefulAsyncQuery } from '@ues-data/shared'
import { getEventTypeItems, MobileAlertGroupBy } from '@ues-mtd/shared'
import { DeviceMobile } from '@ues/assets'

import { useBackendState } from './hooks/useBackendState'
import { mobileAlertNavigate, useFeatureNavigation } from './hooks/useDashboardNavigate'
import { useStyles } from './styles'

export interface DeltaChartProps {
  globalTime?: DashboardTime
  onInteraction?: () => void
}

interface ResolutionCounts {
  current: number
  previous: number
}

function getCounts(rsp: MobileProtectData.Response<MobileProtectData.MobileThreatEventCount[]>): ResolutionCounts {
  if (rsp) {
    return {
      current: rsp.data.find(item => item.queryId === MobileProtectData.ThreatResolution.CURRENT).count,
      previous: rsp.data.find(item => item.queryId === MobileProtectData.ThreatResolution.PREVIOUS).count,
    }
  } else {
    return { current: 0, previous: 0 }
  }
}

export const MobileThreatsDevicesDeltaChart: React.FC<DeltaChartProps> = ({ globalTime }) => {
  const styles = useStyles()
  const featureNavigation = useFeatureNavigation()
  const { t } = useTranslation(['mtd/common'])

  const { startDate, endDate } = useMemo(() => getDateRangeISOString(globalTime), [globalTime])
  const prevDate = useMemo(() => {
    const timeRange = { startDate: new Date(startDate), endDate: new Date(endDate) }
    return prevDateOfEqualPeriod(timeRange)
  }, [endDate, startDate])

  const request: MobileProtectData.MobileThreatEventQueryData = useMemo(() => {
    const eventTypeItems = getEventTypeItems()
    return {
      queries: [
        {
          queryId: MobileProtectData.ThreatResolution.CURRENT,
          startDateTime: startDate,
          endDateTime: endDate,
          eventTypes: eventTypeItems,
          eventStates: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
        },
        {
          queryId: MobileProtectData.ThreatResolution.PREVIOUS,
          startDateTime: prevDate.toISOString(),
          endDateTime: startDate,
          eventTypes: eventTypeItems,
          eventStates: [MobileProtectData.MobileThreatEventState.NEW, MobileProtectData.MobileThreatEventState.RESOLVED],
        },
      ],
      limit: 2,
    }
  }, [endDate, prevDate, startDate])

  const { data: deltaData, error } = useStatefulAsyncQuery(queryMobileDevicesWithThreats, {
    variables: request,
  })

  useBackendState(error)

  const { current, previous } = getCounts(deltaData)

  return (
    <div className={styles.chartContainer}>
      <ChartHeader className={styles.chartHeader}>
        <div>
          <Count
            count={current}
            icon={DeviceMobile}
            description={t('dashboard.mobileDevicesWithThreatAlertsDescription')}
            isIncreaseGood={false}
            showChange={true}
            prevCount={previous}
            onCountClick={() =>
              mobileAlertNavigate(featureNavigation, {
                detectedStart: startDate,
                detectedEnd: endDate,
                groupBy: MobileAlertGroupBy.DEVICE,
              })
            }
          />
        </div>
      </ChartHeader>
    </div>
  )
}
