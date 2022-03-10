import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useRoutes } from 'react-router'

import { FeatureName, Permission, useFeatures } from '@ues-data/shared'
import { GatewayUserEvents } from '@ues-gateway/events'
import { SecuredContentBoundary } from '@ues/behaviours'

import { firstPath } from '../userUtils'
import { SecuredTabWrapper, UserDetailsTabWrapper } from './TabWrapper'

const getTabs = (gatewayAlertsTransition: boolean) =>
  gatewayAlertsTransition
    ? [
        {
          translations: {
            label: 'platform/common:users.details.events.networkActivityTitle',
          },
          ...GatewayUserEvents,
          permission: Permission.BIG_REPORTING_READ,
        },
      ]
    : [
        {
          translations: {
            label: 'platform/common:users.details.events.networkEventsTitle',
          },
          ...GatewayUserEvents,
          permission: Permission.BIG_REPORTING_READ,
        },
      ]

const EventsTab = () => {
  const { t } = useTranslation(['platform/common'])
  const { isEnabled } = useFeatures()
  const cronosNavigation = isEnabled(FeatureName.UESCronosNavigation)
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)
  const tabs = useMemo(() => {
    return getTabs(gatewayAlertsTransition)
  }, [gatewayAlertsTransition])

  return useRoutes(
    cronosNavigation
      ? [
          {
            path: '/*',
            element: <UserDetailsTabWrapper tabs={tabs} label={t('users.eventsTabs')} />,
            children: [...tabs, { path: '/', element: <Navigate to={`.${firstPath(tabs)}`} replace={true} /> }],
          },
        ]
      : [
          {
            ...GatewayUserEvents,
            path: '/',
            element: (
              <SecuredContentBoundary>
                <SecuredTabWrapper permissionName={Permission.BIG_REPORTING_READ}>
                  <Outlet />
                </SecuredTabWrapper>
              </SecuredContentBoundary>
            ),
          },
        ],
  )
}

export default EventsTab
