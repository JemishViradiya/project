//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { lazy } from 'react'

import { FeatureName, ReconciliationEntityType } from '@ues-data/shared'
import { Config, Utils } from '@ues-gateway/shared'

const PoliciesList = lazy(() => import('./policies-main/list'))
const PolicyAdd = lazy(() => import('./policy-add'))
const PolicyEdit = lazy(() => import('./policy-edit'))
const PolicyApplied = lazy(() => import('./policy-assigned-users'))
const PolicyEditor = lazy(() => import('./policy-editor'))

const { fromParts, GATEWAY_ROUTES_DICTIONARY, makeDetailsRouteDefinition } = Utils
const { SUPPORTED_ENTITY_TYPES } = Config

const GATEWAY_POLICY_ROUTE_CONFIG = {
  [ReconciliationEntityType.NetworkAccessControl]: {
    features: (isEnabled, extraTenantFeatures) => !isEnabled(FeatureName.UESBigAclEnabled) || !extraTenantFeatures?.isMigratedToACL,
  },
}

export const GatewayPolicies = SUPPORTED_ENTITY_TYPES.map(entityType => ({
  path: fromParts([GATEWAY_ROUTES_DICTIONARY[entityType]]),
  element: <PoliciesList entityType={entityType} />,
  ...GATEWAY_POLICY_ROUTE_CONFIG[entityType],
}))

const makeGatewayPolicyEditSubTabs = (entityType: ReconciliationEntityType) => [
  {
    path: '/',
    element: <PolicyEditor entityType={entityType} />,
    translations: { label: 'profiles:policy.detail.settings' },
  },
  {
    path: fromParts([GATEWAY_ROUTES_DICTIONARY.Applied]),
    element: <PolicyApplied entityType={entityType} />,
    translations: { label: 'profiles:policy.detail.appliedUsersAndGroups' },
  },
]

export const GatewayPolicyDetails = SUPPORTED_ENTITY_TYPES.map(entityType => {
  const GatewayPolicyEditSubTabs = makeGatewayPolicyEditSubTabs(entityType)

  return {
    path: fromParts([GATEWAY_ROUTES_DICTIONARY[entityType]]),
    children: makeDetailsRouteDefinition({
      add: { element: <PolicyAdd entityType={entityType} /> },
      edit: {
        element: <PolicyEdit tabs={GatewayPolicyEditSubTabs} entityType={entityType} />,
        children: GatewayPolicyEditSubTabs,
      },
      copy: { element: <PolicyAdd entityType={entityType} /> },
    }),
  }
})
