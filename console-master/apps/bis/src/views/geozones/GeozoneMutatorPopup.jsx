import PropTypes from 'prop-types'
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'
import FormHelperText from '@material-ui/core/FormHelperText'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { Select } from '@ues-bis/shared'
import { BasicClose } from '@ues/assets'

import { getCircleTopBottom, getPolygonTopBottom } from '../../googleMaps/util'
import { Context as GeozoneContext } from '../../providers/GeozoneListProvider'
import { Button, ButtonPanel, Icon, IconButton, RiskLevel } from '../../shared'
import styles from './CreateGeozone.module.less'
import Colors from './shapes/Colors'

// These are international miles, US survey miles are 3 mm larger.
const METRES_PER_MILE = 1609.344
const METRES_PER_KM = 1000
const NAME_LIMIT = 250

const getNameErrors = t => ({
  duplicate: { value: t('geozones.duplicateGeozoneName') },
  limitExceeded: { value: t('common.nameInvalid', { max: NAME_LIMIT }) },
  invalid: { hidden: true },
})

const metresToMiles = metres => metres / METRES_PER_MILE
const metresToKm = metres => metres / METRES_PER_KM
const milesToMetres = miles => miles * METRES_PER_MILE
const kmToMetres = km => km * METRES_PER_KM

const toMetres = (distance, unit) => {
  switch (unit) {
    case 'km':
      return kmToMetres(distance)
    case 'miles':
      return milesToMetres(distance)
  }
  return distance
}

const toUnit = (metres, unit) => {
  switch (unit) {
    case 'km':
      return metresToKm(metres)
    case 'miles':
      return metresToMiles(metres)
  }
  return metres
}

const onRadiusChanged = (circle, setRadius, unit) => {
  let radius = circle.getRadius()
  if (radius <= 0) {
    // If the radius is invalid or less than 1, set it to 1.
    radius = 1
  }

  if (radius !== circle.getRadius()) {
    circle.setRadius(radius)
  }
  setRadius(toUnit(radius, unit))
}

