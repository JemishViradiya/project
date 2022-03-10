//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import type { ChartProps } from '@ues-data/dashboard'
import { ReconciliationEntityType } from '@ues-data/gateway'

import { AppliedPoliciesWidget } from './widget'

export const NetworkAccessControlAppliedPolicies: React.FC<ChartProps> = memo(props => (
  <AppliedPoliciesWidget {...props} policyType={ReconciliationEntityType.NetworkAccessControl} />
))
