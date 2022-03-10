//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isNil, mapValues, omit, omitBy } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Typography } from '@material-ui/core'

import { XGrid } from '@ues-behaviour/x-grid'
import type { AclRule, PageableRequestParams } from '@ues-data/gateway'
import { serializeQueryParameter } from '@ues-data/shared'
import { Config, Data, Utils } from '@ues-gateway/shared'
import {
  AppliedFilterPanel,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useFilter,
  useFilterLabels,
  useSort,
} from '@ues/behaviours'

import { useColumns } from '../../hooks'
import type { AclListProps, CurrentTableData } from '../../types'
import ListToolbarActions from './list-toolbar-actions'
import useStyles from './styles'

const { makeSortByQueryParam } = Utils

const {
  GATEWAY_TRANSLATIONS_KEY,
  DEFAULT_LIST_QUERY_PARAMS_MAX,
  DEFAULT_LIST_QUERY_PARAMS_SORT_BY,
  DEFAULT_LIST_QUERY_PARAMS_SORT_DIR,
  DEFAULT_ACL_RULES_COUNT,
} = Config
const { getLocalAclRulesListData } = Data

const idFunction = (rowData: AclRule) => rowData.id

const AclInfiniteList: React.FC<AclListProps> = ({ refetch, total, loading, readOnly = false }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const classes = useStyles()
  const columns = useColumns(readOnly)
  const localListData = useSelector(getLocalAclRulesListData)

  const sortProps = useSort(DEFAULT_LIST_QUERY_PARAMS_SORT_BY, DEFAULT_LIST_QUERY_PARAMS_SORT_DIR)
  const { sort: sortBy, sortDirection: sortDir } = sortProps

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const makeRequestParams = (currentTableData?: CurrentTableData): PageableRequestParams =>
    omitBy(
      {
        offset: 0,
        max: DEFAULT_LIST_QUERY_PARAMS_MAX,
        sortBy: makeSortByQueryParam({
          sortBy: currentTableData?.sort?.sortBy ?? sortBy,
          sortDir: currentTableData?.sort?.sortDir ?? sortDir,
        }),
        query: Object.entries(currentTableData?.filters ?? filterProps?.activeFilters)
          .map(([key, value]) => serializeQueryParameter(key, value))
          .join('&'),
      },
      value => value === '' || isNil(value),
    )

  const updateSort = currentSortBy => {
    sortProps.onSort(currentSortBy)

    const params = makeRequestParams({
      sort: {
        sortBy: currentSortBy,
        sortDir: sortBy !== currentSortBy || sortDir === TableSortDirection.Desc ? TableSortDirection.Asc : TableSortDirection.Desc,
      },
    })

    refetch(params)
  }

  const updateFilter = currentFilter => {
    filterProps.onSetFilter(currentFilter)

    const params = makeRequestParams({
      filters: { ...filterProps.activeFilters, [currentFilter.key]: currentFilter.value },
    })

    refetch(params)
  }

  const removeFilter = currentFilterKey => {
    filterProps.onRemoveFilter(currentFilterKey)

    const params = makeRequestParams({
      filters: omit(filterProps.activeFilters, [currentFilterKey]),
    })

    refetch(params)
  }

  const removeFilters = () => {
    filterProps.onClearFilters()

    const params = makeRequestParams({
      filters: mapValues(filterProps.activeFilters, () => undefined),
    })

    refetch(params)
  }

  const handleOnRowsScrollEnd = async () => {
    const startIndex = sortDir === TableSortDirection.Desc ? localListData.length - DEFAULT_ACL_RULES_COUNT : localListData.length
    const dataTotalLoaded = startIndex >= total

    if (startIndex < DEFAULT_LIST_QUERY_PARAMS_MAX || dataTotalLoaded) {
      return
    }

    const params = { ...makeRequestParams(), offset: startIndex }

    refetch(params)
  }

  const acceptableInfiniteTableThreshold = DEFAULT_LIST_QUERY_PARAMS_MAX / 2
  const tableProps = {
    getRowId: idFunction,
    loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    onRowsScrollEnd: handleOnRowsScrollEnd,
    rows: localListData,
    scrollEndThreshold: acceptableInfiniteTableThreshold,
  }
  const basicTableProviderProps = { columns, idFunction, loading }

  return (
    <Box className={classes.tableContainer}>
      <TableToolbar
        begin={<ListToolbarActions listLoading={loading} readOnly={readOnly} />}
        bottom={
          <AppliedFilterPanel {...filterProps} {...filterLabelProps} onClearFilters={removeFilters} onRemoveFilter={removeFilter} />
        }
        end={<Typography>{t('acl.tableRulesLabel', { count: total ?? 0 })}</Typography>}
      />

      <TableProvider
        basicProps={basicTableProviderProps}
        sortingProps={{ ...sortProps, onSort: updateSort }}
        filterProps={{ ...filterProps, onSetFilter: updateFilter, onRemoveFilter: removeFilter }}
      >
        <XGrid {...tableProps} />
      </TableProvider>
    </Box>
  )
}

export default AclInfiniteList
