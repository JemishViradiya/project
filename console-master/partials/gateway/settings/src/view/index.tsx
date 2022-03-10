//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { useBISPolicySchema } from '@ues-data/bis'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Types, Utils } from '@ues-gateway/shared'
import { HelpLinks } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'
import { SecuredContentBoundary, ViewWrapper } from '@ues/behaviours'

import { AjaxSettingsTabs } from '../components'

const { Page, AclRulesType } = Types
const { GATEWAY_ROUTES_DICTIONARY, fromParts, makePageRoute, makeDetailsRouteDefinition } = Utils

const Acl = lazy(() => import('./acl'))
const AclAdd = lazy(() => import('./acl/add'))
const AclEdit = lazy(() => import('./acl/edit'))
const AclCommitted = lazy(() => import('./acl/committed'))
const AclDraft = lazy(() => import('./acl/draft'))

const DnsSuffixes = lazy(() => import('./dns-suffixes'))
const NetworkProtection = lazy(() => import('./network-protection'))

const NetworkServices = lazy(() => import('./network-services'))
const NetworkServiceAdd = lazy(() => import('./network-services/v3/add'))
const NetworkServiceEdit = lazy(() => import('./network-services/v3/edit'))

const SourceIPPinning = lazy(() => import('./source-ip-pinning'))
const PrivateNetwork = lazy(() => import('./private-network'))
const PrivateNetworkDns = lazy(() => import('./private-network/dns'))
const PrivateNetworkRouting = lazy(() => import('./private-network/network-routing'))
const PrivateNetworkIpRange = lazy(() => import('./private-network/ip-range'))
const GatewayConnectors = lazy(() => import('./private-network/gateway-connectors'))
const GatewayConnectorAdd = lazy(() => import('./private-network/gateway-connectors/add'))
const GatewayConnectorEdit = lazy(() => import('./private-network/gateway-connectors/edit'))
const GatewayConnectorAddPageRedirect = lazy(() => import('./private-network/gateway-connectors/connector-add-page-redirect'))
const GatewayConnectorEditPageRedirect = lazy(() => import('./private-network/gateway-connectors/connector-edit-page-redirect'))

const AclSubTabs = [
  {
    path: fromParts([GATEWAY_ROUTES_DICTIONARY[AclRulesType.Committed]]),
    element: <AclCommitted />,
    translations: { label: 'gateway/common:acl.committed' },
  },
  {
    path: fromParts([GATEWAY_ROUTES_DICTIONARY[AclRulesType.Draft]]),
    element: <AclDraft />,
    translations: { label: 'gateway/common:acl.draft' },
  },
]
const AclTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Acl]),
  element: <Acl tabs={AclSubTabs} />,
  helpId: HelpLinks.GatewayACL,
  translations: {
    label: 'gateway/common:acl.labelAclRules',
  },
  children: [
    { path: '/', element: <Navigate to={`.${fromParts([GATEWAY_ROUTES_DICTIONARY[AclRulesType.Committed]])}`} /> },
    ...AclSubTabs,
  ],
  features: (isEnabled, extraTenantFeatures) =>
    isEnabled(FeatureName.UESBigAclMigrationEnabled) || extraTenantFeatures?.isMigratedToACL,
}

const NetworkProtectionTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkProtection]),
  element: <NetworkProtection />,
  helpId: HelpLinks.NetworkProtection,
  translations: {
    label: 'gateway/common:protection.labelProtection',
    title: 'gateway/common:protection.labelProtection',
    description: 'gateway/common:protection.protectionDescription',
  },
}

const NetworkServicesTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices]),
  element: <NetworkServices />,
  helpId: HelpLinks.NetworkServices,
  translations: {
    label: 'gateway/common:common.networkServices',
    title: 'gateway/common:common.networkServices',
    description: 'gateway/common:networkServices.networkServicesTopLevelDescription',
  },
}

const DnsSuffixesTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.DnsSuffixes]),
  element: <DnsSuffixes />,
  helpId: HelpLinks.ClientDNS,
  translations: {
    label: 'gateway/common:dns.clientDNS',
    title: 'gateway/common:dns.clientDNS',
    description: 'gateway/common:dns.dnsSuffixTableDescription',
  },
}

const SourceIPPinningTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.SourceIPPinning]),
  element: <SourceIPPinning />,
  helpId: HelpLinks.SourceIPAnchoring,
  translations: {
    label: 'gateway/common:networkServices.labelSourceIPAnchoring',
    title: 'gateway/common:networkServices.labelSourceIPAnchoring',
  },
}

export const PrivateNetworkGatewayConnectorsTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
  element: <GatewayConnectors />,
  helpId: HelpLinks.GatewayConnectors,
  translations: {
    label: 'gateway/common:networkServices.labelGatewayConnectors',
    title: 'gateway/common:networkServices.labelGatewayConnectors',
    description: 'gateway/common:connectors.gatewayConnectorsTopLevelDescription',
  },
}
export const PrivateNetworkDnsTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Dns]),
  element: <PrivateNetworkDns />,
  helpId: HelpLinks.PrivateNetworkDNS,
  translations: {
    label: 'gateway/common:dns.privateNetworkDns',
    title: 'gateway/common:dns.privateNetworkDns',
    description: 'gateway/common:privateNetwork.labelDNSDescription',
  },
}
export const PrivateNetworkRoutingTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Routing]),
  element: <PrivateNetworkRouting />,
  helpId: HelpLinks.PrivateNetworkRouting,
  translations: {
    label: 'gateway/common:privateNetwork.labelPrivateNetworkRouting',
    title: 'gateway/common:privateNetwork.labelPrivateNetworkRouting',
    description: 'gateway/common:privateNetwork.labelPrivateNetworkDescription',
  },
}
export const PrivateNetworkIpRangeTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.IpRange]),
  element: <PrivateNetworkIpRange />,
  helpId: HelpLinks.GatewayIPRange,
  hidden: true,
  translations: {
    label: 'gateway/common:privateNetwork.ipRangeTitle',
    title: 'gateway/common:privateNetwork.ipRangeTitle',
    description: 'gateway/common:privateNetwork.ipRangeDescription',
  },
}
const PrivateNetworkSubTabs: TabRouteObject[] = [
  PrivateNetworkGatewayConnectorsTab,
  PrivateNetworkRoutingTab,
  PrivateNetworkDnsTab,
  PrivateNetworkIpRangeTab,
]
export const PrivateNetworkTab: TabRouteObject = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.PrivateNetwork]),
  element: (
    <PrivateNetwork
      tabs={PrivateNetworkSubTabs}
      fullWidthExceptions={[
        fromParts([GATEWAY_ROUTES_DICTIONARY.Routing]),
        fromParts([GATEWAY_ROUTES_DICTIONARY.Dns]),
        fromParts([GATEWAY_ROUTES_DICTIONARY.IpRange]),
      ]}
    />
  ),
  translations: { label: 'gateway/common:privateNetwork.titlePrivateNetwork' },
  children: [
    { path: '/', element: <Navigate to={`.${fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors])}`} /> },
    ...PrivateNetworkSubTabs,
  ],
}

////////////////////////
// Ajax based routes
////////////////////////
export const GatewaySettingsSubTabs: TabRouteObject[] = [
  { ...AclTab },
  { ...NetworkServicesTab },
  { ...NetworkProtectionTab },
  { ...PrivateNetworkGatewayConnectorsTab },
  { ...PrivateNetworkRoutingTab },
  { ...PrivateNetworkDnsTab },
  { ...DnsSuffixesTab },
  { ...SourceIPPinningTab },
]

export const AjaxGatewaySettings = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Settings]),
  element: <AjaxSettingsTabs tabs={GatewaySettingsSubTabs} />,
  children: [
    { path: '/', element: <Navigate to={`.${fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices])}`} /> },
    ...GatewaySettingsSubTabs,
  ],
}
/* HACK: while we get a link router to work, redirect anything destined for the old path
 * of settings/connectors to settings/network/connector.
 */
