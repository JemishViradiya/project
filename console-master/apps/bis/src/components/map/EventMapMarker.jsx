import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles'

import { default as Marker } from '../../googleMaps/Marker'
import { useMapViewStateSaver } from '../../list/hooks'
import { MapUserIcon } from './MapIcon'

export const EventMapMarker = memo(({ event, highlight, selected, onHover, mapStorageId }) => {
  // click takes us to the correct event page...
  const navigate = useNavigate()
  const { id, riskLevel } = event.representative
  const stateSaver = useMapViewStateSaver()

  const onClick = useCallback(() => {
    stateSaver(mapStorageId)
    const safeId = encodeURIComponent(id)
    navigate(`/events/${safeId}`, { state: { goBack: true } })
  }, [stateSaver, mapStorageId, navigate, id])

  const theme = useTheme()
  const mapIcon = useMemo(() => MapUserIcon({ riskLevel, theme }), [riskLevel, theme])
  const position = useMemo(() => ({ lat: event.lat, lng: event.lon }), [event])
  const zIndexes = theme.zIndex.bis.mapMarker
  const zIndex = highlight ? zIndexes.hovered : selected ? zIndexes.focused : zIndexes.normal
  return (
    <Marker
      zIndexOffset={zIndex}
      zIndexMapMarkerHovered={zIndexes.hovered}
      icon={mapIcon}
      position={position}
      riseOnHover
      onClick={onClick}
      onHover={onHover}
    />
  )
})

EventMapMarker.displayName = 'EventMapMarker'
EventMapMarker.propTypes = {
  onHover: PropTypes.func,
  selected: PropTypes.bool,
  highlight: PropTypes.any,
  event: PropTypes.object.isRequired,
  mapStorageId: PropTypes.string,
}

export default EventMapMarker
