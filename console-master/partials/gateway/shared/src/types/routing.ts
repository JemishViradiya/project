//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { ReportingServiceFilter, ReportingServiceQueryFilters } from '@ues-data/gateway'
import type { ReconciliationEntityType } from '@ues-data/shared-types'

import type { AclRulesType } from './acl'

export enum Page {
  GatewayPolicies = 'gateway.policies',
  GatewayPoliciesPolicyAdd = 'gateway.policies.policy.add',
  GatewayPoliciesPolicyCopy = 'gateway.policies.policy.copy',
  GatewayPoliciesPolicyEdit = 'gateway.policies.policy.edit',
  GatewayPoliciesPolicyEditApplied = 'gateway.policies.policy.edit.applied',

  GatewaySettings = 'gateway.settings',

  GatewaySettingsNetworkProtection = 'gateway.settings.networkProtection',

  GatewaySettingsAjaxConnectors = 'gateway.settings.ajax.connectors',
  GatewaySettingsAjaxConnectorAdd = 'gateway.settings.ajax.connector.add',
  GatewaySettingsAjaxConnectorEdit = 'gateway.settings.ajax.connector.edit',

  GatewaySettingsConnectors = 'gateway.settings.connectors',
  GatewaySettingsConnectorAdd = 'gateway.settings.connector.add',
  GatewaySettingsConnectorEdit = 'gateway.settings.connector.edit',

  GatewaySettingsOldConnectors = 'gateway.settings.old.connectors',
  GatewaySettingsOldConnectorAdd = 'gateway.settings.old.connector.add',
  GatewaySettingsOldConnectorEdit = 'gateway.settings.old.connector.edit',

  GatewaySettingsNetworkServices = 'gateway.settings.networkServices',
  GatewaySettingsNetworkServiceAdd = 'gateway.settings.networkService.add',
  GatewaySettingsNetworkServiceEdit = 'gateway.settings.networkService.edit',

  GatewaySettingsAcl = 'gateway.settings.acl',
  GatewaySettingsAclAdd = 'gateway.settings.acl.add',
  GatewaySettingsAclCopy = 'gateway.settings.acl.copy',
  GatewaySettingsAclEdit = 'gateway.settings.acl.edit',

  GatewayDashboard = 'gateway.dashboard',
  GatewayEvents = 'gateway.events',

  GatewayExternalEvents = 'uc.gateway.events',
}

export interface RouteBase<TPage extends Page, TParams = Record<string, unknown>, TQueryStringParams = Record<string, unknown>> {
  page: TPage
  routeConfig: {
    params?: TParams
    queryStringParams?: TQueryStringParams
  }
}

export enum GatewayRouteParamName {
  GroupBy = 'groupBy',
  Rank = 'rank',
  Id = 'id',
  RulesType = 'rulesType',
  EntityType = 'entityType',
  ConnectorUrl = 'connectorUrl',
}

export enum EventsGroupByParam {
  Default = 'default',
  Destination = 'destination',
  Users = 'users',
}

export type GatewayPolicies = RouteBase<Page.GatewayPolicies, { [GatewayRouteParamName.EntityType]: ReconciliationEntityType }>
export type GatewayPoliciesPolicyAddRoute = RouteBase<
  Page.GatewayPoliciesPolicyAdd,
  { [GatewayRouteParamName.EntityType]: ReconciliationEntityType; [GatewayRouteParamName.Id]?: string }
>
export type GatewayPoliciesPolicyCopyRoute = RouteBase<
  Page.GatewayPoliciesPolicyCopy,
  { [GatewayRouteParamName.EntityType]: ReconciliationEntityType; [GatewayRouteParamName.Id]: string }
>
export type GatewayPoliciesPolicyEditRoute = RouteBase<
  Page.GatewayPoliciesPolicyEdit,
  { [GatewayRouteParamName.EntityType]: ReconciliationEntityType; [GatewayRouteParamName.Id]: string }
>
export type GatewayPoliciesPolicyEditAppliedRoute = RouteBase<
  Page.GatewayPoliciesPolicyEditApplied,
  { [GatewayRouteParamName.EntityType]: ReconciliationEntityType; [GatewayRouteParamName.Id]: string }
>

export type GatewaySettingsRoute = RouteBase<Page.GatewaySettings, unknown>

export type GatewaySettingsAjaxConnectorsRoute = RouteBase<Page.GatewaySettingsAjaxConnectors>
export type GatewaySettingsAjaxConnectorEditRoute = RouteBase<
  Page.GatewaySettingsAjaxConnectorEdit,
  { [GatewayRouteParamName.Id]: string }
>
export type GatewaySettingsAjaxConnectorAddRoute = RouteBase<
  Page.GatewaySettingsAjaxConnectorAdd,
  unknown,
  { [GatewayRouteParamName.ConnectorUrl]: string }
>

export type GatewaySettingsConnectorsRoute = RouteBase<Page.GatewaySettingsConnectors>
export type GatewaySettingsConnectorEditRoute = RouteBase<Page.GatewaySettingsConnectorEdit, { [GatewayRouteParamName.Id]: string }>
export type GatewaySettingsConnectorAddRoute = RouteBase<
  Page.GatewaySettingsConnectorAdd,
  unknown,
  { [GatewayRouteParamName.ConnectorUrl]: string }
>

