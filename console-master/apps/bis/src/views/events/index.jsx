import React, { memo, useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { EventFiltersQuery, EventListQuery } from '@ues-data/bis'

import { Header, renderStyle as HeaderStyle } from '../../list/Header'
import { useMapViewStateSaver } from '../../list/hooks'
import MapSplitter from '../../list/MapSplitter'
import useSelectionCount from '../../list/useSelectionCount'
import EventListProvider, { EventListContext } from '../../providers/EventListProvider'
import { default as RiskEngineSettingsProvider } from '../../providers/RiskEngineSettingsProvider'
import StateProvider, { Context as StateContext } from '../../providers/StateProvider'
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
import { default as FilterBar } from '../users/FilterBar'
import EventList from './EventList'
import EventMap, { MapStorageId } from './EventMap'
import styles from './index.module.less'

const INITIAL_FETCH_SIZE = 25
const initialState = {
  offset: 0,
  size: INITIAL_FETCH_SIZE,
}

const Title = memo(({ t }) => {
  const { loading, error, total } = useContext(EventListContext)
  return useMemo(() => {
    if (!total) {
      if (loading) {
        return t('common.loading')
      } else if (error) {
        return t('usersEvents.errorLoadingEvents')
      }
    }
    return t('usersEvents.totalEvents', { count: total || 0 })
  }, [loading, error, total, t])
})

const SelectionCount = memo(props => {
  const { t } = useTranslation()
  const { total } = useContext(EventListContext)
  const count = useSelectionCount(props, total)
  if (count === 0) {
    return null
  }

  return (
    <span className={HeaderStyle.selectionCount} aria-label={t('usersEvents.selectedEvents')}>
      {t('common.selectedItemsCount', { count })}
    </span>
  )
})

const selectionOptions = { key: 'events' }
const eventFiltersAccessor = data => data.eventFilters

export const EventDashboardView = () => {
  const { t } = useTranslation()
  const naviagte = useNavigate()
  const { currentTimePeriod: range } = useContext(StateContext)

  const [stateVariables, setState] = useState(initialState)
  const [viewData, saveViewData] = useLocalStorage(LocalStorageKeys.VIEW_EVENTS, { showMap: true })
  const stateSaver = useMapViewStateSaver()
  const [sorting, saveSorting] = useSorting({ key: 'events', initSortBy: 'datetime', initSortDirection: 'ASC' })
  const { selectionState, selectionVariables, onSelected, onSelectAll, selectedAll, selectedCount, deselectedCount } = useSelection(
    selectionOptions,
  )
  const { filters, searchText, onFilterChange, onSearchChange, filterVariables } = useFilters(filterOptions)
  const onRowClick = useCallback(
    ({ rowData, event }) => {
      if (!event.defaultPrevented) {
        stateSaver(MapStorageId)
        const safeId = encodeURIComponent(rowData.id)
        naviagte(`${safeId}`, { state: { goBack: true } })
      }
    },
    [naviagte, stateSaver],
  )

  const mapVariables = useMemo(
    () => ({
      ...selectionVariables,
      ...filterVariables,
      ...stateVariables,
      ...sorting,
      range,
    }),
    [selectionVariables, filterVariables, stateVariables, sorting, range],
  )
  const exportVariables = useMemo(
    () => ({
      ...selectionVariables,
      ...filterVariables,
      ...stateVariables,
      ...sorting,
      range,
      size: 10000,
    }),
    [selectionVariables, filterVariables, stateVariables, sorting, range],
  )
  const listVariables = useMemo(
    () => ({
      ...filterVariables,
      ...stateVariables,
      ...sorting,
      range,
    }),
    [filterVariables, stateVariables, sorting, range],
  )
  const filterBarVariables = useMemo(() => ({ range: range }), [range])

  const {
    privacyMode: { mode: privacyMode = true } = {},
    features: { RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection } = {},
  } = useClientParams() || {}

  const { handleExport: onExport, isExporting } = useExport({
    fetchPolicy: 'cache-first',
    parseItemsFn: data => data.events,
    query: EventListQuery(privacyMode, RiskScoreResponseFormat, IpAddressRisk, NetworkAnomalyDetection),
    queryPathName: 'eventInfiniteScroll',
    selectedItems: Object.values(selectionState.selected),
    variables: exportVariables,
  })

  const onSort = useCallback(
    ({ sortBy, sortDirection }) => {
      saveSorting({ sortBy, sortDirection })
      setState({ offset: 0, size: INITIAL_FETCH_SIZE })
    },
    [saveSorting],
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
      const filterBar = (
        <FilterBar
          variables={filterBarVariables}
          onFilterChange={onFilterChange}
          filters={filters}
          query={EventFiltersQuery}
          dataAccessor={eventFiltersAccessor}
        />
      )
      if (showMap !== viewData.showMap) {
        viewData.showMap = showMap
        saveViewData(viewData)
      }
      return (
        <div id="event-dashboard" className={styles.listContainer}>
          <EventListProvider variables={listVariables}>
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
            <EventList
              onSort={onSort}
              onSelected={onSelected}
              onSelectAll={onSelectAll}
              selectionState={selectionState}
              selectedAll={selectedAll}
              onRowClick={onRowClick}
            />
          </EventListProvider>
        </div>
      )
    },
    [
      filterBarVariables,
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

  const makeMap = useCallback(mapRef => <EventMap variables={mapVariables} ref={mapRef} onFilterChange={onFilterChange} />, [
    onFilterChange,
    mapVariables,
  ])

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

EventDashboardView.displayName = 'EventsDashboardView'

export const EventsDashboard = memo(() => {
  return (
    <ErrorBoundary>
      <StateProvider>
        <RiskEngineSettingsProvider>
          <EventDashboardView />
        </RiskEngineSettingsProvider>
      </StateProvider>
    </ErrorBoundary>
  )
})

export default EventsDashboard
