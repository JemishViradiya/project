import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Portal } from 'react-portal'

import { useTheme } from '@material-ui/core/styles'

import useClientParams from '../components/hooks/useClientParams'
import useRafDebounceCallback from '../components/hooks/useRafDebounceCallback'
import { environment } from '../environments/environment'
import { autoZoomAdjuster } from '../list/MapUtils'
import ApiContext from './Context'
import { useGoogle } from './loadGoogleApi'
import styles from './Map.module.less'
import Controls from './MapControls'
import { Provider as MapTypeProvider } from './MapType'
import { darkTheme, lightTheme } from './theme'
import { Bounds, centerBoundsAdjuster, getViewport } from './util'

const mapConfig = environment.map
const MIN_MAP_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.minAutoZoom) || 2
const forceTopDownMapViewForAllZoomLevels = 0

const controlOptions = {
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: true,
  streetViewControl: false,
  rotateControl: false,
}

const defaultPadding = {
  top: 90,
  right: 40,
  bottom: 90,
  left: 40,
}

const isInBounds = (map, latLng) => {
  if (map) {
    const bounds = map.getBounds()
    if (bounds) {
      return bounds.contains(latLng)
    }
  }
  return false
}

// const isViewportEqual = (a, b) => {
//   if (!a && !b) {
//     return true
//   } else if (!a || !b) {
//     return false
//   }
//   return a.zoom === b.zoom && a.center.lat === b.center.lat && a.center.lng === b.center.lng
// }

const callViewportChangedWithBounds = (map, current) => {
  const { onViewportChanged } = current
  if (!onViewportChanged || !map) {
    return
  }
  const viewport = getViewport(map)
  const bounds = map.getBounds()
  if (bounds) {
    const areBoundsEqual = bounds.equals(current.bounds)
    if (!areBoundsEqual) {
      current.bounds = bounds
    }
    // bounds will be null if the map isn't initialized, or center or zoom isn't set
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    current.boundingBox = {
      top_left: { lat: ne.lat(), lon: sw.lng() },
      bottom_right: { lat: sw.lat(), lon: ne.lng() },
    }
    onViewportChanged(viewport, current.boundingBox)
  }
}

const zoomToBounds = (map, { bounds, padding = defaultPadding, zoom = map.maxZoom, center }, current) => {
  if (!map || !bounds) {
    return null
  }
  if (bounds.top_left) {
    const {
      top_left: { lat: north, lon: west },
      bottom_right: { lat: south, lon: east },
    } = bounds
    bounds = { north, south, east, west }
  } else if (bounds instanceof Bounds) {
    const { north, south, east, west } = bounds
    bounds = { north, south, east, west }
  }

  if (map.zoom !== zoom) {
    // fitBounds() internally sets center first which may hit bounds
    // restriction zone. So, we set zoom level first to workaround this issue
    // for now.
    // (refer to google issue: https://issuetracker.google.com/issues/124546317)
    map.setZoom(zoom)
  }
  map.panToBounds(bounds, padding)
  if (center.latLng && !map.getCenter().equals(center.latLng)) {
    map.setCenter(center)
  }
  current.bounds = map.getBounds()
}

// we use this to communicate google-api specific information to descendants
export const Context = ApiContext
const { Provider, Consumer } = Context
const defaultViewport = { center: { lat: 0, lng: 0 }, zoom: 1 }

export const useMapContext = () => useContext(Context)

