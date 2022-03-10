import PropTypes from 'prop-types'
import React from 'react'

import { IconPropType } from './Icon'
import Map from './Map'

export const pointify = (google, [x, y]) => new google.maps.Point(x, y)
export const sizeify = (google, [w, h]) => new google.maps.Size(w, h)

export const toGooglePoint = (google, icon, key) => {
  const target = icon[key]
  if (target && Array.isArray(target)) icon[key] = pointify(google, target)
}

export const toGoogleSize = (google, icon, key) => {
  const target = icon[key]
  if (target && Array.isArray(target)) icon[key] = sizeify(google, target)
}

export const googlify = (google, icon) => {
  if (!icon) return undefined
  const i = { ...icon }
  toGooglePoint(google, i, 'anchor')
  toGooglePoint(google, i, 'labelOrigin')
  toGooglePoint(google, i, 'origin')
  toGoogleSize(google, i, 'scaledSize')
  toGoogleSize(google, i, 'size')
  return i
}

// forward everything to the google map API
export class Marker extends React.Component {
  state = { zIndex: 0 }

  componentDidMount() {
    this.setState({ zIndex: this.props.zIndexOffset || 0 })
    this.loadMarker()
  }

  loadMarker() {
    const { google, map, position, title, riseOnHover, icon } = this.props
    if (!map || !google) {
      return
    }

    const marker = new google.maps.Marker({ position, map, title })
    if (riseOnHover || this.props.onHover) {
      marker.addListener('mouseover', this.raise)
      marker.addListener('mouseout', this.lower)
    }
    if (this.props.onClick) {
      marker.addListener('click', this.props.onClick)
    }

    const googleIcon = googlify(google, icon)
    if (googleIcon) {
      marker.setIcon(googleIcon)
      marker.setZIndex(this.props.zIndexOffset || 0)
    }
    this.setState({ marker })
    this.marker = marker
  }

  raise = () => {
    if (this.props.riseOnHover) {
      const marker = this.state.marker
      marker.setZIndex(this.props.zIndexMapMarkerHovered)
    }
    if (this.props.onHover) {
      this.props.onHover(true)
    }
  }

  lower = () => {
    if (this.props.riseOnHover) {
      const { marker, zIndex } = this.state
      marker.setZIndex(zIndex)
    }
    if (this.props.onHover) {
      this.props.onHover(false)
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null)
      this.marker = undefined
    }
    this.setState({ marker: undefined })
  }

  componentDidUpdate(prevProps) {
    const { google, map, position, title, icon, zIndexOffset } = prevProps
    const marker = this.state.marker
    if (!marker) {
      this.loadMarker()
      return
    }
    // okay, we have a marker and new values...
    if (position.lat !== this.props.position.lat || position.lng !== this.props.position.lng) {
      marker.setPosition(this.props.position)
    }

    if ((icon && !this.props.icon) || (!icon && this.props.icon) || (icon && this.props.icon && icon.key !== this.props.icon.key)) {
      if (!this.props.icon) {
        marker.setIcon()
      } else {
        const googleIcon = googlify(google, this.props.icon)
        if (googleIcon) {
          marker.setIcon(googleIcon)
          marker.setZIndex(this.props.zIndexOffset || 0)
        }
      }
    }

    if (title !== this.props.title) marker.setTitle(this.props.title)
    if (map !== this.props.map) marker.setMap(this.props.map)
    if (zIndexOffset !== this.props.zIndexOffset) marker.setZIndex(this.props.zIndexOffset || 0)
  }

  render() {
    const { map, google } = this.props
    const marker = this.state.marker
    if (!map || !google || !marker) return null

    // add this marker to the context for any children to use
    const mapContext = { google, map, marker }
    return <Map.Provider value={mapContext}>{this.props.children}</Map.Provider>
  }
}

// wrap this so that we can pick up our map.
class MarkerWithConsumer extends React.Component {
  render() {
    const { children, ...props } = this.props
    return (
      <Map.Consumer>
        {({ google, map }) => (
          <Marker google={google} map={map} {...props}>
            {children}
          </Marker>
        )}
      </Map.Consumer>
    )
  }
}

MarkerWithConsumer.propTypes = {
  children: PropTypes.node,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  riseOnHover: PropTypes.any,
  zIndexOffset: PropTypes.number,
  title: PropTypes.string,
  icon: IconPropType,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  zIndexMapMarkerHovered: PropTypes.number,
}

// The embedded Marker class needs one extra property
Marker.propTypes = {
  ...MarkerWithConsumer.propTypes,
  map: PropTypes.object,
  google: PropTypes.object,
}

export default MarkerWithConsumer
