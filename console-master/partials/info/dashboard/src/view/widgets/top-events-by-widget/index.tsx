//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'

import type { ChartProps } from '@ues-behaviour/dashboard'
import {
  ChartHeader,
  getDateRangeTimestampString,
  GroupBySelect,
  TimeIntervalId,
  TimeSelectSmall,
  TopList,
  useChartTabs,
  useCustomTimeSelect,
  WidgetTabs,
} from '@ues-behaviour/dashboard'
import { DashboardData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { exfiltrationEventsNavigate } from '../hooks/exfiltrationEventsNavigate'

const tabStore = [
  { tab: 'POLICIES', index: 0, label: 'dashboard.policiesTab' },
  { tab: 'USERS', index: 1, label: 'dashboard.usersTab' },
  { tab: 'DEVICES', index: 2, label: 'dashboard.devicesTab' },
  { tab: 'FILES', index: 3, label: 'dashboard.filesTab' },
  { tab: 'DATA_ENTITIES', index: 4, label: 'dashboard.dataEntities' },
]

enum TopEventsByWidgetsType {
  'POLICIES' = 'policyName',
  'USERS' = 'userName',
  'DEVICES' = 'clientName',
  'FILES' = 'fileName',
  'DATA_ENTITIES' = 'dataEntityName',
}

const maxRecords = 10

const useStyles = makeStyles(theme => ({
  topEventsCard: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 0,

    '& .chart-header': {
      justifyContent: 'flex-end',
      position: 'absolute',
      marginTop: theme.spacing(1.5),
      '& .MuiChip-clickable': {
        marginRight: theme.spacing(15),
        zIndex: 2,
      },
    },

    '& [role="group"]': {
      position: 'absolute',
      backgroundColor: 'white',
      zIndex: 1,
    },
  },
}))

const TopEventsByWidget: React.FC<ChartProps> = ({ id, globalTime }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()

  const { showCustomTime, customDashboardTime, setCustomDashboardTime } = useCustomTimeSelect({
    id,
    defaultTimeInterval: TimeIntervalId.Last30Days,
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
  const variables = useMemo(() => {
    return {
      variables: {
        reportCategory: foundCategoryByIndex,
        queryParams: queryParams,
      },
    }
  }, [foundCategoryByIndex, queryParams])
  const { error, loading, data: dataByReportCategory, refetch } = useStatefulReduxQuery(DashboardData.queryTopEvents, variables)
  const data = useMemo(() => dataByReportCategory && dataByReportCategory[foundCategoryByIndex], [
    dataByReportCategory,
    foundCategoryByIndex,
  ])

  const onTopEventIteraction = data => {
    exfiltrationEventsNavigate({
      startTime: startDate,
      stopTime: endDate,
      [TopEventsByWidgetsType[foundCategoryByIndex]]: data.label,
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

export default TopEventsByWidget
