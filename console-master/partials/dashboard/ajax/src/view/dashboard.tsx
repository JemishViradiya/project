//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import { DashboardProvider, getInitialGlobalTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { BisDashboardWidgetType, useBisChartLibrary } from '@ues-bis/dashboard'
import { useGatewayChartLibrary } from '@ues-gateway/dashboard'
import { Config, Types } from '@ues-gateway/shared'
import { HelpLinks } from '@ues/assets'

import DashboardContent from './dashboard-content'
// import useWidgetsLibrary from './widgets'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { DashboardWidgetType } = Types

export const TEMPORARY_DASHBOARD_CONFIG = {
  id: 'bg',
  timeIntervalId: TimeIntervalId.Last24Hours,
  widgets: [
    {
      id: DashboardWidgetType.PublicNetworkAccess,
      layout: { w: 12, h: 9, x: 0, y: 0 },
    },
    {
      id: DashboardWidgetType.PrivateNetworkAccess,
      layout: { w: 12, h: 9, x: 12, y: 0 },
    },
    {
      id: DashboardWidgetType.ConnectorStatus,
      layout: { w: 6, h: 7, x: 0, y: 14 },
    },
    {
      id: DashboardWidgetType.EgressHealthConnectorWidget,
      layout: { w: 12, h: 7, x: 6, y: 14 },
    },
    {
      id: DashboardWidgetType.NetworkAccessControlAppliedPolicies,
      layout: { w: 6, h: 7, x: 18, y: 14 },
    },
    {
      id: DashboardWidgetType.TopUsersBandwidth,
      layout: { w: 6, h: 7, x: 18, y: 14 },
    },
    {
      id: DashboardWidgetType.PublicTopNetworkDestinations,
      layout: { w: 6, h: 12, x: 0, y: 28 },
    },
    {
      id: DashboardWidgetType.PrivateTopNetworkDestinations,
      layout: { w: 6, h: 12, x: 6, y: 28 },
    },
    {
      id: DashboardWidgetType.NetworkTraffic,
      layout: { w: 6, h: 6, x: 12, y: 28 },
    },
    {
      id: DashboardWidgetType.TransferredBytes,
      layout: { w: 6, h: 6, x: 18, y: 28 },
    },
    {
      id: DashboardWidgetType.TotalActiveUsers,
      layout: { w: 6, h: 6, x: 12, y: 34 },
    },
    {
      id: DashboardWidgetType.TLSVersions,
      layout: { w: 6, h: 6, x: 18, y: 34 },
    },
    {
      id: BisDashboardWidgetType.AlertSummary,
      layout: { w: 6, h: 3, x: 0, y: 40 },
    },
    {
      id: BisDashboardWidgetType.RealTimeAlerts,
      layout: { w: 6, h: 6, x: 0, y: 42 },
    },
    {
      id: BisDashboardWidgetType.IdentityRiskAlerts,
      layout: { w: 12, h: 9, x: 6, y: 40 },
    },
    {
      id: BisDashboardWidgetType.TopActions,
      layout: { w: 6, h: 9, x: 18, y: 40 },
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
      [widget.id]: { chartId: widget.id },
    },
  }),
  { layoutState: [], cardState: {} },
)

// Disable editable dashboard for AJAX
const Dashboard: React.FC = () => {
  const gatewayChartLibrary = useGatewayChartLibrary()
  const bisChartLibrary = useBisChartLibrary()
  const widgetsLibrary = useMemo(() => Object.assign({}, gatewayChartLibrary, bisChartLibrary), [
    gatewayChartLibrary,
    bisChartLibrary,
  ])
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const editable = localStorage.getItem('UES.EditableDashboards.Enabled') === 'true'
  return (
    <DashboardProvider
      dashboardProps={{
        cardState,
        chartLibrary: widgetsLibrary,
        globalTime: getInitialGlobalTime(TEMPORARY_DASHBOARD_CONFIG.timeIntervalId),
        id: TEMPORARY_DASHBOARD_CONFIG.id,
        layoutState,
        // TODO: need to update with UES-2221
        title: [t('labelGateway'), t('dashboard.title')],
        nonPersistent: true,
        editable,
      }}
    >
      <DashboardContent editable={editable} />
    </DashboardProvider>
  )
}

export default Dashboard
