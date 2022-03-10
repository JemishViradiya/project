import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { UserListQuery } from '@ues-data/bis'

import { Header, renderStyle as HeaderStyle } from '../../list/Header'
import { useMapViewStateSaver } from '../../list/hooks'
import MapSplitter from '../../list/MapSplitter'
import useSelectionCount from '../../list/useSelectionCount'
import { default as RiskEngineSettingsProvider } from '../../providers/RiskEngineSettingsProvider'
import UserListProvider, { UserListContext } from '../../providers/UserListProvider'
import {
  ErrorBoundary,
  LocalStorageKeys,
  RiskLevelFilterOptions as filterOptions,
  useClientParams,
  useExport,
  useFilters,
  useLocalStorage,
  useSelection,
  useSorting,
} from '../../shared'
import { default as FilterBar } from './FilterBar'
import styles from './index.module.less'
import UserMap, { MapStorageId } from './Map'
import { default as UserList } from './UserList'

const INITIAL_FETCH_SIZE = 25
const initialState = {
  offset: 0,
  size: INITIAL_FETCH_SIZE,
}

const Title = memo(({ t }) => {
  const { loading, error, total } = useContext(UserListContext)
  return useMemo(() => {
    if (!total) {
      if (loading) {
        return t('common.loading')
      } else if (error) {
        return t('usersEvents.errorLoadingUsers')
      }
    }
    return t('user.activeCount', { count: total || 0 })
  }, [loading, error, total, t])
})

const SelectionCount = memo(props => {
  const { t } = useTranslation()
  const { total } = useContext(UserListContext)
  const count = useSelectionCount(props, total)
  if (count === 0) {
    return null
  }

  return (
    <span className={HeaderStyle.selectionCount} aria-label={t('usersEvents.selectedUsers')}>
      {t('user.selectedCount', { count })}
    </span>
  )
})

export const UsersDashboardView = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [stateVariables, setState] = useState(initialState)
  const [viewData, saveViewData] = useLocalStorage(LocalStorageKeys.VIEW_USERS, { showMap: false })
  const [sorting, saveSorting] = useSorting({ key: 'users', initSortBy: 'assessment.datetime', initSortDirection: 'DESC' })
  const {
    selectionState,
    selectionVariables,
    onSelected,
    onSelectAll,
    selectedAll,
    selectedCount,
    deselectedCount,
  } = useSelection({ idParam: 'id', pluralParam: 'users', key: 'users' })
  const { filters, searchText, onFilterChange, onSearchChange, filterVariables } = useFilters(filterOptions)
  const onSort = useCallback(
    ({ sortBy, sortDirection }) => {
      saveSorting({ sortBy, sortDirection })
      setState({ offset: 0, size: INITIAL_FETCH_SIZE })
    },
    [saveSorting],
  )

  const listVariables = useMemo(
    () => ({
      ...filterVariables,
      ...stateVariables,
      ...sorting,
    }),
    [filterVariables, sorting, stateVariables],
  )
  const mapVariables = useMemo(
    () => ({
      ...selectionVariables,
      ...filterVariables,
      ...stateVariables,
      ...sorting,
    }),
    [selectionVariables, filterVariables, stateVariables, sorting],
  )
  const exportVariables = useMemo(
    () => ({
      ...selectionVariables,
      ...filterVariables,
      ...stateVariables,
      ...sorting,
      size: 10000,
    }),
    [selectionVariables, filterVariables, stateVariables, sorting],
  )

  const {
    privacyMode: { mode: privacyMode = true } = {},
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection },
  } = useClientParams() || {}

  const { handleExport: onExport, isExporting } = useExport({
    fetchPolicy: 'cache-first',
    parseItemsFn: data => data.users,
    query: UserListQuery(privacyMode, RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection),
    queryPathName: 'users',
    selectedItems: Object.values(selectionState.selected),
    variables: exportVariables,
  })

  const stateSaver = useMapViewStateSaver()

  const onRowClick = useCallback(
    ({ rowData, event }) => {
      if (!event.defaultPrevented) {
        stateSaver(MapStorageId)
        const safeEcoId = encodeURIComponent(rowData.assessment.eEcoId)
        navigate(`${safeEcoId}`, { state: { goBack: true } })
      }
    },
    [navigate, stateSaver],
  )

  const selectionCount = useMemo(
    () =>
      !selectedAll && deselectedCount === 0 && selectedCount === 0 ? null : (
        <SelectionCount selectedAll={selectedAll} selectedCount={selectedCount} deselectedCount={deselectedCount} />
      ),
    [selectedAll, deselectedCount, selectedCount],
  )

  const makeListView = useCallback(
    ({ showMap, onShowMap, onHideMap }) => {
      const filterBar = <FilterBar onFilterChange={onFilterChange} filters={filters} />
      if (showMap !== viewData.showMap) {
        viewData.showMap = showMap
        saveViewData(viewData)
      }
      return (
        <div id="user-dashboard-user-list" className={styles.listContainer}>
          <UserListProvider variables={listVariables}>
            <Header
              title={<Title t={t} />}
              selectionCount={selectionCount}
              filterBar={filterBar}
              onSearchChange={onSearchChange}
              showMap={showMap}
              onShowMap={onShowMap}
              onHideMap={onHideMap}
              searchText={searchText}
              onExport={onExport}
              isExporting={isExporting}
            />
            <UserList
              onSort={onSort}
              onSelected={onSelected}
              onSelectAll={onSelectAll}
              selectionState={selectionState}
              selectedAll={selectedAll}
              onRowClick={onRowClick}
            />
          </UserListProvider>
        </div>
      )
    },
    [
      onFilterChange,
      filters,
      viewData,
      t,
      selectionCount,
      onSearchChange,
      searchText,
      onExport,
      isExporting,
      onSort,
      onSelected,
      onSelectAll,
      selectionState,
      selectedAll,
      onRowClick,
      saveViewData,
      listVariables,
    ],
  )

  const makeMap = useCallback(
    mapRef => <UserMap id="UserMap" variables={mapVariables} ref={mapRef} onFilterChange={onFilterChange} />,
    [mapVariables, onFilterChange],
  )
  return useMemo(
    () => (
      <MapSplitter showMap={viewData.showMap}>
        {makeListView}
        {makeMap}
      </MapSplitter>
    ),
    [makeListView, makeMap, viewData.showMap],
  )
}

UsersDashboardView.displayName = 'UsersDashboardView'

export const UsersDashboard = memo(() => {
  return (
    <ErrorBoundary>
      <RiskEngineSettingsProvider>
        <UsersDashboardView />
      </RiskEngineSettingsProvider>
    </ErrorBoundary>
  )
})

export default UsersDashboard
