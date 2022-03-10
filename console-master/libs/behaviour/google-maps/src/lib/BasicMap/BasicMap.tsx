import React, { memo, useMemo } from 'react'

import { GoogleMap as Map } from '../GoogleMaps'
import mapConfig from '../GoogleMaps/mapConfig'
import type { MapControlsProps } from './MapControls/MapControls'
import MapControls from './MapControls/MapControls'

export const BasicMap: React.FC<MapControlsProps> = memo(
  ({ zoomControls, mapTypeControls, isFullscreen, onFullscreenToggle, minZoom, maxZoom, children, ...mapProps }) => {
    const minZoomOption = useMemo(() => {
      if (minZoom) {
        if (minZoom < 0) return 0
        else if (minZoom > maxZoom) return Math.max(maxZoom, 0)
        else return minZoom
      } else {
        return mapConfig.zoom.defaultMinZoom
      }
    }, [maxZoom, minZoom])

    const maxZoomOption = useMemo(() => {
      if (maxZoom) {
        if (maxZoom < 0) return 0
        else return maxZoom
      } else {
        return mapConfig.zoom.defaultMaxZoom
      }
    }, [maxZoom])

    return (
      <Map {...mapProps} minZoom={minZoomOption} maxZoom={maxZoomOption}>
        {children}
        <MapControls
          zoomControls={zoomControls}
          mapTypeControls={mapTypeControls}
          minZoom={minZoomOption}
          maxZoom={maxZoomOption}
          isFullscreen={isFullscreen}
          onFullscreenToggle={onFullscreenToggle}
        />
      </Map>
    )
  },
)

export default BasicMap
