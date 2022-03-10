import PropTypes from 'prop-types'
import React from 'react'
import { Portal } from 'react-portal'

import Map from './Map'

// forward everything to the google map API
export class Popup extends React.PureComponent {
  constructor(...props) {
    super(...props)
    // TODO: use a factory keyed by googleMaps global object for this in more lazy fashion
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const UtilPopup = require('./PopupHelper').Popup
    const popup = new UtilPopup()
    this.state = { popup, container: popup.getContainer() }
  }

  loadPopup() {
    const popup = this.state.popup
    const {
      google,
      map,
      marker,
      offset,
      position,
      invertedPosition,
      risk,
      onClose,
      onOpen,
      stayOpen,
      privacyModeOn = false,
    } = this.props
    if (!map || !google) {
      return
    }

    if (marker) {
      popup.setMarker(marker)
    } else if (position) {
      popup.setPosition(position, invertedPosition)
    }
    popup.setRisk(risk)
    popup.setMap(map)
    popup.setOffset(offset)
    popup.setAutoClose(!stayOpen)
    popup.setPrivate(privacyModeOn)
    this.firstDrawListenerId = popup.addListener(popup.FIRST_DRAW_AFTER_OPEN_EVENT, this.autopan)
    if (onClose) {
      this.removeListenerId = popup.addListener(popup.REMOVE_EVENT, onClose)
    }
    if (onOpen) {
      this.openListenerId = popup.addListener(popup.FIRST_DRAW_AFTER_OPEN_EVENT, onOpen)
    }

    if (marker) {
      this.markerListenerId = marker.addListener('click', this.open)
    } else if (position) {
      this.open()
    }
  }

  componentDidMount() {
    this.loadPopup()
  }

  // move the popup so that it's on the screen as much as it can be
  autopan = latlng => {
    const { map, autopan } = this.props
    if (map && autopan) {
      map.panTo(latlng)
    }
  }

  componentWillUnmount() {
    const popup = this.state.popup
    const google = this.props.google
    if (google) {
      if (this.markerListenerId) google.maps.event.removeListener(this.markerListenerId)
      if (this.firstDrawListenerId) google.maps.event.removeListener(this.firstDrawListenerId)
      if (this.removeListenerId) google.maps.event.removeListener(this.removeListenerId)
    }
    if (popup) {
      popup.close()
    }
  }

  componentDidUpdate({ google, map, marker, offset, position, invertedPosition, risk, onClose, onOpen, stayOpen }) {
    const popup = this.state.popup

    if (offset !== this.props.offset) popup.setOffset(this.props.offset)
    if (map !== this.props.map) popup.setMap(this.props.map)
    if (risk !== this.props.risk) popup.setRisk(this.props.risk)
    if (stayOpen !== this.props.stayOpen) popup.setAutoClose(!this.props.stayOpen)
    if (marker !== this.props.marker) {
      if (this.markerListenerId) {
        google.maps.event.removeListener(this.markerListenerId)
        this.markerListenerId = undefined
      }
      popup.setMarker(this.props.marker)
      if (this.props.marker && this.props.map) {
        this.markerListenerId = this.props.marker.addListener('click', this.open)
      }
    }
    if (position && (position !== this.props.position || invertedPosition !== this.props.invertedPosition)) {
      popup.setPosition(this.props.position, this.props.invertedPosition)
      popup.draw()
    }
    if (onClose !== this.props.onClose) {
      if (this.removeListenerId) {
        google.maps.event.removeListener(this.removeListenerId)
        this.removeListenerId = undefined
      }
      if (this.props.onClose) {
        this.removeListenerId = popup.addListener(popup.REMOVE_EVENT, this.props.onClose)
      }
    }
    if (onOpen !== this.props.onOpen) {
      if (this.openListenerId) {
        google.maps.event.removeListener(this.openListenerId)
        this.openListenerId = undefined
      }
      if (this.props.onOpen) {
        this.openListenerId = popup.addListener(popup.FIRST_DRAW_AFTER_OPEN_EVENT, this.props.onOpen)
      }
    }
  }

  open = () => {
    this.setState(
      {
        open: true,
      },
      () => {
        this.state.popup.open()
      },
    )
  }

  close = () => {
    this.setState(
      {
        open: false,
      },
      () => {
        this.state.popup.close()
      },
    )
  }

  render() {
    if (this.state.open) {
      return <Portal node={this.state.container}>{this.props.children}</Portal>
    }
    return null
  }
}

class PopupWithConsumer extends React.Component {
  // has to shine through to the underlying popup
  close() {
    const popup = this.popupRef
    if (popup) popup.close()
  }

  open() {
    const popup = this.popupRef
    if (popup) popup.open()
  }

  setPopupRef = ref => {
    this.popupRef = ref
  }

  render() {
    const { children, ...props } = this.props
    return (
      <Map.Consumer>
        {({ google, map, marker }) => (
          <Popup google={google} map={map} marker={marker} ref={this.setPopupRef} {...props}>
            {children}
          </Popup>
        )}
      </Map.Consumer>
    )
  }
}

PopupWithConsumer.displayName = 'PopupWithConsumer'

PopupWithConsumer.propTypes = {
  children: PropTypes.node.isRequired,
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  autopan: PropTypes.bool,
  position: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }),
  invertedPosition: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }),
  risk: PropTypes.string,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  stayOpen: PropTypes.bool,
}

// "autopan" reads better than "noAutopan"
PopupWithConsumer.defaultProps = {
  autopan: true,
  stayOpen: false,
}

// this makes the unit tests run a little cleaner
Popup.defaultProps = {
  autopan: true,
}

Popup.propTypes = {
  ...PopupWithConsumer.propTypes,
  google: PropTypes.object,
  marker: PropTypes.object,
  map: PropTypes.object,
}
Popup.displayName = 'Popup'

export default PopupWithConsumer
