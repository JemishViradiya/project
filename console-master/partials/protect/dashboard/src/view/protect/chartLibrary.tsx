/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useTheme } from '@material-ui/core/styles'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { ChartType, StatsCount } from '@ues-behaviour/dashboard'
import { EppDashboardData } from '@ues-data/epp'
import type { UesTheme } from '@ues/assets'
import { BasicBlock, BasicNoteFull, BrandCylance } from '@ues/assets'

import { DeviceProtectionGauge, ThreatProtectionGauge } from './../../widgets'
import { ThreatEvents } from './threatEvents'
import { TopTenThreats } from './topTenLists'
import { ThreatClassifications, ThreatsByPriority } from './topThreats'

// TODO not localizing atm because these will be replaced when requirements for EPP dashboard are finalized.
const last24Hours = 'Last 24 hours'
const max = 'Max'

const RunningThreatsRecent = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.chipAlert.high

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const running = useMemo(() => (threatStats.loading ? undefined : threatStats.result.RecentRunningThreats), [threatStats])
  return <StatsCount id={props.id} color={color} data={running} timeLabel={last24Hours} disableIntervalSelection={true} />
}

const RunningThreatsTotal = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.chipAlert.high

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const running = useMemo(() => (threatStats.loading ? undefined : threatStats.result.TotalRunningThreats), [threatStats])
  return <StatsCount id={props.id} color={color} data={running} timeLabel={max} disableIntervalSelection={true} />
}

const AutoRunThreatsRecent = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.chipAlert.medium

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const autoRun = useMemo(() => (threatStats.loading ? undefined : threatStats.result.RecentAutoRunThreats), [threatStats])
  return <StatsCount id={props.id} color={color} data={autoRun} timeLabel={last24Hours} disableIntervalSelection={true} />
}

const AutoRunThreatsTotal = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.chipAlert.medium

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const autoRun = useMemo(() => (threatStats.loading ? undefined : threatStats.result.TotalAutoRunThreats), [threatStats])
  return <StatsCount id={props.id} color={color} data={autoRun} timeLabel={max} disableIntervalSelection={true} />
}

const QuarantinedThreatsRecent = (props: ChartProps): JSX.Element => {
  const color = '#00968c'

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const quarantined = useMemo(() => (threatStats.loading ? undefined : threatStats.result.RecentQuarantinedThreats), [threatStats])
  return (
    <StatsCount
      id={props.id}
      color={color}
      data={quarantined}
      icon={BasicBlock}
      timeLabel={last24Hours}
      disableIntervalSelection={true}
    />
  )
}

const QuarantinedThreatsTotal = (props: ChartProps): JSX.Element => {
  const color = '#00968c'

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const quarantined = useMemo(() => (threatStats.loading ? undefined : threatStats.result.TotalQuarantinedThreats), [threatStats])
  return (
    <StatsCount id={props.id} color={color} data={quarantined} icon={BasicBlock} timeLabel={max} disableIntervalSelection={true} />
  )
}

const UniqueToCylanceRecent = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.cyGreen[500]

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const unique = useMemo(() => (threatStats.loading ? undefined : threatStats.result.RecentUniqueThreats), [threatStats])
  return (
    <StatsCount
      id={props.id}
      color={color}
      data={unique}
      icon={BrandCylance}
      timeLabel={last24Hours}
      disableIntervalSelection={true}
    />
  )
}

const UniqueToCylanceTotal = (props: ChartProps): JSX.Element => {
  const theme = useTheme<UesTheme>()
  const color = theme.palette.cyGreen[500]

  const {
    tasks: { threatStats },
  }: EppDashboardData.EppDashboardState = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice])

  const unique = useMemo(() => (threatStats.loading ? undefined : threatStats.result.TotalUniqueThreats), [threatStats])
  return (
    <StatsCount id={props.id} color={color} data={unique} icon={BrandCylance} timeLabel={max} disableIntervalSelection={true} />
  )
}

const TotalAnalyzedFiles = (props: ChartProps): JSX.Element => {
  const color = '#00968c'

  const { totalFilesAnalyzed } = useSelector(state => state[EppDashboardData.EppDashboardReduxSlice].tasks)
  const totalAnalyzed = useMemo(() => (totalFilesAnalyzed.loading ? undefined : totalFilesAnalyzed.result.fileCount), [
    totalFilesAnalyzed,
  ])

  return <StatsCount id={props.id} color={color} icon={BasicNoteFull} data={totalAnalyzed} timeLabel={max} />
}

export const getChartLibrary = t => ({
  runningThreatsRecent: {
    title: t('widget.runningThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: RunningThreatsRecent,
  },
  runningThreatsTotal: {
    title: t('widget.runningThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: RunningThreatsTotal,
  },
  autoRunThreatsRecent: {
    title: t('widget.autoRunThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: AutoRunThreatsRecent,
  },
  autoRunThreatsTotal: {
    title: t('widget.autoRunThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: AutoRunThreatsTotal,
  },
  quarantinedThreatsRecent: {
    title: t('widget.quarantinedThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: QuarantinedThreatsRecent,
  },
  quarantinedThreatsTotal: {
    title: t('widget.quarantinedThreats'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: QuarantinedThreatsTotal,
  },
  uniqueToCylanceRecent: {
    title: t('widget.uniqueToCylance'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: UniqueToCylanceRecent,
  },
  uniqueToCylanceTotal: {
    title: t('widget.uniqueToCylance'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: UniqueToCylanceTotal,
  },
  totalAnalyzedFiles: {
    title: t('widget.totalAnalyzedFiles'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Count,
    showCardTitle: true,
    component: TotalAnalyzedFiles,
  },
  threatProtection: {
    title: t('widget.threatProtection'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Pie,
    component: ThreatProtectionGauge,
  },
  deviceProtection: {
    title: t('widget.deviceProtection'),
    defaultWidth: 6,
    defaultHeight: 6,
    chartType: ChartType.Pie,
    component: DeviceProtectionGauge,
  },
  threatEvents: {
    title: t('widget.threatEvents'),
    defaultWidth: 18,
    defaultHeight: 20,
    chartType: ChartType.Line,
    component: ThreatEvents,
  },
  threatsByPriority: {
    title: t('widget.threatsByPriority'),
    defaultWidth: 6,
    defaultHeight: 12,
    chartType: ChartType.Toplist,
    component: ThreatsByPriority,
  },
  topTenThreats: {
    title: t('widget.topTenLists'),
    defaultWidth: 6,
    defaultHeight: 12,
    chartType: ChartType.Toplist,
    component: TopTenThreats,
  },
  threatClassifications: {
    title: t('widget.threatClassifications'),
    defaultWidth: 6,
    defaultHeight: 12,
    chartType: ChartType.Donut,
    component: ThreatClassifications,
  },
})
