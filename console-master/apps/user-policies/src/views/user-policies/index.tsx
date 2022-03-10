import React, { lazy } from 'react'
import { Navigate } from 'react-router-dom'

import { AdaptiveResponsePolicy } from '@ues-bis/adaptive-response-policies'
import { RiskDetectionPolicy } from '@ues-bis/risk-detection-policies'
import { EnterpriseIdentityPolicy } from '@ues-eid/policy'
import { GatewayPolicyDetails } from '@ues-gateway/policies'
import { DlpPolicy } from '@ues-info/policy'
import { ProtectMobilePolicy } from '@ues-mtd/policy'
import { ActivationProfile, ActivationProfiles } from '@ues-platform/policies'

import { Routes } from './user-policies-routes'

const UserPoliciesNavigation = lazy(() => import('./user-policies-navigation'))

export const ProfilesRoutes = [
  // policy list
  {
    path: '/list',
    element: <UserPoliciesNavigation />,
    children: [{ path: '/', element: <Navigate to={`.${ActivationProfiles.path}`} /> }, ...Routes],
  },

  // policy details
  ActivationProfile,
  ProtectMobilePolicy,
  EnterpriseIdentityPolicy,
  ...GatewayPolicyDetails,
  AdaptiveResponsePolicy,
  RiskDetectionPolicy,
  DlpPolicy,
]
