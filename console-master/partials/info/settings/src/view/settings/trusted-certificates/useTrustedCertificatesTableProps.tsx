/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Moment } from 'moment'
import moment from 'moment'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { I18nFormats, StatusHigh } from '@ues/assets'
import type { CustomFilter, SimpleFilter, TableProviderProps } from '@ues/behaviours'
import {
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  DATE_OPERATORS,
  DatePickerFilter,
  DateRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useBooleanFilter,
  useCheckboxFilter,
  useClientFilter,
  useClientSearch,
  useColumnPicker,
  useDatePickerFilter,
  useDateRangeFilter,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import makeStyles from '../../styles'

const NameFilterComponent = ({ label, columnKey }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: columnKey, defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

const DateFilterComponent = ({ label, columnKey }) => {
  const filterProps = useTableFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: columnKey, defaultOperator: OPERATOR_VALUES.BEFORE })
  return <DatePickerFilter label={label} {...props} />
}

type UseCertificateInput = {
  data: any
  fetchMore?: (variables: any) => Promise<any>
  setSortParams?: (sortParam: string) => void
  handleRowClick?: any
  selectionEnabled: boolean
}

type UseCertificateReturn = {
  tableProps: any
  providerProps: Omit<TableProviderProps & { data: any[] }, 'children'>
  filterLabelProps: any
  getSelected: any[]
}

const idFunction = rowData => rowData.alias

const isExpiredCert = (dateStr: string, className: string) => {
  const expiration = moment(dateStr).format('x')
  const now = moment().format('x')
  return now > expiration ? (
    <span className={className}>
      <StatusHigh fontSize="small" />
    </span>
  ) : null
}

export const useTrustedCertificatesTableProps = ({
  data,
  handleRowClick,
  selectionEnabled,
}: UseCertificateInput): UseCertificateReturn => {
  const { t, i18n } = useTranslation(['dlp/common', 'platform/time'])
  const classes = makeStyles()

  const columns = useMemo(
    () => {
      return [
        {
          label: t('setting.trustedCertificates.columns.subject'),
          dataKey: 'subject',
          sortable: true,
          show: true,
          persistent: true,
          filterType: FILTER_TYPES.QUICK_SEARCH,
          renderFilter: () => <NameFilterComponent label={t('setting.trustedCertificates.columns.subject')} columnKey="subject" />,
          width: 120,
        },
        {
          label: t('setting.trustedCertificates.columns.issuer'),
          dataKey: 'issuer',
          sortable: true,
          show: true,
          persistent: false,
          filterType: FILTER_TYPES.QUICK_SEARCH,
          renderFilter: () => <NameFilterComponent label={t('setting.trustedCertificates.columns.issuer')} columnKey="issuer" />,
          width: 120,
        },
        {
          label: t('setting.trustedCertificates.columns.addedDate'),
          dataKey: 'created',
          sortable: true,
          show: true,
          persistent: false,
          renderCell: (rowData: any, rowDataIndex: number) => {
            return rowData['created'] ? i18n.format(rowData['created'], I18nFormats.DateShort) : undefined
          },
          filterType: FILTER_TYPES.DATE_PICKER,
          renderFilter: () => (
            <DateFilterComponent label={t('setting.trustedCertificates.columns.addedDate')} columnKey="created" />
          ),
          width: 20,
        },
        {
          label: t('setting.trustedCertificates.columns.expirationDate'),
          dataKey: 'expiryDate',
          sortable: true,
          show: true,
          persistent: false,
          renderCell: (rowData: any, rowDataIndex: number) => {
            return rowData['expiryDate'] ? (
              <div className={classes.row}>
                {i18n.format(rowData['expiryDate'], I18nFormats.DateShort)}
                {isExpiredCert(rowData['expiryDate'], classes.warning)}
              </div>
            ) : undefined
          },
          filterType: FILTER_TYPES.DATE_PICKER,
          renderFilter: () => (
            <DateFilterComponent label={t('setting.trustedCertificates.columns.expirationDate')} columnKey="expiryDate" />
          ),
          width: 20,
        },
      ]
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })
  const sortingProps = useSort('subject', 'asc')
  const selectedProps = useSelected('alias')

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const rows = data?.elements ?? []
  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const filterData = useClientFilter({ data: rows, activeFilters: filterProps?.activeFilters, filterProps: columns })

  const tableProps = {
    noDataPlaceholder: t('noData'),
  }

  const providerProps = {
    sortingProps,
    selectedProps: selectionEnabled ? selectedProps : undefined,
    basicProps,
    data: filterData,
    filterProps,
  }

  const getSelected = data?.elements?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  return { tableProps, providerProps, filterLabelProps, getSelected }
}
