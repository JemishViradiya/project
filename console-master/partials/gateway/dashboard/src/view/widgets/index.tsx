//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartLibrary } from '@ues-behaviour/dashboard'
import { ChartType } from '@ues-behaviour/dashboard'
import { FeatureName, FeaturizationApi, Permission } from '@ues-data/shared'
import { Config, Types } from '@ues-gateway/shared'

import { NetworkAccessControlAppliedPolicies } from './applied-policies-widget'
import { ConnectorStatusWidget } from './connector-status-widget'
import { EgressHealthConnectorWidget } from './egress-health-connector-widget'
import { PrivateNetworkAccessWidget, PublicNetworkAccessWidget } from './network-access-widget'
import { NetworkTrafficWidget } from './network-traffic-widget'
import { SecurityRiskCategoriesWidget } from './security-risk-categories-widget'
import { TLSVersionsWidget } from './tls-versions-widget'
import { TopBlockedCategories } from './top-blocked-categories'
import { PrivateTopNetworkDestinationsWidget, PublicTopNetworkDestinationsWidget } from './top-network-destinations-widget'
import { TopUsersBandwidth } from './top-users-bandwidth'
import { TotalActiveUsersWidget } from './total-active-users'
import { TransferredBytesWidget } from './transferred-bytes-widget'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { DashboardWidgetType } = Types

export const useWidgetsLibrary = (): ChartLibrary => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  return useMemo(
    () => ({
      [DashboardWidgetType.NetworkTraffic]: {
        title: t('common.networkConnections'),
        component: NetworkTrafficWidget,
        chartType: ChartType.Pie,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
      },
      [DashboardWidgetType.TransferredBytes]: {
        title: t('dashboard.transferredBytesWidgetTitle'),
        component: TransferredBytesWidget,
        chartType: ChartType.Pie,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
      },
      [DashboardWidgetType.ConnectorStatus]: {
        title: t('dashboard.connectorStatusWidgetTitle'),
        component: ConnectorStatusWidget,
        chartType: ChartType.Toplist,
        permissions: [Permission.BIG_TENANT_READ],
        defaultHeight: 7,
        defaultWidth: 6,
      },
      [DashboardWidgetType.TLSVersions]: {
        title: t('dashboard.tlsVersionsWidgetTitle'),
        component: TLSVersionsWidget,
        chartType: ChartType.Pie,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
      },
      [DashboardWidgetType.TopBlockedCategories]: {
        title: t('dashboard.topBlockedCategoriesWidgetTitle'),
        component: TopBlockedCategories,
        chartType: ChartType.Pie,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
        features: () => FeaturizationApi.isFeatureEnabled(FeatureName.UESBigAclEnabled),
      },
      [DashboardWidgetType.TopUsersBandwidth]: {
        title: t('dashboard.topUsersBandwidthWidgetTitle'),
        component: TopUsersBandwidth,
        chartType: ChartType.Toplist,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 12,
        defaultWidth: 6,
      },
      [DashboardWidgetType.PrivateTopNetworkDestinations]: {
        title: t('dashboard.privateTopNetworkDestinationsWidgetTitle'),
        component: PrivateTopNetworkDestinationsWidget,
        chartType: ChartType.Toplist,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 12,
        defaultWidth: 6,
      },
      [DashboardWidgetType.PublicTopNetworkDestinations]: {
        title: t('dashboard.publicTopNetworkDestinationsWidgetTitle'),
        component: PublicTopNetworkDestinationsWidget,
        chartType: ChartType.Toplist,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 12,
        defaultWidth: 6,
      },
      [DashboardWidgetType.PublicNetworkAccess]: {
        title: t('dashboard.publicNetworkAccessWidgetTitle'),
        component: PublicNetworkAccessWidget,
        chartType: ChartType.Line,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 9,
        defaultWidth: 12,
      },
      [DashboardWidgetType.PrivateNetworkAccess]: {
        title: t('dashboard.privateNetworkAccessWidgetTitle'),
        component: PrivateNetworkAccessWidget,
        chartType: ChartType.Line,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 9,
        defaultWidth: 12,
      },
      [DashboardWidgetType.NetworkAccessControlAppliedPolicies]: {
        title: t('dashboard.networkAccessControlAppliedPoliciesWidgetTitle'),
        component: NetworkAccessControlAppliedPolicies,
        chartType: ChartType.Pie,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 7,
        defaultWidth: 6,
      },
      [DashboardWidgetType.TotalActiveUsers]: {
        title: t('dashboard.totalActiveUsersWidgetTitle'),
        showCardTitle: false,
        component: TotalActiveUsersWidget,
        chartType: ChartType.Count,
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
      },
      [DashboardWidgetType.EgressHealthConnectorWidget]: {
        title: t('connectors.connectors'),
        component: EgressHealthConnectorWidget,
        chartType: ChartType.Line,
        permissions: [Permission.BIG_REPORTING_READ, Permission.BIG_TENANT_READ],
        defaultHeight: 7,
        defaultWidth: 12,
      },
      [DashboardWidgetType.SecurityRiskCategories]: {
        title: t('dashboard.securityRiskCategoriesTitle'),
        component: SecurityRiskCategoriesWidget,
        chartType: ChartType.Pie,
        features: () => FeaturizationApi.isFeatureEnabled(FeatureName.UESBigIpRepEnabled),
        permissions: [Permission.BIG_REPORTING_READ],
        defaultHeight: 6,
        defaultWidth: 6,
      },
    }),
    [t],
  )
}
