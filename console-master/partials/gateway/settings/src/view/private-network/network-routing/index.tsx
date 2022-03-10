//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Data, Hooks } from '@ues-gateway/shared'

import Routing from './routing'

const { queryTenantConfig } = Data
const { LoadingProgress } = Components
const { BigService, useBigPermissions } = Hooks

const PrivateNetworkRouting: React.FC = () => {
  useBigPermissions(BigService.Tenant)
  const { loading } = useStatefulReduxQuery(queryTenantConfig)

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }
  return <Routing />
}

export default PrivateNetworkRouting
