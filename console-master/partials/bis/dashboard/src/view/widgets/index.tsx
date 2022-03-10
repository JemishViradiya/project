import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartLibrary } from '@ues-behaviour/dashboard'
import { ChartType } from '@ues-behaviour/dashboard'
import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, Permission, ServiceId } from '@ues-data/shared'

import { BisDashboardWidgetType } from '../types'
import AlertSummary from './AlertSummary'
// import CombinedRiskAlerts from './CombinedRiskAlerts'
// import GeozoneRiskAlerts from './GeozoneRiskAlerts'
import IdentityRiskAlerts from './IdentityRiskAlerts'
import Map from './Map'
import RealTimeAlerts from './RealTimeAlerts'
import TopActions from './TopActions'

const DEFAULT_WIDGET_CONFIG = { defaultHeight: 12, defaultWidth: 6 }

export const useWidgetsLibrary = (): ChartLibrary => {
  const { t } = useTranslation('bis/ues')
  const { isMigratedToDP } = useBISPolicySchema()
  return useMemo(() => {
    return {
      [BisDashboardWidgetType.AlertSummary]: {
        ...DEFAULT_WIDGET_CONFIG,
        title: t('dashboard.networkAlertSummaryWidget.title'),
        component: props => <AlertSummary {...props} />,
        chartType: ChartType.Toplist,
        defaultHeight: 6,
        permissions: [Permission.BIS_EVENTS_READ],
        services: [ServiceId.BIG],
        features: isEnabled => !(isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP),
      },
      [BisDashboardWidgetType.IdentityRiskAlerts]: {
        title: t('dashboard.networkAnomalyAlertsWidgetTitle'),
        component: props => <IdentityRiskAlerts {...props} />,
        chartType: ChartType.Line,
        defaultWidth: 12,
        defaultHeight: 10,
        permissions: [Permission.BIS_EVENTS_READ],
        services: [ServiceId.BIG],
        features: isEnabled => !(isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP),
      },
      // [BisDashboardWidgetType.GeozoneRiskAlerts]: {
      //   title: t('dashboard.geozoneRiskAlertsWidgetTitle'),
      //   component: props => <GeozoneRiskAlerts {...props} />,
      //   chartType: ChartType.Line,
      //   defaultWidth: 12,
      //   defaultHeight: 10,
      //   permissions: [Permission.BIS_EVENTS_READ],
      // },
      [BisDashboardWidgetType.TopActions]: {
        ...DEFAULT_WIDGET_CONFIG,
        title: t('dashboard.topActionsWidgetTitle'),
        component: props => <TopActions {...props} />,
        chartType: ChartType.Toplist,
        permissions: [Permission.BIS_EVENTS_READ],
        features: isEnabled => !(isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP),
        services: [ServiceId.BIG],
      },
      [BisDashboardWidgetType.RealTimeAlerts]: {
        ...DEFAULT_WIDGET_CONFIG,
        title: t('dashboard.realTimeAlertsWidgetTitle'),
        component: props => <RealTimeAlerts {...props} />,
        chartType: ChartType.Bar,
        permissions: [Permission.BIS_EVENTS_READ],
        services: [ServiceId.BIG],
        features: isEnabled => !(isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP),
      },
      // [BisDashboardWidgetType.CombinedRiskAlerts]: {
      //   title: t('dashboard.combinedRiskAlertsWidgetTitle'),
      //   component: props => <CombinedRiskAlerts {...props} />,
      //   chartType: ChartType.Line,
      //   defaultWidth: 12,
      //   defaultHeight: 10,
      // },
      [BisDashboardWidgetType.Map]: {
        ...DEFAULT_WIDGET_CONFIG,
        title: t('dashboard.mapWidgetTitle'),
        component: props => {
          return <Map {...props} childProps={[{ minZoom: 2 }, { maxZoom: 21 }]} />
        },
        chartType: ChartType.Map,
        defaultWidth: 12,
        defaultHeight: 10,
        features: isEnabled => isEnabled(FeatureName.BisGeofenceEnabled),
      },
    }
  }, [isMigratedToDP, t])
}
