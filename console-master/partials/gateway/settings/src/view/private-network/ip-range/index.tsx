//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Data, Hooks } from '@ues-gateway/shared'

import IpRangeForm from './ip-range-form'

const { LoadingProgress } = Components
const { queryTenantConfig } = Data
const { BigService, useBigPermissions } = Hooks

const PrivateNetworkIpRange: React.FC = () => {
  useBigPermissions(BigService.Tenant)
  const { loading } = useStatefulReduxQuery(queryTenantConfig)

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }

  return <IpRangeForm />
}

export default PrivateNetworkIpRange
