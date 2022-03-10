import type { ReactNode } from 'react'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import type { Position } from '../GoogleMaps'
import { useGoogleMapContext } from '../GoogleMaps'
import type { MiniIcon } from './shapes/MiniIcon'
import { getHoveredZIndex } from './utils/util'

const pointify = (google, [x, y]: number[]) => new google.maps.Point(x, y)
const sizeify = (google, [w, h]: number[]) => new google.maps.Size(w, h)

const toGooglePoint = (google, icon: google.maps.Icon, key: string) => {
  const target = icon[key]
  if (target && Array.isArray(target)) icon[key] = pointify(google, target)
}

const toGoogleSize = (google, icon: google.maps.Icon, key: string) => {
  const target = icon[key]
  if (target && Array.isArray(target)) icon[key] = sizeify(google, target)
}

const googlify = (google, icon: MiniIcon): google.maps.Icon => {
  const i = { ...icon } as Omit<MiniIcon, 'anchor'>
  toGooglePoint(google, i, 'anchor')
  toGooglePoint(google, i, 'labelOrigin')
  toGooglePoint(google, i, 'origin')
  toGoogleSize(google, i, 'scaledSize')
  toGoogleSize(google, i, 'size')
  return i
}

interface MarkerProps {
  position: Position
  riseOnHover: boolean
  zIndex?: number
  onHover?: (hovered: boolean) => void
  onClick?: () => void
  icon?: MiniIcon
  title: string
}

interface MarkerContextProps {
  marker: ReactNode
}

export const MarkerContext = createContext<MarkerContextProps>({ marker: null })

export const useMarkerContext = () => useContext(MarkerContext)

const Marker: React.FC<MarkerProps> = ({ icon, title, position, zIndex = 0, riseOnHover, onHover, onClick, children }) => {
  const [marker, setMarker] = useState<google.maps.Marker>()
  const { google, map } = useGoogleMapContext()

  const raise = useCallback(() => {
    marker.setTitle('') // remove title to get rid off default tooltip shown - marker has 'aria-label' set anyway
    if (riseOnHover) {
      marker.setZIndex(getHoveredZIndex(zIndex))
    }
    onHover && onHover(true)
  }, [marker, onHover, riseOnHover, zIndex])

  const lower = useCallback(() => {
    marker.setTitle(title) // set back 'title' so element could be located (but it has aria-label set anyway)
    if (riseOnHover) {
      marker.setZIndex(zIndex)
    }
    onHover && onHover(false)
  }, [marker, onHover, riseOnHover, title, zIndex])

  useEffect(() => {
    setMarker(
      new google.maps.Marker({
        position,
        map,
        optimized: false,
        title,
      }),
    )
  }, [google, map, position, title])

  useEffect(() => {
    if (marker) {
      if (riseOnHover || onHover) {
        marker.addListener('mouseover', raise)
        marker.addListener('mouseout', lower)
      }
      if (onClick) {
        marker.addListener('click', onClick)
      }
      return () => {
        google.maps.event.clearInstanceListeners(marker)
        marker.setMap(null)
      }
    }
  }, [google, lower, marker, onClick, onHover, raise, riseOnHover])

  useEffect(() => {
    marker && marker.setPosition(position)
  }, [marker, position])

  useEffect(() => {
    marker && icon && marker.setIcon(googlify(google, icon))
  }, [marker, icon, google])

  useEffect(() => {
    marker && marker.setZIndex(zIndex)
  }, [marker, zIndex])

  useEffect(() => {
    marker && marker.setMap(map)
  }, [marker, map])

  const contextValue = useMemo<MarkerContextProps>(() => ({ marker }), [marker])
  return <MarkerContext.Provider value={contextValue}>{children}</MarkerContext.Provider>
}

export default Marker
