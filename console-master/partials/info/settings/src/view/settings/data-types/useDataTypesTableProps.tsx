/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { Moment } from 'moment'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import { DATA_TYPES, INFO_TYPES, REGION } from '@ues-data/dlp' // TODO: revisit this
import type { CustomFilter, InfiniteTableProps, InfiniteTableProviderInputProps, SimpleFilter } from '@ues/behaviours'
import {
  BooleanFilter,
  CheckboxFilter,
  ColumnPicker,
  DatePickerFilter,
  DateRangeFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useBooleanFilter,
  useCheckboxFilter,
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

const NameFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'name', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

const SourceFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<DATA_TYPES[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'type' })
  return <CheckboxFilter label={label} items={Object.keys(DATA_TYPES)} {...props} />
}

const StatusFilterComponent = ({ label, option }) => {
  const filterProps = useTableFilter<SimpleFilter<boolean>>()
  const props = useBooleanFilter({ filterProps, key: 'type' })
  return <BooleanFilter label={label} optionLabel={option} {...props} />
}

const RegionFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<REGION[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'regions' })
  return <CheckboxFilter label={label} items={Object.values(REGION)} {...props} />
}

const InfoTypeFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<INFO_TYPES[]>>()
  const props = useCheckboxFilter({ filterProps, key: 'infoTypes' })
  return <CheckboxFilter label={label} items={Object.values(INFO_TYPES)} {...props} />
}

type UseDataTypeInput = {
  data: any
  fetchMore?: (variables: any) => Promise<any>
  handleRowClick?: any
  selectionEnabled: boolean
}

type UseDataTypeReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  filterLabelProps: any
  unselectAll: () => void
  getSelected: any[]
}

const idFunction = rowData => rowData.guid

export const useDataTypesTableProps = ({
  data,
  fetchMore,
  handleRowClick,
  selectionEnabled,
}: UseDataTypeInput): UseDataTypeReturn => {
  const { t } = useTranslation(['dlp/common'])

  const columns = useMemo(
    () => [
      {
        label: t('setting.dataTypes.columns.name'),
        dataKey: 'name',
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: rowData => (
          <MuiLink component={Link} to={`/data-types/update/${rowData?.guid}`}>
            {rowData?.name}
          </MuiLink>
        ),
        renderFilter: () => <NameFilterComponent label={t('setting.dataTypes.filter.name')} />,
        width: 10,
      },
      // {
      //   label: t('setting.dataTypes.columns.keywords'),
      //   dataKey: 'parameters',
      //   sortable: true,
      //   show: true,
      //   persistent: false,
      //   filterType: FILTER_TYPES.CHECKBOX,
      //   renderFilter: () => <SourceFilterComponent label={t('setting.dataTypes.filter.keywords')} />,
      //   width: 80,
      // },
      {
        label: t('setting.dataTypes.columns.informationType'),
        dataKey: 'infoTypes',
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const infoTypes = rowData['infoTypes']
          return infoTypes
            ? infoTypes
                .split(',')
                .map((infoType: string) => {
                  const value = Object.keys(INFO_TYPES).find(
                    infoTypeEntry => infoTypeEntry.toUpperCase() === infoType.trim().toUpperCase(),
                  )
                  return INFO_TYPES[value]
                })
                .join(', ')
            : undefined
        },
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <InfoTypeFilterComponent label={t('setting.dataTypes.filter.infoTypes')} />,
        width: 10,
      },
      {
        label: t('setting.dataTypes.columns.region'),
        dataKey: 'regions',
        sortable: true,
        show: true,
        persistent: false,
        renderCell: (rowData: any, rowDataIndex: number) => {
          const regions = rowData['regions']
          return regions
            ? regions
                .split(',')
                .map((region: string) =>
                  Object.values(REGION).find(regionEntry => regionEntry.toUpperCase() === region.toUpperCase()),
                )
                .join(', ')
            : undefined
        },
        filterType: FILTER_TYPES.CHECKBOX,
        renderFilter: () => <RegionFilterComponent label={t('setting.dataTypes.filter.regions')} />,
        width: 5,
      },
      {
        label: t('setting.dataTypes.columns.source'),
        dataKey: 'type',
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.BOOLEAN,
        renderFilter: () => (
          <StatusFilterComponent label={t('setting.dataTypes.filter.source')} option={t('setting.dataTypes.filter.inUse')} />
        ),
        width: 5,
      },
    ],
    [t],
  )

  const isRowLoaded = (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.cursor },
      }

      fetchMore ? await fetchMore(variables) : console.debug('no fetchMore function')
    },
    [fetchMore, data],
  )

  const infinitLoader = {
    rowCount: data?.totals?.elements ?? 0,
    isRowLoaded: isRowLoaded,
    loadMoreRows: onLoadMoreRows,
    threshold: 30,
    minimumBatchSize: 50,
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const sortingProps = useSort(null, 'asc')
  const selectedProps = useSelected('guid')

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  // const filteredData = useClientSearch({ data?.elements , searchColumns: ['name', 'description'], searchString })
  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const tableProps = {
    noDataPlaceholder: t('noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps: selectionEnabled ? selectedProps : undefined,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
  }

  const unselectAll = () => {
    // eslint-disable-next-line no-unused-expressions
    selectedProps?.resetSelectedItems()
  }

  const getSelected = data?.elements?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  //   const getSelected = useCallback(() => {
  //     return data?.elements.filter(d => selectedProps.selected.includes(idFunction(d))) ?? []
  //   }, [data?.elements, selectedProps.selected])

  return { tableProps, providerProps, filterLabelProps, getSelected, unselectAll }
}
