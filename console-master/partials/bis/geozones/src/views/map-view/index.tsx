import React from 'react'

import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

import type { GeozoneEntity } from '@ues-behaviour/google-maps'
import { GeozonesMap as GeozonesMapComponent } from '@ues-behaviour/google-maps'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    '& .hovered': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  map: {
    flex: 1,
  },
}))

interface MapViewProps {
  data: GeozoneEntity[]
  onZoneDelete: (zone: GeozoneEntity) => void
  onZoneSave: (zone: GeozoneEntity) => void
  onZoneShapeCreated: (created: any) => void
  onFullScreenToggle?: () => void
  isFullscreen: boolean
  visibleZones: GeozoneEntity[]
}

const MapView: React.FC<MapViewProps> = ({
  data = [],
  onZoneDelete,
  onZoneSave,
  isFullscreen,
  onZoneShapeCreated,
  visibleZones,
  onFullScreenToggle,
}) => {
  const styles = useStyles()

  return (
    <Box className={styles.container}>
      <GeozonesMapComponent
        onFullscreenToggle={onFullScreenToggle}
        onZoneShapeCreated={onZoneShapeCreated}
        className={styles.map}
        zones={data}
        onZoneSave={onZoneSave}
        onZoneDelete={onZoneDelete}
        isFullscreen={isFullscreen}
        visibleZones={visibleZones}
      />
    </Box>
  )
}

export default MapView
