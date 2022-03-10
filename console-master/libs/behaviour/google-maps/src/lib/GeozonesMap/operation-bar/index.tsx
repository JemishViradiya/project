import React, { memo, useEffect, useMemo } from 'react'
import { Portal } from 'react-portal'

import Box from '@material-ui/core/Box'

import type { PositionFunc } from '../../GoogleMaps'
import { useGoogleMapContext } from '../../GoogleMaps'
import type { DrawingControlsProps } from './DrawingControls'
import DrawingControls from './DrawingControls'
import SearchInput from './SearchInput'
import useStyles from './styles'

interface OperationBarProps extends DrawingControlsProps {
  onPlaceSelected: (name: string, location: PositionFunc) => void
}

export const OperationBar: React.FC<OperationBarProps> = memo(
  ({ onPlaceSelected, onCreateShapeClick, onShapeCreated, disabled }) => {
    const containerElement = useMemo<HTMLDivElement>(() => document.createElement('div'), [])
    const styles = useStyles()
    const { google, map } = useGoogleMapContext()

    useEffect(() => {
      map.controls[google.maps.ControlPosition.LEFT_TOP].push(containerElement)
    }, [containerElement, google, map])

    return (
      <Portal node={containerElement}>
        <Box className={styles.container}>
          <SearchInput onSelect={onPlaceSelected} disabled={disabled} />
          <DrawingControls onCreateShapeClick={onCreateShapeClick} onShapeCreated={onShapeCreated} disabled={disabled} />
        </Box>
      </Portal>
    )
  },
)

export default OperationBar
