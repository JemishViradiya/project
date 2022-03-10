import React, { memo, useContext, useMemo } from 'react'

import MapContext from '../googleMaps/Context'
import Heatmap from '../googleMaps/Heatmap'
import Markers from './DynamicMarker'
import mergeClusters from './mergeClusters'

const MapMarkers = memo(
  ({ data, dataAccessor, autoZoom, autoView, markerType, selectedEvent, onEventSelected, privacyMode, ...rest }) => {
    const { map } = useContext(MapContext)
    data = data ? dataAccessor(data) : null

    const zoom = map && map.zoom
    let clusters = useMemo(() => data && zoom && (!privacyMode ? mergeClusters(data, zoom) : data), [data, privacyMode, zoom])
    if (!clusters) {
      return null
    }

    if (autoZoom && map) {
      map.zoomToClusterBounds(clusters)
    }
    if (autoView && map) {
      const {
        bounds,
        viewport: { zoom, center },
      } = autoView
      map.zoomToFixedBounds(bounds, zoom, center)
      map.panToCenter(center, zoom, true)
    }

    if (!privacyMode) {
      // Merge clusters only if we do not have privacy mode enabled
      const preMerge = clusters.length
      try {
        clusters = mergeClusters(clusters, zoom)
      } catch (err) {
        // FIXME: Report this through Stanley
        console.error(`Failed to merge clusters, using original. Error was: ${err.message}`)
      }
      const postMerge = clusters.length
      console.log(`preMerge: ${preMerge} postMerge: ${postMerge}`)
    }

    if (privacyMode) {
      return <Heatmap data={clusters} zoom={zoom} selectedEvent={selectedEvent} onEventSelected={onEventSelected} />
    } else {
      return (
        <Markers type={markerType} clusters={clusters} selectedEvent={selectedEvent} onEventSelected={onEventSelected} {...rest} />
      )
    }
  },
)

MapMarkers.displayName = 'MapMarkers'

export default MapMarkers
