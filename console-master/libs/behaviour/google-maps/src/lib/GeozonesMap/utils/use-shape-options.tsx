import { useMemo } from 'react'

import type { CircularGeozoneGeometry, CircularGeozoneOptions, PolygonalGeozoneGeometry, PolygonalGeozoneOptions } from '../model'
import { GeozoneType } from '../model'
import { useShapeStyle } from './use-shape-style'

export const useShapeOptions = (
  geometry: CircularGeozoneGeometry | PolygonalGeozoneGeometry,
  type: GeozoneType,
  highlighted?: boolean,
): CircularGeozoneOptions | PolygonalGeozoneOptions => {
  const shapeStyle = useShapeStyle()
  return useMemo(() => {
    const commonOptions = {
      clickable: !highlighted,
      ...shapeStyle,
    }

    return type === GeozoneType.Circle
      ? ({
          ...(geometry ?? {}),
          ...commonOptions,
        } as CircularGeozoneOptions)
      : ({
          paths: [...((geometry as PolygonalGeozoneGeometry)?.coordinates ?? [])],
          ...commonOptions,
        } as PolygonalGeozoneOptions)
  }, [highlighted, shapeStyle, type, geometry])
}
