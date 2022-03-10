import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { BasicMap } from '../BasicMap'
import type { PositionFunc, Viewport } from '../GoogleMaps'
import { useGoogleMapContext } from '../GoogleMaps'
import mapConfig from '../GoogleMaps/mapConfig'
import { useZoomListener } from '../utils/use-zoom-listener'
import { useCoordinatedDataSelectionContext } from './CoordinatedDataSelectionProvider'
import EditGeozonePopup from './edit-geozone-popup'
import type { GeozoneEntity, GeozoneShape } from './model'
import { GeozoneType } from './model'
import OperationBar from './operation-bar'
import SearchPin from './SearchPin'
import { useShapeOptions } from './utils/use-shape-options'
import { getCirclePosition, getDegreesPerMeter, getPolygonPosition } from './utils/util'
import ZonesOverlay from './ZonesOverlay'

interface GeozonesMapProps {
  zones: GeozoneEntity[]
  onZoneSave: (zone: GeozoneEntity) => void
  onZoneDelete: (zone: GeozoneEntity) => void
  onFullscreenToggle?: () => void
  isFullscreen: boolean
  className?: string
  onZoneShapeCreated?: (created: boolean) => void
  initialViewport?: Viewport
  visibleZones?: GeozoneEntity[]
}

enum ReducerActionType {
  NewShape,
  SelectShape,
  ClosePopup,
  Search,
  SetPopupPosition,
}

interface ReducerState {
  popupLocation?: PositionFunc
  invertedPopupLocation?: PositionFunc
  shape?: GeozoneShape
  shapeType?: GeozoneType
  isNewShape?: boolean
  name?: string
  searchPinLocation?: PositionFunc
}

interface ReducerActionSetShape {
  type: ReducerActionType.NewShape | ReducerActionType.SelectShape
  position: {
    normal: PositionFunc
    inverted: PositionFunc
  }
  shape: GeozoneShape
  shapeType: GeozoneType
  name?: string
}

interface ReducerActionSetPopupPosition {
  type: ReducerActionType.SetPopupPosition
  position: {
    normal: PositionFunc
    inverted: PositionFunc
  }
}

interface ReducerActionSearch {
  type: ReducerActionType.Search
  location: PositionFunc
  name: string
}

type ReducerAction =
  | ReducerActionSetShape
  | ReducerActionSetPopupPosition
  | ReducerActionSearch
  | { type: ReducerActionType.ClosePopup }

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ReducerActionType.NewShape:
    case ReducerActionType.SelectShape:
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        popupLocation: action.position.normal,
        invertedPopupLocation: action.position.inverted,
        shape: action.shape,
        shapeType: action.shapeType,
        isNewShape: action.type === ReducerActionType.NewShape,
        name: action.name,
      }
    case ReducerActionType.ClosePopup:
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {}
    case ReducerActionType.SetPopupPosition:
      return {
        ...state,
        popupLocation: action.position.normal,
        invertedPopupLocation: action.position.inverted,
      }
    case ReducerActionType.Search:
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        searchPinLocation: action.location,
        name: action.name,
      }
  }
}

export const GeozonesMap: React.FC<GeozonesMapProps> = memo(
  ({ className, initialViewport, isFullscreen, onFullscreenToggle, ...rest }) => {
    const viewport = useMemo(() => initialViewport || mapConfig.defaultViewport, [initialViewport])

    return (
      <BasicMap className={className} isFullscreen={isFullscreen} onFullscreenToggle={onFullscreenToggle} gestureHandling="greedy">
        <GeozonesMapWithMapContext initialZoomLevel={viewport.zoom} {...rest} />
      </BasicMap>
    )
  },
)

interface GeozonesMapWithMapContextProps extends Omit<GeozonesMapProps, 'className' | 'isFullscreen' | 'onFullscreenToggle'> {
  initialZoomLevel: number
}

const fitMapToVisibleZones = (visibleZones: GeozoneEntity[], map: google.maps.Map) => {
  console.log(visibleZones)
  if (visibleZones?.length > 0) {
    const bounds = new google.maps.LatLngBounds()

    for (const zone of visibleZones) {
      if (zone.type === GeozoneType.Circle) {
        const radiusInDegrees = getDegreesPerMeter(zone.geometry.radius)
        // bottom
        bounds.extend({
          lat: zone.geometry.center.lat - radiusInDegrees,
          lng: zone.geometry.center.lng,
        })
        // left
        bounds.extend({
          lat: zone.geometry.center.lat,
          lng: zone.geometry.center.lng - radiusInDegrees,
        })
        // up
        bounds.extend({
          lat: zone.geometry.center.lat + radiusInDegrees,
          lng: zone.geometry.center.lng,
        })
        // right
        bounds.extend({
          lat: zone.geometry.center.lat,
          lng: zone.geometry.center.lng + radiusInDegrees,
        })
      } else {
        zone.geometry.coordinates.forEach(latLng => bounds.extend(latLng))
      }
    }
    map.fitBounds(bounds)
  }
}

