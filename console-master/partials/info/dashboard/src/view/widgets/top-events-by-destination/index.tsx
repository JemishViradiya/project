//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import {
  ChartHeader,
  getDateRangeTimestampString,
  TimeIntervalId,
  TimeSelectSmall,
  TopList,
  useChartTabs,
  useCustomTimeSelect,
  WidgetTabs,
} from '@ues-behaviour/dashboard'
import { DashboardData, ExfiltrationTypeEventsBy } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { exfiltrationEventsNavigate } from '../hooks/exfiltrationEventsNavigate'

const tabStore = [
  { tab: ExfiltrationTypeEventsBy.Email, index: 0, label: 'dashboard.emailTab' },
  { tab: ExfiltrationTypeEventsBy.Browser, index: 1, label: 'dashboard.browserTab' },
  { tab: ExfiltrationTypeEventsBy.RemovableMedia, index: 2, label: 'dashboard.usbTab' },
]

const maxRecords = 10

const useStyles = makeStyles(theme => ({
  topEventsCard: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 0,

    '& .chart-header': {
      justifyContent: 'flex-end',
      position: 'absolute',
      '& .MuiChip-clickable': {
        marginRight: theme.spacing(15),
        zIndex: 2,
      },
    },

    '& [role="group"]': {
      position: 'absolute',
      backgroundColor: theme.palette.background.default,
      zIndex: 1,
    },
  },
}))

const TopEventsByDestination: React.FC<ChartProps> = ({ id, globalTime }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()

  const { showCustomTime, customDashboardTime, setCustomDashboardTime } = useCustomTimeSelect({
    id,
    defaultTimeInterval: TimeIntervalId.Last7Days,
  })

  const { currentTabIndex } = useChartTabs({
    id,
    defaultIndex: 0,
  })

  const timeInterval = useMemo(
    () => (showCustomTime ? customDashboardTime : globalTime),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCustomTime, customDashboardTime.timeInterval, globalTime.timeInterval],
  )

  const { startDate, endDate } = useMemo(
    () => getDateRangeTimestampString(timeInterval),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeInterval.timeInterval],
  )

  const queryParams = useMemo(() => {
    return {
      maxRecords: maxRecords,
      startTime: startDate,
      stopTime: endDate,
    }
  }, [startDate, endDate])

  const foundCategoryByIndex = useMemo(() => tabStore.find(item => item.index === currentTabIndex).tab, [currentTabIndex])
  const variables = useMemo(
    () => ({
      variables: {
        reportCategory: foundCategoryByIndex,
        queryParams: queryParams,
      },
    }),
    [foundCategoryByIndex, queryParams],
  )
  const { error, loading, data: dataByReportCategory, refetch } = useStatefulReduxQuery(DashboardData.queryTopEvents, variables)

  const data = useMemo(() => dataByReportCategory && dataByReportCategory[foundCategoryByIndex], [
    dataByReportCategory,
    foundCategoryByIndex,
  ])

  const onTopEventIteraction = data => {
    const locations = foundCategoryByIndex === ExfiltrationTypeEventsBy.RemovableMedia ? encodeURIComponent(data.label) : data.label
    exfiltrationEventsNavigate({
      startTime: startDate,
      stopTime: endDate,
      locations,
    })
  }

  return (
    <div className={classes.topEventsCard}>
      <ChartHeader className="chart-header">
        <div>
          {showCustomTime && <TimeSelectSmall dashboardTime={customDashboardTime} setDashboardTime={setCustomDashboardTime} />}
        </div>
      </ChartHeader>
      <WidgetTabs
        id={id}
        items={tabStore.map(item => ({
          label: t(item.label),
          component: <TopList data={data?.items ? data.items : []} onInteraction={onTopEventIteraction} />,
        }))}
      />
    </div>
  )
}

export default TopEventsByDestination
