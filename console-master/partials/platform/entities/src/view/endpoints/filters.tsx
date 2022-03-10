/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import type { TFunction } from 'i18next'
import { memoize } from 'lodash-es'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Link } from '@material-ui/core'

import type { AggregatedEndpoint } from '@ues-data/platform'
import { DeviceOs, EmmConnectionRegistrationStatus, EmmConnectionType, RiskLevelStatus } from '@ues-data/platform/entities/types'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { OsIcon } from '@ues-platform/shared'
import { I18nFormats, useTextCellStyles } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableColumn } from '@ues/behaviours'
import {
  CheckboxFilter,
  DatetimeRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  useCheckboxFilter,
  useDatetimeRangeFilter,
  useQuickSearchFilter,
  useTableFilter,
} from '@ues/behaviours'

import { Connection } from './Connection'
import { RiskChip } from './RiskChip'

const getFormattedDate = memoize((rowData, fieldKey, i18n) => {
  const dateField = rowData[fieldKey]
  return dateField ? i18n.format(dateField, I18nFormats.DateTimeShort) : undefined
})

const osItems = Object.values(DeviceOs)
const riskItems = Object.values(RiskLevelStatus)
const emmConnectionTypes = Object.values(EmmConnectionType)

const riskItemsLabels = memoize((t: TFunction) => {
  const labels = {}
  riskItems.forEach(r => (labels[r] = t(`endpoint.risk.${r}`)))
  return labels
})

const osItemsLabels = memoize((t: TFunction) => {
  const labels = {}
  osItems.forEach(r => (labels[r] = t(`general/form:os.${r}`)))
  return labels
})

const emmConnectionTypeLabels = memoize((t: TFunction) => {
  const labels = {}
  emmConnectionTypes.forEach(r => (labels[r] = t(`emmConnection.type.${r}`)))
  return labels
})

const StringFilterComponent: React.FC<{ fieldName: string; label: string }> = memo(({ fieldName, label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: fieldName, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={[]} {...props} />
})

const DateFilterComponent: React.FC<{ fieldName: string; label: string }> = memo(({ fieldName, label }) => {
  const filterProps = useTableFilter<CustomFilter<DatetimeRangeFilter>>()
  const props = useDatetimeRangeFilter({ filterProps, key: fieldName })
  return <DatetimeRangeFilter label={label} {...props} />
})

const OsFilter: React.FC<{ t: TFunction }> = memo(({ t }) => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'osPlatform' })
  return <CheckboxFilter label={t('endpoint.fields.os')} items={osItems} itemsLabels={osItemsLabels(t)} {...props} />
})

const RiskLevelStatusFilter: React.FC<{ t: TFunction }> = memo(({ t }) => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'riskLevelStatus' })
  return (
    <CheckboxFilter label={t('endpoint.fields.riskLevelStatus')} items={riskItems} itemsLabels={riskItemsLabels(t)} {...props} />
  )
})
const EmmConnectionsFilter: React.FC<{ t: TFunction }> = memo(({ t }) => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'emmType' })
  return (
    <CheckboxFilter
      label={t('endpoint.fields.emmConnections')}
      items={emmConnectionTypes}
      itemsLabels={emmConnectionTypeLabels(t)}
      {...props}
    />
  )
})

const exportableStatusList = [EmmConnectionRegistrationStatus.ERROR, EmmConnectionRegistrationStatus.PENDING]
const getEmmConnectionExportValue = (data, t) => {
  if (data.emmType in exportableStatusList) {
    return t('endpoint.export.emmConnections', { name: data.emmType, status: data.emmRegistrationStatus })
  }
}

