import cn from 'classnames'
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

import { useGoogleMapsApi } from './MapApi/useGoogleMapsApi'
import mapConfig from './mapConfig'

export interface Position {
  lat: number
  lng: number
}

export interface PositionFunc {
  lat: () => number
  lng: () => number
}

export interface Viewport {
  center: Position
  zoom: number
}

export interface MapProps {
  className?: string
  viewport?: Viewport
  minZoom?: number
  maxZoom?: number
  gestureHandling?: 'auto' | 'cooperative' | 'greedy' | 'none'
}

interface GoogleMapContextValue {
  map: google.maps.Map
  google: typeof google
  mapContainerRef?: React.MutableRefObject<HTMLDivElement>
}

export const GoogleMapContext = React.createContext<GoogleMapContextValue>({ map: null, google: null, mapContainerRef: null })

export const useGoogleMapContext = () => useContext(GoogleMapContext)

const { defaultViewport, controlOptions, restriction } = mapConfig

const useStyles = makeStyles(() => ({
  mapWrapper: {
    position: 'relative',
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}))

export const GoogleMap: React.FC<MapProps> = memo(
  ({ children, className, viewport = defaultViewport, minZoom, maxZoom, gestureHandling }) => {
    const styles = useStyles()
    const google = useGoogleMapsApi()
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState(null)
    const mapContextValue = useMemo<GoogleMapContextValue>(() => ({ map, google, mapContainerRef }), [google, map])

    const GoogleMap = google?.maps?.Map

    const googleMapOptions = useMemo<google.maps.MapOptions>(
      () => ({ ...viewport, ...controlOptions, restriction, minZoom, maxZoom, gestureHandling }),
      [viewport, minZoom, maxZoom, gestureHandling],
    )

    useEffect(() => {
      if (mapContainerRef.current && GoogleMap) {
        setMap(new GoogleMap(mapContainerRef.current, googleMapOptions))
      }
    }, [GoogleMap, googleMapOptions])

    return (
      <GoogleMapContext.Provider value={mapContextValue}>
        <div className={cn(styles.mapWrapper, className)}>
          <div role="application" ref={mapContainerRef} className={styles.map} />
          {google && map ? children : null}
        </div>
      </GoogleMapContext.Provider>
    )
  },
)
