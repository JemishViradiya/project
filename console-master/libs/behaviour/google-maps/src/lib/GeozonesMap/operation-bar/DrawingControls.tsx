import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'

import { usePrevious } from '@ues-behaviour/react'
import { BasicGeozoneRadius, BasicGeozoneShape } from '@ues/assets'

import { useGoogleMapContext } from '../../GoogleMaps'
import { Tooltip } from '../../Tooltip'
import type { GeozoneShape } from '../model'
import { GeozoneType } from '../model'
import { useShapeStyle } from '../utils/use-shape-style'
import useStyles from './styles'

export interface DrawingControlsProps {
  onCreateShapeClick: (enabled: boolean) => void
  onShapeCreated: (shape: GeozoneShape, type: GeozoneType) => void
  disabled: boolean
}

const DrawingControls: React.FC<DrawingControlsProps> = memo(({ onCreateShapeClick, onShapeCreated, disabled }) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const { google, map } = useGoogleMapContext()
  const [mode, setMode] = useState<google.maps.drawing.OverlayType.CIRCLE | google.maps.drawing.OverlayType.POLYGON>(null)
  const [shape, setShape] = useState<GeozoneShape>()
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager>()

  const styles = useStyles()
  const shapeStyle = useShapeStyle()

  const setNewShape = useCallback(
    newShape => {
      // Clear out any previous pending shape
      if (shape) {
        shape.setMap(null)
      }

      // Get out of drawing mode
      setShape(newShape)
      setMode(null)
    },
    [shape],
  )

  const onCircleComplete = useCallback(
    circle => {
      setNewShape(circle)
      onShapeCreated(circle, GeozoneType.Circle)
    },
    [onShapeCreated, setNewShape],
  )

  const onPolygonComplete = useCallback(
    polygon => {
      setNewShape(polygon)
      onShapeCreated(polygon, GeozoneType.Polygon)
    },
    [onShapeCreated, setNewShape],
  )

  useEffect(() => {
    if (!drawingManager) {
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: mode,
        drawingControl: false,
        circleOptions: {
          ...shapeStyle,
        },
        polygonOptions: {
          ...shapeStyle,
        },
      })
      drawingManager.setMap(map)
      setDrawingManager(drawingManager)
    }
  }, [drawingManager, google, map, mode, onCircleComplete, onPolygonComplete, shapeStyle])

  useEffect(() => {
    if (drawingManager) {
      drawingManager.addListener('circlecomplete', onCircleComplete)
      drawingManager.addListener('polygoncomplete', onPolygonComplete)
      return () => {
        google.maps.event.clearInstanceListeners(drawingManager)
      }
    }
  }, [google, drawingManager, onCircleComplete, onPolygonComplete])

  const prevMode = usePrevious(mode)
  useEffect(() => {
    if (mode !== prevMode) {
      if (drawingManager.getMap() !== map) {
        drawingManager.setMap(map)
      }
      drawingManager.setOptions({
        drawingMode: mode,
      })
    }
  }, [drawingManager, map, mode, prevMode])

  const toggleCircle = useCallback(() => {
    const CIRCLE_OVERLAY = google?.maps?.drawing?.OverlayType?.CIRCLE
    const newMode = mode === CIRCLE_OVERLAY ? null : CIRCLE_OVERLAY
    setMode(newMode)
    onCreateShapeClick(!!newMode)
  }, [google?.maps?.drawing?.OverlayType?.CIRCLE, mode, onCreateShapeClick])

  const togglePolygon = useCallback(() => {
    const POLYGON_OVERLAY = google?.maps?.drawing?.OverlayType?.POLYGON
    const newMode = mode === POLYGON_OVERLAY ? null : POLYGON_OVERLAY
    setMode(newMode)
    onCreateShapeClick(!!newMode)
  }, [google?.maps?.drawing?.OverlayType?.POLYGON, mode, onCreateShapeClick])

  const circleSelected = mode === google?.maps?.drawing?.OverlayType?.CIRCLE
  const polygonSelected = mode === google?.maps?.drawing?.OverlayType?.POLYGON

  return (
    <Box className={styles.drawingControlsContainer}>
      <Tooltip title={t('operationBar.draw.circle')}>
        <IconButton
          size="small"
          color={circleSelected ? 'primary' : 'default'}
          onClick={toggleCircle}
          className={styles.createCircleButton}
          disabled={disabled}
        >
          <BasicGeozoneRadius />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('operationBar.draw.polygon')}>
        <IconButton size="small" color={polygonSelected ? 'primary' : 'default'} onClick={togglePolygon} disabled={disabled}>
          <BasicGeozoneShape />
        </IconButton>
      </Tooltip>
    </Box>
  )
})

export default DrawingControls
