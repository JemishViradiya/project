import React, { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DialogChildren } from '@ues/behaviours'

import type { PositionFunc } from '../../GoogleMaps'
import Popup from '../../Popup'
import type { GeozoneEntity, GeozoneShape } from '../model'
import { GeozoneType, GeozoneUnit } from '../model'
import {
  convertDistanceToMetres,
  convertMetresToUnit,
  getCirclePosition,
  getPolygonPosition,
  getZoneSize,
  mapShapeToGeometry,
} from '../utils/util'
import Actions from './Actions'
import Content from './Content'
import { useName } from './use-name'
import { useRadius } from './use-radius'

interface EditGeozoneProps {
  zone?: GeozoneEntity
  onSave: (zone: GeozoneEntity) => void
  onDelete: (zone: GeozoneEntity) => void
  onCancel: () => void
  position: PositionFunc
  invertedPosition: PositionFunc
  shape: GeozoneShape
  shapeType: GeozoneType
  setPopupPosition: ({ normal, inverted }: { normal: PositionFunc; inverted: PositionFunc }) => void
  saving?: boolean
  initialName: string
  canHaveName?: (name: string) => string
}

const onCircleChanged = (circle, setRadius, unit) => {
  let radius = circle.getRadius()
  if (radius <= 0) {
    // If the radius is invalid or less than 1, set it to 1.
    radius = 1
  }

  if (radius !== circle.getRadius()) {
    circle.setRadius(radius)
  }
  setRadius(convertMetresToUnit(radius, unit))
}

const getDefaultUnit = (zone: GeozoneEntity) => zone?.unit ?? GeozoneUnit.km

const EditGeozone: React.FC<EditGeozoneProps> = memo(
  ({
    zone,
    onSave,
    onDelete,
    onCancel,
    position,
    invertedPosition,
    shape,
    shapeType,
    setPopupPosition,
    saving,
    initialName,
    canHaveName,
  }) => {
    const { t } = useTranslation('behaviour/geozones-map')
    const isCircle = shapeType === GeozoneType.Circle
    const [open, setOpen] = useState(false)
    const [name, nameError, onNameChange] = useName(zone?.name ?? (initialName || ''), canHaveName)
    const [unit, setUnit] = useState(getDefaultUnit(zone))
    const [radius, radiusError, onRadiusChange, setRadius, ignoreRadiusCallback] = useRadius(
      isCircle ? convertMetresToUnit((shape as google.maps.Circle).getRadius(), unit) : null,
      shape,
      unit,
    )
    const [shapeChanged, setShapeChanged] = useReducer(s => s + 1, 0)

    useEffect(() => {
      setUnit(getDefaultUnit(zone))
    }, [zone])

    const onClose = useCallback(() => {
      setOpen(false)
      onCancel()
    }, [onCancel])

    useEffect(() => {
      shape.setEditable(true)
      shape.setDraggable(true)

      if (isCircle) {
        const circle = shape as google.maps.Circle
        circle.addListener('radius_changed', () => {
          if (ignoreRadiusCallback.current) {
            ignoreRadiusCallback.current = false
          } else {
            onCircleChanged(circle, setRadius, unit)
            setPopupPosition(getCirclePosition(circle))
          }
        })
        circle.addListener('dragend', () => {
          setPopupPosition(getCirclePosition(circle))
        })
      } else {
        const polygon = shape as google.maps.Polygon
        polygon.addListener('mouseup', () => {
          setPopupPosition(getPolygonPosition(polygon))
          setShapeChanged()
        })
        polygon.addListener('dragend', () => {
          setPopupPosition(getPolygonPosition(polygon))
          setShapeChanged()
        })
      }

      return () => {
        if (shape) {
          google.maps.event.clearInstanceListeners(shape)
        }
      }
    }, [shape, setRadius, unit, ignoreRadiusCallback, setPopupPosition, isCircle])

    const onUnitChange = useCallback(
      e => {
        const newUnit = e.target.value
        // Changing the unit should keep the radius the same distance
        setUnit(newUnit)
        setRadius(convertMetresToUnit(convertDistanceToMetres(radius, unit), newUnit))
      },
      [unit, setUnit, setRadius, radius],
    )

    const onSaveClick = useCallback(() => {
      onSave({
        id: zone?.id,
        unit,
        name,
        ...mapShapeToGeometry({
          shape,
          type: isCircle ? GeozoneType.Circle : GeozoneType.Polygon,
        }),
      })
    }, [isCircle, name, onSave, shape, unit, zone?.id])

    const onDeleteClick = useCallback(() => {
      onDelete(zone)
    }, [onDelete, zone])

    const shapeSize = useMemo(
      () =>
        getZoneSize(
          mapShapeToGeometry({
            shape,
            type: shapeType,
          }).geometry,
          shapeType,
          unit,
        ),
      // we want to have 'shapeChanged' in dependencies to react on polygon size changes and 'radius' to react on circle size changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [shape, shapeType, unit, shapeChanged, radius],
    )

    const isSaveDisabled = saving || !name || !!nameError || radiusError

    useEffect(() => {
      if (position) {
        setOpen(true)
      }
    }, [position])

    return (
      <Popup open={open} onClose={onClose} position={position} invertedPosition={invertedPosition} stayOpen>
        <div role="dialog">
          <DialogChildren
            title={t(shapeType === GeozoneType.Circle ? 'popupGeozone.titleCircle' : 'popupGeozone.titlePolygon')}
            content={
              <Content
                isCircle={isCircle}
                name={name}
                nameError={nameError}
                onNameChange={onNameChange}
                radius={radius}
                radiusError={radiusError}
                onRadiusChange={onRadiusChange}
                unit={unit}
                onUnitChange={onUnitChange}
                shapeSize={shapeSize}
              />
            }
            actions={
              <Actions
                deletable={!!zone}
                canSave={!isSaveDisabled}
                saving={saving}
                onDeleteClick={onDeleteClick}
                onCloseClick={onClose}
                onSaveClick={onSaveClick}
              />
            }
          />
        </div>
      </Popup>
    )
  },
)

export default EditGeozone
