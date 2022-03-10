//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Link } from '@material-ui/core'

import type { NetworkServicesV3 } from '@ues-data/gateway'
import { Config, Types, Utils } from '@ues-gateway/shared'
import { BasicAllow } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import { FILTER_TYPES } from '@ues/behaviours'

import { ColumnDataKey } from '../../types'
import { DescriptionFilterComponent, NameFilterComponent, SaasAppsFilterComponent } from './filters'

const { makePageRoute, isSystemNetworkService } = Utils
const { GATEWAY_TRANSLATIONS_KEY } = Config
const { Page } = Types

export const useColumns = (): TableColumn<NetworkServicesV3.NetworkServiceEntity>[] => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigate = useNavigate()

  return [
    {
      label: t('common.name'),
      dataKey: ColumnDataKey.Name,
      sortable: true,
      renderCell: rowData => (
        <Link
          role="link"
          variant="inherit"
          color="primary"
          onClick={() => navigate(makePageRoute(Page.GatewaySettingsNetworkServiceEdit, { params: { id: rowData.id } }))}
        >
          {rowData.name}
        </Link>
      ),
      gridColDefProps: { flex: 1 },
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <NameFilterComponent />,
      text: true,
    },
    {
      label: t('common.description'),
      dataKey: ColumnDataKey.Description,
      renderCell: rowData => rowData.metadata?.description,
      gridColDefProps: { flex: 1.4 },
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <DescriptionFilterComponent />,
      text: true,
    },
    {
      label: t('networkServices.saasApps'),
      dataKey: ColumnDataKey.SaasApps,
      sortable: true,
      renderCell: rowData => isSystemNetworkService(rowData.tenantId) && <BasicAllow fontSize="small" />,
      gridColDefProps: { flex: 0.6 },
      filterType: FILTER_TYPES.RADIO,
      renderFilter: () => <SaasAppsFilterComponent />,
    },
  ]
}
