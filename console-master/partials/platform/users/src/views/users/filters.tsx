/* eslint-disable sonarjs/no-duplicate-string */
//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import { Link } from '@material-ui/core'

import { I18nFormats, useTextCellStyles } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableColumn } from '@ues/behaviours'
import {
  DatetimeRangeFilter,
  FILTER_TYPES,
  NUMERIC_OPERATORS,
  NumericNoRangeFilter,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  STRING_OPERATORS,
  TableFilterContext,
  useDatetimeRangeFilter,
  useNumericNoRangeFilter,
  useQuickSearchFilter,
  useRadioFilter,
  useTableFilter,
} from '@ues/behaviours'

import { getDataSourceItems, renderDataSource } from './userUtils'

export enum ColumnDataKey {
  Key = 'userId',
}

const SearchOperators = STRING_OPERATORS.filter(op => op === OPERATOR_VALUES.CONTAINS)
const SearchFilterComponent: React.FC<{ filter: 'displayName' | 'emailAddress' }> = ({ filter }) => {
  const { t } = useTranslation(['platform/common', 'profiles'])
  const filterProps = useContext(TableFilterContext)

  const props = useQuickSearchFilter({ filterProps, key: filter, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={t(`users.grid.${filter}`)} operators={SearchOperators} {...props} />
}

const DisplayName: React.FC<{ id: string; displayName: string }> = ({ id, displayName }) => {
  const { ellipsisTextCell } = useTextCellStyles()
  return (
    <Link component={RouterLink} to={`./${id}`} className={ellipsisTextCell}>
      {displayName}
    </Link>
  )
}

const getPasscodeExpiryString = (expiry: string, i18n, t) => {
  return (
    expiry && (Date.now() > new Date(expiry).getTime() ? t('users.grid.expired') : i18n.format(expiry, I18nFormats.DateTimeShort))
  )
}

const DataSourceFilterComponent: React.FC = () => {
  const { t } = useTranslation(['platform/common'])

  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: 'dataSource' })
  return <RadioFilter label={t('users.grid.dataSource.header')} {...getDataSourceItems(t)} {...props} />
}

const DevicesFilterComponent: React.FC = () => {
  const { t } = useTranslation(['platform/common'])

  const filterProps = useTableFilter<SimpleFilter<number>>()
  const props = useNumericNoRangeFilter({
    filterProps,
    key: 'devices',
    defaultOperator: OPERATOR_VALUES.GREATER,
    onlyPositive: true,
  })
  return <NumericNoRangeFilter label={t('users.grid.devices')} {...props} operators={NUMERIC_OPERATORS} />
}

const PasscodeExpiryFilterComponent = () => {
  const { t } = useTranslation(['platform/common'])

  const filterProps = useTableFilter<CustomFilter<DatetimeRangeFilter>>()
  const props = useDatetimeRangeFilter({ filterProps, key: 'expiry', allowFutureDates: true })
  return <DatetimeRangeFilter label={t('users.grid.passcodeExpiry')} {...props} />
}

const useColumns = (): TableColumn[] => {
  const { t, i18n } = useTranslation(['platform/common'])
  const { ellipsisTextCell } = useTextCellStyles()

  return useMemo(
    () => [
      {
        label: t('users.grid.displayName'),
        dataKey: 'displayName',
        renderCell: data => <DisplayName id={data.userId} displayName={data.displayName} />,
        persistent: true,
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent filter={'displayName'} />,
      },
      {
        label: t('users.grid.emailAddress'),
        dataKey: 'emailAddress',
        sortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <SearchFilterComponent filter={'emailAddress'} />,
        gridColDefProps: { minWidth: 190 },
      },
      {
        label: t('users.grid.dataSource.header'),
        dataKey: 'dataSource',
        renderCell: data => <div className={ellipsisTextCell}>{renderDataSource(data, t)}</div>,
        sortable: true,
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <DataSourceFilterComponent />,
        gridColDefProps: { minWidth: 150 },
      },
      {
        label: t('users.grid.devices'),
        dataKey: 'devices',
        sortable: true,
        filterType: FILTER_TYPES.NUMERIC_NO_RANGE,
        renderFilter: () => <DevicesFilterComponent />,
        gridColDefProps: { minWidth: 150 },
      },
      {
        label: t('users.grid.passcodeExpiry'),
        dataKey: 'expiry',
        sortable: true,
        renderCell: ({ expiry }) => <div className={ellipsisTextCell}>{getPasscodeExpiryString(expiry, i18n, t)}</div>,
        filterType: FILTER_TYPES.DATETIME_RANGE,
        renderFilter: () => <PasscodeExpiryFilterComponent />,
        gridColDefProps: { minWidth: 170 },
      },
    ],
    [ellipsisTextCell, i18n, t],
  )
}

export { useColumns }
