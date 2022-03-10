//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Data, Hooks } from '@ues-gateway/shared'

import LookupZones from './lookup-zones'

const { queryTenantConfig } = Data
const { LoadingProgress } = Components
const { BigService, useBigPermissions } = Hooks

const PrivateNetworkDns: React.FC = () => {
  useBigPermissions(BigService.Tenant)
  const { loading } = useStatefulReduxQuery(queryTenantConfig)

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }
  return <LookupZones />
}

export default PrivateNetworkDns
