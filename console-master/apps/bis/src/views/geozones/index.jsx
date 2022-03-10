import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { GeozoneIdsQuery, GeozoneListDeleteMutation, GeozoneListQuery } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { BasicDelete as iconDelete } from '@ues/assets'

import throttle from '../../components/util/throttle'
import { CONFIRM_DELETE_GEOZONE_LIST_ITEM } from '../../config/consts/dialogIds'
import { Header, renderStyle as HeaderStyle } from '../../list/Header'
import MapSplitter from '../../list/MapSplitter'
import useSelectionCount from '../../list/useSelectionCount'
import GeozoneListProvider, { Context as GeozoneListContext } from '../../providers/GeozoneListProvider'
import {
  ErrorBoundary,
  hasEmptySelection,
  Icon,
  IconButton,
  LocalStorageKeys,
  reportClientError,
  useExport,
  useFilters,
  useLocalStorage,
  useQueryCallback,
  useSelection,
  useSorting,
} from '../../shared'
import GeozoneList from './GeozoneList'
import GeozoneMap from './GeozoneMap'
import { DeletionConfirmation } from './GeozoneModals'
import styles from './index.module.less'

const SelectionCount = memo(props => {
  const { t } = useTranslation()
  const { total } = useContext(GeozoneListContext)
  const count = useSelectionCount(props, total)
  if (count === 0) {
    return null
  }
  return (
    <span className={HeaderStyle.selectionCount} aria-label={t('geozones.selectedGeozones')}>
      {t('common.selectedItemsCount', { count })}
    </span>
  )
})

const selectionOptions = { key: 'geozones' }

const getSelectedGeozones = (geozones, selectionIds, selectMode, searchText) =>
  geozones.filter(zone => {
    let allow = true
    if (selectMode) {
      // In normal selection mode, export everything if
      // nothing is selected, or just export the ones
      // selected if something is selected.
      if (selectionIds.length > 0) {
        allow = allow && selectionIds.includes(zone.id)
      }
    } else {
      // In inverse selection mode, export everything unless
      // the id is explicitly deselected.
      allow = allow && !selectionIds.includes(zone.id)
    }

    if (searchText.length >= 3) {
      allow = allow && zone.name.toLowerCase().includes(searchText.toLowerCase())
    }
    return allow
  })

