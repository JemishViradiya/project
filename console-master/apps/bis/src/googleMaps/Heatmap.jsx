import React, { memo, useContext, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import useClientParams from '../components/hooks/useClientParams'
import { HeatmapClusterIcon } from '../components/map/MapIcon'
import RectangleMapMarker from '../components/map/RectangleMapMarker'
import shorten from '../components/util/shorten'
import MapContext from './Context'
import { encode, getBounds } from './geohash'
import { default as Marker } from './Marker'
import { getMetersPerPixel, getPrecision } from './util'

const geohashPrecisionMeters = {
  1: 5001000, // 5009.4 km x 4992.6 km
  2: 1252300, // 1252.3 km x 624.1 km
  3: 156500, // 156.5 km x 156 km
  4: 39100, // 39.1 km x 19.5 km
  5: 4900, // 4.9 km x 4.9 km
  6: 1200, // 1.2 km x 609.4 m
}

const getWeight = cluster => {
  return cluster.count
}

const showIcon = true

const defaultGradient = [
  'rgba(0,0,0,0)',
  'rgba(0,0,0,0.6)',
  'rgba(0,0,0,0.65)',
  'rgba(0,0,0,0.7)',
  'rgba(0,0,0,0.75)',
  'rgba(0,0,0,0.8)',
  'rgba(0,0,0,0.85)',
  'rgba(0,0,0,0.9)',
  'rgba(0,0,0,0.95)',
  'rgba(0,0,0,1)',
]

const RectHeatmap = memo(({ data, zoom, ...rest }) => {
  const { mode, maxPrecision = 5 } = useClientParams('privacyMode') || {}
  const { map } = useContext(MapContext)
  const hideBounds = zoom <= 5 || zoom === 7 || zoom === 10
  const precision = map ? getPrecision(maxPrecision, map.zoom) : undefined
  return data.map(cluster => {
    const geoBounds = hideBounds
      ? undefined
      : cluster.geohash
      ? getBounds(cluster.geohash)
      : getBounds(encode(cluster.lat, cluster.lon, precision))
    return (
      <RectangleMapMarker
        key={`rectangle-marker:${cluster.geohash}`}
        cluster={cluster}
        geoBounds={geoBounds}
        {...rest}
        privacyModeOn={mode}
      />
    )
  })
})
RectHeatmap.displayName = 'RectHeatmap'

const Heatmap = ({ data }) => {
  const heatmap = useRef()
  const { t } = useTranslation()
  const { google, map } = useContext(MapContext)
  const { maxPrecision = 5 } = useClientParams('privacyMode') || {}
  const points = useMemo(() => {
    return data.map(cluster => {
      return {
        location: new google.maps.LatLng(cluster.lat, cluster.lon),
        weight: getWeight(cluster),
      }
    })
  }, [data, google.maps.LatLng])

  useEffect(() => {
    if (!heatmap.current) {
      heatmap.current = new google.maps.visualization.HeatmapLayer({
        data: points,
        map,
        gradient: defaultGradient,
        // opacity: 1,
        // maxIntensity: 100,
      })
    } else {
      heatmap.current.setData(points)
      if (heatmap.current.getMap() !== map) {
        heatmap.current.setMap(map)
      }
    }
  }, [google.maps.visualization.HeatmapLayer, map, points])

  useEffect(
    () => () => {
      if (heatmap.current) {
        heatmap.current.setMap(null)
      }
    },
    [],
  )

  const mapZoom = map && map.zoom
  useEffect(() => {
    if (heatmap.current && map) {
      // Mirrored on server
      const precision = getPrecision(maxPrecision, mapZoom)
      let geohashMeters = geohashPrecisionMeters[precision]
      if (!geohashMeters) {
        if (precision < 1) {
          geohashMeters = geohashPrecisionMeters[1]
        } else {
          geohashMeters = geohashPrecisionMeters[maxPrecision]
        }
      }
      const metersPerPixel = getMetersPerPixel(map.getCenter().lat(), mapZoom)
      console.log(`Zoom: ${mapZoom}, radius: ${geohashMeters / metersPerPixel}`)
      heatmap.current.setOptions({ radius: geohashMeters / metersPerPixel })
    }
  }, [heatmap, mapZoom, map, data, maxPrecision])

  const theme = useTheme()
  const markers = useMemo(() => {
    return data.map((cluster, i) => {
      const icon = HeatmapClusterIcon({
        color: '#fff',
        count: cluster.count,
        formattedCount: shorten(cluster.count, t),
        theme,
      })
      const position = { lat: cluster.lat, lng: cluster.lon }
      return (
        <Marker
          key={`heatmap-marker:${i}`}
          icon={icon}
          position={position}
          zIndexOffset={theme.zIndex.bis.mapMarker.normal}
          zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
        />
      )
    })
  }, [data, theme, t])

  if (showIcon) {
    return markers
  } else {
    return null
  }
}

Heatmap.displayName = 'Heatmap'
export default RectHeatmap
