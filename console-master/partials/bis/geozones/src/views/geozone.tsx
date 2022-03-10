import cn from 'clsx'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import type { GridRowParams } from '@material-ui/x-grid'

import type { GeozoneEntity } from '@ues-behaviour/google-maps'
import { CoordinatedDataSelectionProvider, useCoordinatedDataSelectionContext } from '@ues-behaviour/google-maps'
import { GeozonesQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'
import { SplitView as SplitViewComponent, useSnackbar } from '@ues/behaviours'

import { DeletionModal, useDeletionModalHandlers } from '../components/deletion-modal'
import { useCreateGeozoneHandler } from '../hooks/use-create-geozone-handler'
import { useGeozonesTableProps } from '../hooks/use-geozones-table-props'
import { useUpdateGeozoneHandler } from '../hooks/use-update-geozone-handler'
import { geozoneEntityToMutationInput, queryResultEntryToGeozoneEntity } from '../utils/data'
import ListView from './list'
import MapView from './map-view'

const useStyles = makeStyles((theme: any) => ({
  container: {
    width: '100%',
    height: '100%',
  },
  splitContainer: {
    width: '100%',
    height: '100%',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHighlighted: {
    backgroundColor: theme.palette.grey[100],
  },
}))

const Geozone: React.FC = () => {
  const [canSelectZone, setCanSelectZone] = useState(true)
  const styles = useStyles()
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const { enqueueMessage } = useSnackbar()

  const { error, loading, data: tableData } = useStatefulApolloQuery(GeozonesQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  useEffect(() => {
    if (error) {
      enqueueMessage(t('bis/shared:common.errorPleaseContact'), 'error')
    }
  }, [enqueueMessage, error, t])

  const listEntities = useMemo(() => tableData?.geozones ?? [], [tableData])

  const mapEntities = useMemo(() => {
    const zones = (listEntities ?? []).map(queryResultEntryToGeozoneEntity)
    const zonesById = new Map(zones.map(zone => [zone.id, zone]))

    return { zones, zonesById }
  }, [listEntities])

  const {
    select: selectZone,
    highlight: highlightZone,
    selected: selectedZone,
    highlighted: highlightedZone,
  } = useCoordinatedDataSelectionContext()

  const getRowClassName = useCallback(
    (params: GridRowParams) =>
      cn(
        styles.tableRow,
        selectedZone && selectedZone.id === params.id
          ? 'Mui-selected'
          : highlightedZone && highlightedZone.id === params.id
          ? styles.tableRowHighlighted
          : '',
      ),
    [styles, highlightedZone, selectedZone],
  )

  const handleRowClick = useCallback(
    rowData => {
      if (selectedZone && selectedZone.id === rowData.id) {
        selectZone(null)
      } else {
        selectZone(queryResultEntryToGeozoneEntity(rowData.row))
      }
    },
    [selectZone, selectedZone],
  )

  const { providerProps, filterLabelProps } = useGeozonesTableProps({
    data: listEntities,
    handleRowClick: handleRowClick,
  })

  const { handler: createHandler } = useCreateGeozoneHandler()
  const { handler: updateHandler } = useUpdateGeozoneHandler()

  const { props: deletionModalProps, openDeletionModal } = useDeletionModalHandlers(listEntities)

  const onZoneSave = useCallback(
    async (savedZone: GeozoneEntity) => {
      const zone = { ...savedZone }

      const { error } = await (zone.id
        ? updateHandler(geozoneEntityToMutationInput(zone))
        : createHandler(geozoneEntityToMutationInput(zone)))

      if (error) {
        throw new Error()
      }
    },
    [createHandler, updateHandler],
  )

  const onZoneShapeCreated = useCallback(created => {
    setCanSelectZone(!created)
  }, [])

  const onZoneDelete = useCallback(
    async (zone?: GeozoneEntity) => {
      const ids = zone ? [zone.id as string] : providerProps.selectedProps.selected

      if (ids.length > 0) {
        openDeletionModal(ids)
      }
    },
    [openDeletionModal, providerProps.selectedProps.selected],
  )

  const onTableRowOver = useCallback(
    rowData => {
      highlightZone(rowData.row)
    },
    [highlightZone],
  )

  const onTableRowOut = useCallback(() => {
    highlightZone(null)
  }, [highlightZone])

  useEffect(() => {
    if (selectedZone) {
      const selectedZoneInMapEntities = mapEntities?.zonesById?.has(selectedZone?.id)

      if (!selectedZoneInMapEntities) {
        selectZone(null)
        highlightZone(null)
      }
    }
  }, [selectedZone, mapEntities, selectZone, highlightZone])

  useEffect(() => {
    const ids = new Set(listEntities.map(entity => entity.id))
    const selectedIds = new Set(providerProps.selectedProps?.selected ?? [])

    providerProps.selectedProps?.selected?.forEach(id => {
      if (!ids.has(id)) {
        selectedIds.delete(id)
      }
    })

    providerProps.selectedProps?.setSelected(Array.from(selectedIds))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEntities])

  const tableProps = useMemo(
    () => ({
      rows: providerProps.data,
      tableName: 'BIS_GEOZONES_TABLE',
      ...(canSelectZone && { onRowClick: handleRowClick }),
      onRowOver: onTableRowOver,
      onRowOut: onTableRowOut,
      checkboxSelection: true,
      getRowClassName,
    }),
    [providerProps.data, canSelectZone, handleRowClick, onTableRowOver, onTableRowOut, getRowClassName],
  )

  const visibleZones = useMemo(
    () =>
      (providerProps.selectedProps?.selected ?? []).reduce<GeozoneEntity[]>((acc, id) => {
        const entity = mapEntities.zonesById.get(id)

        return entity ? [...acc, entity] : acc
      }, []),

    [mapEntities.zonesById, providerProps.selectedProps?.selected],
  )

  const onListDelete = useCallback(() => {
    openDeletionModal(providerProps.selectedProps?.selected ?? [])
  }, [openDeletionModal, providerProps.selectedProps?.selected])

  const [mapFullScreen, setMapFullScreen] = useState(false)

  const onFullScreenToggle = useCallback(() => setMapFullScreen(value => !value), [])

  const splitSizes = useMemo(() => (mapFullScreen ? [0, 100] : [50, 50]), [mapFullScreen])

  return (
    <Box className={styles.container}>
      <SplitViewComponent className={styles.splitContainer} minSize={mapFullScreen ? 0 : 240} initialSizes={splitSizes}>
        <ListView
          providerProps={providerProps}
          loading={loading}
          filterLabelProps={filterLabelProps}
          onDelete={onListDelete}
          tableProps={tableProps}
        />
        <MapView
          data={mapEntities.zones}
          isFullscreen={mapFullScreen}
          onFullScreenToggle={onFullScreenToggle}
          onZoneShapeCreated={onZoneShapeCreated}
          onZoneDelete={onZoneDelete}
          onZoneSave={onZoneSave}
          visibleZones={visibleZones}
        />
      </SplitViewComponent>
      <DeletionModal {...deletionModalProps} />
    </Box>
  )
}

export const GeozonesWrapper = () => (
  <CoordinatedDataSelectionProvider>
    <Geozone />
  </CoordinatedDataSelectionProvider>
)

export default GeozonesWrapper