const GeozonesMapWithMapContext: React.FC<GeozonesMapWithMapContextProps> = memo(
  ({ zones, onZoneShapeCreated, onZoneSave, onZoneDelete, initialZoomLevel, visibleZones }) => {
    const { google, map } = useGoogleMapContext()
    const zoomLevel = useZoomListener(initialZoomLevel)
    const [isZoneSaving, setIsZoneSaving] = useState(false)
    const [state, dispatch] = useReducer(reducer, {})
    const { isNewShape } = state
    const { selected: selectedZone, select: selectZone } = useCoordinatedDataSelectionContext()

    const createShape = useCallback(
      (shape: GeozoneShape, type: GeozoneType, name?: string) => {
        onZoneShapeCreated && onZoneShapeCreated(true)
        dispatch({
          type: ReducerActionType.NewShape,
          shape,
          shapeType: type,
          position:
            type === GeozoneType.Circle
              ? getCirclePosition(shape as google.maps.Circle)
              : getPolygonPosition(shape as google.maps.Polygon),
          name,
        })
      },
      [onZoneShapeCreated],
    )

    const onPopupClose = useCallback(() => {
      selectZone(null)
      onZoneShapeCreated && onZoneShapeCreated(false)
      dispatch({ type: ReducerActionType.ClosePopup })
    }, [onZoneShapeCreated, selectZone])

    const onPopupSave = useCallback(
      async (zone: GeozoneEntity) => {
        try {
          setIsZoneSaving(true)
          await onZoneSave(zone)
          onPopupClose()
        } finally {
          setIsZoneSaving(false)
        }
      },
      [onPopupClose, onZoneSave],
    )

    const setPopupLocation = useCallback(
      position => {
        dispatch({ type: ReducerActionType.SetPopupPosition, position })
      },
      [dispatch],
    )

    const onSearchPlaceSelected = useCallback<(name: string, location: PositionFunc) => void>(
      (name, location) => {
        dispatch({ type: ReducerActionType.Search, name, location } as ReducerActionSearch)
      },
      [dispatch],
    )

    const onCreateShapeClick = useCallback(
      enabled => {
        if (enabled) {
          onPopupClose()
        }
      },
      [onPopupClose],
    )

    const onSearchPinShapeCreated = useCallback(
      (shape: GeozoneShape, type: GeozoneType) => {
        createShape(shape, type, state.name)
      },
      [createShape, state.name],
    )

    const selectedShapeType = selectedZone?.type === 'circle' ? GeozoneType.Circle : GeozoneType.Polygon
    const selectedShapeOptions = useShapeOptions(selectedZone?.geometry, selectedShapeType)

    useEffect(() => {
      if (selectedZone) {
        const shape =
          selectedShapeType === GeozoneType.Circle
            ? new google.maps.Circle(selectedShapeOptions)
            : new google.maps.Polygon(selectedShapeOptions)
        shape.setMap(map)

        fitMapToVisibleZones([selectedZone], map)

        dispatch({
          type: ReducerActionType.SelectShape,
          shape,
          shapeType: selectedShapeType,
          position:
            selectedShapeType === GeozoneType.Circle
              ? getCirclePosition(shape as google.maps.Circle)
              : getPolygonPosition(shape as google.maps.Polygon),
        })
      } else {
        onPopupClose()
      }
    }, [google, map, onPopupClose, selectedShapeOptions, selectedShapeType, selectedZone])

    useEffect(() => {
      fitMapToVisibleZones(visibleZones, map)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleZones])

    return (
      <>
        <ZonesOverlay zoomLevel={zoomLevel} zones={zones} />
        <OperationBar
          onPlaceSelected={onSearchPlaceSelected}
          onCreateShapeClick={onCreateShapeClick}
          onShapeCreated={createShape}
          disabled={isNewShape}
        />
        {state.searchPinLocation && (
          <SearchPin
            zoom={zoomLevel}
            location={state.searchPinLocation}
            name={state.name}
            onShapeCreated={onSearchPinShapeCreated}
          />
        )}
        {state.popupLocation && (
          <EditGeozonePopup
            zone={zones.find(zone => zone.id === selectedZone?.id)}
            position={state.popupLocation}
            invertedPosition={state.invertedPopupLocation}
            onSave={onPopupSave}
            onDelete={onZoneDelete}
            onCancel={onPopupClose}
            shape={state.shape}
            shapeType={state.shapeType}
            setPopupPosition={setPopupLocation}
            initialName={state.name}
            saving={isZoneSaving}
          />
        )}
      </>
    )
  },
)

export default GeozonesMap
