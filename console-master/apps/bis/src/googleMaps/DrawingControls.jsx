import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'

import { BasicGeozoneRadius, BasicGeozoneShape } from '@ues/assets'

import { Icon } from '../shared'
import styles from './DrawingControls.module.less'
import Map from './Map'

export class DrawingControls extends PureComponent {
  state = {
    mode: null,
  }

  onCircleComplete = circle => {
    const { google, circlePopup } = this.props
    // Clear out any previous pending shape
    if (this.state.shape) {
      this.state.shape.setMap(null)
    }

    // Get out of drawing mode
    this.setState({ shape: circle, mode: null })
    circle.google = google

    // Tell our parent that we have a circle
    circlePopup(circle)
  }

  onPolygonComplete = polygon => {
    const { google, polygonPopup } = this.props

    // Clear out any previous pending shape
    if (this.state.shape) {
      this.state.shape.setMap(null)
    }

    // Get out of drawing mode
    this.setState({ shape: polygon, mode: null })
    polygon.google = google

    // Tell our parent that we have a polygon
    polygonPopup(polygon)
  }

  load() {
    const { google, map, fillColor, strokeColor } = this.props

    if (map && google) {
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: this.state.mode,
        drawingControl: false,
        circleOptions: {
          fillColor,
          fillOpacity: 0.4,
          strokeColor,
          strokeWeight: 2,
        },
        polygonOptions: {
          fillColor,
          fillOpacity: 0.4,
          strokeColor,
          strokeWeight: 2,
        },
      })
      drawingManager.setMap(map)
      this.circleListenerId = drawingManager.addListener('circlecomplete', this.onCircleComplete)
      this.polygonListenerId = drawingManager.addListener('polygoncomplete', this.onPolygonComplete)
      this.setState({ drawingManager })
    }
  }

  componentDidMount() {
    this.load()
  }

  componentWillUnmount() {
    const { google } = this.props
    if (this.circleListenerId) google.maps.event.removeListener(this.circleListenerId)
    if (this.polygonListenerId) google.maps.event.removeListener(this.polygonListenerId)
  }

  componentDidUpdate(prevProps, prevState) {
    const { map } = this.props
    const { drawingManager } = this.state
    if (!drawingManager) {
      this.load()
    } else if (prevState.mode !== this.state.mode) {
      if (drawingManager.getMap() !== map) {
        drawingManager.setMap(map)
      }
      drawingManager.setOptions({
        drawingMode: this.state.mode,
      })
    }
  }

  toggleCircle = () => {
    const { google, disabled } = this.props
    const CIRCLE = google.maps.drawing.OverlayType.CIRCLE
    this.setState(state => {
      return { mode: disabled || state.mode === CIRCLE ? null : CIRCLE }
    })
  }

  togglePolygon = () => {
    const { google, disabled } = this.props
    const POLYGON = google.maps.drawing.OverlayType.POLYGON
    this.setState(state => {
      return { mode: disabled || state.mode === POLYGON ? null : POLYGON }
    })
  }

  render() {
    const { mode } = this.state
    const { google, t } = this.props
    let circleSelected = false
    let polygonSelected = false
    if (google) {
      const { CIRCLE, POLYGON } = google.maps.drawing.OverlayType
      circleSelected = mode && mode === CIRCLE
      polygonSelected = mode && mode === POLYGON
    }
    return (
      <div className={styles.buttons}>
        <div
          className={styles.button}
          title={t('geozones.addCircularGeozone')}
          role="button"
          tabIndex="-1"
          onClick={this.toggleCircle}
        >
          <Icon className={`${styles.icon} ${circleSelected ? styles.selected : ''}`} icon={BasicGeozoneRadius} />
        </div>
        <div
          className={styles.button}
          title={t('geozones.addCustomGeozone')}
          role="button"
          tabIndex="-1"
          onClick={this.togglePolygon}
        >
          <Icon className={`${styles.icon} ${polygonSelected ? styles.selected : ''}`} icon={BasicGeozoneShape} />
        </div>
      </div>
    )
  }
}

class DrawingControlsWithConsumer extends PureComponent {
  render() {
    const { children, ...props } = this.props
    return <Map.Consumer>{({ google, map }) => <DrawingControls google={google} map={map} {...props} />}</Map.Consumer>
  }
}

DrawingControlsWithConsumer.propsTypes = {
  circlePopup: PropTypes.func.isRequired,
  polygonPopup: PropTypes.func.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  t: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

DrawingControlsWithConsumer.defaultProps = {
  disabled: false,
}

DrawingControls.propTypes = {
  ...DrawingControlsWithConsumer.propTypes,
  map: PropTypes.object,
  google: PropTypes.object,
}

export default withTranslation()(DrawingControlsWithConsumer)
