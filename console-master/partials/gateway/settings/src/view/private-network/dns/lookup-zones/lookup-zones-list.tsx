//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Button, IconButton, Typography } from '@material-ui/core'

import { TenantPrivateDnsZonesType } from '@ues-data/gateway'
import { Config, Data, Hooks } from '@ues-gateway/shared'
import { BasicAdd, BasicClose, BasicEdit } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider, TableToolbar } from '@ues/behaviours'

import LookupZonesDialog from './lookup-zones-dialog'
import type { LookupZonesDialogProps, LookupZonesListProps, ZoneListItem } from './types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const {
  getLocalTenantConfig,
  getPrivateDnsZones,
  getPrivateDnsZonesByType,
  getTenantConfigurationTask,
  updateLocalTenantConfig,
} = Data
const { BigService, useBigPermissions } = Hooks

const idFunction = rowData => rowData.zone

const TITLE_LOCALIZATION_KEY = {
  [TenantPrivateDnsZonesType.DnsServers]: 'dns.dnsServersDescription',
  [TenantPrivateDnsZonesType.ForwardZones]: 'dns.dnsForwardLookupZoneDescription',
  [TenantPrivateDnsZonesType.ReverseZones]: 'dns.dnsReverseLookupZoneDescription',
}

const ADD_BUTTON_LOCALIZATION_KEY = {
  [TenantPrivateDnsZonesType.DnsServers]: 'dns.dnsServerAdd',
  [TenantPrivateDnsZonesType.ForwardZones]: 'dns.forwardZoneAdd',
  [TenantPrivateDnsZonesType.ReverseZones]: 'dns.reverseZoneAdd',
}

const LookupZonesList: React.FC<LookupZonesListProps> = ({ zonesType }) => {
  const [lookupZonesDialogProps, setLookupZonesDialogProps] = useState<LookupZonesDialogProps>()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const dispatch = useDispatch()
  const { canUpdate } = useBigPermissions(BigService.Tenant)

  const tenantConfigurationTask = useSelector(getTenantConfigurationTask)
  const privateDnsZones = useSelector(getPrivateDnsZones)
  const dnsZonesByType = useSelector(state => getPrivateDnsZonesByType(state)(zonesType))
  const localTenantConfig = useSelector(getLocalTenantConfig)

  const dnsServers = privateDnsZones?.forwardZones?.[0]?.forward || privateDnsZones?.reverseZones?.[0]?.forward || []
  const isDnsServers = zonesType === TenantPrivateDnsZonesType.DnsServers

  const openLookupZonesDialog = (rowData?: ZoneListItem) =>
    setLookupZonesDialogProps({
      dialogId: Symbol('dialog-id'),
      rowData,
    })

  const updateDnsServers = (rowDataIndex: number) => {
    const updatedForward = [...dnsServers]

    updatedForward.splice(rowDataIndex, 1)

    const update = {
      privateDnsZones:
        updatedForward.length === 0
          ? {
              forwardZones: [],
              reverseZones: [],
            }
          : {
              forwardZones: [{ ...localTenantConfig?.privateDnsZones?.forwardZones?.[0], forward: updatedForward }],
              reverseZones: [{ ...localTenantConfig?.privateDnsZones?.reverseZones?.[0], forward: updatedForward }],
            },
    }

    dispatch(updateLocalTenantConfig(update))
  }

  const updateDnsZones = (rowDataIndex: number) => {
    const name = [...(localTenantConfig?.privateDnsZones?.[zonesType]?.[0]?.name ?? [])]

    name.splice(rowDataIndex, 1)

    const update = {
      privateDnsZones: {
        ...localTenantConfig.privateDnsZones,
        [zonesType]: [{ ...localTenantConfig.privateDnsZones[zonesType]?.[0], name }],
      },
    }

    dispatch(updateLocalTenantConfig(update))
  }

  const zonesList = isDnsServers ? dnsServers : dnsZonesByType?.name ?? []
  const lookupZonesData = zonesList.map((zone: string, index: number) => ({ zone, id: index }))

  const columns: TableColumn[] = [
    {
      label: isDnsServers ? t('common.ipAddresses') : t('dns.dnsZone'),
      dataKey: 'zone',
    },
    {
      dataKey: 'lookupZonesActions',
      icon: true,
      align: 'right',
      renderCell: (rowData, rowDataIndex) => (
        <Box display="flex" justifyContent="flex-end">
          {canUpdate && (
            <>
              <IconButton aria-label={t('common.buttonEdit')} onClick={() => openLookupZonesDialog(rowData)} size="small">
                <BasicEdit />
              </IconButton>
              <IconButton
                aria-label={t('common.buttonDelete')}
                onClick={() => (isDnsServers ? updateDnsServers(rowDataIndex) : updateDnsZones(rowDataIndex))}
                size="small"
              >
                <BasicClose />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ]

  const basicProps = { columns, idFunction, loading: tenantConfigurationTask?.loading }

  return (
    <>
      <Typography component="p">{t(TITLE_LOCALIZATION_KEY[zonesType])}</Typography>
      <TableToolbar
        begin={
          canUpdate && (
            <Button
              disabled={false}
              variant="contained"
              color="secondary"
              onClick={() => openLookupZonesDialog()}
              startIcon={<BasicAdd />}
            >
              {t(ADD_BUTTON_LOCALIZATION_KEY[zonesType])}
            </Button>
          )
        }
      />
      <TableProvider basicProps={basicProps}>
        <BasicTable data={lookupZonesData ?? []} noDataPlaceholder={t('common.noData')} />
      </TableProvider>
      <LookupZonesDialog zonesType={zonesType} {...lookupZonesDialogProps} />
    </>
  )
}

export default LookupZonesList
