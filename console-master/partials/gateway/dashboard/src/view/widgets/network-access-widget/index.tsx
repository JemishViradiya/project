//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import type { ChartProps } from '@ues-data/dashboard'
import { ReportingServiceNetworkRouteType } from '@ues-data/gateway'

import { NetworkAccessWidget } from './widget'

export const PublicNetworkAccessWidget: React.FC<ChartProps> = memo(props => (
  <NetworkAccessWidget {...props} networkRouteType={ReportingServiceNetworkRouteType.Public} />
))

export const PrivateNetworkAccessWidget: React.FC<ChartProps> = memo(props => (
  <NetworkAccessWidget {...props} networkRouteType={ReportingServiceNetworkRouteType.Private} />
))
