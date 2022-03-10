//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'
import type { PartialRouteObject } from 'react-router'
import { Navigate } from 'react-router-dom'

import { AdaptiveResponseSettings } from '@ues-bis/adaptive-response-settings'
import { FeatureName } from '@ues-data/shared'
import { AuthenticationChildRoutes, AuthenticatorRoute } from '@ues-eid/settings'
import { AjaxGatewaySettings, AjaxGatewaySettingsDetails } from '@ues-gateway/settings'
import {
  PlatformBCN,
  PlatformBCNAdditional,
  PlatformCompanyDirectoryDetailsRoutes,
  PlatformCompanyDirectoryRoute,
} from '@ues-platform/settings'
import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'

const GatewaySettingsNavigation = lazy(() => import('./gateway-settings-navigation'))

const SettingsRootTabs: TabRouteObject[] = [
  { ...AjaxGatewaySettings, translations: { label: 'gateway-settings:networkSettings' } },
  { ...PlatformCompanyDirectoryRoute, translations: { label: 'gateway-settings:directoryConnection' } },
  { ...PlatformBCN, translations: { label: 'gateway-settings:connectivityNode' } },
  {
    ...AuthenticatorRoute,
    features: isEnabled => isEnabled(FeatureName.EIDAuthentication),
    translations: { label: 'gateway-settings:authentication' },
    helpId: HelpLinks.AuthenticationSettings,
  },
  {
    ...AdaptiveResponseSettings,
    features: (isEnabled, extraTenantFeatures) => !extraTenantFeatures?.isMigratedToDP,
    translations: { label: 'gateway-settings:adaptiveResponse' },
    helpId: HelpLinks.SettingsAdaptiveResponse,
  },
]

export const GatewaySettingsRoutes: PartialRouteObject[] = [
  {
    path: '/',
    element: <GatewaySettingsNavigation childRoutes={SettingsRootTabs} />,
    children: [{ path: '/', element: <Navigate to="./settings" /> }, ...SettingsRootTabs],
  },
  AjaxGatewaySettingsDetails,
  PlatformCompanyDirectoryDetailsRoutes,
  PlatformBCNAdditional,
  AuthenticationChildRoutes,
]
