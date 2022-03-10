import React, { memo } from 'react'

import type { GeozoneEntity } from './model'
import { GeozoneType } from './model'
import CircleZone from './shapes/CircleZone'
import PolygonZone from './shapes/PolygonZone'

interface ZonesOverlayProps {
  zoomLevel: number
  zones: GeozoneEntity[]
}

const ZonesOverlay: React.FC<ZonesOverlayProps> = memo(({ zoomLevel, zones }) => {
  return (
    <>
      {zones.map(zone => {
        const { id } = zone
        const commonProps = {
          key: id,
          zone,
          zoom: zoomLevel,
        }

        if (zone.type === GeozoneType.Circle) {
          return <CircleZone {...commonProps} />
        } else {
          return <PolygonZone {...commonProps} />
        }
      })}
    </>
  )
})

export default ZonesOverlay
