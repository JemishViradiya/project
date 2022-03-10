//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'

import { ExportAction } from '@ues-behaviour/export'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Components, Config, Data, Hooks } from '@ues-gateway/shared'
import { AriaElementLabel } from '@ues/assets-e2e'
import { BasicTable, TableProvider } from '@ues/behaviours'

const { queryTenantConfig } = Data
const { LoadingProgress } = Components
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { BigService, useBigPermissions, useExportAction } = Hooks

const SourceIpPinning: React.FC = () => {
  const { canRead } = useBigPermissions(BigService.Tenant)
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const queryVariables = {
    skip: !canRead,
  }
  const { loading, data } = useStatefulReduxQuery(queryTenantConfig, queryVariables)
  const tableData = data?.sourceIPAnchoredIPs?.map((ip, index) => ({ ip, id: index }))
  const exportAction = useExportAction(
    data,
    (i, data) => ({
      id: i,
      ip: data?.sourceIPAnchoredIPs?.[i],
    }),
    'SourceIPPinning',
    data?.sourceIPAnchoredIPs?.length,
    BigService.Tenant,
  )

  const basicProps = {
    columns: [
      { label: t('common.ipAddresses'), dataKey: 'ip' },
      {
        dataKey: 'action',
        renderLabel: () => (
          <Box display="flex" justifyContent="flex-end" width="100%">
            <ExportAction exportAction={exportAction} DialogProps={{ isFilterable: false }} />
          </Box>
        ),
      },
    ],
    idFunction: rowData => rowData.sourceIpAnchoringId,
  }

  if (loading) {
    return <LoadingProgress alignSelf="center" />
  }

  return (
    <Box aria-label={AriaElementLabel.SettingsSourceIpAnchoringView}>
      <Typography>
        {data?.sourceIPAnchoredEnabled
          ? t('sourceIPAnchoring.sourceIPAnchoringIPAddressesText')
          : t('sourceIPAnchoring.sourceIPAnchoringDisabledText')}
      </Typography>

      {data?.sourceIPAnchoredEnabled && (
        <Box m={1}>
          <TableProvider basicProps={basicProps}>
            <BasicTable data={tableData ?? []} noDataPlaceholder={t('common.noData')} />
          </TableProvider>
        </Box>
      )}
    </Box>
  )
}

export default SourceIpPinning
