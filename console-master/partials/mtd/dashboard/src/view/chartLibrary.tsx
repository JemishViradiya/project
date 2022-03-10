import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ChartLibrary, ChartProps } from '@ues-behaviour/dashboard'
import { ChartType } from '@ues-behaviour/dashboard'
import { FeatureName, Permission } from '@ues-data/shared'

import { EnabledDevicesChart } from './widgets/threats/EnabledDevicesChart'
import {
  MobileAppThreatsBarChart,
  MobileDeviceSecurityThreatsBarChart,
  MobileNetworkThreatsBarChart,
} from './widgets/threats/MobileThreatsBarChartWidgets'
import { MobileThreatsDeltaChart } from './widgets/threats/MobileThreatsDeltaChart'
import { MobileThreatsDevicesDeltaChart } from './widgets/threats/MobileThreatsDevicesDeltaChart'
import {
  MobileAppThreatsLineChart,
  MobileDeviceSecurityThreatsLineChart,
  MobileNetworkThreatsLineChart,
  MobileThreatsSummaryLineChart,
} from './widgets/threats/MobileThreatsLineChartWidgets'
import MobileThreatsPieChart from './widgets/threats/MobileThreatsPieChart'
import { MobileThreatsTopDeviceListChart } from './widgets/threats/MobileThreatsTopDeviceListChart'
import {
  CompromisedNetworkTopListChart,
  InsecureWifiTopListChart,
  MaliciousAppTopListChart,
  MobileThreatDetectionsTopListChart,
  SideLoadedAppTopListChart,
  UnsafeMessageTopListChart,
  UnsupportedModelTopListChart,
  UnsupportedOsTopListChart,
  UnsupportedSecurityPatchTopListChart,
  /*RestrictedAppTopListChart,*/
} from './widgets/threats/MobileThreatsTopListChartWidgets'
import VulnerableOSBarChart from './widgets/vulnerability/v4/VulnerableOSBarChart'

export const useWidgetsLibrary = (): ChartLibrary => {
  const { t } = useTranslation(['mtd/common'])

  const noopComponent = (props: ChartProps): JSX.Element => {
    return null
  }

  return useMemo(
    () => ({
      vulnerableMobileOsChart: {
        title: t('dashboard.mobileOsWithVulnerabilities'),
        defaultWidth: 6,
        defaultHeight: 7,
        component: VulnerableOSBarChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Bar,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.ECS_VULNERABILITIES_READ],
      },
      mobileAppThreatsBarChart: {
        title: t('dashboard.mobileAppThreats'),
        defaultWidth: 6,
        defaultHeight: 7,
        component: MobileAppThreatsBarChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Bar,
        availableOptions: { totalCount: false, dataZoom: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileNetworkThreatsBarChart: {
        title: t('dashboard.mobileNetworkThreats'),
        defaultWidth: 6,
        defaultHeight: 7,
        component: MobileNetworkThreatsBarChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Bar,
        availableOptions: { totalCount: false, dataZoom: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileDeviceSecurityThreatsBarChart: {
        title: t('dashboard.mobileDeviceSecurityThreats'),
        defaultWidth: 6,
        defaultHeight: 7,
        component: MobileDeviceSecurityThreatsBarChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Bar,
        availableOptions: { totalCount: false, dataZoom: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileAppThreatsLineChart: {
        title: t('dashboard.mobileAppThreats'),
        defaultWidth: 12,
        defaultHeight: 7,
        component: MobileAppThreatsLineChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Line,
        availableOptions: { totalCount: false, customTime: true },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileNetworkThreatsLineChart: {
        title: t('dashboard.mobileNetworkThreats'),
        defaultWidth: 12,
        defaultHeight: 7,
        component: MobileNetworkThreatsLineChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Line,
        availableOptions: { totalCount: false, customTime: true },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileDeviceSecurityThreatsLineChart: {
        title: t('dashboard.mobileDeviceSecurityThreats'),
        defaultWidth: 12,
        defaultHeight: 7,
        component: MobileDeviceSecurityThreatsLineChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Line,
        availableOptions: { totalCount: false, customTime: true },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatsPieChart: {
        title: t('dashboard.mobileThreatsByCategory'),
        defaultWidth: 12,
        defaultHeight: 8,
        component: MobileThreatsPieChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Pie,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      maliciousAppTopListChart: {
        title: t('dashboard.topMaliciousAppThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: MaliciousAppTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      sideLoadedAppTopListChart: {
        title: t('dashboard.topSideLoadedAppThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: SideLoadedAppTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      /*
  restrictedAppTopListChart: {
    title: t('dashboard.topRestrictedAppThreats'),
    defaultWidth: 5,
    defaultHeight: 7,
    component: RestrictedAppTopListChart,
    drilldownComponent: noopComponent,
    chartType: ChartType.Toplist,
    availableOptions: { totalCount: false, customTime: false },
    permissions: [Permission.MTD_EVENTS_READ],
  },
  */
      insecureWifiTopListChart: {
        title: t('dashboard.topInsecureWifiThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: InsecureWifiTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      compromisedNetworkTopListChart: {
        title: t('dashboard.topCompromisedNetworkThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: CompromisedNetworkTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      unsupportedOsTopListChart: {
        title: t('dashboard.topUnsupportedOsThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: UnsupportedOsTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      unsupportedModelTopListChart: {
        title: t('dashboard.topUnsupportedModelThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: UnsupportedModelTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      unsupportedSecurityPatchTopListChart: {
        title: t('dashboard.topUnsupportedSecurityPatchThreats'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: UnsupportedSecurityPatchTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatDetectionsTopListChart: {
        title: t('dashboard.topMobileThreatDetections'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: MobileThreatDetectionsTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatTopDeviceListChart: {
        title: t('dashboard.topMobileThreatDevices'),
        defaultWidth: 6,
        defaultHeight: 4,
        component: MobileThreatsTopDeviceListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatsSummaryLineChart: {
        title: t('dashboard.mobileThreatsByCategory'),
        defaultWidth: 12,
        defaultHeight: 7,
        component: MobileThreatsSummaryLineChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Line,
        availableOptions: { totalCount: false, customTime: true },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatsDeltaChart: {
        title: t('dashboard.totalThreatsDetected'),
        showCardTitle: false,
        defaultWidth: 6,
        defaultHeight: 4,
        component: MobileThreatsDeltaChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Count,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      mobileThreatsDevicesDeltaChart: {
        title: t('dashboard.mobileDevicesWithThreatAlerts'),
        showCardTitle: false,
        defaultWidth: 6,
        defaultHeight: 4,
        component: MobileThreatsDevicesDeltaChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Count,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.MTD_EVENTS_READ],
      },
      enabledDevicesChart: {
        title: t('dashboard.enabledDevices'),
        showCardTitle: false,
        defaultWidth: 6,
        defaultHeight: 4,
        component: EnabledDevicesChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Count,
        availableOptions: { totalCount: false, customTime: false },
        permissions: [Permission.ECS_DEVICES_READ],
      },
      unsafeMessagesTopListChart: {
        title: t('dashboard.topUnsafeMessages'),
        defaultWidth: 5,
        defaultHeight: 7,
        component: UnsafeMessageTopListChart,
        drilldownComponent: noopComponent,
        chartType: ChartType.Toplist,
        availableOptions: { totalCount: false, customTime: false },
        features: isEnabled => isEnabled(FeatureName.MobileThreatDetectionUnsafeMsgThreat),
        permissions: [Permission.MTD_EVENTS_READ],
      },
    }),
    [t],
  )
}
