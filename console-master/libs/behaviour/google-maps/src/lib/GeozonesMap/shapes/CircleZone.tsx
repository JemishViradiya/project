import isEqual from 'lodash-es/isEqual'
import { memo, useMemo } from 'react'

import type { PositionFunc } from '../../GoogleMaps'
import type { CircularGeozoneEntity } from '../model'
import { getMetersPerPixel } from '../utils/util'
import type { ZoneOptions } from './Zone'
import Zone from './Zone'

const pick = ({ zone: { id, geometry }, zoom }: ZoneOptions) => ({
  id,
  ...('center' in geometry && { lat: geometry.center.lat, lng: geometry.center.lng }),
  ...('radius' in geometry && { radius: geometry.radius }),
  zoom,
})

const CircleZone: React.FC<ZoneOptions> = memo(
  ({ zone, zoom }) => {
    const {
      geometry: {
        center: { lat, lng },
        radius,
      },
    } = zone as CircularGeozoneEntity
    const useIcon = useMemo(() => {
      const metersPerPixel = getMetersPerPixel(lat, zoom)
      // See https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
      const pixelDiameter = (2 * radius) / metersPerPixel
      return pixelDiameter <= 24
    }, [lat, zoom, radius])

    const markerPosition = useMemo<PositionFunc>(
      () => ({
        lat: () => lat,
        lng: () => lng,
      }),
      [lat, lng],
    )

    return Zone({
      zone,
      markerPosition,
      useIcon,
      zoom,
    })
  },
  (prev, next) => {
    return isEqual(pick(prev), pick(next))
  },
)

export default CircleZone
