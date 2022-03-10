//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { TenantPrivateDnsZonesType } from '@ues-data/gateway'
import { Config } from '@ues-gateway/shared'
import { ButtonGroupNav } from '@ues/behaviours'

import { TenantStickyActions } from '../../../../components'
import { PICK_TENANT_CONFIG_PROPERTIES } from '../../../constants'
import LookupZonesList from './lookup-zones-list'

const { GATEWAY_TRANSLATIONS_KEY } = Config

const LookupZones: React.FC = () => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const buttons = [
    { label: t('dns.dnsServers'), component: <LookupZonesList zonesType={TenantPrivateDnsZonesType.DnsServers} /> },
    { label: t('dns.dnsForwardLookupZone'), component: <LookupZonesList zonesType={TenantPrivateDnsZonesType.ForwardZones} /> },
    { label: t('dns.dnsReverseLookupZone'), component: <LookupZonesList zonesType={TenantPrivateDnsZonesType.ReverseZones} /> },
  ]

  return (
    <>
      <ButtonGroupNav items={buttons} />
      <TenantStickyActions tenantConfigurationKeys={PICK_TENANT_CONFIG_PROPERTIES.privateNetworkDns} />
    </>
  )
}

export default LookupZones
