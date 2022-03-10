//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isNil, mapValues, omit, omitBy } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Box, Button } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { XGrid } from '@ues-behaviour/x-grid'
import type { NetworkServicesV3 } from '@ues-data/gateway'
import { NetworkServiceTenantId } from '@ues-data/gateway'
import { serializeQueryParameter, UesSessionApi } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Config, Hooks, Types, Utils } from '@ues-gateway/shared'
import { BasicAdd } from '@ues/assets'
import { AriaElementLabel } from '@ues/assets-e2e'
import {
  AppliedFilterPanel,
  TableProvider,
  TableSortDirection,
  TableToolbar,
  useFilter,
  useFilterLabels,
  useSort,
} from '@ues/behaviours'

import { SAAS_APPS_FILTER_LOCALIZATION_KEYS } from './constants'
import { useColumns } from './hooks'
import useStyles from './styles'
import type { CurrentTableData } from './types'
import { ColumnDataKey } from './types'

const { useBigPermissions, BigService, useNetworkServicesData } = Hooks
const {
  GATEWAY_TRANSLATIONS_KEY,
  NETWORK_SERVICES_DEFAULT_SORT,
  NETWORK_SERVICES_MAX_RECORDS,
  NETWORK_SERVICES_SCROLL_THRESHOLD,
} = Config
const { makePageRoute, isTaskResolved, makeSortByQueryParam } = Utils
const { Page } = Types

const DEFAULT_QUERY_VARIABLES = {
  tenantId: UesSessionApi.getTenantId(),
  offset: 0,
  max: NETWORK_SERVICES_MAX_RECORDS,
  sortBy: `${NETWORK_SERVICES_DEFAULT_SORT} ${TableSortDirection.Asc}`,
}

