import React, { createContext, memo, useCallback, useMemo, useRef, useState } from 'react'

// map-ish maps
const ROADMAP = 'roadmap'
const TERRAIN = 'terrain' // roadmap plus elevation coloring
// satellite-ish maps
const SATELLITE = 'satellite'
const HYBRID = 'hybrid' // satellite plus labels

export const MapTypes = {
  ROADMAP,
  TERRAIN,
  SATELLITE,
  HYBRID,
}

const nextMapTypeRef = (value, prev) => ({
  type: value,
  hasTerrain: value === ROADMAP || value === TERRAIN ? value === TERRAIN : prev.hasTerrain,
  hasLabel: value === SATELLITE || value === HYBRID ? value === HYBRID : prev.hasLabel,
})

export const useMapType = mapRef => {
  const [mapType, setMapTypeState] = useState(() => localStorage.getItem('mapType') || ROADMAP)
  const localRef = useRef()
  if (!localRef.current) {
    localRef.current = nextMapTypeRef(mapType, { hasTerrain: mapType === TERRAIN, hasLabel: mapType === HYBRID })
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
      const typeId = mapRef.getMapTypeId()
      if (type !== typeId) {
        setMapTypeState(type)
      }
      localStorage.setItem('mapType', type)
      localRef.current = nextMapTypeRef(type, localRef.current)
    },
    [mapRef, setMapTypeState],
  )

  // make sure we set up our map properly
  if (mapRef) {
    const typeId = mapRef.getMapTypeId()
    if (typeId !== mapType) {
      mapRef.setMapTypeId(mapType)
    }
  }

  return useMemo(() => ({ type: mapType, set: setMapType, get: () => mapRef.getMapTypeId() }), [mapRef, mapType, setMapType])
}

export const Context = createContext()

export const Provider = memo(({ map, children }) => {
  const value = useMapType(map)
  return <Context.Provider value={value}>{children}</Context.Provider>
})
