//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartLibrary, ChartProps } from '@ues-behaviour/dashboard'
import { ChartType } from '@ues-behaviour/dashboard'
import { DashboardWidgetType } from '@ues-data/dlp'

import ConnectedDlpDevicesWidget from './connected-dlp-devices'
import ConnectedDlpUsersWidget from './connected-dlp-users'
import EvidenceLockerFilesWidget from './evidence-locker-files'
import ExfiltrationEventsWidget from './exfiltration-events-widget'
import SensitiveDataEndpointsWidget from './sensitive-data-endpoints-widget'
import TopEventsByDestination from './top-events-by-destination'
import TopEventsByWidget from './top-events-by-widget'
import TotalSensitiveDataWidget from './total-sensitive-data'

const DEFAULT_WIDGET_CONFIG = { defaultHeight: 12, defaultWidth: 6 }

export const useWidgetsLibrary = (): ChartLibrary => {
  const { t } = useTranslation('dlp/common')
  return useMemo(
    () =>
      Object.entries({
        [DashboardWidgetType.ExfiltrationEvents]: {
          title: t('dashboard.exfiltrationEventsByWidgetTitle'),
          component: (props: ChartProps): JSX.Element => <ExfiltrationEventsWidget {...props} />,
          chartType: ChartType.Line,
          availableOptions: { customTime: true },
        },
        [DashboardWidgetType.TopEventsBy]: {
          title: t('dashboard.topEventsByWidgetTitle'),
          component: (props: ChartProps): JSX.Element => <TopEventsByWidget {...props} />,
          chartType: ChartType.Toplist,
          availableOptions: { customTime: true },
        },
        [DashboardWidgetType.TotalSensitiveData]: {
          title: t('dashboard.totalSensitiveDataTitle'),
          showCardTitle: true,
          component: (props: ChartProps): JSX.Element => <TotalSensitiveDataWidget {...props} />,
          chartType: ChartType.Count,
        },
        [DashboardWidgetType.SensitiveDataEndpoints]: {
          title: t('dashboard.sensitiveDataEndpoints'),
          component: (props: ChartProps): JSX.Element => <SensitiveDataEndpointsWidget {...props} />,
          chartType: ChartType.Count,
        },
        [DashboardWidgetType.EvidenceLockerFiles]: {
          title: t('dashboard.evidenceLockerFilesTitle'),
          showCardTitle: true,
          component: (props: ChartProps): JSX.Element => <EvidenceLockerFilesWidget {...props} />,
          chartType: ChartType.Count,
        },
        [DashboardWidgetType.ConnectedUsers]: {
          title: t('dashboard.connectedUsers'),
          showCardTitle: false,
          component: (props: ChartProps): JSX.Element => <ConnectedDlpUsersWidget {...props} />,
          chartType: ChartType.Count,
        },
        [DashboardWidgetType.ConnectedDevices]: {
          title: t('dashboard.connectedDevices'),
          showCardTitle: false,
          component: (props: ChartProps): JSX.Element => <ConnectedDlpDevicesWidget {...props} />,
          chartType: ChartType.Count,
        },
        [DashboardWidgetType.TopEventsByDestination]: {
          title: t('dashboard.exfiltrationEventsByDestination'),
          component: (props: ChartProps): JSX.Element => <TopEventsByDestination {...props} />,
          chartType: ChartType.Count,
          availableOptions: { customTime: true },
        },
      }).reduce((acc, [widgetId, widgetConfig]) => ({ ...acc, [widgetId]: { ...DEFAULT_WIDGET_CONFIG, ...widgetConfig } }), {}),
    [t],
  )
}
