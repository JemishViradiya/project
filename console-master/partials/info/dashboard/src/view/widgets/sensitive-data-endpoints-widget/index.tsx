//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { BarChart, ChartHeader, useChartTabs, WidgetTabs } from '@ues-behaviour/dashboard'
import { DashboardData, SensitiveFilesReportCategory } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { sensitiveDataNavigate } from '../hooks/sensitiveDataNavigate'
import { useSensitiveData } from '../useSensitiveData'

const tabStore = [
  { tab: SensitiveFilesReportCategory.POLICY, index: 0, label: 'dashboard.policiesTab' },
  { tab: SensitiveFilesReportCategory.FILE_TYPE, index: 1, label: 'dashboard.fileTypesTab' },
  { tab: SensitiveFilesReportCategory.INFO_TYPE, index: 2, label: 'dashboard.infoTypesTab' },
  { tab: SensitiveFilesReportCategory.DATA_ENTITY, index: 3, label: 'dashboard.dataTypesTab' },
]

const useStyles = makeStyles(theme => ({
  sensitiveFilesCard: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 0,

    '& .chart-header': {
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(3),

      '& span': {
        paddingLeft: theme.spacing(1),
      },
    },
  },
}))

const SensitiveDataEndpointsWidget: React.FC<ChartProps> = ({ id }) => {
  const { t } = useTranslation('dlp/common')
  const classes = useStyles()
  const { currentTabIndex } = useChartTabs({
    id,
    defaultIndex: 0,
  })
  const { data: totalSensitiveData } = useStatefulReduxQuery(DashboardData.queryTotalSensitiveFilesOnEndpoints)
  const { data: sensitiveDataEndpoints } = useStatefulReduxQuery(DashboardData.querySensitiveFilesOnEndpoints, {
    variables: {
      reportCategory: tabStore?.find(item => item.index === currentTabIndex).tab,
    },
  })
  const { sensitiveDataItems } = useSensitiveData(sensitiveDataEndpoints, currentTabIndex)

  const getFilteredValue = item => {
    const { key } = sensitiveDataEndpoints

    if (!key) {
      return null
    }
    switch (key) {
      case 'POLICY':
        return { policyGuid: item?.guid }
      case 'FILE_TYPE':
        return { type: item?.label }
      case 'INFO_TYPE':
        return { infoTypes: item?.label }
      case 'DATA_ENTITY':
        return { dataEntityGuid: item?.guid }
    }
  }

  const interactionHandleClick = item => {
    const filterKey = getFilteredValue(item)
    sensitiveDataNavigate({
      offset: 0,
      max: 200,
      ...filterKey,
    })
  }

  return (
    <div className={classes.sensitiveFilesCard}>
      <ChartHeader className="chart-header">
        <Typography noWrap variant={'h2'}>
          {totalSensitiveData?.totalSensitiveCount ?? 0}
        </Typography>
        <Typography variant={'caption'}> {t('dashboard.totalSensitiveData')}</Typography>
      </ChartHeader>
      <WidgetTabs
        id={id}
        items={tabStore.map(item => ({
          label: t(item.label),
          component: sensitiveDataItems && <BarChart data={sensitiveDataItems} onInteraction={interactionHandleClick} />,
        }))}
      />
    </div>
  )
}

export default SensitiveDataEndpointsWidget
