import { useCallback, useMemo, useRef, useState } from 'react'

interface MapTypeRefInterface {
  type: google.maps.MapTypeId
  hasTerrain: boolean
  hasLabel: boolean
}

const nextMapTypeRef = (value: google.maps.MapTypeId, prev) => ({
  type: value,
  hasTerrain:
    value === google.maps.MapTypeId.ROADMAP || value === google.maps.MapTypeId.TERRAIN
      ? value === google.maps.MapTypeId.TERRAIN
      : prev.hasTerrain,
  hasLabel:
    value === google.maps.MapTypeId.SATELLITE || value === google.maps.MapTypeId.HYBRID
      ? value === google.maps.MapTypeId.HYBRID
      : prev.hasLabel,
})

export const useMapType = mapRef => {
  const { ROADMAP, TERRAIN, HYBRID, SATELLITE } = google?.maps?.MapTypeId
  const [mapType, setMapTypeState] = useState<google.maps.MapTypeId>(
    () => google?.maps?.MapTypeId[localStorage.getItem('mapType')?.toUpperCase()] || ROADMAP,
  )

  const localRef = useRef<MapTypeRefInterface>(null)
  if (!localRef.current) {
    localRef.current = nextMapTypeRef(mapType, {
      hasTerrain: mapType === TERRAIN,
      hasLabel: mapType === HYBRID,
    })
  }

  const setMapType = useCallback(
    (type, force) => {
      if (!force) {
        if (type === ROADMAP) {
          type = localRef.current.hasTerrain ? TERRAIN : ROADMAP
        } else if (type === SATELLITE) {
          type = localRef.current.hasLabel ? HYBRID : SATELLITE
        }
      }
      const typeId = mapRef?.getMapTypeId()
      if (type !== typeId) {
        setMapTypeState(type)
      }
      localStorage.setItem('mapType', type)
      localRef.current = nextMapTypeRef(type, localRef.current)
    },
    [HYBRID, ROADMAP, SATELLITE, TERRAIN, mapRef],
  )

  if (mapRef) {
    const typeId = mapRef.getMapTypeId()
    if (typeId !== mapType) {
      mapRef.setMapTypeId(mapType)
    }
  }

  return useMemo(() => ({ type: mapType, set: setMapType, get: () => mapRef?.getMapTypeId() }), [mapRef, mapType, setMapType])
}
