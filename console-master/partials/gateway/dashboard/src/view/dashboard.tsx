//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'

import type { DashboardProps } from '@ues-behaviour/dashboard'
import { DashboardProvider, getInitialGlobalTime, TimeIntervalId } from '@ues-behaviour/dashboard'
import { FeatureName, UesReduxStore, useFeatures } from '@ues-data/shared'
import { Config, Types } from '@ues-gateway/shared'

import DashboardContent from './dashboard-content'
import { useWidgetsLibrary } from './widgets'

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
      layout: { w: 6, h: 12, x: 0, y: 28 },
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

const Dashboard: React.FC = () => {
  const widgetsLibrary = useWidgetsLibrary()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const features = useFeatures()
  const cronosEnabled = features.isEnabled(FeatureName.UESCronosNavigation)
  return (
    <ReduxProvider store={UesReduxStore}>
      <DashboardProvider
        dashboardProps={{
          cardState,
          chartLibrary: widgetsLibrary,
          globalTime: getInitialGlobalTime(TEMPORARY_DASHBOARD_CONFIG.timeIntervalId),
          id: TEMPORARY_DASHBOARD_CONFIG.id,
          layoutState,
          title: cronosEnabled ? t('labelGateway') : [t('labelGateway'), t('dashboard.title')],
          nonPersistent: true,
          editable: cronosEnabled,
        }}
      >
        <DashboardContent editable={cronosEnabled} />
      </DashboardProvider>
    </ReduxProvider>
  )
}

export default Dashboard
