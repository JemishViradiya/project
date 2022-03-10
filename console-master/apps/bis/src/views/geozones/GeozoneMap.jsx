import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { default as DrawingControls } from '../../googleMaps/DrawingControls'
import Map from '../../googleMaps/Map'
import { default as SearchInput } from '../../googleMaps/SearchInput'
import { getCircleTopBottom, getPolygonTopBottom } from '../../googleMaps/util'
import { Context as GeozoneContext } from '../../providers/GeozoneListProvider'
import CreateGeozone from './CreateGeozone'
import SearchPin from './SearchPin'
import CircleZone from './shapes/CircleZone'
import PolygonZone from './shapes/PolygonZone'

const reducer = (state, action) => {
  switch (action.type) {
    case 'circle':
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        popupLocation: action.topBottom[0],
        invertedPopupLocation: action.topBottom[1],
        shape: action.circle,
        showRadius: true,
        name: action.name,
      }
    case 'polygon':
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        popupLocation: action.topBottom[0],
        invertedPopupLocation: action.topBottom[1],
        shape: action.polygon,
        showRadius: false,
        name: action.name,
      }
    case 'close':
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        popupLocation: null,
        invertedPopupLocation: null,
        shape: null,
        showRadius: false,
      }
    case 'set':
      return {
        ...state,
        popupLocation: action.location[0],
        invertedPopupLocation: action.location[1],
      }
    case 'search':
      if (state.shape) {
        state.shape.setMap(null)
      }
      return {
        popupLocation: null,
        invertedPopupLocation: null,
        shape: null,
        showRadius: false,
        pinLocation: action.location,
        pinName: action.name,
      }
    default:
      throw new Error()
  }
}

const GeozoneMap = memo(
  ({
    showPopupId,
    onPopupClose,
    highlightId,
    onHighlightChanged,
    onZoneSelected,
    disableZoneSelection,
    zoneSelectionDisabled,
    onDeleteSingle,
  }) => {
    const theme = useTheme()
    const [viewport, setViewport] = useState({ center: { lat: 0, lng: 0 }, zoom: 2 })
    const [state, dispatch] = useReducer(reducer, { showRadius: false })

    const circlePopup = useCallback(
      circle => {
        // Limit the number of digits in the radius
        const radius = Math.round(circle.getRadius())
        circle.setRadius(radius)

        disableZoneSelection(true)
        dispatch({ type: 'circle', circle, topBottom: getCircleTopBottom(circle) })
      },
      [disableZoneSelection],
    )

    const polygonPopup = useCallback(
      polygon => {
        disableZoneSelection(true)
        dispatch({ type: 'polygon', polygon, topBottom: getPolygonTopBottom(polygon) })
      },
      [disableZoneSelection],
    )

    const closePopup = useCallback(() => {
      disableZoneSelection(false)
      dispatch({ type: 'close' })
    }, [disableZoneSelection])

    const setPopupLocation = useCallback(
      location => {
        dispatch({ type: 'set', location })
      },
      [dispatch],
    )

    // We get provided both viewport and bounds but we don't care about
    // the bounds. However, we need to explicitly strip it out before
    // calling setViewport.
    const setViewportWithBounds = useCallback(
      viewport => {
        setViewport(viewport)
      },
      [setViewport],
    )

    const context = useContext(GeozoneContext)

    const focusRef = useRef()
    useEffect(() => {
      if (focusRef.current) {
        focusRef.current.focus()
        focusRef.current = null
      }
    })
    const renderGeozones = useMemo(() => {
      const { data } = context
      if (!data) {
        return null
      }

      return data.map(zone => {
        const id = zone.id

        // FIXME: Highlights should use useReducer / useContext
        const showPopup = showPopupId === id
        const highlighted = highlightId === id || showPopup

        switch (zone.geometry.type) {
          case 'Polygon':
            return (
              <PolygonZone
                key={`geozone-${id}`}
                zone={zone}
                zoom={viewport.zoom}
                highlighted={highlighted}
                onHighlightChanged={onHighlightChanged}
                showPopup={showPopup}
                onPopupClose={onPopupClose}
                onZoneSelected={onZoneSelected}
                disableZoneSelection={disableZoneSelection}
                onDeleteSingle={onDeleteSingle}
              />
            )
          case 'Circle':
            return (
              <CircleZone
                key={`geozone-${id}`}
                zone={zone}
                zoom={viewport.zoom}
                highlighted={highlighted}
                onHighlightChanged={onHighlightChanged}
                showPopup={showPopup}
                onPopupClose={onPopupClose}
                onZoneSelected={onZoneSelected}
                disableZoneSelection={disableZoneSelection}
                onDeleteSingle={onDeleteSingle}
              />
            )
          default:
            return null
        }
      })
    }, [
      context,
      showPopupId,
      highlightId,
      viewport.zoom,
      onHighlightChanged,
      onPopupClose,
      onZoneSelected,
      disableZoneSelection,
      onDeleteSingle,
    ])

    const onSearch = useCallback(
      ({ name, location }) => {
        dispatch({ type: 'search', name, location })
      },
      [dispatch],
    )

    const onPinCircle = useCallback(
      circle => {
        const name = state.pinName
        disableZoneSelection(true)
        dispatch({ type: 'circle', circle, name, topBottom: getCircleTopBottom(circle) })
      },
      [state.pinName, disableZoneSelection],
    )

    const onPinPolygon = useCallback(
      polygon => {
        const name = state.pinName
        disableZoneSelection(true)
        dispatch({ type: 'polygon', polygon, name, topBottom: getPolygonTopBottom(polygon) })
      },
      [state.pinName, disableZoneSelection],
    )

    return (
      <Map key="map" viewport={viewport} fullSize onViewportChanged={setViewportWithBounds} noMapRiskType>
        {renderGeozones}
        <SearchInput onSelect={onSearch} disabled={zoneSelectionDisabled} />
        {state.pinLocation && (
          <SearchPin zoom={viewport.zoom} location={state.pinLocation} onCircle={onPinCircle} onPolygon={onPinPolygon} />
        )}
        <DrawingControls
          circlePopup={circlePopup}
          polygonPopup={polygonPopup}
          fillColor={theme.palette.bis.risk.high}
          strokeColor={theme.palette.bis.risk.high}
          disabled={zoneSelectionDisabled}
        />
        {state.popupLocation && (
          <CreateGeozone
            showRadius={state.showRadius}
            position={state.popupLocation}
            invertedPosition={state.invertedPopupLocation}
            setPosition={setPopupLocation}
            onDone={closePopup}
            shape={state.shape}
            initialName={state.name}
          />
        )}
      </Map>
    )
  },
)

GeozoneMap.displayName = 'GeozoneMap'
GeozoneMap.propTypes = {
  highlightId: PropTypes.string,
  onHighlightChanged: PropTypes.func.isRequired,
  onZoneSelected: PropTypes.func.isRequired,
  disableZoneSelection: PropTypes.func,
  zoneSelectionDisabled: PropTypes.bool,
  showPopupId: PropTypes.string,
  onPopupClose: PropTypes.func.isRequired,
}

GeozoneMap.defaultProps = {
  disableZoneSelection: () => {},
  zoneSelectionDisabled: false,
}

export default GeozoneMap
