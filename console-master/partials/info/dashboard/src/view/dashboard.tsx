//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import { DashboardProvider, getInitialGlobalTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { DashboardWidgetType } from '@ues-data/dlp'

import DashboardContent from './dashboard-content'
import { useWidgetsLibrary } from './widgets'

export const TEMPORARY_DASHBOARD_CONFIG = {
  id: 'bg',
  timeIntervalId: TimeIntervalId.Last24Hours,
  widgets: [
    {
      id: DashboardWidgetType.ExfiltrationEvents,
      layout: { w: 12, h: 9, x: 0, y: 0 },
    },
    {
      id: DashboardWidgetType.TopEventsBy,
      layout: { w: 12, h: 9, x: 12, y: 0 },
      options: { customTime: 'last30Days' },
    },
    {
      id: DashboardWidgetType.TotalSensitiveData,
      layout: { w: 6, h: 3, x: 0, y: 34 },
    },
    {
      id: DashboardWidgetType.SensitiveDataEndpoints,
      layout: { w: 18, h: 10, x: 12, y: 34 },
    },
    {
      id: DashboardWidgetType.EvidenceLockerFiles,
      layout: { w: 6, h: 3, x: 6, y: 34 },
    },
    {
      id: DashboardWidgetType.ConnectedUsers,
      layout: { w: 6, h: 3, x: 12, y: 34 },
    },
    {
      id: DashboardWidgetType.ConnectedDevices,
      layout: { w: 6, h: 3, x: 18, y: 34 },
    },
    {
      id: DashboardWidgetType.TopEventsByDestination,
      layout: { w: 12, h: 9, x: 6, y: 35 },
      options: { customTime: 'last7Days' },
    },
  ],
}

const { layoutState, cardState } = TEMPORARY_DASHBOARD_CONFIG.widgets.reduce<{
  layoutState: DashboardProps['layoutState']
  cardState: DashboardProps['cardState']
}>(
  (acc, widget) => ({
    layoutState: [...acc.layoutState, { i: widget.id, ...widget.layout }],
    cardState: {
      ...acc.cardState,
      [widget.id]: { chartId: widget.id, options: widget.options },
    },
  }),
  { layoutState: [], cardState: {} },
)

const Dashboard: React.FC = () => {
  const widgetsLibrary = useWidgetsLibrary()
  const { t } = useTranslation('dlp/common')

  const editable = true
  return (
    <DashboardProvider
      dashboardProps={{
        cardState,
        chartLibrary: widgetsLibrary,
        globalTime: getInitialGlobalTime(TEMPORARY_DASHBOARD_CONFIG.timeIntervalId),
        id: TEMPORARY_DASHBOARD_CONFIG.id,
        layoutState,
        title: t('labelDlp'),
        nonPersistent: true,
        editable: editable,
      }}
    >
      <DashboardContent editable={editable} />
    </DashboardProvider>
  )
}

export default Dashboard
