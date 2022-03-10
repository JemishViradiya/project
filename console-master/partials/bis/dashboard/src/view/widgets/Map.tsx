import React, { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import type { ChartProps } from '@ues-behaviour/dashboard'
import { BasicMap } from '@ues-behaviour/google-maps'

const useStyles = makeStyles({
  container: {
    height: '100%',
    width: '100%',
  },
})

const MapWidget: React.FC<ChartProps> = memo(({ childProps }) => {
  const styles = useStyles()

  const minZoom = useMemo(() => {
    return childProps.find(prop => prop['minZoom'])['minZoom']
  }, [childProps])

  const maxZoom = useMemo(() => {
    return childProps.find(prop => prop['maxZoom'])['maxZoom']
  }, [childProps])

  return <BasicMap className={styles.container} zoomControls={true} mapTypeControls={true} minZoom={minZoom} maxZoom={maxZoom} />
})

export default MapWidget