export const GeozoneDashboardView = () => {
  const { t } = useTranslation()
  const [viewData, saveViewData] = useLocalStorage(LocalStorageKeys.VIEW_GEOZONES, { showMap: true })
  const [state, setState] = useState({
    allowRowSelection: true,
  })
  const highlightTimeout = useRef()
  const selectedIds = useRef()
  const selectedNames = useRef()
  const [sorting, onSort] = useSorting({ key: 'geozones', initSortBy: 'name', initSortDirection: 'ASC' })
  const {
    onSelected,
    onSelectAll,
    onDeleteSingle,
    selectionState,
    selectedCount,
    selectedAll,
    deselectedCount,
    selectionVariables,
    clearSelection,
  } = useSelection(selectionOptions)
  const { onSearchChange, searchText } = useFilters()

  const onHighlightChanged = useCallback(highlightId => {
    highlightTimeout.current = throttle(() => setState(state => ({ ...state, highlightId })), highlightTimeout.current)
  }, [])

  const onLoadMoreRows = useCallback(({ startIndex }) => {
    // FIXME: do nothing for now, decide how this should work...
  }, [])

  const onRowSelected = useCallback(
    rowSelectId => {
      if (state.allowRowSelection) {
        setState({ ...state, rowSelectId })
      }
    },
    [state],
  )

  const onDisableRowSelection = useCallback(disabled => {
    setState(state => ({ ...state, allowRowSelection: !disabled }))
  }, [])

  const clearRowSelection = useCallback(
    geozoneId => {
      if (state.rowSelectId === geozoneId) {
        setState({ ...state, rowSelectId: undefined })
      }
    },
    [state],
  )

  const headerTitle = useMemo(() => {
    // FIXME: What is the help icon for in the UX mockup?
    return t('geozones.title')
  }, [t])

  const openDialog = useCallback(() => setState(state => ({ ...state, dialogId: CONFIRM_DELETE_GEOZONE_LIST_ITEM })), [])
  const closeDialog = useCallback(
    () =>
      setState(state => {
        const { dialogId, ...rest } = state
        return { ...rest }
      }),
    [],
  )

  const deleteSelected = useQueryCallback(GeozoneIdsQuery, { fetchPolicy: 'cache-only' }, result => {
    const zones = getSelectedGeozones(result?.geozones || [], selectionVariables.ids, selectionVariables.selectMode, searchText)
    if (zones && zones.length > 0) {
      selectedIds.current = zones.map(zone => zone.id)
      selectedNames.current = zones.map(zone => zone.name)
      openDialog()
    }
  })

  const showDeleteButton = !hasEmptySelection(selectionState)
  const deleteMutationOptions = useMemo(
    () => ({
      onCompleted: clearSelection,
    }),
    [clearSelection],
  )
  const [deleteGeozones, { loading: loadingDeleteGeozones }] = useStatefulApolloMutation(
    GeozoneListDeleteMutation,
    deleteMutationOptions,
  )
  const onDelete = useCallback(async () => {
    try {
      await deleteGeozones({ variables: { ids: selectedIds.current } })
    } catch (e) {
      reportClientError(e)
    }
    closeDialog()
  }, [closeDialog, deleteGeozones])
  const headerActionButtons = useMemo(() => {
    if (!showDeleteButton) {
      return null
    }
    return (
      <>
        <IconButton onClick={deleteSelected} title={t('common.delete')}>
          <Icon icon={iconDelete} />
        </IconButton>
        <DeletionConfirmation
          dialogId={state.dialogId}
          zone={selectedNames.current || []}
          onClose={closeDialog}
          onDelete={onDelete}
          deleteInProgress={loadingDeleteGeozones}
        />
      </>
    )
  }, [closeDialog, deleteSelected, loadingDeleteGeozones, onDelete, showDeleteButton, state.dialogId, t])

  const csvFields = [
    { label: t('geozones.id'), value: 'id' },
    { label: t('common.name'), value: 'name' },
    { label: t('geozones.risk'), value: 'risk' },
    { label: t('common.location'), value: 'location' },
    { label: t('geozones.unit'), value: 'unit' },
    { label: t('geozones.geometry'), value: zone => JSON.stringify(zone.geometry) },
  ]

  const { handleExport: onExport, isExporting } = useExport({
    fields: csvFields,
    parseItemsFn: data => getSelectedGeozones(data || [], selectionVariables.ids, selectionVariables.selectMode, searchText),
    query: GeozoneListQuery,
    queryPathName: 'geozones',
    selectedItems: Object.values(selectionState.selected),
  })

  const variables = useMemo(
    () => ({
      searchText: searchText,
      sortBy: sorting.sortBy,
      sortDirection: sorting.sortDirection,
    }),
    [searchText, sorting.sortBy, sorting.sortDirection],
  )
  const makeList = ({ showMap, onShowMap, onHideMap }) => {
    if (showMap !== viewData.showMap) {
      viewData.showMap = showMap
      saveViewData(viewData)
    }
    const handleShowMap = () => {
      onDisableRowSelection(false)
      onShowMap()
    }

    const handleHideMap = () => {
      onDisableRowSelection(true)
      clearRowSelection(state.rowSelectId)
      onHideMap()
    }

    return (
      <div className={styles.listContainer}>
        <Header
          title={headerTitle}
          selectionCount={
            <SelectionCount selectedAll={selectedAll} selectedCount={selectedCount} deselectedCount={deselectedCount} />
          }
          actionButtons={headerActionButtons}
          onSearchChange={onSearchChange}
          showMap={showMap}
          onShowMap={handleShowMap}
          onHideMap={handleHideMap}
          searchText={searchText}
          onExport={onExport}
          isExporting={isExporting}
        />

        <GeozoneList
          onSort={onSort}
          sortBy={sorting.sortBy}
          sortDirection={sorting.sortDirection}
          highlightId={state.highlightId}
          onHighlightChanged={onHighlightChanged}
          onLoadMoreRows={onLoadMoreRows}
          onRowSelected={onRowSelected}
          singleSelectId={state.rowSelectId}
          selectionState={selectionState}
          onSelected={onSelected}
          onSelectAll={onSelectAll}
          selectedAll={selectedAll}
        />
      </div>
    )
  }
  const makeMap = mapRef => (
    <GeozoneMap
      ref={mapRef}
      highlightId={state.highlightId}
      onHighlightChanged={onHighlightChanged}
      onZoneSelected={onRowSelected}
      disableZoneSelection={onDisableRowSelection}
      zoneSelectionDisabled={!state.allowRowSelection}
      showPopupId={state.rowSelectId}
      onPopupClose={clearRowSelection}
      onDeleteSingle={onDeleteSingle}
    />
  )
  return (
    <GeozoneListProvider variables={variables}>
      <MapSplitter showMap={viewData.showMap}>
        {makeList}
        {makeMap}
      </MapSplitter>
    </GeozoneListProvider>
  )
}

export const GeozoneDashboard = memo(() => (
  <ErrorBoundary>
    <GeozoneDashboardView />
  </ErrorBoundary>
))

export default GeozoneDashboard
