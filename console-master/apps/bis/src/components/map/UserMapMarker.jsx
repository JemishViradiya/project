import PropTypes from 'prop-types'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'

import { useTheme } from '@material-ui/core/styles'

import { default as Marker } from '../../googleMaps/Marker'
import MapPopup from '../../googleMaps/Popup'
import { MapUserIcon } from './MapIcon'
import UserMapPopup from './UserMapPopup'

// offsets of the popup from marker anchor
const LARGE_OFFSET = { x: 0, y: -38 }
const REGULAR_OFFSET = { x: 0, y: -30 }

const UserMapMarker = memo(({ noPopup, size, user, selected, onSelected }) => {
  const [hovered, setHovered] = useState(false)
  const popupRef = useRef()
  const popupOpened = popupRef.current && popupRef.current.isOpen
  const riskLevel = user.riskLevel

  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.close()
    }
  }, [popupRef])
  const renderPopup = useMemo(() => {
    if (noPopup) {
      return null
    }
    const offset = size === 'large' || hovered || popupOpened ? LARGE_OFFSET : REGULAR_OFFSET
    return (
      <MapPopup offset={offset} risk={riskLevel} ref={popupRef} autopan maxWidth={400}>
        <UserMapPopup user={user} onClose={closePopup} />
      </MapPopup>
    )
  }, [closePopup, hovered, noPopup, popupOpened, riskLevel, size, user])

  const iconSize = size || ((hovered || popupOpened || selected) && 'large') || 'normal'
  const theme = useTheme()
  const mapIcon = useMemo(() => {
    return MapUserIcon({
      riskLevel,
      size: iconSize,
      theme,
    })
  }, [iconSize, riskLevel, theme])
  const { lat, lon: lng } = user.assessment.location
  const zIndexes = theme.zIndex.bis.mapMarker
  const zIndex = hovered ? zIndexes.hovered : selected || popupOpened ? zIndexes.focused : zIndexes.normal
  const onClick = useCallback(() => onSelected && onSelected(user), [onSelected, user])

  return (
    <Marker
      zIndexOffset={zIndex}
      zIndexMapMarkerHovered={zIndexes.hovered}
      icon={mapIcon}
      position={{ lat, lng }}
      riseOnHover
      onClick={onClick}
      onHover={setHovered}
    >
      {renderPopup}
    </Marker>
  )
})

UserMapMarker.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.string,
  selected: PropTypes.bool,
  noPopup: PropTypes.any,
}
UserMapMarker.displayName = 'UserMapMarker'

export default UserMapMarker
