//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { AclRule } from '@ues-data/gateway'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { Config, Data, Utils } from '@ues-gateway/shared'
import type { TableColumn } from '@ues/behaviours'
import { FILTER_TYPES } from '@ues/behaviours'

import {
  ActionsCell,
  ActionsIconCell,
  CheckmarkIconCell,
  DescriptionFilterComponent,
  DispositionActionCell,
  EnabledTriggerCell,
  NameFilterComponent,
  NameLinkCell,
  RankCell,
} from '../components'
import { ColumnDataKey } from '../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { getListRankModeEnabled } = Data
const { isDefaultAclRule } = Utils

export const useColumns = (readOnly?: boolean): TableColumn<AclRule>[] => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const rankModeEnabled = useSelector(getListRankModeEnabled)
  const { isEnabled } = useFeatures()

  const isDisabled = (rowData: AclRule) => isDefaultAclRule(rowData) || rankModeEnabled || readOnly

  const filterable = (filterConfig: Pick<TableColumn, 'filterType' | 'renderFilter'>) => (rankModeEnabled ? {} : filterConfig)

  return [
    {
      label: t('common.order'),
      dataKey: ColumnDataKey.Rank,
      sortable: !rankModeEnabled,
      renderCell: rowData => <RankCell item={rowData} disabled={isDefaultAclRule(rowData)} />,
    },
    {
      label: t('common.name'),
      dataKey: ColumnDataKey.Name,
      sortable: true,
      renderCell: rowData => <NameLinkCell item={rowData} disabled={isDefaultAclRule(rowData) || rankModeEnabled} />,
      gridColDefProps: { flex: 1, minWidth: 150 },
      ...filterable({
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
      }),
      text: true,
    },
    {
      label: t('common.description'),
      dataKey: ColumnDataKey.Description,
      sortable: true,
      renderCell: rowData => (isDefaultAclRule(rowData) ? t('acl.defaultAclRuleDescription') : rowData?.metadata?.description),
      gridColDefProps: { flex: 2, minWidth: 250 },
      ...filterable({
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DescriptionFilterComponent />,
      }),
      text: true,
    },
    {
      label: t('common.action'),
      dataKey: ColumnDataKey.Disposition,
      renderCell: rowData => <DispositionActionCell item={rowData} />,
      gridColDefProps: { flex: 0.75, minWidth: 80 },
    },
    {
      renderLabel: () => <ActionsIconCell property={'notify'} tooltipLabel={t('acl.notifyFieldLabel')} show />,
      dataKey: ColumnDataKey.Notify,
      renderCell: rowData => <ActionsIconCell item={rowData} property={'notify'} />,
      gridColDefProps: { align: 'center', flex: 0.25, minWidth: 45 },
    },
    {
      renderLabel: () => (
        <ActionsIconCell property={'applyBlockGatewayList'} tooltipLabel={t('acl.networkProtectionTooltipLabel')} show />
      ),
      dataKey: ColumnDataKey.NetworkProtection,
      renderCell: rowData => <ActionsIconCell item={rowData} property={'applyBlockGatewayList'} />,
      gridColDefProps: { align: 'center', flex: 0.25, minWidth: 45 },
    },
    {
      renderLabel: () => <ActionsIconCell property={'privacy'} tooltipLabel={t('acl.trafficPrivacyHelpLabel')} show />,
      dataKey: ColumnDataKey.Privacy,
      hidden: !isEnabled(FeatureName.UESBigDNSPrivacyEnabled),
      renderCell: rowData => <CheckmarkIconCell show={rowData?.disposition?.privacy} />,
      gridColDefProps: { align: 'center', flex: 0.25, minWidth: 45 },
    },
    {
      label: t('acl.destinationAddressTitle'),
      dataKey: ColumnDataKey.Target,
      renderCell: rowData => <CheckmarkIconCell show={rowData?.criteria?.destination?.enabled} />,
      gridColDefProps: { flex: 0.35, minWidth: 80 },
    },
    {
      label: t('acl.destinationCategoriesTitle'),
      dataKey: ColumnDataKey.Category,
      renderCell: rowData => <CheckmarkIconCell show={rowData?.criteria?.categorySet?.enabled} />,
      gridColDefProps: { flex: 0.35, minWidth: 80 },
    },
    {
      label: t('common.usersOrUsersGroups'),
      dataKey: ColumnDataKey.UsersOrGroups,
      renderCell: rowData => <CheckmarkIconCell show={rowData?.criteria?.selector?.enabled} />,
      gridColDefProps: { flex: 0.35, minWidth: 80 },
    },
    {
      label: t('common.risk'),
      dataKey: ColumnDataKey.Risk,
      hidden: !isEnabled(FeatureName.UESActionOrchestrator),
      renderCell: rowData => <CheckmarkIconCell show={rowData?.criteria?.riskRange?.enabled} />,
      gridColDefProps: { flex: 0.35, minWidth: 80 },
    },
    {
      label: t('acl.enabledField'),
      dataKey: ColumnDataKey.Enabled,
      renderCell: rowData => <EnabledTriggerCell item={rowData} disabled={isDisabled(rowData)} />,
      gridColDefProps: { flex: 0.5, minWidth: 100 },
    },
    {
      dataKey: ColumnDataKey.Action,
      renderCell: rowData => <ActionsCell item={rowData} disabled={isDisabled(rowData)} hidden={isDefaultAclRule(rowData)} />,
      gridColDefProps: { align: 'right', flex: 0.25, minWidth: 50 },
    },
  ]
}
