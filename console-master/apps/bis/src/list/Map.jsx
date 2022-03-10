import isEqual from 'lodash-es/isEqual'
import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useMemo, useRef } from 'react'

import { NetworkStatus } from '@apollo/client'

import { useStatefulApolloQuery } from '@ues-data/shared'

import useClientParams from '../components/hooks/useClientParams'
import useDebounceCallback from '../components/hooks/useDebounceCallback'
import { environment } from '../environments/environment'
import MapContext from '../googleMaps/Context'
import ViewportMap from '../googleMaps/Map'
import GeozoneListProvider from '../providers/GeozoneListProvider'
import MapOptionsProvider from '../providers/MapOptionsProvider'
import Geozones from './Geozones'
import MapMarkers from './MapMarkers'
import { Context as MapSplitterContext } from './MapSplitterContext'
import { isEqualBounds, markerBounds } from './MapUtils'

const mapConfig = environment.map
const MIN_MAP_ZOOM = (mapConfig && mapConfig.zoom && mapConfig.zoom.minAutoZoom) || 2
const mapWrapperStyle = { height: '100%' }

const promiseTimeout = timeout => new Promise(resolve => setTimeout(resolve, timeout))
const handleBoundsChange = (boundsRef, clusterQuery, mapView, bounds, zoomChanged, needAutoView) => {
  if (!isEqualBounds(bounds, boundsRef.current.map) || zoomChanged || needAutoView) {
    // console.log('handleBoundsChange()', JSON.stringify([bounds, true]))
    boundsRef.current = {
      map: bounds,
      markers: markerBounds(bounds),
    }
    if (!isEqualBounds(clusterQuery.current.newVariables.geoBounds, boundsRef.current.markers) || zoomChanged || needAutoView) {
      const newVariables = {
        ...clusterQuery.current.newVariables,
        zoomLevel: mapView.current.zoom || MIN_MAP_ZOOM,
        geoBounds: boundsRef.current.markers,
      }
      clusterQuery.current.newVariables = newVariables
      clusterQuery.current.pending = true
      // console.log('Map: refetch with new bounds', JSON.stringify([boundsRef.current.map, mapView.current.zoom]))
      clusterQuery.current
        .refetch(newVariables)
        .catch(() => undefined)
        .then(() => promiseTimeout(200))
        .then(() => {
          clusterQuery.current.pending = false
          const ns = clusterQuery.current.networkStatus
          if (ns < NetworkStatus.ready) {
            return
          }
          const pending = clusterQuery.current.pendingBounds
          if (pending) {
            handleBoundsChange(boundsRef, clusterQuery, mapView, pending)
          }
        })
    }
  }
}

const PanToSelection = memo(({ selectedEvent }) => {
  const { map } = useContext(MapContext)
  const selectedEventId = useRef()
  return useMemo(() => {
    if (selectedEvent && selectedEventId.current !== selectedEvent.id && selectedEvent.assessment.location) {
      selectedEventId.current = selectedEvent.id
      const center = { lat: selectedEvent.assessment.location.lat, lng: selectedEvent.assessment.location.lon }
      if (map) {
        map.panToCenter(center)
      }
    }
    return null
  }, [selectedEvent, map])
})

const noop = data => data

export const getMapViewStorageId = name => `${name}.mapView`

