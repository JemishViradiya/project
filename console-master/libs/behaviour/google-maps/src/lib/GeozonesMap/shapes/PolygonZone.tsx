import isEqual from 'lodash-es/isEqual'
import { memo, useMemo } from 'react'

import type { PolygonalGeozoneEntity } from '../model'
import { Bounds } from '../model'
import { getMetersPerPixel } from '../utils/util'
import type { ZoneOptions } from './Zone'
import Zone from './Zone'

const pick = ({ zone: { id, geometry }, zoom }: ZoneOptions) => ({
  id,
  ...('coordinates' in geometry && { coordinates: geometry.coordinates }),
  zoom,
})

const PolygonZone: React.FC<ZoneOptions> = memo(
  ({ zone, zoom }) => {
    const {
      geometry: { coordinates },
    } = zone as PolygonalGeozoneEntity
    const bounds = useMemo(() => {
      const bounds = new Bounds()
      let top = { lat: -90, lng: 0 }
      let bottom = { lat: 90, lng: 0 }
      coordinates.forEach(coord => {
        const point = { lat: coord.lat, lng: coord.lng }
        bounds.extend(point)
        if (coord[0] > top.lat) {
          top = point
        }
        if (coord[0] < bottom.lat) {
          bottom = point
        }
      })
      return {
        center: bounds.getCenter(),
        width: bounds.getWidthMeters(),
        height: bounds.getHeightMeters(),
        topCenter: {
          lat: () => top.lat,
          lng: () => top.lng,
        },
        bottomCenter: {
          lat: () => bottom.lat,
          lng: () => bottom.lng,
        },
      }
    }, [coordinates])

    const useIcon = useMemo(() => {
      const metersPerPixel = getMetersPerPixel(bounds.center.lat(), zoom)
      return bounds.width / metersPerPixel <= 24 || bounds.height / metersPerPixel <= 24
    }, [bounds, zoom])

    return Zone({
      zone,
      markerPosition: bounds.center,
      useIcon,
      zoom,
    })
  },
  (prev, next) => {
    return isEqual(pick(prev), pick(next))
  },
)

export default PolygonZone
