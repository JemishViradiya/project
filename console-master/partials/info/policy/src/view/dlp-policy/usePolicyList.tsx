/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { TFunction } from 'i18next'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import type {
  CustomFilter,
  InfiniteTableProps,
  InfiniteTableProviderInputProps,
  SimpleFilter,
  TableColumn,
  TableSortDirection,
} from '@ues/behaviours'
import {
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  DatePickerFilter,
  DateRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  STRING_OPERATORS,
  useBooleanFilter,
  useCheckboxFilter,
  useColumnPicker,
  useDatePickerFilter,
  useDateRangeFilter,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useRadioFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useDateConversion } from './helpers'

const policyTypes = ['regulatory', 'organizational']
const policyTypesLabels = (t: TFunction) => {
  const labels = {}
  policyTypes.forEach(r => (labels[r] = t(`policy.sections.general.type.${r}`)))
  return labels
}
const getFilterLabels = t => {
  return { ...policyTypesLabels(t) }
}

const NameFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const DescriptionFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'description', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const PolicyTypeFilterComponent: React.FC<{ fieldName: string; label: string; t: TFunction }> = memo(({ fieldName, label, t }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: fieldName })
  return <RadioFilter label={label} items={policyTypes} itemsLabels={policyTypesLabels(t)} {...props} />
})

type UseTemplateInput = {
  data: any
  fetchMore?: (variables: any) => Promise<any>
  handleRowClick?: any
  getNamePath?: (profile) => string
  getUsersPath?: (profile) => string
  getGroupsPath?: (profile) => string
  tableName?: string
  policiesLoading?: boolean
  setIsUpdatedPoliciesListInUse?: any
}

type UseTemplateReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  filterLabelProps: any
  getSelected: any[]
  unselectAll: () => void
  selectedItems: any[]
  handleSearch: (str: string) => void
}

const idFunction = rowData => rowData.policyId

export const usePolicyList = ({
  data,
  fetchMore,
  handleRowClick,
  getNamePath = profile => '#',
  getUsersPath = profile => '#',
  getGroupsPath = profile => '#',
  tableName,
  policiesLoading,
  setIsUpdatedPoliciesListInUse,
}: UseTemplateInput): UseTemplateReturn => {
  const { t } = useTranslation(['dlp/policy'])
  const [searchString, setSearchString] = useState<string>()
  const { getDateShortFormat } = useDateConversion()

  const columns: TableColumn[] = useMemo(
    () => [
      {
        label: t('policy.table.columns.name'),
        dataKey: 'name',
        persistent: true,
        clientSortable: true,
        renderCell: rowData => (
          <MuiLink component={Link} to={getNamePath(rowData)}>
            {rowData.policyName}
          </MuiLink>
        ),
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <NameFilterComponent label={t('policy.table.filter.name')} />,
      },
      {
        label: t('policy.table.columns.description'),
        dataKey: 'description',
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DescriptionFilterComponent label={t('policy.table.filter.description')} />,
      },
      {
        label: t('policy.table.columns.policyType'),
        dataKey: 'classification',
        clientSortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => (
          <PolicyTypeFilterComponent fieldName="classification" t={t} label={t('policy.table.columns.policyType')} />
        ),
        renderCell: (rowData: any) => t(`policy.sections.general.type.${rowData['classification'].toLowerCase()}`),
      },
      {
        label: t('policy.table.columns.userCount'),
        dataKey: 'userCount',
        renderCell: rowData => (
          <MuiLink component={Link} to={getUsersPath(rowData)}>
            {rowData.userCount || 0}
          </MuiLink>
        ),
      },
      {
        label: t('policy.table.columns.groupCount'),
        dataKey: 'groupCount',
        renderCell: rowData => (
          <MuiLink component={Link} to={getGroupsPath(rowData)}>
            {rowData.groupCount || 0}
          </MuiLink>
        ),
      },
      {
        label: t('policy.table.columns.added'),
        dataKey: 'created',
        renderCell: ({ created }) => created && getDateShortFormat(created),
        clientSortable: true,
      },
      {
        label: t('policy.table.columns.modified'),
        dataKey: 'modified',
        renderCell: ({ modified }) => modified && getDateShortFormat(modified),
        clientSortable: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const isRowLoaded = (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      if (data?.navigation?.next) {
        setIsUpdatedPoliciesListInUse(false)
        await fetchMore({ offset: startIndex })
      }
    },
    [data?.navigation?.next, fetchMore, setIsUpdatedPoliciesListInUse],
  )

  const infinitLoader = {
    rowCount: data?.totals?.elements ?? 0,
    isRowLoaded: isRowLoaded,
    loadMoreRows: onLoadMoreRows,
    threshold: 1,
    minimumBatchSize: 25,
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns: columns,
    title: t('policy.table.tableColumns'),
    tableName,
  })

  const sortingProps = useSort('name', 'asc')
  const selectedProps = useSelected('policyId')

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
      loading: policiesLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps, policiesLoading],
  )

  // const filteredData = useClientSearch({ data?.elements , searchColumns: ['name', 'description'], searchString })
  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, getFilterLabels(t))

  const tableProps = {
    noDataPlaceholder: t('policy.table.noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
  }

  const unselectAll = () => {
    // eslint-disable-next-line no-unused-expressions
    selectedProps?.resetSelectedItems()
  }

  const getSelected = data?.elements?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  const selectedItems = useMemo(() => {
    return data?.elements?.filter(i => selectedProps.selected.includes(i.policyId))
  }, [selectedProps.selected, data])

  return { tableProps, providerProps, filterLabelProps, getSelected, unselectAll, selectedItems, handleSearch: setSearchString }
}