export const NetworkServicesList: React.FC = () => {
  const { canCreate } = useBigPermissions(BigService.NetworkServices)

  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigate = useNavigate()
  const classes = useStyles()
  const tenantId = UesSessionApi.getTenantId()

  const {
    networkServicesResponse: initialNetworkServicesResponse,
    loading: initialLoadingNetworkServices,
    fetchMore,
  } = useNetworkServicesData({ fetchQueryParams: DEFAULT_QUERY_VARIABLES, includeOptions: false, aclNetworkServices: true })
  const previousInitialNetworkServicesLoading = usePrevious(initialLoadingNetworkServices)

  const [loading, setLoading] = useState<boolean>(false)
  const [localTableData, setLocalTableData] = useState<NetworkServicesV3.NetworkServiceEntity[]>([])

  const dataTotal = initialNetworkServicesResponse?.totals?.elements ?? 0

  useEffect(() => {
    if (isTaskResolved({ loading: initialLoadingNetworkServices }, { loading: previousInitialNetworkServicesLoading })) {
      setLocalTableData(initialNetworkServicesResponse?.elements ?? [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoadingNetworkServices])

  const columns = useColumns()

  const basicTableProviderProps = {
    columns,
    idFunction: rowData => rowData.id,
    loading: loading ?? initialLoadingNetworkServices,
  }

  const sortProps = useSort(NETWORK_SERVICES_DEFAULT_SORT, TableSortDirection.Asc)
  const { sort: sortBy, sortDirection: sortDir } = sortProps

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const fetchNetworkServices = async (params: NetworkServicesV3.NetworkServicesRequestParams, resetData = true) => {
    try {
      setLoading(true)
      const { elements: data } = (await fetchMore({
        tenantId,
        params,
      })) as PagableResponse<NetworkServicesV3.NetworkServiceEntity>

      setLocalTableData(resetData ? data : [...localTableData, ...data])
    } catch (error) {
      throw new Error('Error when fetching network services...')
    } finally {
      setLoading(false)
    }
  }

  const makeRequestParamsQuery = (currentTableData: CurrentTableData) => {
    const filters = { ...(currentTableData?.filters ?? filterProps?.activeFilters) } as CurrentTableData['filters']

    const filtersOverwrites = {}
    const paramsAffectedByQuery: NetworkServicesV3.NetworkServicesRequestParams = {}

    if (filters?.[ColumnDataKey.SaasApps]?.value === t(SAAS_APPS_FILTER_LOCALIZATION_KEYS.ADMIN_CREATED)) {
      paramsAffectedByQuery.intrinsic = false
    }

    if (filters?.[ColumnDataKey.SaasApps]?.value === t(SAAS_APPS_FILTER_LOCALIZATION_KEYS.PREDEFINED)) {
      filtersOverwrites[ColumnDataKey.SaasApps] = { value: NetworkServiceTenantId.System }
    }

    const query = Object.entries({ ...omit(filters, [ColumnDataKey.SaasApps]), ...filtersOverwrites })
      .map(([key, value]) => serializeQueryParameter(key, value))
      .join('&')

    return { query, paramsAffectedByQuery }
  }

  const makeRequestParams = (currentTableData?: CurrentTableData): NetworkServicesV3.NetworkServicesRequestParams => {
    const { query, paramsAffectedByQuery } = makeRequestParamsQuery(currentTableData)

    return omitBy(
      {
        intrinsic: true,
        tenantId,
        offset: 0,
        max: NETWORK_SERVICES_MAX_RECORDS,
        sortBy: makeSortByQueryParam({
          sortBy: currentTableData?.sort?.sortBy ?? sortBy,
          sortDir: currentTableData?.sort?.sortDir ?? sortDir,
        }),
        query,
        ...paramsAffectedByQuery,
      },
      value => value === '' || isNil(value),
    )
  }

  const updateSort = currentSortBy => {
    sortProps.onSort(currentSortBy)

    const params = makeRequestParams({
      sort: {
        sortBy: currentSortBy,
        sortDir: sortBy !== currentSortBy || sortDir === TableSortDirection.Desc ? TableSortDirection.Asc : TableSortDirection.Desc,
      },
    })

    fetchNetworkServices(params)
  }

  const handleOnRowsScrollEnd = async () => {
    const startIndex = localTableData.length
    const dataTotalLoaded = startIndex >= dataTotal

    if (startIndex < NETWORK_SERVICES_MAX_RECORDS || dataTotalLoaded) {
      return
    }

    const params = { ...makeRequestParams(), offset: startIndex }

    fetchNetworkServices(params, false)
  }

  const updateFilter = currentFilter => {
    filterProps.onSetFilter(currentFilter)

    const params = makeRequestParams({
      filters: { ...filterProps.activeFilters, [currentFilter.key]: currentFilter.value },
    })

    fetchNetworkServices(params)
  }

  const removeFilter = currentFilterKey => {
    filterProps.onRemoveFilter(currentFilterKey)

    const params = makeRequestParams({
      filters: omit(filterProps.activeFilters, [currentFilterKey]),
    })

    fetchNetworkServices(params)
  }

  const removeFilters = () => {
    filterProps.onClearFilters()

    const params = makeRequestParams({
      filters: mapValues(filterProps.activeFilters, () => undefined),
    })

    fetchNetworkServices(params)
  }

  const tableProps = {
    getRowId: rowData => rowData.id,
    loading: initialLoadingNetworkServices || loading,
    noRowsMessageKey: `${GATEWAY_TRANSLATIONS_KEY}:common.noData`,
    onRowsScrollEnd: handleOnRowsScrollEnd,
    rows: localTableData,
    scrollEndThreshold: NETWORK_SERVICES_SCROLL_THRESHOLD,
    checkboxSelection: false,
  }

  return (
    <Box className={classes.container}>
      <TableToolbar
        begin={
          canCreate && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate(makePageRoute(Page.GatewaySettingsNetworkServiceAdd))}
              startIcon={<BasicAdd />}
            >
              {t('common.buttonAdd')}
            </Button>
          )
        }
        bottom={
          <AppliedFilterPanel {...filterProps} {...filterLabelProps} onClearFilters={removeFilters} onRemoveFilter={removeFilter} />
        }
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