export type GatewaySettingsOldConnectorsRoute = RouteBase<Page.GatewaySettingsOldConnectors>
export type GatewaySettingsOldConnectorEditRoute = RouteBase<
  Page.GatewaySettingsOldConnectorEdit,
  { [GatewayRouteParamName.Id]: string }
>
export type GatewaySettingsOldConnectorAddRoute = RouteBase<
  Page.GatewaySettingsOldConnectorAdd,
  unknown,
  { [GatewayRouteParamName.ConnectorUrl]: string }
>

export type GatewaySettingsNetworkProtectionRoute = RouteBase<Page.GatewaySettingsNetworkProtection>

export type GatewaySettingsNetworkServicesRoute = RouteBase<Page.GatewaySettingsNetworkServices>
export type GatewaySettingsNetworkServiceAddRoute = RouteBase<Page.GatewaySettingsNetworkServiceAdd>
export type GatewaySettingsNetworkServiceEditRoute = RouteBase<
  Page.GatewaySettingsNetworkServiceEdit,
  { [GatewayRouteParamName.Id]: string }
>

export type GatewaySettingsAclRoute = RouteBase<Page.GatewaySettingsAcl, { [GatewayRouteParamName.RulesType]: AclRulesType }>
export type GatewaySettingsAclAddRoute = RouteBase<
  Page.GatewaySettingsAclAdd,
  { [GatewayRouteParamName.RulesType]: AclRulesType },
  { [GatewayRouteParamName.Rank]?: number }
>
export type GatewaySettingsAclEditRoute = RouteBase<
  Page.GatewaySettingsAclEdit,
  { [GatewayRouteParamName.Id]: string; [GatewayRouteParamName.RulesType]: AclRulesType }
>
export type GatewaySettingsAclCopyRoute = RouteBase<
  Page.GatewaySettingsAclCopy,
  { [GatewayRouteParamName.Id]: string; [GatewayRouteParamName.RulesType]: AclRulesType },
  { [GatewayRouteParamName.Rank]?: number }
>

export interface GatewayEventsRouteQueryParams
  extends Pick<
    ReportingServiceQueryFilters,
    | ReportingServiceFilter.AlertAction
    | ReportingServiceFilter.AlertPolicyName
    | ReportingServiceFilter.NetworkRoute
    | ReportingServiceFilter.TlsVersion
    | ReportingServiceFilter.Destination
  > {
  displayName?: string
  startDate?: string
  endDate?: string
}

export type GatewayEventsRoute = RouteBase<
  Page.GatewayEvents,
  { [GatewayRouteParamName.GroupBy]: EventsGroupByParam },
  GatewayEventsRouteQueryParams
>

export type GatewayDashboardRoute = RouteBase<Page.GatewayDashboard>

export type GatewayExternalEventsRoute = RouteBase<
  Page.GatewayExternalEvents,
  { [GatewayRouteParamName.GroupBy]: EventsGroupByParam },
  GatewayEventsRouteQueryParams
>

export type PagesRoutes = {
  [Page.GatewayPolicies]: GatewayPolicies
  [Page.GatewayPoliciesPolicyAdd]: GatewayPoliciesPolicyAddRoute
  [Page.GatewayPoliciesPolicyCopy]: GatewayPoliciesPolicyCopyRoute
  [Page.GatewayPoliciesPolicyEdit]: GatewayPoliciesPolicyEditRoute
  [Page.GatewayPoliciesPolicyEditApplied]: GatewayPoliciesPolicyEditAppliedRoute

  [Page.GatewaySettings]: GatewaySettingsRoute

  [Page.GatewaySettingsAjaxConnectors]: GatewaySettingsAjaxConnectorsRoute
  [Page.GatewaySettingsAjaxConnectorAdd]: GatewaySettingsAjaxConnectorAddRoute
  [Page.GatewaySettingsAjaxConnectorEdit]: GatewaySettingsAjaxConnectorEditRoute

  [Page.GatewaySettingsConnectors]: GatewaySettingsConnectorsRoute
  [Page.GatewaySettingsConnectorAdd]: GatewaySettingsConnectorAddRoute
  [Page.GatewaySettingsConnectorEdit]: GatewaySettingsConnectorEditRoute

  [Page.GatewaySettingsOldConnectors]: GatewaySettingsOldConnectorsRoute
  [Page.GatewaySettingsOldConnectorAdd]: GatewaySettingsOldConnectorAddRoute
  [Page.GatewaySettingsOldConnectorEdit]: GatewaySettingsOldConnectorEditRoute

  [Page.GatewaySettingsNetworkProtection]: GatewaySettingsNetworkProtectionRoute

  [Page.GatewaySettingsNetworkServices]: GatewaySettingsNetworkServicesRoute
  [Page.GatewaySettingsNetworkServiceAdd]: GatewaySettingsNetworkServiceAddRoute
  [Page.GatewaySettingsNetworkServiceEdit]: GatewaySettingsNetworkServiceEditRoute

  [Page.GatewaySettingsAcl]: GatewaySettingsAclRoute
  [Page.GatewaySettingsAclAdd]: GatewaySettingsAclAddRoute
  [Page.GatewaySettingsAclCopy]: GatewaySettingsAclCopyRoute
  [Page.GatewaySettingsAclEdit]: GatewaySettingsAclEditRoute

  [Page.GatewayEvents]: GatewayEventsRoute
  [Page.GatewayExternalEvents]: GatewayExternalEventsRoute

  [Page.GatewayDashboard]: GatewayDashboardRoute
}
