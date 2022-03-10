import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Position, PositionFunc } from '../../GoogleMaps'
import { useCoordinatedDataSelectionContext } from '../CoordinatedDataSelectionProvider'
import Marker from '../Marker'
import type { GeozoneEntity } from '../model'
import { GeozoneType } from '../model'
import { useShapeOptions } from '../utils/use-shape-options'
import MiniIcon from './MiniIcon'
import { Shape } from './Shape'

export interface ZoneOptions {
  key?: string | number
  zone: GeozoneEntity
  zoom: number
}

interface ZoneProps extends ZoneOptions {
  markerZIndex?: number
  useIcon: boolean
  markerPosition: PositionFunc
}

const Zone: React.FC<ZoneProps> = ({ zone, markerPosition, useIcon, markerZIndex = 1 }) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const {
    selected: selectedZone,
    highlighted: highlightedZone,
    select: selectGeozone,
    highlight: highlightGeozone,
  } = useCoordinatedDataSelectionContext()
  const selected = selectedZone?.id === zone.id
  const highlighted = highlightedZone?.id === zone.id || selected

  const onHoverStart = useMemo(() => {
    if (!highlightGeozone) {
      return null
    }
    return () => highlightGeozone(zone)
  }, [zone, highlightGeozone])

  const onHoverEnd = useMemo(() => {
    if (!highlightGeozone) {
      return null
    }
    return () => highlightGeozone(null)
  }, [highlightGeozone])

  const onHover = useMemo(
    () => value => {
      if (!highlightGeozone) {
        return null
      }
      value ? onHoverStart() : onHoverEnd()
    },
    [highlightGeozone, onHoverStart, onHoverEnd],
  )

  const onSelected = useCallback(() => {
    selectGeozone && selectGeozone(zone)
  }, [selectGeozone, zone])

  const shapeType = zone.type === 'circle' ? GeozoneType.Circle : GeozoneType.Polygon
  const shapeOptions = useShapeOptions(zone.geometry, shapeType)
  const highlightOptions = useShapeOptions(zone.geometry, shapeType, true)

  const shape = useMemo(
    () => (
      <Shape type={shapeType} options={shapeOptions} onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} onClick={onSelected} />
    ),
    [shapeOptions, onHoverStart, onHoverEnd, onSelected, shapeType],
  )

  const highlightShape = useMemo(() => (highlighted ? <Shape type={shapeType} options={highlightOptions} strokeOutside /> : null), [
    highlighted,
    shapeType,
    highlightOptions,
  ])

  const icon = useMemo(() => MiniIcon({ highlighted, fillColor: shapeOptions.fillColor, shapeType }), [
    highlighted,
    shapeOptions.fillColor,
    shapeType,
  ])

  const positionObject = useMemo<Position>(
    () => ({
      lat: markerPosition.lat(),
      lng: markerPosition.lng(),
    }),
    [markerPosition],
  )

  if (useIcon) {
    return selected ? null : (
      <Marker
        title={t('marker.zoneAriaLabel', { name: zone.name })}
        zIndex={markerZIndex}
        icon={icon}
        riseOnHover
        onHover={onHover}
        onClick={onSelected}
        position={positionObject}
      />
    )
  } else {
    return (
      <>
        {selected ? null : highlightShape}
        {selected ? null : shape}
      </>
    )
  }
}

export default Zone
