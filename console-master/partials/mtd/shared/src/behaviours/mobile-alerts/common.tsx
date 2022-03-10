import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { MobileProtectData } from '@ues-data/mtd'
import { QueryStringParamKeys } from '@ues-mtd/alert-types'
import { I18nFormats } from '@ues/assets'
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

import { addDetected, MobileAlertColumnNames } from '../../data'
import { resolveCheckboxFilter, resolveDatetimeRangeFilter, resolveQuickSearchFilter } from '../../index'

const MTD_COMMON = 'mtd/common'
const STRING_OPERATORS = [OPERATOR_VALUES.CONTAINS]

export const quickSearchFilterWaitTimeInterval = 800

export interface MobileAlertsFilters {
  detectedStart?: string
  detectedEnd?: string
  type?: string[]
  status?: string[]
  name?: string
  device?: string
  user?: string
  description?: string
}

const GetFilterLabel = (name: string): string => {
  const { t } = useTranslation([MTD_COMMON])
  return t(`mobileAlert.list.filters.${name}`)
}

export const TranslateStatus = (status: string, t): string => {
  return t(`threatStatus.${status.toLowerCase()}`)
}

export const TranslateType = (type: string, t): string => {
  return t(`threats.${type}`)
}

export const alertLink = (linkLabel, query) => {
  return <Link to={`/mobile-alerts?` + new URLSearchParams((query as MobileAlertsFilters) as string).toString()}>{linkLabel}</Link>
}

export const StatusFilterComponent = ({ items, itemLabels }) => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'status' })
  return <CheckboxFilter label={GetFilterLabel('status')} items={items} itemsLabels={itemLabels} {...props} />
}

export const TypeFilterComponent = ({ items, itemLabels }) => {
  const filterProps = useTableFilter<SimpleFilter<any[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'type' })
  return <CheckboxFilter label={GetFilterLabel('type')} items={items} itemsLabels={itemLabels} {...props} />
}

export const NameFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({
    filterProps,
    debounceInterval: quickSearchFilterWaitTimeInterval,
    key: MobileAlertColumnNames.Name,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    requireMinimumCharacters: true,
  })
  return (
    <QuickSearchFilter label={GetFilterLabel('name')} operators={STRING_OPERATORS} requireMinimumCharacters={true} {...props} />
  )
}

export const DescriptionFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({
    filterProps,
    debounceInterval: quickSearchFilterWaitTimeInterval,
    key: MobileAlertColumnNames.Description,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    requireMinimumCharacters: true,
  })
  return (
    <QuickSearchFilter
      label={GetFilterLabel('description')}
      operators={STRING_OPERATORS}
      requireMinimumCharacters={true}
      {...props}
    />
  )
}

export const UserNameFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({
    filterProps,
    debounceInterval: quickSearchFilterWaitTimeInterval,
    key: MobileAlertColumnNames.UserName,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    requireMinimumCharacters: true,
  })
  return (
    <QuickSearchFilter label={GetFilterLabel('user')} operators={STRING_OPERATORS} requireMinimumCharacters={true} {...props} />
  )
}

export const DeviceNameFilterComponent = () => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({
    filterProps,
    debounceInterval: quickSearchFilterWaitTimeInterval,
    key: MobileAlertColumnNames.DeviceName,
    defaultOperator: OPERATOR_VALUES.CONTAINS,
    requireMinimumCharacters: true,
  })
  return (
    <QuickSearchFilter label={GetFilterLabel('device')} operators={STRING_OPERATORS} requireMinimumCharacters={true} {...props} />
  )
}

export const DetectedFilterComponent = () => {
  const filterProps = useTableFilter<CustomFilter<DatetimeRangeFilter>>()
  const props = useDatetimeRangeFilter({ filterProps, key: MobileAlertColumnNames.Detected })
  return <DatetimeRangeFilter label={GetFilterLabel('detected')} {...props} />
}

export const formatDateTime = (datetime: number | undefined, i18n): string => {
  return datetime ? i18n.format(datetime, I18nFormats.DateTime) : ''
}

