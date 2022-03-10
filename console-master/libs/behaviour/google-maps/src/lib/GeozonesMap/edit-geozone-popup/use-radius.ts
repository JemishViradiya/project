import { useCallback, useEffect, useRef, useState } from 'react'

import type { GeozoneShape, GeozoneUnit } from '../model'
import { convertDistanceToMetres } from '../utils/util'

const fixRadius = (radius: number) => parseFloat(radius.toFixed(2))

const setDefaultRadius = (radius: number) => (radius ? fixRadius(radius) : 0)

export const useRadius = (initialRadius: number, shape: GeozoneShape, unit: GeozoneUnit) => {
  // Radius will always be the value shown in the input field. However, the shape radius is always in metres.
  const [radius, setRadiusState] = useState(setDefaultRadius(initialRadius))
  const [radiusError, setRadiusError] = useState<boolean>(false)
  const ignoreRadiusCallback = useRef(false)

  useEffect(() => {
    setRadiusState(setDefaultRadius(initialRadius))
    setRadiusError(false)
  }, [initialRadius])

  const setRadius = useCallback((radius: number) => setRadiusState(fixRadius(radius)), [])

  const onRadiusChange = useCallback(
    e => {
      const circle = shape as google.maps.Circle
      const radius = parseFloat(e.target.value)
      if (radius > 0) {
        setRadius(radius)
        setRadiusError(false)
        ignoreRadiusCallback.current = true
        circle.setRadius(convertDistanceToMetres(radius, unit))
      } else {
        setRadius(e.target.value)
        setRadiusError(true)
      }
    },
    [unit, setRadius, setRadiusError, shape],
  )

  return [radius, radiusError, onRadiusChange, setRadius, ignoreRadiusCallback] as const
}
