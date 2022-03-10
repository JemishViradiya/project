import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useRoutes } from 'react-router'

import { GatewayUserAlerts } from '@ues-bis/gateway-alerts'
import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, Permission, useFeatures } from '@ues-data/shared'
import { MtdUserAlerts } from '@ues-mtd/alerts'
import { SecuredContentBoundary } from '@ues/behaviours'

import { firstPath } from '../userUtils'
import { SecuredTabWrapper, UserDetailsTabWrapper } from './TabWrapper'

const AlertsTab = () => {
  const { t } = useTranslation(['platform/common'])
  const { isEnabled } = useFeatures()

  const { isMigratedToDP } = useBISPolicySchema()

  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)
  const cronosNavigation = isEnabled(FeatureName.UESCronosNavigation)
  const actorDpEnabled = isEnabled(FeatureName.UESActionOrchestrator) && isMigratedToDP
  const tabs = useMemo(() => {
    return gatewayAlertsTransition
      ? [
          {
            translations: {
              label: 'platform/common:alerts.mtdPageTitle',
            },
            ...MtdUserAlerts,
            permission: Permission.MTD_EVENTS_READ,
          },
        ]
      : [
          {
            translations: {
              label: actorDpEnabled
                ? 'platform/common:alerts.gatewayNetworkBehaviorAlertTitle'
                : 'platform/common:alerts.gatewayAlertTitle',
            },
            ...GatewayUserAlerts,
            permission: Permission.BIS_EVENTS_READ,
          },
          {
            translations: {
              label: 'platform/common:alerts.mtdPageTitle',
            },
            ...MtdUserAlerts,
            permission: Permission.MTD_EVENTS_READ,
          },
        ]
  }, [actorDpEnabled, gatewayAlertsTransition])

  return useRoutes(
    cronosNavigation
      ? [
          {
            path: '/*',
            element: <UserDetailsTabWrapper tabs={tabs} label={t('users.alertsTabs')} />,
            children: [...tabs, { path: '/', element: <Navigate to={`.${firstPath(tabs)}`} replace={true} /> }],
          },
        ]
      : [
          {
            ...GatewayUserAlerts,
            path: '/',
            element: (
              <SecuredContentBoundary>
                <SecuredTabWrapper permissionName={Permission.BIS_EVENTS_READ}>
                  <Outlet />
                </SecuredTabWrapper>
              </SecuredContentBoundary>
            ),
          },
        ],
  )
}

export default AlertsTab