export const formatDatetimeRange = (rowData, i18n): string => {
  if (rowData.firstDetected && rowData.lastDetected) {
    return `${formatDateTime(rowData.firstDetected, i18n)} - ${formatDateTime(rowData.lastDetected, i18n)}`
  } else if (rowData.firstDetected) {
    return formatDateTime(rowData.firstDetected, i18n)
  } else {
    return formatDateTime(rowData.lastDetected, i18n)
  }
}

export const formatFiltersByUserAndDevice = (useFilters, filters, additionalDataFilters?: Record<string, string>) => {
  if (useFilters) {
    const ret = {}
    let resolvedDatetimeRangeFilter = null
    Object.entries(filters).forEach(filterProperty => {
      const key = filterProperty[0]
      const value = filterProperty[1]
      switch (key) {
        case MobileAlertColumnNames.Type:
          ret[QueryStringParamKeys.TYPE] = resolveCheckboxFilter(value)
          break
        case MobileAlertColumnNames.Status:
          ret[QueryStringParamKeys.STATUS] = resolveCheckboxFilter(value)
          break
        case MobileAlertColumnNames.Name:
          ret[QueryStringParamKeys.NAME] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.Description:
          ret[QueryStringParamKeys.DESCRIPTION] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.DeviceName:
          ret[QueryStringParamKeys.DEVICE_NAME] = resolveQuickSearchFilter(value)
          break
        case MobileAlertColumnNames.Detected:
          resolvedDatetimeRangeFilter = resolveDatetimeRangeFilter(value)
          ret[QueryStringParamKeys.DETECTED_START] = resolvedDatetimeRangeFilter['startDateTime']
          ret[QueryStringParamKeys.DETECTED_END] = resolvedDatetimeRangeFilter['endDateTime']
          break
      }
    })
    if (additionalDataFilters) {
      Object.keys(additionalDataFilters).forEach(key => {
        ret[key] = additionalDataFilters[key]
      })
    }
    return ret
  } else {
    return {}
  }
}

