import PropTypes from 'prop-types'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'

import { EventFiltersQuery } from '@ues-data/bis'

import useClientParams from '../components/hooks/useClientParams'
import { MapChartClusterIcon } from '../components/map/MapIcon'
import { RiskLevel } from '../components/RiskLevel'
import UnknownLocation from '../components/UnknownLocation'
import shorten from '../components/util/shorten'
import Heatmap from '../googleMaps/Heatmap'
import Map from '../googleMaps/Map'
import { default as Marker } from '../googleMaps/Marker'
import { Bounds, getBoundsZoomLevel } from '../googleMaps/util'
import mergeClusters from '../list/mergeClusters'
import { GeoclusterProvider } from '../providers/GeoclusterProvider'
import MapOptionsProvider from '../providers/MapOptionsProvider'
import { Context as StateProviderContext } from '../providers/StateProvider'

const dataAccessor = data => {
  const unknown = data.eventFilters?.find(item => item.key === RiskLevel.UNKNOWN_LOC)
  return unknown ? unknown.count : 0
}

const DashboardMapMarker = ({ position, count, critical, high, medium, low }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [hover, setHover] = useState(false)
  const formattedCount = shorten(count, t)
  const icon = MapChartClusterIcon({
    color: RiskLevel.colorOfHighestRisk(theme, critical, high, medium, low),
    count,
    formattedCount,
    hover,
    theme,
  })
  const onHover = useCallback(hovered => setHover(hovered), [setHover])
  return (
    <Marker
      icon={icon}
      position={position}
      zIndexOffset={hover ? theme.zIndex.bis.mapMarker.hovered : theme.zIndex.bis.mapMarker.normal}
      zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
      onHover={onHover}
    />
  )
}

const DashboardMap = ({ width, height, leftBottomNode }) => {
  const context = useContext(GeoclusterProvider.Context)
  const { privacyMode: { mode: privacyMode = true } = {} } = useClientParams() || {}

  let geoClusters = { count: 0, data: [] }
  if (context && context.data && context.data.geoClusters) {
    geoClusters = context.data.geoClusters
  }

  const bounds = useMemo(() => {
    let bounds
    if (geoClusters.data.length > 0) {
      bounds = new Bounds()
      geoClusters.data.forEach(({ lat, lon }) => {
        const position = { lat, lng: lon }
        bounds.extend(position)
      })
    }
    return bounds
  }, [geoClusters.data])

  const viewport = useMemo(() => {
    const viewport = {
      // the default
      center: { lat: 0, lng: 0 },
      zoom: 1,
    }

    if (bounds) {
      const c = bounds.getCenter()
      viewport.center = { lat: c.lat(), lng: c.lng() }
      const boundsZoom = getBoundsZoomLevel(bounds, { width, height })
      viewport.zoom = Math.min(4, Math.max(1, boundsZoom))
    }

    return viewport
  }, [bounds, width, height])

  const markers = useMemo(() => {
    if (geoClusters.data.length > 0) {
      if (privacyMode) {
        return <Heatmap data={geoClusters.data} zoom={viewport.zoom} />
      } else {
        let clusters = geoClusters.data
        try {
          clusters = mergeClusters(clusters, viewport.zoom)
        } catch (err) {
          // FIXME: Report to Stanley
          console.error(`Failed to merge clusters: ${err.message}`)
        }
        return clusters.map(({ lat, lon, ...others }, i) => {
          const key = `event-loc:${i}`
          const position = { lat, lng: lon }
          return <DashboardMapMarker key={key} position={position} {...others} />
        })
      }
    }
  }, [geoClusters.data, privacyMode, viewport.zoom])

  return (
    <Map
      key="map"
      width={width}
      height={height}
      viewport={viewport}
      gestureHandling="none"
      leftBottomNode={leftBottomNode}
      noZoomButtons
      notDraggable
      noStreetView
      noControls={false}
    >
      {markers}
    </Map>
  )
}

const MapChart = ({ width, height }) => {
  const { currentTimePeriod: range } = useContext(StateProviderContext)
  const [mapOptions] = useContext(MapOptionsProvider.Context)
  const renderUnknownLocation = useMemo(() => {
    const variables = {
      range,
      type: RiskLevel.LocationOptions.field,
    }
    return <UnknownLocation query={EventFiltersQuery} variables={variables} dataAccessor={dataAccessor} />
  }, [range])

  if (!height || !width) return null
  return (
    <GeoclusterProvider variables={{ range, riskTypes: [...mapOptions.riskTypes] }}>
      <DashboardMap width={width} height={height} leftBottomNode={renderUnknownLocation} />
    </GeoclusterProvider>
  )
}

MapChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
}

MapChart.displayName = 'MapChart'
export default MapChart