export const AjaxGatewaySettingsDetails = {
  path: fromParts([GATEWAY_ROUTES_DICTIONARY.Settings]),
  children: [
    {
      path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
      children: makeDetailsRouteDefinition({
        addConnector: { element: <GatewayConnectorAdd /> },
        edit: { element: <GatewayConnectorEdit /> },
      }),
    },
    {
      path: fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices]),
      children: makeDetailsRouteDefinition({ add: { element: <NetworkServiceAdd /> }, edit: { element: <NetworkServiceEdit /> } }),
    },
    {
      path: fromParts([GATEWAY_ROUTES_DICTIONARY.Network]),
      children: [
        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
          children: makeDetailsRouteDefinition({
            addConnector: { element: <GatewayConnectorAdd /> },
            edit: { element: <GatewayConnectorEdit /> },
          }),
        },
      ],
    },
  ],
}

////////////////////////
// Cronos+ based routes
////////////////////////
const GatewayNetworkSettingsTabs: TabRouteObject[] = [
  { ...AclTab },
  { ...NetworkServicesTab },
  { ...NetworkProtectionTab },
  { ...PrivateNetworkTab },
  { ...DnsSuffixesTab },
  { ...SourceIPPinningTab },
]

const GatewayNetworkSettingsRedirect: React.FC = () => {
  const { isMigratedToACL } = useBISPolicySchema()
  const { isEnabled } = useFeatures()

  if (isMigratedToACL || isEnabled(FeatureName.UESBigAclMigrationEnabled)) {
    return <Navigate to={`./${fromParts([GATEWAY_ROUTES_DICTIONARY.Acl])}`} />
  } else {
    return <Navigate to={`./${fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices])}`} />
  }
}

const makeGatewayNetworkSettingsRoutes = () => {
  const basePath = makePageRoute(Page.GatewaySettings)

  return [
    {
      path: basePath,
      element: (
        <ViewWrapper
          basename={basePath}
          titleKey="console:network.title"
          tabs={GatewayNetworkSettingsTabs}
          tabWrapper
          fullHeight
          fullHeightExceptions={[
            fromParts([GATEWAY_ROUTES_DICTIONARY.DnsSuffixes]),
            fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkProtection]),
            fromParts([GATEWAY_ROUTES_DICTIONARY.SourceIPPinning]),
          ]}
          fullWidthExceptions={[
            fromParts([GATEWAY_ROUTES_DICTIONARY.DnsSuffixes]),
            fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkProtection]),
            fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices]),
            fromParts([GATEWAY_ROUTES_DICTIONARY.SourceIPPinning]),
          ]}
          tabWrapperExceptions={[fromParts([GATEWAY_ROUTES_DICTIONARY.Acl]), fromParts([GATEWAY_ROUTES_DICTIONARY.PrivateNetwork])]}
          tKeys={['console', 'gateway/common']}
          PanelProps={{ fullHeight: true, ContentWrapper: SecuredContentBoundary }}
        />
      ),
      children: [
        { path: '/', element: <GatewayNetworkSettingsRedirect /> },
        ...GatewayNetworkSettingsTabs,
        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
          element: <Navigate to={makePageRoute(Page.GatewaySettingsConnectors)} />,
        },
      ],
    },

    {
      path: basePath,
      children: [
        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.Acl]),
          children: [
            {
              path: '/:rulesType',
              children: makeDetailsRouteDefinition({
                add: { element: <AclAdd /> },
                edit: { element: <AclEdit /> },
                copy: { element: <AclAdd /> },
              }),
            },
          ],
        },

        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.NetworkServices]),
          children: makeDetailsRouteDefinition({
            add: { element: <NetworkServiceAdd /> },
            edit: { element: <NetworkServiceEdit /> },
          }),
        },

        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
          children: makeDetailsRouteDefinition({
            addConnector: { element: <GatewayConnectorAddPageRedirect /> },
            edit: { element: <GatewayConnectorEditPageRedirect /> },
          }),
        },

        {
          path: fromParts([GATEWAY_ROUTES_DICTIONARY.PrivateNetwork]),
          children: [
            {
              path: fromParts([GATEWAY_ROUTES_DICTIONARY.Connectors]),
              children: makeDetailsRouteDefinition({
                addConnector: { element: <GatewayConnectorAdd /> },
                edit: { element: <GatewayConnectorEdit /> },
              }),
            },
          ],
        },
      ],
    },
  ]
}

export const GatewayNetworkSettings = makeGatewayNetworkSettingsRoutes()

// Used for the partials e2e tests
export const _routes = GatewayNetworkSettings
