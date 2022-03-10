import React from 'react'

export type {
  GeozoneEntity,
  PolygonalGeozoneEntity,
  CircularGeozoneEntity,
  CircularGeozoneGeometry,
  PolygonalGeozoneGeometry,
} from './lib/GeozonesMap/model'
export { GeozoneUnit, GeozoneType } from './lib/GeozonesMap/model'
export { useGoogleMapsApi } from './lib/GoogleMaps/MapApi/useGoogleMapsApi'
export {
  CoordinatedDataSelectionProvider,
  useCoordinatedDataSelectionContext,
} from './lib/GeozonesMap/CoordinatedDataSelectionProvider'
export type { Position } from './lib/GoogleMaps'
export { useGoogleMapContext, mapConfig } from './lib/GoogleMaps'

export const GeozonesMap = React.lazy(() => import('./lib/GeozonesMap/GeozonesMap'))
export { getZoneSize } from './lib/GeozonesMap/utils/util'

export const BasicMap = React.lazy(() => import('./lib/BasicMap/BasicMap'))