// eslint-disable-next-line sonarjs/cognitive-complexity
const Map = memo(props => {
  const {
    children,
    fullSize,
    width,
    height,
    maxZoom,
    noControls,
    noMapRiskType,
    noZoomButtons,
    noStreetView,
    notDraggable,
    gestureHandling,
    leftBottomNode,
    viewport,
    onViewportChanged,
  } = props
  // our google-api-aware descendants want to know this...
  const { privacyMode: { mode: notNormalizedMode = true } = {} } = useClientParams() || {}
  let mode = notNormalizedMode
  if (notNormalizedMode.mode !== undefined) {
    mode = notNormalizedMode.mode
  }
  const theme = useTheme()
  const {
    palette,
    custom: { bisMap: mapTheme },
  } = theme
  const isDarkTheme = palette.muiPaletteType === 'dark'
  const google = useGoogle()
  const mapRef = useRef()
  const controlsDiv = useRef()
  if (!controlsDiv.current) {
    // make an element to act as a react portal
    controlsDiv.current = document.createElement('div')
  }
  const leftBottomDiv = useRef()
  if (!leftBottomDiv.current) {
    // add a custom control at left bottom
    leftBottomDiv.current = document.createElement('div')
  }
  const [map, setState] = useState()
  const [zoomLevel, setZoomLevel] = useState()
  const locals = useRef({
    noControls,
    gestureHandling,
    privacyMode: mode,
    viewportProp: viewport,
    viewport: viewport || defaultViewport,
    maxZoom,
  })
  locals.current.onViewportChanged = onViewportChanged
  locals.current.map = map
  locals.current.viewportProp = viewport

  const callViewportChanged = useCallback(
    (map, current) => {
      callViewportChangedWithBounds(map, current)
      setZoomLevel(map.getZoom())
    },
    [setZoomLevel],
  )
  const onChange = useRafDebounceCallback(callViewportChanged, [])
  const changeListener = useCallback(() => onChange(locals.current.map, locals.current), [onChange])
  const GoogleMap = google && google.maps && google.maps.Map
  useEffect(() => {
    const current = { ...locals.current }
    locals.current = current
    const div = mapRef.current
    if (!google || !GoogleMap || !div) return

    const { noControls, gestureHandling, viewport } = current

    // change provided additional controls/options as requested...
    const adjustOptions = {
      streetViewControl: !noControls && !locals.current.privacyMode,
      draggableCursor: noControls ? 'pointer' : null,
    }
    if (gestureHandling) adjustOptions.gestureHandling = gestureHandling

    const options = {
      minZoom: MIN_MAP_ZOOM,
      maxZoom: locals.current.maxZoom,
      restriction: {
        latLngBounds: {
          // Google Maps does not have imagery above or below 85 degrees, so we don't
          // let the user see them either. That means that events in those regions
          // will not be visible on the map.
          north: 85,
          south: -85,
          west: -180,
          east: 180,
        },
        strictBounds: true,
      },
      ...controlOptions,
      ...adjustOptions,
      ...viewport,
      styles: isDarkTheme ? darkTheme : lightTheme,
      backgroundColor: palette.background.paper2,
      controlSize: mapTheme.controlSize,
      fullscreenControl: mapTheme.fullscreenControl,
    }

    const map = new GoogleMap(div, options)
    map.zoomToClusterBounds = cluster => {
      const { width, height } = map.getDiv().getBoundingClientRect()
      const params = autoZoomAdjuster(cluster, map, width, height, locals.current.maxZoom)
      if (params) {
        const { bounds, zoom } = params
        console.log(`Map: auto-zoom to bounds@${zoom}`, bounds)
        zoomToBounds(map, params, current)
      }
    }
    map.zoomToFixedBounds = (bounds, zoom, center) => {
      console.log(`Map: zoom to fixed bounds@${zoom}`, bounds)
      zoomToBounds(map, { bounds, zoom, center }, current)
    }
    map.panToCenter = (center, maxZoom, force) => {
      if (force || !isInBounds(map, center)) {
        const { width, height } = map.getDiv().getBoundingClientRect()
        const params = centerBoundsAdjuster(map, center, width, height, maxZoom)
        console.log('Map: pan to center', params)
        zoomToBounds(map, params, current)
      }
    }

    const zoomListenerId = map.addListener('zoom_changed', changeListener)
    const centerListenerId = map.addListener('center_changed', changeListener)

    // put our custom controls into the map
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlsDiv.current)
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(leftBottomDiv.current)
    map.setTilt(forceTopDownMapViewForAllZoomLevels)
    setState(map)

    return () => {
      google.maps.event.removeListener(zoomListenerId)
      google.maps.event.removeListener(centerListenerId)
    }
  }, [
    changeListener,
    google,
    GoogleMap,
    locals,
    isDarkTheme,
    palette.background.paper2,
    mapTheme.controlSize,
    mapTheme.fullscreenControl,
  ])

  useMemo(() => {
    if (!map) return
    const opts = {}
    // If privacy mode is enabled then don't show street view otherwise check other properties

    const streetViewControl = mode ? false : !noControls && !noStreetView
    if (map.streetViewControl !== streetViewControl) {
      opts.streetViewControl = streetViewControl
    }
    const draggableCursor = noControls || notDraggable ? 'pointer' : null
    if (map.draggableCursor !== draggableCursor) {
      opts.draggableCursor = draggableCursor
    }
    if (locals.current.gestureHandling !== gestureHandling) {
      opts.gestureHandling = gestureHandling
      locals.current.gestureHandling = gestureHandling
    }
    map.setOptions(opts)
  }, [map, noControls, noStreetView, mode, notDraggable, gestureHandling])

  const style = useMemo(() => {
    const style = { width: '100%', height: '100%' }
    if (width) {
      style.width = `${width}px`
    }
    if (height) {
      style.height = `${height}px`
    }
    return style
  }, [width, height])

  useLayoutEffect(() => {
    if (map && viewport) {
      const { center: viewportCenter, zoom: viewportZoom } = viewport
      if (viewportCenter.lat || viewportCenter.lon) {
        const zoom = Math.max(viewportZoom, MIN_MAP_ZOOM)
        if (map.zoom !== zoom) {
          console.log('Map: apply viewport prop zoom', viewportZoom)
          map.setZoom(zoom)
        }
        const center = map.center?.toJSON() ?? {} // don't crash the component in this case if we use mocked version without valid api key
        if (center.lat !== viewport.center.lat || center.lon !== viewport.center.lon) {
          console.log('Map: apply viewport prop center', viewportCenter)
          map.setCenter(viewport.center)
        }
      }
    }
  }, [map, viewport])

  const value = useMemo(() => ({ google, map }), [google, map])
  return (
    <>
      <div id="map" role="application" ref={mapRef} style={style} className={fullSize ? styles.FullSize : styles.Normal} />
      <Provider value={value}>
        <MapTypeProvider map={map}>
          {children}
          {leftBottomNode ? <Portal node={leftBottomDiv.current}>{React.cloneElement(leftBottomNode)}</Portal> : null}
          {noControls ? null : (
            <Portal node={controlsDiv.current}>
              <Controls mapRef={map} noZoomButtons={noZoomButtons} noMapRiskType={noMapRiskType} zoomLevel={zoomLevel} />
            </Portal>
          )}
        </MapTypeProvider>
      </Provider>
    </>
  )
})

Map.Consumer = Consumer
// we provide this for any child components that want to augment the map context.
// okay, just for "Marker", which wants to add itself to the context for its "Popup" children
Map.Provider = Provider

Map.displayName = 'Map'
Map.propTypes = {
  viewport: PropTypes.shape({
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
    zoom: PropTypes.number.isRequired,
  }),
  maxZoom: PropTypes.number,
  onViewportChanged: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  fullSize: PropTypes.bool,
  noControls: PropTypes.bool,
  gestureHandling: PropTypes.string,
  children: PropTypes.node,
  leftBottomNode: PropTypes.node,
}

export default Map
