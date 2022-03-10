import cn from 'clsx'
import React, { useCallback, useMemo, useState } from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import type { GridRowParams } from '@material-ui/x-grid'

import type { GeozoneEntity } from '@ues-behaviour/google-maps'
import { GeozonesMap as GeozonesMapComponenent } from '@ues-behaviour/google-maps'
import { XGrid } from '@ues-behaviour/x-grid'
import {
  DialogChildren,
  ProgressButton,
  TableProvider,
  useControlledDialog,
  useFilter,
  useSelected,
  useSort,
} from '@ues/behaviours'

import markdown from './GeozonesMap.md'
import {
  CoordinatedDataSelectionProvider,
  useCoordinatedDataSelectionContext,
} from './lib/GeozonesMap/CoordinatedDataSelectionProvider'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(4),
    height: theme.spacing(200),
    '& .hovered': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  table: {
    width: theme.spacing(100),
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHighlighted: {
    backgroundColor: theme.palette.grey[100],
  },
  map: {
    flex: 1,
  },
}))

const TABLE_COLUMNS = [
  {
    dataKey: 'name',
    label: 'Geozone name',
    sortable: false,
  },
]

const TABLE_NAME = 'geozones'

const tableIdFunction = row => row.id
const tableBasicProps = {
  columns: TABLE_COLUMNS,
  idFunction: tableIdFunction,
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const GeozonesMapTableView = () => {
  const classNames = useStyles()
  const [zones, setZones] = useState<GeozoneEntity[]>([])
  const [zoneToDelete, setZoneToDelete] = useState<GeozoneEntity>()
  const [isDeletingGeozone, setIsDeletingGeozone] = useState(false)
  const [canSelectZone, setCanSelectZone] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const {
    select: selectZone,
    highlight: highlightZone,
    selected: selectedZone,
    highlighted: highlightedZone,
  } = useCoordinatedDataSelectionContext()

  const onZoneSave = useCallback(
    async (savedZone: GeozoneEntity) => {
      const zone = { ...savedZone }
      await delay(1000)
      if (zone.id) {
        setZones([...zones.filter(({ id }) => id !== zone.id), zone])
      } else {
        zone.id = new Date().getTime()
        setZones([...zones, zone])
      }
    },
    [zones],
  )

  const onZoneShapeCreated = useCallback(created => {
    setCanSelectZone(!created)
  }, [])

  const onZoneDelete = useCallback(zone => {
    setZoneToDelete(zone)
  }, [])

  const onConfirmDeleteZone = useCallback(async () => {
    setIsDeletingGeozone(true)
    await delay(500)
    setZones(zones.filter(({ id }) => id !== zoneToDelete.id))
    setIsDeletingGeozone(false)
    setZoneToDelete(null)
    selectZone(null)
    highlightZone(null)
  }, [highlightZone, selectZone, zoneToDelete?.id, zones])

  const onCancelDeleteZone = useCallback(() => {
    setZoneToDelete(null)
  }, [])

  const { open, onClose } = useControlledDialog(
    zoneToDelete
      ? {
          dialogId: Symbol('confirmDeleteGeozone'),
        }
      : {},
  )

  const onFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  const onTableRowClick = useCallback(
    rowData => {
      if (selectedZone && selectedZone.id === rowData.id) {
        selectZone(null)
      } else {
        selectZone(rowData.row)
      }
    },
    [selectZone, selectedZone],
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

  const tableFilterProps = useFilter({})
  const tableSelectionProps = useSelected('id')
  const tableSortProps = useSort(null, 'asc')

  const getRowClassName = useCallback(
    (params: GridRowParams) =>
      cn(
        classNames.tableRow,
        selectedZone && selectedZone.id === params.id
          ? 'Mui-selected'
          : highlightedZone && highlightedZone.id === params.id
          ? classNames.tableRowHighlighted
          : '',
      ),
    [classNames, highlightedZone, selectedZone],
  )

  const tableProps = useMemo(
    () => ({
      rows: zones,
      tableName: TABLE_NAME,
      ...(canSelectZone && { onRowClick: onTableRowClick }),
      onRowOver: onTableRowOver,
      onRowOut: onTableRowOut,
      checkboxSelection: true,
      getRowClassName,
    }),
    [canSelectZone, getRowClassName, onTableRowClick, onTableRowOut, onTableRowOver, zones],
  )

  return (
    <Box className={classNames.container}>
      {!isFullscreen && (
        <Box className={classNames.table}>
          <TableProvider
            basicProps={tableBasicProps}
            sortingProps={tableSortProps}
            selectedProps={tableSelectionProps}
            filterProps={tableFilterProps}
          >
            <XGrid {...tableProps} />
          </TableProvider>
        </Box>
      )}
      <GeozonesMapComponenent
        className={classNames.map}
        zones={zones}
        onZoneShapeCreated={onZoneShapeCreated}
        onZoneSave={onZoneSave}
        onZoneDelete={onZoneDelete}
        isFullscreen={isFullscreen}
        onFullscreenToggle={onFullscreenToggle}
      />
      <Dialog open={open} onClose={onClose}>
        <DialogChildren
          content={<Typography gutterBottom>{`Do you want to delete ${zoneToDelete?.name} geozone?`}</Typography>}
          actions={
            <>
              <Button variant="outlined" onClick={onCancelDeleteZone}>
                Cancel
              </Button>
              <ProgressButton loading={isDeletingGeozone} variant="contained" color="primary" onClick={onConfirmDeleteZone}>
                Delete
              </ProgressButton>
            </>
          }
        />
      </Dialog>
    </Box>
  )
}

export const GeozonesMap = () => (
  <CoordinatedDataSelectionProvider>
    <GeozonesMapTableView />
  </CoordinatedDataSelectionProvider>
)

export default {
  title: 'Maps/Geozones Map',
  parameters: {
    notes: markdown,
  },
}
