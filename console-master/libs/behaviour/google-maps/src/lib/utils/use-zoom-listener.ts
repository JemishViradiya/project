import { useCallback, useEffect, useState } from 'react'

import { useGoogleMapContext } from '../GoogleMaps'

export const useZoomListener = (initialZoomLevel: number | null) => {
  const { map } = useGoogleMapContext()
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel)

  useEffect(() => {
    setZoomLevel(initialZoomLevel)
  }, [initialZoomLevel])

  const onZoomChanged = useCallback(() => {
    setZoomLevel(map.getZoom())
  }, [map])

  useEffect(() => {
    const listener = map.addListener('zoom_changed', onZoomChanged)
    return () => {
      listener.remove()
    }
  }, [map, onZoomChanged])

  return zoomLevel
}
