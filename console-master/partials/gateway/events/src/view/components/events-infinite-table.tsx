//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isNil, mapValues, omit, pick } from 'lodash-es'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Typography } from '@material-ui/core'
import type { XGridProps as MuiXGridProps } from '@material-ui/x-grid'

import { usePrevious } from '@ues-behaviour/react'
import { XGrid } from '@ues-behaviour/x-grid'
import type { ReportingServiceQueryVariables } from '@ues-data/gateway'
import { Config, Utils } from '@ues-gateway/shared'
import { AriaElementLabel } from '@ues/assets-e2e'
import type { TableColumn } from '@ues/behaviours'
import {
  AppliedFilterPanel,
  ColumnPicker,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useSort,
} from '@ues/behaviours'

import { EventsContext } from '../context'
import {
  QUERY_FILTER_KEYS_RESOLVERS,
  QUERY_SORT_KEYS_RESOLVERS,
  SYNCHRONOUS_FILTER_KEYS,
  TIMESTAMP_ORDER_QUERY_KEY,
} from './constants'
import EventsGroupBySelect from './group-by-select'
import type { DefaultSortType } from './hooks'
import { useAsyncUserFilter } from './hooks'
import useStyles from './styles'
import type { CurrentTableData, EventsListName } from './types'
import { EventsColumnDataKey } from './types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { isTaskResolved } = Utils

interface EventsInfiniteTableProps {
  columns: TableColumn[]
  data: unknown[]
  dataLimit: number
  dataTotal: number
  defaultFilters?: Record<string, any>
  defaultQueryVariables: ReportingServiceQueryVariables
  defaultSort?: DefaultSortType
  idFunction: (rowData: any) => string
  listName: EventsListName
  loading?: boolean
  onRowClick?: MuiXGridProps['onRowClick']
  persistDefaultQueryFilter?: boolean
  pickColumns: EventsColumnDataKey[]
  refetch: (variables: ReportingServiceQueryVariables) => void
  showGroupBy?: boolean
  tableTitle?: string
}

