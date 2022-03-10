//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import type { PartialRouteObject } from 'react-router'

import { FeatureName, FeaturizationApi } from '@ues-data/shared'
import { ReconciliationEntityType } from '@ues-data/shared-types'

import type { PagesRoutes } from '../types'
import { AclRulesType, Page } from '../types'

type PageRouteFunction<TPage extends keyof PagesRoutes, TRoute extends PagesRoutes[TPage]['routeConfig']> = (
  routeConfig: TRoute,
) => string

type PageRouteFunctions = {
  [TPage in keyof PagesRoutes]: PageRouteFunction<TPage, PagesRoutes[TPage]['routeConfig']>
}

const toQueryStringParams = <TQueryStringParams>(queryStringParams: TQueryStringParams) => {
  if (isEmpty(queryStringParams)) return ''
  const query = Object.entries(queryStringParams)
    .map(([name, value]) => `${name}=${value}`)
    .join('&')
  return `?${query}`
}

export const fromParts = <TQueryStringParams>(parts: string[], queryStringParams?: TQueryStringParams) =>
  `/${parts.filter(Boolean).join('/')}${toQueryStringParams(queryStringParams)}`

const resolveEventsRouteParts = (singleNXAppPath: string[], fallbackPath: string[]): string[] =>
  FeaturizationApi.isFeatureEnabled(FeatureName.SingleNXApp) ? singleNXAppPath : fallbackPath

export const GATEWAY_ROUTES_DICTIONARY = {
  Acl: 'acl',
  Add: 'add',
  AgentIps: 'ips',
  Applied: 'applied',
  Connectors: 'connectors',
  Copy: 'copy',
  CreateConnector: 'createconnector',
  Dashboard: 'dashboard',
  Dns: 'dns',
  DnsSuffixes: 'dns-suffixes',
  Events: 'events',
  Gateway: 'gateway',
  IpRange: 'ip-range',
  List: 'list',
  Network: 'network',
  NetworkProtection: 'network-protection',
  NetworkServices: 'network-services',
  PrivateNetwork: 'private-network',
  Routing: 'routing',
  Settings: 'settings',
  SourceIPPinning: 'ip-pinning',
  [ReconciliationEntityType.GatewayApp]: 'gatewayService',
  [ReconciliationEntityType.NetworkAccessControl]: 'networkAccessControl',
  [AclRulesType.Committed]: 'committed',
  [AclRulesType.Draft]: 'draft',
} as const
export const SETTINGS_ROUTE_PATH_PARTS = [GATEWAY_ROUTES_DICTIONARY.Settings, GATEWAY_ROUTES_DICTIONARY.Network]
export const CONNECTORS_AJAX_ROUTE_PATH_PARTS = [GATEWAY_ROUTES_DICTIONARY.Settings, GATEWAY_ROUTES_DICTIONARY.Connectors]

const GATEWAY_DETAILS_PATHS_DICTIONARY = {
  add: fromParts([GATEWAY_ROUTES_DICTIONARY.Add]),
  addConnector: fromParts([GATEWAY_ROUTES_DICTIONARY.CreateConnector]),
  copy: `${fromParts([GATEWAY_ROUTES_DICTIONARY.Copy])}/:id`,
  edit: '/:id',
}
export const makeDetailsRouteDefinition = (
  config: Partial<Record<keyof typeof GATEWAY_DETAILS_PATHS_DICTIONARY, PartialRouteObject>>,
) => Object.entries(config).map(([key, config]) => ({ ...config, path: GATEWAY_DETAILS_PATHS_DICTIONARY[key] }))

