import type React from 'react'
import { memo, useEffect, useMemo, useRef } from 'react'

import { useGoogleMapContext } from '../../GoogleMaps'
import type { GeozoneShape, ShapeGeozoneOptions } from '../model'
import { GeozoneType } from '../model'

export interface ShapeProps {
  type: GeozoneType
  options: ShapeGeozoneOptions
  strokeOutside?: boolean
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onClick?: () => void
}

export const Shape: React.FC<ShapeProps> = memo(({ type, options, strokeOutside, onHoverStart, onHoverEnd, onClick }) => {
  const { google, map } = useGoogleMapContext()
  const shape = useRef<GeozoneShape>()

  const shapeOptions = useMemo(
    () => ({
      ...options,
      strokePosition: strokeOutside ? google.maps.StrokePosition.OUTSIDE : google.maps.StrokePosition.CENTER,
      strokeWeight: 1,
    }),
    [google, options, strokeOutside],
  )

  useEffect(() => {
    if (!shape.current) {
      const options = { ...shapeOptions, map }
      shape.current = type === GeozoneType.Circle ? new google.maps.Circle(options) : new google.maps.Polygon(options)
    } else {
      shape.current.setOptions(shapeOptions)
      shape.current.setMap(map)
    }

    return () => {
      if (shape.current) {
        shape.current.setMap(null)
      }
    }
  }, [google, map, shapeOptions, type])

  useEffect(() => {
    if (shape.current) {
      if (onHoverStart) {
        google.maps.event.addListener(shape.current, 'mouseover', onHoverStart)
      }
      if (onHoverEnd) {
        google.maps.event.addListener(shape.current, 'mouseout', onHoverEnd)
      }
      if (onClick) {
        google.maps.event.addListener(shape.current, 'click', onClick)
      }
    }

    return () => {
      if (shape.current) {
        google.maps.event.clearInstanceListeners(shape.current)
      }
    }
  }, [google, onClick, onHoverStart, onHoverEnd])

  return null
})
