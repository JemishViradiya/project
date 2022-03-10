import React from 'react'
import { useTranslation } from 'react-i18next'

import { DEFAULT_TIME_INTERVAL, getInitialGlobalTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { EppDashboardData } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'

import DashboardTemplate from './DashboardTemplate'
import { getChartLibrary } from './protect/chartLibrary'
import useEppDashboardDataSource from './protect/useEppDashboardDataSource'

const Root = React.memo(() => {
  useEppDashboardDataSource()
  const { t } = useTranslation(['epp/protect'])

  const dashboardProps = {
    id: 'protectDashboardStatic',
    title: t('protectDashboard'),
    globalTime: getInitialGlobalTime(DEFAULT_TIME_INTERVAL),
    layoutState: [
      { i: 'card1', x: 0, y: 0, w: 6, h: 3 },
      { i: 'card2', x: 6, y: 0, w: 6, h: 3 },
      { i: 'card3', x: 12, y: 0, w: 6, h: 3 },
      { i: 'card4', x: 18, y: 0, w: 6, h: 3 },
      { i: 'card5', x: 0, y: 6, w: 6, h: 3 },
      { i: 'card6', x: 6, y: 6, w: 6, h: 3 },
      { i: 'card7', x: 12, y: 6, w: 6, h: 3 },
      { i: 'card8', x: 18, y: 6, w: 6, h: 3 },
      { i: 'card9', x: 0, y: 13, w: 6, h: 3 },
      { i: 'card10', x: 0, y: 20, w: 6, h: 6 },
      { i: 'card11', x: 0, y: 32, w: 6, h: 6 },
      { i: 'card12', x: 6, y: 7, w: 18, h: 15 },
      { i: 'card13', x: 0, y: 56, w: 6, h: 13 },
      { i: 'card14', x: 16, y: 56, w: 8, h: 13 },
      { i: 'card15', x: 6, y: 56, w: 10, h: 13 },
    ],
    cardState: {
      card1: {
        chartId: 'runningThreatsRecent',
      },
      card2: {
        chartId: 'autoRunThreatsRecent',
      },
      card3: {
        chartId: 'quarantinedThreatsRecent',
      },
      card4: {
        chartId: 'uniqueToCylanceRecent',
      },
      card5: {
        chartId: 'runningThreatsTotal',
      },
      card6: {
        chartId: 'autoRunThreatsTotal',
      },
      card7: {
        chartId: 'quarantinedThreatsTotal',
      },
      card8: {
        chartId: 'uniqueToCylanceTotal',
      },
      card9: {
        chartId: 'totalAnalyzedFiles',
      },
      card10: {
        chartId: 'threatProtection',
      },
      card11: {
        chartId: 'deviceProtection',
      },
      card12: {
        chartId: 'threatEvents',
      },
      card13: {
        chartId: 'threatsByPriority',
      },
      card14: {
        chartId: 'topTenThreats',
      },
      card15: {
        chartId: 'threatClassifications',
      },
    },
    chartLibrary: getChartLibrary(t),
    nonPersistent: true,
    chartsRemovable: true,
  }

  return <DashboardTemplate {...dashboardProps} />
})

export default Root
