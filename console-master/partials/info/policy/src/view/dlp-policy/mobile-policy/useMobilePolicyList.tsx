/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEqual } from 'lodash-es'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import type {
  DraggableTableProps,
  DraggableTableProviderInputProps,
  SimpleFilter,
  TableColumn,
  TableSortDirection,
} from '@ues/behaviours'
import {
  ColumnPicker,
  CustomFilter,
  DatePickerFilter,
  DateRangeFilter,
  FILTER_TYPES,
  InfiniteTableProps,
  InfiniteTableProviderInputProps,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useBooleanFilter,
  useCheckboxFilter,
  useClientSearch,
  useClientSort,
  useColumnPicker,
  useDatePickerFilter,
  useDateRangeFilter,
  useDraggableTable,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useDateConversion } from '../helpers'
import { usePoliciesPermissions } from '../usePoliciesPermission'

const NameFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

const DescriptionFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'description', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

type UsePolicyInput = {
  elements: any[]
  fetchMore?: (variables: any) => Promise<any>
  handleRowClick?: any
  rankable: boolean
  getNamePath?: (profile) => string
  getUsersPath?: (profile) => string
  getGroupsPath?: (profile) => string
  setRankingSaved?: (boolean) => void
  tableName?: string
}

type UsePolicyReturn = {
  tableProps: DraggableTableProps
  rankMode: boolean
  setRankMode: (mode: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterLabelProps: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSelected: any[]
  unselectAll: () => void
  handleSearch: (str: string) => void
  resetDrag: () => void
  providerProps: Omit<DraggableTableProviderInputProps, 'children'>
}

const idFunction = rowData => rowData.policyId

export const useMobilePolicyList = ({
  elements,
  fetchMore,
  handleRowClick,
  rankable,
  getNamePath,
  getUsersPath,
  getGroupsPath,
  setRankingSaved = () => {
    //do nothing if undefined
  },
  tableName,
}: UsePolicyInput): UsePolicyReturn => {
  const { t } = useTranslation(['dlp/policy'])
  const [rankMode, setRankMode] = useState(false)
  const [searchString, setSearchString] = useState<string>()
  const { getDateShortFormat } = useDateConversion()
  const { canDelete } = usePoliciesPermissions()

  const columns: TableColumn[] = useMemo(
    () => {
      const rawColumns: TableColumn[] = [
        {
          label: t('policy.table.columns.name'),
          dataKey: 'name',
          persistent: true,
          clientSortable: true,
          renderCell: rowData => (
            <MuiLink component={Link} to={getNamePath(rowData)}>
              {rowData.name}
            </MuiLink>
          ),
          filterType: FILTER_TYPES.QUICK_SEARCH,
          // renderFilter: () => <NameFilterComponent label={t('policy.table.filter.name')} />,
        },
        {
          label: t('policy.table.columns.description'),
          dataKey: 'description',
          filterType: FILTER_TYPES.QUICK_SEARCH,
          // renderFilter: () => <DescriptionFilterComponent label={t('policy.table.filter.description')} />,
          clientSortable: true,
        },
        {
          label: t('policy.table.columns.userCount'),
          dataKey: 'userCount',
          renderCell: rowData => (
            <MuiLink component={Link} to={getUsersPath(rowData)}>
              {rowData.userCount || 0}
            </MuiLink>
          ),
          clientSortable: true,
        },
        {
          label: t('policy.table.columns.groupCount'),
          dataKey: 'groupCount',
          renderCell: rowData => (
            <MuiLink component={Link} to={getGroupsPath(rowData)}>
              {rowData.groupCount || 0}
            </MuiLink>
          ),
          clientSortable: true,
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
      ]
      if (rankable) {
        rawColumns.unshift({
          label: t('policy.table.columns.rank'),
          dataKey: 'rank',
          clientSortable: true,
        })
      }
      return rawColumns
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const isRowLoaded = (prop: { index: number }) => elements[prop.index] !== undefined ?? false

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : 0 /* data?.cursor */ },
      }

      await fetchMore(variables)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchMore, elements],
  )

  const infinitLoader = {
    rowCount: elements.length ?? 0,
    isRowLoaded: isRowLoaded,
    loadMoreRows: onLoadMoreRows,
    threshold: 30,
    minimumBatchSize: 20,
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns: columns,
    title: t('policy.table.tableColumns'),
    tableName,
  })

  const sortingProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortingProps
  const selectedProps = useSelected('policyId')

  const draggable = rankMode
    ? {
        onDragChange: ({ updatedDataSource }) => {
          isEqual(elements, updatedDataSource) ? setRankingSaved(true) : setRankingSaved(false)
          /* empty for now */
        },
        onDataReorder: (rowData, index) => ({ ...rowData, rank: index + 1 }),
      }
    : undefined

  const filteredData = useClientSearch({ data: elements, searchColumns: ['name', 'description'], searchString })
  const sortParams = useMemo(
    () => ({
      data: filteredData,
      sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
      dataAccessor: displayedColumns.find(column => sort === column.dataKey)?.clientSortableDataAccessor,
    }),
    [displayedColumns, filteredData, sort, sortDirection],
  )
  const sortedData = useClientSort(sortParams)

  const { data: processedData, draggableProps, resetDrag } = useDraggableTable({
    initialData: sortedData,
    idFunction,
    draggable,
  })

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

  // const filteredData = useClientSearch({ data?.elements , searchColumns: ['name', 'description'], searchString })
  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const tableProps = {
    noDataPlaceholder: t('policy.table.noData'),
    data: processedData,
  }

  const providerProps = {
    basicProps,
    draggableProps,
    sortingProps,
    selectedProps: canDelete && selectedProps,
  }

  const unselectAll = () => {
    // eslint-disable-next-line no-unused-expressions
    selectedProps?.resetSelectedItems()
  }

  const getSelected = elements?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  const selectedItems = useMemo(() => {
    return elements?.filter(i => selectedProps.selected.includes(i.policyId))
  }, [selectedProps.selected, elements])

  return {
    tableProps,
    providerProps,
    filterLabelProps,
    getSelected,
    unselectAll,
    selectedItems,
    handleSearch: setSearchString,
    rankMode,
    setRankMode,
    resetDrag,
  }
}