export const createPartialMobileAlertColumns = (
  t,
  i18n,
  eventTypeItems,
  eventTypeItemLabels,
  stateItems,
  stateItemsLabels,
  filtered: MobileAlertColumnNames[],
): TableColumn[] => {
  return [
    {
      label: t('mobileAlert.list.columns.status'),
      dataKey: MobileAlertColumnNames.Status,
      persistent: true,
      sortable: true,
      filterType: FILTER_TYPES.CHECKBOX,
      renderFilter: () => <StatusFilterComponent items={stateItems} itemLabels={stateItemsLabels} />,
      renderCell: rowData => TranslateStatus(rowData.status, t),
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
    {
      label: t('mobileAlert.list.columns.type'),
      dataKey: MobileAlertColumnNames.Type,
      persistent: true,
      sortable: true,
      filterType: FILTER_TYPES.CHECKBOX,
      renderFilter: () => <TypeFilterComponent items={eventTypeItems} itemLabels={eventTypeItemLabels} />,
      renderCell: rowData => TranslateType(rowData.type, t),
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
    {
      label: t('mobileAlert.list.columns.name'),
      dataKey: MobileAlertColumnNames.Name,
      persistent: true,
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <NameFilterComponent />,
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
    {
      label: t('mobileAlert.list.columns.description'),
      dataKey: MobileAlertColumnNames.Description,
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <DescriptionFilterComponent />,
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
    {
      label: t('mobileAlert.list.columns.device'),
      dataKey: MobileAlertColumnNames.DeviceName,
      sortable: true,
      filterType: FILTER_TYPES.QUICK_SEARCH,
      renderFilter: () => <DeviceNameFilterComponent />,
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
    {
      label: t('mobileAlert.list.columns.detected'),
      dataKey: MobileAlertColumnNames.Detected,
      sortable: true,
      filterType: FILTER_TYPES.DATETIME_RANGE,
      renderFilter: () => <DetectedFilterComponent />,
      renderCell: rowData => formatDateTime(rowData.detected, i18n),
      gridColDefProps: { minWidth: 150, flex: 1 },
    },
  ].filter((column: TableColumn) => !filtered.includes(column.dataKey as MobileAlertColumnNames))
}

export const createDefaultFilters = (search: string) => {
  const defaultFilters = {}
  const searchParams = new URLSearchParams(search)
  if (Boolean(search) && search.length !== 0) {
    if (searchParams.get('status')) {
      defaultFilters[MobileAlertColumnNames.Status] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams
          .get('status')
          .split(',')
          .filter(key => key && key.length > 0),
      }
    } else if (!searchParams.has('status')) {
      defaultFilters[MobileAlertColumnNames.Status] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: [MobileProtectData.MobileThreatEventState.NEW],
      }
    }
    searchParams.get('type') &&
      (defaultFilters[MobileAlertColumnNames.Type] = {
        operator: OPERATOR_VALUES.IS_IN,
        value: searchParams.get('type').split(','),
      })
    addDetected(defaultFilters, searchParams)
    searchParams.get('deviceName') &&
      (defaultFilters[MobileAlertColumnNames.DeviceName] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('deviceName'),
      })
    searchParams.get('name') &&
      (defaultFilters[MobileAlertColumnNames.Name] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('name'),
      })
    searchParams.get('description') &&
      (defaultFilters[MobileAlertColumnNames.Description] = {
        operator: OPERATOR_VALUES.CONTAINS,
        value: searchParams.get('description'),
      })
  }
  return defaultFilters
}

export const idFunction = (rowData): string => rowData.id

export const useMobileAlertColumns = (
  t,
  i18n,
  eventTypeItems,
  eventTypeItemLabels,
  stateItems,
  stateItemsLabels,
): TableColumn[] => {
  return useMemo(
    (): TableColumn[] => [
      {
        label: t('mobileAlert.list.columns.status'),
        dataKey: MobileAlertColumnNames.Status,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <StatusFilterComponent items={stateItems} itemLabels={stateItemsLabels} />,
        renderCell: rowData => TranslateStatus(rowData.status, t),
        exportValue: rowData => TranslateStatus(rowData.status, t),
        gridColDefProps: { minWidth: 150, flex: 2 },
      },
      {
        label: t('mobileAlert.list.columns.type'),
        dataKey: MobileAlertColumnNames.Type,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <TypeFilterComponent items={eventTypeItems} itemLabels={eventTypeItemLabels} />,
        valueGetter: rowValue => TranslateType(rowValue.row.type, t),
        exportValue: rowData => TranslateType(rowData.type, t),
        gridColDefProps: { minWidth: 150, flex: 2 },
      },
      {
        label: t('mobileAlert.list.columns.name'),
        dataKey: MobileAlertColumnNames.Name,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent />,
        exportValue: rowData => rowData.name,
        gridColDefProps: { minWidth: 150, flex: 3 },
      },
      {
        label: t('mobileAlert.list.columns.description'),
        dataKey: MobileAlertColumnNames.Description,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DescriptionFilterComponent />,
        exportValue: rowData => rowData.description,
        gridColDefProps: { minWidth: 200, flex: 4 },
      },
      {
        label: t('mobileAlert.list.columns.user'),
        dataKey: MobileAlertColumnNames.UserName,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <UserNameFilterComponent />,
        exportValue: rowData => rowData.userName,
        gridColDefProps: { minWidth: 200, flex: 3 },
      },
      {
        label: t('mobileAlert.list.columns.device'),
        dataKey: MobileAlertColumnNames.DeviceName,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DeviceNameFilterComponent />,
        exportValue: rowData => rowData.deviceName,
        gridColDefProps: { minWidth: 150, flex: 3 },
      },
      {
        label: t('mobileAlert.list.columns.detected'),
        dataKey: MobileAlertColumnNames.Detected,
        sortable: true,
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <DetectedFilterComponent />,
        renderCell: rowData => formatDateTime(rowData.detected, i18n),
        exportValue: rowData => formatDateTime(rowData.detected, i18n),
        gridColDefProps: { minWidth: 150, flex: 3 },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n],
  )
}