const useColumns = (): TableColumn<AggregatedEndpoint>[] => {
  const { isEnabled } = useFeatures()
  const UESActionOrchestratorEnabled = isEnabled(FeatureName.UESActionOrchestrator)
  const intuneIntegrationEnabled = isEnabled(FeatureName.UESIntuneIntegration)

  const { t, i18n } = useTranslation(['platform/endpoints', 'platform/common', 'general/form'])
  const navigate = useNavigate()
  const { ellipsisTextCell } = useTextCellStyles()

  const riskColumn: TableColumn<AggregatedEndpoint> = {
    label: t('endpoint.fields.riskLevelStatus'),
    dataKey: 'riskLevelStatus',
    sortable: true,
    filterType: FILTER_TYPES.CHECKBOX,
    show: true,
    renderFilter: () => <RiskLevelStatusFilter t={t} />,
    exportValue: data => t(`endpoint.risk.${data.riskLevelStatus || 'UNKNOWN'}`),
    renderCell: data => <RiskChip riskLevel={data.riskLevelStatus} t={t} />,
    gridColDefProps: { minWidth: 100 },
  }

  const emmConnectionsColumn: TableColumn<AggregatedEndpoint> = {
    label: t('endpoint.fields.emmConnections'),
    dataKey: 'emmType',
    sortable: true,
    filterType: FILTER_TYPES.CHECKBOX,
    show: true,
    renderFilter: () => <EmmConnectionsFilter t={t} />,
    exportValue: data => getEmmConnectionExportValue(data, t),
    renderCell: data => data.emmType && <Connection name={data.emmType} status={data.emmRegistrationStatus} t={t} />,
    gridColDefProps: { minWidth: 100 },
  }

  const emmConnectionsColumnIndex = 6
  const columns: TableColumn<AggregatedEndpoint>[] = [
    {
      label: t('endpoint.fields.device'),
      dataKey: 'device',
      renderCell: data => (
        <Link
          onClick={() => {
            navigate(`/mobile-devices/${data.endpointId}`)
          }}
          className={ellipsisTextCell}
          aria-label={t('general/form:ariaLabels.viewDeviceDetails', { deviceName: data.device })}
        >
          {data.device}
        </Link>
      ),
      persistent: true,
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <StringFilterComponent fieldName={'device'} label={t('endpoint.fields.device')} />,
      exportValue: data => data.device,
    },
    {
      label: t('endpoint.fields.userName'),
      dataKey: 'userDisplayName',
      sortable: true,
      persistent: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <StringFilterComponent fieldName={'userDisplayName'} label={t('endpoint.fields.userName')} />,
      exportValue: data => data.userDisplayName,
    },
    {
      label: t('endpoint.fields.userEmail'),
      dataKey: 'userEmailAddress',
      sortable: true,
      show: false,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <StringFilterComponent fieldName={'userEmailAddress'} label={t('endpoint.fields.userEmail')} />,
      exportValue: data => data.userEmailAddress,
    },
    {
      label: t('endpoint.fields.os'),
      dataKey: 'osPlatform',
      sortable: true,
      renderCell: data => <OsIcon os={data.osPlatform} />,
      filterType: FILTER_TYPES.CHECKBOX,
      renderFilter: () => <OsFilter t={t} />,
      exportValue: data => data.osPlatform,
    },
    {
      label: t('endpoint.fields.osVersion'),
      dataKey: 'osVersion',
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <StringFilterComponent fieldName={'osVersion'} label={t('endpoint.fields.osVersion')} />,
      exportValue: data => data.osVersion,
      gridColDefProps: { minWidth: 150 },
    },
    {
      label: t('endpoint.fields.agent'),
      dataKey: 'agent',
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <StringFilterComponent fieldName={'agent'} label={t('endpoint.fields.agent')} />,
      exportValue: data => data.agent,
    },
    {
      label: t('endpoint.fields.enrollment'),
      dataKey: 'enrollmentTime',
      sortable: true,
      renderCell: data =>
        data.enrollmentTime && <div className={ellipsisTextCell}>{getFormattedDate(data, 'enrollmentTime', i18n)}</div>,
      filterType: FILTER_TYPES.DATETIME_RANGE,
      renderFilter: () => <DateFilterComponent fieldName={'enrollmentTime'} label={t('endpoint.fields.enrollment')} />,
      exportValue: data => getFormattedDate(data, 'enrollmentTime', i18n),
      gridColDefProps: { minWidth: 180 },
    },
    {
      label: t('endpoint.fields.osSecurityPatch'),
      dataKey: 'osSecurityPatch',
      sortable: true,
      filterType: FILTER_TYPES.CHECKBOX,
      show: false,
      renderFilter: () => <StringFilterComponent fieldName={'osSecurityPatch'} label={t('endpoint.fields.osSecurityPatch')} />,
      exportValue: data => data.osSecurityPatch,
    },
  ]
  // Insert EMM connections column if Intune integration is enabled
  if (intuneIntegrationEnabled) columns.splice(emmConnectionsColumnIndex, 0, emmConnectionsColumn)

  return useMemo(
    (): TableColumn<AggregatedEndpoint>[] => (UESActionOrchestratorEnabled ? [riskColumn, ...columns] : columns),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )
}

const getFilterLabels = memoize(t => {
  return { ...osItemsLabels(t), ...riskItemsLabels(t), ...emmConnectionTypeLabels(t) }
})

export { useColumns, getFilterLabels }
