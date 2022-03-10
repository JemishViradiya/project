import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo } from 'react'

import Portal from '@material-ui/core/Portal'
import { makeStyles } from '@material-ui/core/styles'

import type { PositionFunc } from '../GoogleMaps'
import { useGoogleMapContext } from '../GoogleMaps'

interface PopupProps {
  open?: boolean
  marker?: ReactNode
  position?: PositionFunc
  invertedPosition?: PositionFunc
  onShow?: () => void
  onClose?: () => void
  stayOpen?: boolean
  autopan?: boolean
  offset?: { x: number; y: number }
}

/* The popup bubble styling.
 * taken more-or-less from the google maps api documentation
 * https://developers.google.com/maps/documentation/javascript/examples/overlay-popup */
const useStyles = makeStyles(theme => ({
  popupBubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translate(0, -100%)',

    /* Style the bubble. */
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    boxShadow: '0 2px 10px 1px rgba(0, 0, 0, 0.5)',
  },
  /* The parent of the bubble. A zero-height div at the top of the tip. */
  popupBubbleAnchor: {
    position: 'absolute',
    width: '220px',
    bottom: 0,
    left: 0,
  },
  /* JavaScript will position this div at the bottom of the popup tip. */
  popupContainer: {
    cursor: 'auto',
    height: 0,
    position: 'absolute',

    /* The max width of the info window. */
    width: '100px',
  },
  inverted: {
    '& $popupBubble': {
      transform: `translate(0, 0)`,
    },
    '& $popupBubbleAnchor': {
      bottom: 'initial',
      top: 0,
    },
    '&.positioned': {
      popupBubbleAnchor: {
        top: 0,
      },
    },
  },
}))

const Popup: React.FC<PopupProps> = ({
  open,
  marker,
  offset,
  position,
  invertedPosition,
  onShow,
  onClose,
  stayOpen = false,
  autopan = true,
  children,
}) => {
  const { google, map } = useGoogleMapContext()
  const styles = useStyles()
  const popup = useMemo(() => new (require('./PopupHelper').Popup)(styles), [styles])

  const openPopup = useCallback(() => {
    popup.open()
  }, [popup])

  const closePopup = useCallback(() => {
    popup.close()
  }, [popup])

  // move the popup so that it's on the screen as much as it can be
  const panPopup = useCallback(
    latlng => {
      if (autopan) {
        map.panTo(latlng)
      }
    },
    [map, autopan],
  )

  useEffect(() => {
    popup && popup.setOffset(offset)
  }, [offset, popup])

  useEffect(() => {
    popup && popup.setMap(map)
  }, [map, popup])

  useEffect(() => {
    popup && popup.setAutoClose(!stayOpen)
  }, [popup, stayOpen])

  useEffect(() => {
    popup && popup.setMarker(marker)
  }, [marker, openPopup, popup])

  useEffect(() => {
    popup && popup.setAutoClose(!stayOpen)
  }, [popup, stayOpen])

  useEffect(() => {
    popup && popup.setPosition(position, invertedPosition) && popup.draw()
  }, [invertedPosition, popup, position])

  useEffect(() => {
    if (popup && autopan) {
      const autopanListener = popup.addListener(popup.FIRST_DRAW_AFTER_OPEN_EVENT, panPopup)
      return () => {
        google.maps.event.removeListener(autopanListener)
      }
    }
  }, [autopan, google, panPopup, popup])

  useEffect(() => {
    if (popup && onClose) {
      const listener = popup.addListener(popup.REMOVE_EVENT, onClose)
      return () => {
        google.maps.event.removeListener(listener)
      }
    }
  }, [google, onClose, popup])

  useEffect(() => {
    if (popup && onShow) {
      const listener = popup.addListener(popup.FIRST_DRAW_AFTER_OPEN_EVENT, onShow)
      return () => {
        google.maps.event.removeListener(listener)
      }
    }
  }, [google, onShow, popup])

  useEffect(() => {
    if (popup) {
      if (open) {
        openPopup()
      } else {
        closePopup()
      }
    }
  }, [closePopup, open, openPopup, popup])

  if (popup && open) {
    return <Portal container={popup.getContainer()}>{children}</Portal>
  }
  return null
}

export default Popup