// eslint-disable-next-line sonarjs/cognitive-complexity
const Map = memo(props => {
  const {
    dataAccessor = noop,
    id,
    query,
    variables,
    autoZoomCount = 0,
    autoView,
    leftBottomNode,
    markerType = 'event',
    selectedEvent,
    onEventSelected,
  } = props
  const mapView = useRef({
    center: { lat: 0, lng: 0 },
    zoom: MIN_MAP_ZOOM,
  })
  const { getWidth } = useContext(MapSplitterContext)
  const { privacyMode: { mode: privacyMode = true, maxZoom = 10 } = {} } = useClientParams() || {}

  const clusterQuery = useRef({ networkStatus: NetworkStatus.loading })
  const boundsRef = useRef({})
  const needAutoView = useRef(false)
  const autoViewRef = useRef()
  if (autoView && (!autoViewRef.current || !isEqual(autoViewRef.current, autoView))) {
    autoViewRef.current = autoView
    needAutoView.current = true
  }

  const storageId = useMemo(() => getMapViewStorageId(id), [id])
  const onViewportChanged = useDebounceCallback(
    (viewport, bounds) => {
      console.log('onViewportChanged', viewport, bounds)
      if (bounds.top_left.lon === 0 && bounds.bottom_right.lon === 0) {
        return
      }
      sessionStorage.setItem(storageId, JSON.stringify({ viewport, bounds }))
      const zoomChanged = viewport.zoom !== mapView.current.zoom
      mapView.current = viewport
      const cq = clusterQuery.current
      if (!cq.pending && (cq.networkStatus >= NetworkStatus.ready || cq.networkStatus === NetworkStatus.loading)) {
        handleBoundsChange(boundsRef, clusterQuery, mapView, bounds, zoomChanged, needAutoView.current)
      } else {
        cq.pendingBounds = bounds
      }
    },
    300,
    [],
  )
  const zoomCount = useRef()
  if (!zoomCount.current) {
    zoomCount.current = { prop: autoZoomCount, state: -1 }
  } else {
    zoomCount.current.prop = autoZoomCount
  }

  const renderMap = useCallback(
    ({ loading, data = [], networkStatus, refetch }) => {
      const cq = clusterQuery.current
      const previousNetworkStatus = cq.networkStatus
      cq.networkStatus = networkStatus
      cq.refetch = refetch

      const width = getWidth()
      if (width === undefined) {
        cq.networkStatus = previousNetworkStatus
        return null
      }

      let autoZoom = false
      const zc = zoomCount.current
      if (networkStatus >= NetworkStatus.ready) {
        autoZoom = zc.state !== zc.prop
        zc.state = zc.prop
      }
      if (networkStatus >= NetworkStatus.ready && cq.pendingBounds && !cq.pending) {
        const pending = cq.pendingBounds
        cq.pendingBounds = undefined
        if (pending && !autoZoom) {
          handleBoundsChange(boundsRef, clusterQuery, mapView, pending)
        }
      }

      // After autoZoom is done, we adjust the viewport to same as autoView.
      let view
      if (!autoZoom && !loading && needAutoView.current) {
        needAutoView.current = false
        view = autoViewRef.current
      }
      return (
        <MapMarkers
          data={data}
          dataAccessor={dataAccessor}
          autoZoom={autoZoom}
          autoView={view}
          markerType={markerType}
          selectedEvent={selectedEvent}
          onEventSelected={onEventSelected}
          privacyMode={privacyMode}
          mapStorageId={storageId}
        />
      )
    },
    [getWidth, dataAccessor, markerType, selectedEvent, onEventSelected, privacyMode, storageId],
  )

  const autoZoom = zoomCount.current.prop !== zoomCount.current.state

  const [mapOptions] = useContext(MapOptionsProvider.Context)

  let geoBounds
  let zoomLevel
  if (needAutoView.current) {
    geoBounds = autoViewRef.current.bounds
    zoomLevel = autoViewRef.current.viewport.zoom
  } else {
    geoBounds = autoZoom ? undefined : boundsRef.current.markers
    zoomLevel = autoZoom ? MIN_MAP_ZOOM : (geoBounds && mapView.current.zoom) || MIN_MAP_ZOOM
  }
  const riskTypes = useMemo(() => [...mapOptions.riskTypes], [mapOptions])
  const newVariables = useMemo(
    () => ({
      ...variables,
      zoomLevel,
      geoBounds,
      riskTypes,
    }),
    [geoBounds, variables, zoomLevel, riskTypes],
  )
  clusterQuery.current.newVariables = newVariables

  const queryOptions = useMemo(
    () => ({
      variables: newVariables,
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      partialRefetch: true,
    }),
    [newVariables],
  )

  const queryResult = useStatefulApolloQuery(query, queryOptions)

  return useMemo(() => {
    const mapMaxZoom = privacyMode ? maxZoom : mapConfig.zoom.defaultMaxZoom
    return (
      <GeozoneListProvider>
        <div style={mapWrapperStyle}>
          <ViewportMap fullSize maxZoom={mapMaxZoom} onViewportChanged={onViewportChanged} leftBottomNode={leftBottomNode}>
            <PanToSelection selectedEvent={selectedEvent} />
            <Geozones />
            {renderMap(queryResult)}
          </ViewportMap>
        </div>
      </GeozoneListProvider>
    )
  }, [privacyMode, maxZoom, onViewportChanged, leftBottomNode, selectedEvent, renderMap, queryResult])
})

Map.propTypes = {
  id: PropTypes.string,
  variables: PropTypes.object,
  query: PropTypes.object.isRequired,
  dataAccessor: PropTypes.func,
  markerType: PropTypes.string,
  selectedEvent: PropTypes.object,
  onEventSelected: PropTypes.func,
}

export default Map