const GeozoneMutatorPopup = memo(
  ({
    id,
    showRadius,
    setPosition,
    onDone,
    shape,
    initialName,
    initialLevel,
    initialUnit,
    mutation,
    mutationState: { loading, error },
    children,
    // eslint-disable-next-line sonarjs/cognitive-complexity
  }) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const changeListener = useRef()
    const dragListener = useRef()
    const [name, setName] = useState(initialName || '')
    const [level, setLevel] = useState(initialLevel || RiskLevel.HIGH)
    const [unit, setUnit] = useState(initialUnit || 'km')
    // Radius will always be the value shown in the input field. However, the shape radius is always in metres.
    const [radius, setRadius] = useState(showRadius && toUnit(shape.getRadius(), unit))
    const ignoreRadiusCallback = useRef(false)
    const geozoneContext = useContext(GeozoneContext)
    const names = useMemo(() => {
      const { data } = geozoneContext
      if (!data) {
        return []
      }
      return data.filter(zone => zone.id !== id).map(zone => zone.name)
    }, [id, geozoneContext])
    const nameErrors = useMemo(() => getNameErrors(t), [t])

    const [nameError, setNameError] = useState(
      name === '' ? nameErrors.invalid : names.includes(name) ? nameErrors.duplicate : false,
    )
    const [radiusError, setRadiusError] = useState(false)

    useEffect(() => {
      shape.setEditable(true)
      shape.setDraggable(true)

      if (showRadius) {
        changeListener.current = shape.addListener('radius_changed', () => {
          if (ignoreRadiusCallback.current) {
            ignoreRadiusCallback.current = false
          } else {
            onRadiusChanged(shape, setRadius, unit)
            setPosition(getCircleTopBottom(shape))
          }
        })
        dragListener.current = shape.addListener('dragend', () => {
          setPosition(getCircleTopBottom(shape))
        })
      } else {
        changeListener.current = shape.addListener('mouseup', () => {
          setPosition(getPolygonTopBottom(shape))
        })
        dragListener.current = shape.addListener('dragend', () => {
          setPosition(getPolygonTopBottom(shape))
        })
      }

      return () => {
        if (shape && shape.google) {
          const removeListener = shape.google.maps.event.removeListener
          if (changeListener.current) {
            removeListener(changeListener.current)
            changeListener.current = null
          }
          if (dragListener.current) {
            removeListener(dragListener.current)
            dragListener.current = null
          }
        }
      }
    }, [shape, showRadius, setRadius, setPosition, unit, ignoreRadiusCallback])

    const onNameChange = useCallback(
      e => {
        const name = e.target.value
        if (name) {
          setName(name)
          const trimmedName = name.trim()
          if (trimmedName.length > NAME_LIMIT) {
            setNameError(nameErrors.limitExceeded)
          } else if (names.includes(trimmedName)) {
            setNameError(nameErrors.duplicate)
          } else if (!trimmedName) {
            setNameError(nameErrors.invalid)
          } else {
            setNameError(false)
          }
        } else {
          setName('')
          setNameError(nameErrors.invalid)
        }
      },
      [nameErrors.duplicate, nameErrors.invalid, nameErrors.limitExceeded, names],
    )

    const onLevelChange = useCallback(
      e => {
        const level = e.target.value
        setLevel(level)
        shape.setOptions(Colors.style(level, theme))
      },
      [setLevel, shape, theme],
    )

    const onRadiusChange = useCallback(
      e => {
        const radius = parseFloat(e.target.value)
        if (radius > 0) {
          let metreRadius
          if (unit === 'km') {
            metreRadius = kmToMetres(radius)
          } else if (unit === 'miles') {
            metreRadius = milesToMetres(radius)
          }

          setRadius(radius)
          setRadiusError(false)
          ignoreRadiusCallback.current = true
          shape.setRadius(metreRadius)
        } else {
          setRadius(e.target.value)
          setRadiusError(true)
        }
      },
      [unit, setRadius, setRadiusError, shape],
    )

    const onUnitChange = useCallback(
      e => {
        const newUnit = e.target.value
        // Changing the unit should keep the radius the same distance
        setUnit(newUnit)
        setRadius(toUnit(toMetres(radius, unit), newUnit))
      },
      [unit, setUnit, setRadius, radius],
    )

    const buildGeometry = useCallback(() => {
      if (showRadius) {
        return {
          type: 'Circle',
          center: {
            lat: shape.getCenter().lat(),
            lon: shape.getCenter().lng(),
          },
          radius: shape.getRadius(),
        }
      } else {
        // Warning: This only saves the first path in the polygon.
        // If we make the polygons editable so that people can add
        // holes, this will not store the holes.
        return {
          type: 'Polygon',
          coordinates: shape
            .getPath()
            .getArray()
            .map(latlng => [latlng.lat(), latlng.lng()]),
        }
      }
    }, [showRadius, shape])

    const onAdd = useCallback(async () => {
      const geometry = buildGeometry()
      mutation({
        variables: {
          id,
          input: {
            name: name.trim() || t('geozones.geozone'),
            risk: level,
            geometry,
            unit,
          },
        },
      })
    }, [mutation, id, name, level, buildGeometry, t, unit])

    const button = useMemo(() => {
      const disableAdd = loading || !!nameError || radiusError
      const addFn = disableAdd ? undefined : onAdd

      if (id) {
        return (
          <>
            <ButtonPanel
              p={0}
              buttons={[
                <Button onClick={onDone}>{t('common.cancel')}</Button>,
                <Button.Confirmation color="primary" loading={loading} onClick={addFn} disabled={disableAdd}>
                  {t('common.save')}
                </Button.Confirmation>,
              ]}
            />

            {error && <p>{t('geozones.errorUpdateGeozone')}</p>}
          </>
        )
      }
      return (
        <>
          <Button color="primary" loading={loading} onClick={addFn} disabled={disableAdd}>
            {t('geozones.add')}
          </Button>
          {error && <p>{t('geozones.errorCreateGeozone')}</p>}
        </>
      )
    }, [nameError, radiusError, onAdd, id, t, error, onDone, loading])

    const nameInputProps = useMemo(() => {
      return {
        error: !!nameError,
        onChange: onNameChange,
        value: name,
        inputProps: {
          'aria-labelledby': 'geozone-name',
          'data-testid': 'geozone-mutator-popup-geozone-name-input',
        },
        margin: 'none',
        label: t('geozones.geozoneName'),
        required: true,
        size: 'small',
        className: styles.largeInput,
      }
    }, [nameError, onNameChange, name, t])

    return (
      <div className={styles.dialog}>
        <IconButton size="small" className={styles.closeIcon} title={t('common.close')} onClick={onDone}>
          <Icon icon={BasicClose} />
        </IconButton>
        <div className={styles.formGroup}>
          {children && !Array.isArray(children) ? React.cloneElement(children, nameInputProps) : <TextField {...nameInputProps} />}
        </div>
        <div className={styles.formGroup}>
          <Select
            className={styles.largeInput}
            label={t('geozones.geozoneRiskLevel')}
            labelId="geozone-mutator-popup-risk-level-input-label"
            required
            inputProps={{ 'data-testid': 'geozone-mutator-popup-risk-level-input' }}
            onChange={onLevelChange}
            value={level}
            fullWidth
            size="small"
          >
            <MenuItem value={RiskLevel.HIGH}>{t('risk.level.HIGH')}</MenuItem>
            <MenuItem value={RiskLevel.MEDIUM}>{t('risk.level.MEDIUM')}</MenuItem>
            <MenuItem value={RiskLevel.LOW}>{t('risk.level.LOW')}</MenuItem>
          </Select>
        </div>
        {showRadius && (
          <div className={styles.formGroup}>
            <TextField
              className={styles.smallInput}
              type="number"
              onChange={onRadiusChange}
              error={!!radiusError && t('geozones.invalidRadius')}
              helperText={radiusError && <FormHelperText margin="dense" error />}
              value={radius}
              label={t('geozones.radius')}
              size="small"
              inputProps={{
                className: styles.radiusInnerInput,
                'data-testid': 'geozone-mutator-popup-radius-input',
              }}
            />

            <Select
              className={styles.smallInput}
              onChange={onUnitChange}
              required
              size="small"
              value={unit}
              inputProps={{
                'data-testid': 'geozone-mutator-popup-radius-unit-input',
              }}
            >
              <MenuItem value="miles">{t('geozones.miles')}</MenuItem>
              <MenuItem value="km">{t('geozones.km')}</MenuItem>
            </Select>
          </div>
        )}
        <div className={styles.hr} />
        {button}
      </div>
    )
  },
)

GeozoneMutatorPopup.propTypes = {
  id: PropTypes.string,
  showRadius: PropTypes.bool,
  setPosition: PropTypes.func.isRequired,
  position: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }).isRequired,
  invertedPosition: PropTypes.shape({
    lat: PropTypes.func.isRequired,
    lng: PropTypes.func.isRequired,
  }).isRequired,
  onDone: PropTypes.func.isRequired,
  shape: PropTypes.object.isRequired,
  initialName: PropTypes.string,
  initialLevel: PropTypes.oneOf([RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW]),
  initialUnit: PropTypes.string,
  mutation: PropTypes.func,
  mutationState: PropTypes.object,
}

GeozoneMutatorPopup.defaultProps = {
  showRadius: false,
  mutationState: {},
}

GeozoneMutatorPopup.displayName = 'GeozoneMutatorPopup'

export default GeozoneMutatorPopup
