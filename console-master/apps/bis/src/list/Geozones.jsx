import React, { memo, useContext, useMemo } from 'react'

import { Context as MapContext } from '../googleMaps/Map'
import { Context as GeozoneContext } from '../providers/GeozoneListProvider'
import CircleZone from '../views/geozones/shapes/CircleZone'
import PolygonZone from '../views/geozones/shapes/PolygonZone'

const Geozones = memo(() => {
  const context = useContext(GeozoneContext)
  const { map } = useContext(MapContext)
  const zoom = map ? map.zoom : 1

  const render = useMemo(() => {
    const { data } = context
    if (!data) {
      return null
    }

    return data.map(zone => {
      const id = zone.id
      switch (zone.geometry.type) {
        case 'Polygon':
          return <PolygonZone key={`geozone-${id}`} zone={zone} zoom={zoom} background />
        case 'Circle':
          return <CircleZone key={`geozone-${id}`} zone={zone} zoom={zoom} background />
        default:
          return null
      }
    })
  }, [context, zoom])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{render}</>
})

Geozones.displayName = 'Geozones'

Geozones.propTypes = {}

export default Geozones
