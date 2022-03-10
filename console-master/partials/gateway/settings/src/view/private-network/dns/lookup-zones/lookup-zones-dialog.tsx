//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'
import React from 'react'
import type { ValidateResult } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Dialog } from '@material-ui/core'

import { Form } from '@ues-behaviour/hook-form'
import type { TenantConfiguration } from '@ues-data/gateway'
import { TenantPrivateDnsZonesType } from '@ues-data/gateway'
import { Config, Data, Utils } from '@ues-gateway/shared'
import { DialogChildren, useControlledDialog } from '@ues/behaviours'

import type { LookupZonesDialogProps } from './types'

const {
  isValidCIDR,
  isValidCIDRs,
  isValidDNSDomain,
  isValidDNSDomains,
  isValidIPAddress,
  isValidIPAddresses,
  sanitizeDomain,
  getIPType,
  isIPInTargetArray,
  IPType,
} = Utils
const { getLocalTenantConfig, updateLocalTenantConfig } = Data
const { GATEWAY_TRANSLATIONS_KEY } = Config

const DIALOG_LOCALIZATION_KEY = {
  TITLE_ADD: {
    [TenantPrivateDnsZonesType.DnsServers]: 'dns.dnsServerAdd',
    [TenantPrivateDnsZonesType.ForwardZones]: 'dns.forwardZoneAdd',
    [TenantPrivateDnsZonesType.ReverseZones]: 'dns.reverseZoneAdd',
  },
  TITLE_EDIT: {
    [TenantPrivateDnsZonesType.DnsServers]: 'dns.dnsServerEdit',
    [TenantPrivateDnsZonesType.ForwardZones]: 'dns.forwardZoneEdit',
    [TenantPrivateDnsZonesType.ReverseZones]: 'dns.reverseZoneEdit',
  },
  HELP_LABEL: {
    [TenantPrivateDnsZonesType.DnsServers]: 'dns.enterIpAddressesHelpLabel',
    [TenantPrivateDnsZonesType.ForwardZones]: 'dns.enterDomainsHelpLabel',
    [TenantPrivateDnsZonesType.ReverseZones]: 'dns.enterCidrsHelpLabel',
  },
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const LookupZonesDialog: React.FC<LookupZonesDialogProps> = ({ dialogId, rowData, zonesType }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'general/form'])
  const dispatch = useDispatch()
  const localTenantConfig = useSelector(getLocalTenantConfig)

  const isAddMode = rowData === undefined

  const isDnsServerInPrivateNetworkSpace = (dnsServer: string, tenantConfig: Partial<TenantConfiguration>) => {
    const dnsServerIPType = getIPType(dnsServer)

    const { privateNetworkIpV4Ranges = [], privateNetworkIpV6Ranges = [] } = tenantConfig
    const privateNetwork = dnsServerIPType === IPType.IPv4 ? privateNetworkIpV4Ranges : privateNetworkIpV6Ranges

    return isIPInTargetArray(dnsServer, privateNetwork)
  }

  const validateDnsServers = (value: string[]) =>
    value.map(item => isDnsServerInPrivateNetworkSpace(item, localTenantConfig)).every(Boolean)

  const dnsServersValidatorFn = value => {
    const validateIPAddressFn = isAddMode ? isValidIPAddresses : isValidIPAddress

    if (!validateIPAddressFn(value)) {
      return t('general/form:validationErrors.invalid')
    }

    const validateDnsServersFn = isAddMode
      ? validateDnsServers
      : value => isDnsServerInPrivateNetworkSpace(value, localTenantConfig)

    return validateDnsServersFn(value) ? true : t('dns.dnsServerPrivateNetworkValidation')
  }

  const forwardZonesValidatorFn = value => {
    const validatorFn = isAddMode ? isValidDNSDomains : isValidDNSDomain

    return validatorFn(value) ? true : t('dns.dnsForwardZoneValidation')
  }

  const reverseZonesValidatorFn = value => {
    const validatorFn = isAddMode ? isValidCIDRs : isValidCIDR

    return validatorFn(value) ? true : t('dns.dnsReverseZoneValidation')
  }

  const FORM_FIELDS_CONFIG = {
    [TenantPrivateDnsZonesType.ForwardZones]: {
      labelKey: 'common.domain',
      validatorFn: forwardZonesValidatorFn,
    },
    [TenantPrivateDnsZonesType.ReverseZones]: {
      labelKey: 'common.cidrAddress',
      validatorFn: reverseZonesValidatorFn,
    },
    [TenantPrivateDnsZonesType.DnsServers]: {
      labelKey: 'common.ipAddress',
      validatorFn: dnsServersValidatorFn,
    },
  }

  const dnsServers =
    localTenantConfig?.privateDnsZones?.forwardZones?.[0]?.forward ||
    localTenantConfig?.privateDnsZones?.reverseZones?.[0]?.forward ||
    []

  const addDnsZone = (zone: string[]) => [...(localTenantConfig?.privateDnsZones?.[zonesType]?.[0]?.name ?? []), ...zone]

  const editDnsZone = (zone: string) => {
    const update = [...(localTenantConfig?.privateDnsZones?.[zonesType]?.[0]?.name ?? [])]

    update[rowData.id] = zone

    return update
  }

  const addDnsServers = (server: string[]) => [...dnsServers, ...server]

  const editDnsServers = (server: string) => {
    const update = [...dnsServers]

    update[rowData.id] = server

    return update
  }

  const updateDnsServers = (server: string | string[]): void => {
    const forward = isAddMode ? addDnsServers(server as string[]) : editDnsServers(server as string)

    const update = {
      privateDnsZones: {
        forwardZones: [{ ...localTenantConfig?.privateDnsZones?.forwardZones?.[0], forward }],
        reverseZones: [{ ...localTenantConfig?.privateDnsZones?.reverseZones?.[0], forward }],
      },
    }

    dispatch(updateLocalTenantConfig(update))
  }

  const updateLookupZone = (zone: string | string[]): void => {
    const sanitizedZone = typeof zone === 'string' ? sanitizeDomain(zone) : zone.map(sanitizeDomain)
    const name = isAddMode ? addDnsZone(sanitizedZone as string[]) : editDnsZone(sanitizedZone as string)

    const update = {
      privateDnsZones: {
        ...localTenantConfig.privateDnsZones,
        [zonesType]: [{ ...localTenantConfig.privateDnsZones?.[zonesType]?.[0], name }],
      },
    }

    dispatch(updateLocalTenantConfig(update))
  }

  const updateTenantConfig = ({ zone }) => {
    zonesType === TenantPrivateDnsZonesType.DnsServers ? updateDnsServers(zone) : updateLookupZone(zone)
    onClose()
  }

  const { open, onClose } = useControlledDialog({ dialogId })

  if (!zonesType) return null

  const getTitle = (isAddMode: boolean, zonesType: TenantPrivateDnsZonesType): string =>
    t(isAddMode ? DIALOG_LOCALIZATION_KEY.TITLE_ADD[zonesType] : DIALOG_LOCALIZATION_KEY.TITLE_EDIT[zonesType])

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogChildren
        title={getTitle(isAddMode, zonesType)}
        onClose={onClose}
        content={
          <Form
            fields={[
              {
                type: isAddMode ? 'multiLine' : 'text',
                name: 'zone',
                label: t(FORM_FIELDS_CONFIG[zonesType].labelKey),
                helpLabel: isAddMode && t(DIALOG_LOCALIZATION_KEY.HELP_LABEL[zonesType]),
                validationRules: {
                  required: t('common.requiredFieldErrorMessage') as string,
                  validate: value => {
                    if (isAddMode ? isEmpty(value[0]) : isEmpty(value)) {
                      return t('common.requiredFieldErrorMessage') as ValidateResult
                    }

                    return FORM_FIELDS_CONFIG[zonesType].validatorFn(value)
                  },
                },
              },
            ]}
            initialValues={rowData}
            onSubmit={updateTenantConfig}
            onCancel={onClose}
            submitButtonLabel={isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
          />
        }
      />
    </Dialog>
  )
}

export default LookupZonesDialog