const EventsInfiniteTable: React.FC<EventsInfiniteTableProps> = ({
  columns,
  data,
  dataLimit,
  dataTotal,
  defaultFilters,
  defaultQueryVariables,
  defaultSort,
  idFunction,
  listName,
  loading: loadingEvents,
  onRowClick,
  persistDefaultQueryFilter = false,
  pickColumns,
  refetch: refetchEvents,
  showGroupBy = false,
  tableTitle,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [localTableData, setLocalTableData] = useState(data ?? [])

  const {
    categories: { categoryNamesMap },
  } = useContext(EventsContext)

  const previousLoadingEvents = usePrevious(loadingEvents)
  const classes = useStyles()
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])

  const filterProps = useFilter(defaultFilters) as any
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)
  const sortProps = useSort(defaultSort?.sortBy, defaultSort?.sortDirection ?? TableSortDirection.Asc)
  const { sort: sortBy, sortDirection } = sortProps

  const triggerRefetchEvents = (currentTableData?: CurrentTableData) => {
    setLocalTableData([])
    refetchEvents(makeQueryVariables(currentTableData))
  }

  const { value: ecoIds, loading: loadingUsers } = useAsyncUserFilter({
    activeFilter: filterProps.activeFilters[EventsColumnDataKey.User],
    refetchEvents: () => triggerRefetchEvents(),
  })

  const makeFilterQueryVariable = (currentFilters: CurrentTableData['filters']): ReportingServiceQueryVariables['filter'] =>
    pickColumns.reduce((acc, columnKey) => {
      const activeFilter = currentFilters ? currentFilters?.[columnKey] : filterProps.activeFilters?.[columnKey]

      if (isNil(activeFilter)) return acc

      const resolvedFilter = QUERY_FILTER_KEYS_RESOLVERS[columnKey]?.({
        activeFilter,
        t,
        ecoIds,
        listName,
        categoryNamesMap,
      })

      return { ...acc, ...resolvedFilter }
    }, {})

  const makeSortQueryVariable = (currentSort: CurrentTableData['sort']) =>
    QUERY_SORT_KEYS_RESOLVERS[currentSort?.sortBy ?? sortBy]({
      sortDirection: currentSort?.sortDirection ?? sortDirection,
      listName,
    })

  const makeQueryVariables = (currentTableData?: CurrentTableData): ReportingServiceQueryVariables => {
    const filter = {
      ...pick(defaultQueryVariables?.filter, [TIMESTAMP_ORDER_QUERY_KEY[listName]]),
      ...(persistDefaultQueryFilter ? defaultQueryVariables?.filter : {}),
      ...makeFilterQueryVariable(currentTableData?.filters),
    }
    const sort = makeSortQueryVariable(currentTableData?.sort)

    return { ...defaultQueryVariables, fromRecord: 0, filter, sort }
  }

  useEffect(() => {
    return () => setLocalTableData([])
  }, [])

  useEffect(() => {
    if (isTaskResolved({ loading: loadingEvents }, { loading: previousLoadingEvents })) {
      setLocalTableData([...localTableData, ...data])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingEvents])

  const handleOnRowsScrollEnd = async () => {
    const startIndex = localTableData.length
    const dataTotalLoaded = startIndex >= dataTotal

    if (startIndex < defaultQueryVariables.maxRecords || dataTotalLoaded) {
      return
    }

    const queryVariables = makeQueryVariables()

    refetchEvents({ ...queryVariables, fromRecord: startIndex })
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: t('common.tableColumns'),
  })

  const loading = loadingEvents || loadingUsers

  const basicTableProviderProps = {
    columns: displayedColumns,
    columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} tableCell={false} removeAnchorEl={true} />,
    idFunction,
    loading,
  }

  const tableProps = {
    getRowId: idFunction,
    loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    onRowsScrollEnd: handleOnRowsScrollEnd,
    rows: localTableData,
    onRowClick,
  }

  const updateFilter = currentFilter => {
    filterProps.onSetFilter(currentFilter)

    if (SYNCHRONOUS_FILTER_KEYS.includes(currentFilter.key)) {
      triggerRefetchEvents({ filters: { ...filterProps.activeFilters, [currentFilter.key]: currentFilter.value } })
    }
  }

  const updateSort = currentSortBy => {
    sortProps.onSort(currentSortBy)
    triggerRefetchEvents({
      sort: {
        sortBy: currentSortBy,
        sortDirection:
          sortBy !== currentSortBy || sortDirection === TableSortDirection.Asc ? TableSortDirection.Desc : TableSortDirection.Asc,
      },
    })
  }

  const removeFilter = currentFilterKey => {
    filterProps.onRemoveFilter(currentFilterKey)
    triggerRefetchEvents({ filters: omit(filterProps.activeFilters, [currentFilterKey]) })
  }

  const removeFilters = () => {
    filterProps.onClearFilters()
    triggerRefetchEvents({ filters: mapValues(filterProps.activeFilters, () => undefined) })
  }

  const totalDataCountLabel = useMemo(
    () => {
      const dataTotalOrMore = dataTotal === dataLimit ? `${dataTotal}+` : dataTotal
      return t('common.tableResultsLabel', { count: (localTableData.length ? dataTotalOrMore : 0) as number })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localTableData],
  )

  return (
    <Box className={classes.container}>
      <TableToolbar
        begin={tableTitle ? <Typography variant="h2">{tableTitle}</Typography> : null}
        bottom={
          <AppliedFilterPanel {...filterProps} {...filterLabelProps} onClearFilters={removeFilters} onRemoveFilter={removeFilter} />
        }
        end={
          <Box display="flex" alignItems="center">
            <Box mb={6} mr={8}>
              <Typography>{totalDataCountLabel}</Typography>
            </Box>
            {showGroupBy && <EventsGroupBySelect dateRangeFilter={filterProps?.activeFilters?.[EventsColumnDataKey.DateRange]} />}
          </Box>
        }
      />
      <TableProvider
        basicProps={basicTableProviderProps}
        sortingProps={{ ...sortProps, onSort: updateSort }}
        filterProps={{ ...filterProps, onSetFilter: updateFilter, onRemoveFilter: removeFilter }}
      >
        <XGrid {...tableProps} aria-label={AriaElementLabel.EventsInfiniteTable} />
      </TableProvider>
    </Box>
  )
}

export default EventsInfiniteTable