const routeFunctions: PageRouteFunctions = {
  [Page.GatewayPolicies]: ({ params: { entityType }, queryStringParams }) =>
    fromParts([GATEWAY_ROUTES_DICTIONARY.List, GATEWAY_ROUTES_DICTIONARY[entityType]], queryStringParams),
  [Page.GatewayPoliciesPolicyAdd]: ({ params: { entityType }, queryStringParams }) =>
    fromParts([GATEWAY_ROUTES_DICTIONARY[entityType], GATEWAY_ROUTES_DICTIONARY.Add], queryStringParams),
  [Page.GatewayPoliciesPolicyCopy]: ({ params: { entityType, id }, queryStringParams }) =>
    fromParts([GATEWAY_ROUTES_DICTIONARY[entityType], GATEWAY_ROUTES_DICTIONARY.Copy, id], queryStringParams),
  [Page.GatewayPoliciesPolicyEdit]: ({ params: { entityType, id }, queryStringParams }) =>
    fromParts([GATEWAY_ROUTES_DICTIONARY[entityType], id], queryStringParams),
  [Page.GatewayPoliciesPolicyEditApplied]: ({ params: { entityType, id }, queryStringParams }) =>
    fromParts([GATEWAY_ROUTES_DICTIONARY[entityType], id, GATEWAY_ROUTES_DICTIONARY.Applied], queryStringParams),

  [Page.GatewaySettings]: ({ queryStringParams }) => fromParts(SETTINGS_ROUTE_PATH_PARTS, queryStringParams),
  [Page.GatewaySettingsNetworkProtection]: ({ queryStringParams }) =>
    fromParts([...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.NetworkProtection], queryStringParams),

  [Page.GatewaySettingsAjaxConnectors]: ({ queryStringParams }) => fromParts(CONNECTORS_AJAX_ROUTE_PATH_PARTS, queryStringParams),
  [Page.GatewaySettingsAjaxConnectorAdd]: ({ queryStringParams }) =>
    fromParts([...CONNECTORS_AJAX_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.CreateConnector], queryStringParams),
  [Page.GatewaySettingsAjaxConnectorEdit]: ({ params: { id }, queryStringParams }) =>
    fromParts([...CONNECTORS_AJAX_ROUTE_PATH_PARTS, id], queryStringParams),

  [Page.GatewaySettingsOldConnectors]: ({ queryStringParams }) =>
    fromParts([...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.Connectors], queryStringParams),
  [Page.GatewaySettingsOldConnectorAdd]: ({ queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.Connectors, GATEWAY_ROUTES_DICTIONARY.CreateConnector],
      queryStringParams,
    ),
  [Page.GatewaySettingsOldConnectorEdit]: ({ params: { id }, queryStringParams }) =>
    fromParts([...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.Connectors, id], queryStringParams),

  [Page.GatewaySettingsConnectors]: ({ queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.PrivateNetwork, GATEWAY_ROUTES_DICTIONARY.Connectors],
      queryStringParams,
    ),
  [Page.GatewaySettingsConnectorAdd]: ({ queryStringParams }) =>
    fromParts(
      [
        ...SETTINGS_ROUTE_PATH_PARTS,
        GATEWAY_ROUTES_DICTIONARY.PrivateNetwork,
        GATEWAY_ROUTES_DICTIONARY.Connectors,
        GATEWAY_ROUTES_DICTIONARY.CreateConnector,
      ],
      queryStringParams,
    ),
  [Page.GatewaySettingsConnectorEdit]: ({ params: { id }, queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.PrivateNetwork, GATEWAY_ROUTES_DICTIONARY.Connectors, id],
      queryStringParams,
    ),

  [Page.GatewaySettingsNetworkServices]: ({ queryStringParams }) =>
    fromParts([...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.NetworkServices], queryStringParams),
  [Page.GatewaySettingsNetworkServiceAdd]: ({ queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.NetworkServices, GATEWAY_ROUTES_DICTIONARY.Add],
      queryStringParams,
    ),
  [Page.GatewaySettingsNetworkServiceEdit]: ({ params: { id }, queryStringParams }) =>
    fromParts([...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.NetworkServices, id], queryStringParams),

  [Page.GatewaySettingsAcl]: ({ params: { rulesType }, queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.Acl, GATEWAY_ROUTES_DICTIONARY[rulesType]],
      queryStringParams,
    ),
  [Page.GatewaySettingsAclAdd]: ({ params: { rulesType }, queryStringParams }) =>
    fromParts(
      [
        ...SETTINGS_ROUTE_PATH_PARTS,
        GATEWAY_ROUTES_DICTIONARY.Acl,
        GATEWAY_ROUTES_DICTIONARY[rulesType],
        GATEWAY_ROUTES_DICTIONARY.Add,
      ],
      queryStringParams,
    ),
  [Page.GatewaySettingsAclCopy]: ({ params: { id, rulesType }, queryStringParams }) =>
    fromParts(
      [
        ...SETTINGS_ROUTE_PATH_PARTS,
        GATEWAY_ROUTES_DICTIONARY.Acl,
        GATEWAY_ROUTES_DICTIONARY[rulesType],
        GATEWAY_ROUTES_DICTIONARY.Copy,
        id,
      ],
      queryStringParams,
    ),
  [Page.GatewaySettingsAclEdit]: ({ params: { id, rulesType }, queryStringParams }) =>
    fromParts(
      [...SETTINGS_ROUTE_PATH_PARTS, GATEWAY_ROUTES_DICTIONARY.Acl, GATEWAY_ROUTES_DICTIONARY[rulesType], id],
      queryStringParams,
    ),

  [Page.GatewayDashboard]: ({ queryStringParams }) => fromParts([GATEWAY_ROUTES_DICTIONARY.Dashboard], queryStringParams),

  [Page.GatewayEvents]: ({ params: { groupBy }, queryStringParams }) =>
    fromParts(
      resolveEventsRouteParts(
        [GATEWAY_ROUTES_DICTIONARY.Events, GATEWAY_ROUTES_DICTIONARY.Gateway, groupBy],
        [GATEWAY_ROUTES_DICTIONARY.Events, groupBy],
      ),
      queryStringParams,
    ),

  // TODO remove with BIG-6857
  [Page.GatewayExternalEvents]: ({ params: { groupBy }, queryStringParams }) =>
    fromParts(
      resolveEventsRouteParts(['uc', 'console#', 'events', 'gateway', groupBy], ['uc', 'gateway#', 'events', groupBy]),
      queryStringParams,
    ),
}

export const makePageRoute = <TPage extends keyof PagesRoutes, TRoute extends PagesRoutes[TPage]>(
  page: TPage,
  routeConfig?: Partial<TRoute['routeConfig']>,
): string =>
  routeFunctions[page]({
    ...routeConfig,
    params: routeConfig?.params ?? {},
    queryStringParams: routeConfig?.queryStringParams ?? {},
  } as any)
