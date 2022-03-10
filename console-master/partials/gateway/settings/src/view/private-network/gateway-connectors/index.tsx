//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'
import { ButtonGroupNav } from '@ues/behaviours'

import ConnectorsList from './connectors-list'
import HealthCheckUrl from './health-check-url'
import SourceIpValidation from './source-ip-validation'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { queryTenantConfig } = Data
const { LoadingProgress } = Components
const { useBigPermissions, BigService } = Hooks

const GatewayConnectors: React.FC = memo(() => {
  useBigPermissions(BigService.Tenant)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { loading } = useStatefulReduxQuery(queryTenantConfig)

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }

  const buttons = [
    { label: t('connectors.connectors'), component: <ConnectorsList /> },
    { label: t('connectors.healthCheckLabel'), component: <HealthCheckUrl /> },
    { label: t('connectors.sourceIpValidation'), component: <SourceIpValidation /> },
  ]

  return <ButtonGroupNav items={buttons} />
})

export default GatewayConnectors
