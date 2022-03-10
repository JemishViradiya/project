import PropTypes from 'prop-types'
import React, { useCallback, useMemo, useState } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { default as Marker } from '../../../googleMaps/Marker'
import GeozonePopup from '../GeozonePopup'
import MiniIcon from './MiniIcon'

const Zone = ({
  background,
  zone,
  highlighted,
  onHighlightChanged,
  onZoneSelected,
  disableZoneSelection,
  showPopup,
  onPopupClose,
  Shape,
  shapeOptions,
  highlightOptions,
  latlng,
  popupLatLng,
  invertedPopupLatLng,
  useIcon,
  onDeleteSingle,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { id, risk } = zone
  const theme = useTheme()

  const onHoverStart = useMemo(() => {
    if (background) {
      return null
    }
    return () => onHighlightChanged(id)
  }, [id, background, onHighlightChanged])

  const [editMode, setEditMode] = useState(false)

  const onHoverEnd = useMemo(() => {
    if (background) {
      return null
    }
    return () => onHighlightChanged()
  }, [background, onHighlightChanged])

  const onHover = useMemo(() => {
    if (background) {
      return null
    }
    return value => {
      value ? onHoverStart() : onHoverEnd()
    }
  }, [background, onHoverStart, onHoverEnd])

  const onSelected = useCallback(() => {
    onZoneSelected(id)
  }, [onZoneSelected, id])

  // Make default geozone drawing index lower than other polygons.
  shapeOptions.zIndex = shapeOptions.zIndex || theme.zIndex.bis.geozone.normal

  const shape = useMemo(
    () => <Shape options={shapeOptions} onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} onClick={onSelected} />,
    [Shape, shapeOptions, onHoverStart, onHoverEnd, onSelected],
  )

  const highlightShape = useMemo(() => (highlighted ? <Shape options={highlightOptions} strokeOutside /> : null), [
    highlighted,
    Shape,
    highlightOptions,
  ])

  const icon = useMemo(() => MiniIcon({ risk, highlighted, theme }), [risk, highlighted, theme])

  const onDeletionCompleted = useCallback(
    deleted => {
      const deleteQueryName = Object.keys(deleted)[0] || null
      if (deleteQueryName && deleted[deleteQueryName].success.length === 1) {
        const id = deleted[deleteQueryName].success[0]
        onDeleteSingle(id)
      }
    },
    [onDeleteSingle],
  )

  const popup = useMemo(() => {
    if (showPopup) {
      const onClose = () => {
        onPopupClose(id)
      }
      return (
        <GeozonePopup
          latlng={popupLatLng}
          invertedLatlng={invertedPopupLatLng}
          zone={zone}
          onClose={onClose}
          disableZoneSelection={disableZoneSelection}
          onEditModeChanged={setEditMode}
          onDeletionCompleted={onDeletionCompleted}
        />
      )
    }
  }, [showPopup, invertedPopupLatLng, popupLatLng, zone, disableZoneSelection, onPopupClose, id, onDeletionCompleted])

  const positionObject = useMemo(
    () => ({
      lat: latlng.lat(),
      lng: latlng.lng(),
    }),
    [latlng],
  )

  if (useIcon) {
    if (background) {
      return null
    }

    const zIndex = highlighted ? theme.zIndex.bis.mapMarker.hovered : theme.zIndex.bis.mapMarker.normal
    return (
      <>
        {popup}
        {editMode ? null : (
          <Marker
            zIndexOffset={zIndex}
            zIndexMapMarkerHovered={theme.zIndex.bis.mapMarker.hovered}
            icon={icon}
            riseOnHover
            onHover={onHover}
            onClick={onSelected}
            position={positionObject}
          />
        )}
      </>
    )
  } else {
    return (
      <>
        {popup}
        {editMode ? null : highlightShape}
        {editMode ? null : shape}
      </>
    )
  }
}

Zone.propTypes = {
  background: PropTypes.bool,
  highlighted: PropTypes.bool,
  onHighlightChanged: PropTypes.func,
  zone: PropTypes.shape({
    geometry: PropTypes.object.isRequired,
    risk: PropTypes.string.isRequired,
  }).isRequired,
  zoom: PropTypes.number,
  showPopup: PropTypes.bool,
  onPopupClose: PropTypes.func,
  onZoneSelected: PropTypes.func,
  disableZoneSelection: PropTypes.func,
}

Zone.defaultProps = {
  background: false,
  zoom: 1,
  onHighlightChanged: () => {},
  onPopupClose: () => {},
  onZoneSelected: () => {},
  disableZoneSelection: () => {},
}

Zone.displayName = 'Zone'

export default Zone
