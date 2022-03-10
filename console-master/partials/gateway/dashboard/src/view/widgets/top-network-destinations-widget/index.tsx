//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'

import type { ChartProps } from '@ues-data/dashboard'
import { ReportingServiceNetworkRouteType } from '@ues-data/gateway'

import { TopNetworkDestinationsWidget } from './widget'

export const PublicTopNetworkDestinationsWidget: React.FC<ChartProps> = memo(props => (
  <TopNetworkDestinationsWidget {...props} networkRouteType={ReportingServiceNetworkRouteType.Public} />
))

export const PrivateTopNetworkDestinationsWidget: React.FC<ChartProps> = memo(props => (
  <TopNetworkDestinationsWidget {...props} networkRouteType={ReportingServiceNetworkRouteType.Private} />
))
