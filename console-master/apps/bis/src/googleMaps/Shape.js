import PropTypes from 'prop-types'
import { useContext, useEffect, useMemo, useRef } from 'react'

import { useTheme } from '@material-ui/core/styles'

import MapContext from './Context'

const cleanupListener = (google, listener) => {
  if (google && listener) {
    google.maps.event.removeListener(listener)
  }
}

const useEventListener = (google, shape, event, prop, ref) => {
  useEffect(() => {
    if (shape.current && prop) {
      ref.current = shape.current.addListener(event, prop)
    }
    return () => {
      cleanupListener(google, ref.current)
    }
  }, [google, prop, shape, ref, event])
}

const Shape = ({ options, strokeOutside, onHoverStart, onHoverEnd, onClick }, shapeType) => {
  const shape = useRef()
  const hoverStart = useRef()
  const hoverEnd = useRef()
  const click = useRef()
  const { google, map } = useContext(MapContext)
  const {
    custom: { bisMap: mapTheme },
  } = useTheme()

  const shapeOptions = useMemo(() => {
    if (!google) {
      return options
    }

    return {
      ...options,
      strokePosition: strokeOutside ? google.maps.StrokePosition.OUTSIDE : google.maps.StrokePosition.CENTER,
      strokeWeight: mapTheme.geozone.strokeWeight,
    }
  }, [google, options, strokeOutside, mapTheme.geozone.strokeWeight])

  useEffect(() => {
    if (google) {
      if (!shape.current) {
        shape.current = new google.maps[shapeType]({ ...shapeOptions, map })
      } else {
        shape.current.setOptions(shapeOptions)
        shape.current.setMap(map)
      }
    }

    return () => {
      if (shape.current) {
        shape.current.setMap(null)
      }
    }
  }, [google, map, shapeOptions, shapeType])

  useEventListener(google, shape, 'mouseover', onHoverStart, hoverStart)
  useEventListener(google, shape, 'mouseout', onHoverEnd, hoverEnd)
  useEventListener(google, shape, 'click', onClick, click)

  return null
}

export const ShapePropTypes = {
  options: PropTypes.object.isRequired,
  strokeOutside: PropTypes.bool,
  onHoverStart: PropTypes.func,
  onHoverEnd: PropTypes.func,
  onClick: PropTypes.func,
}

export default Shape
