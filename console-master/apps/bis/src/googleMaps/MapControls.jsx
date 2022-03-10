import classnames from 'classnames'
import React, { memo, useCallback, useContext, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'

import { ArrowLeft, BasicAdd, BasicMinus } from '@ues/assets'

import useClientParams from '../components/hooks/useClientParams'
import useGlobalActionListener from '../components/hooks/useGlobalActionListener'
import useToggle from '../components/hooks/useToggle'
import RiskType from '../components/RiskType'
import IconButton from '../components/widgets/IconButton'
import { environment } from '../environments/environment'
import MapOptionsProvider from '../providers/MapOptionsProvider'
import { Icon } from '../shared'
import styles from './MapControls.module.less'
import { Context as MapTypeContext, MapTypes } from './MapType'

export { MapTypes } from './MapType'

const { ROADMAP, TERRAIN, SATELLITE, HYBRID } = MapTypes

// extra stuff for language resource lookup
const LR_MAP = 'common.map'
const LR_SATELLITE = 'map.satellite'
const LR_LABEL = 'map.label'
const LR_TERRAIN = 'map.terrain'
const LR_BEHAVIOR = 'risk.common.identityRisk'
const LR_GEOZONE = 'common.geozoneRisk'

const RiskTypePicker = () => {
  const [mapOptions, toggleMapOption] = useContext(MapOptionsProvider.Context)
  const { t } = useTranslation()

  const behavioral = mapOptions.riskTypes.includes(RiskType.BEHAVIORAL)
  const geozone = mapOptions.riskTypes.includes(RiskType.GEOZONE)

  return (
    <div data-testid="riskTypePicker" className={styles.typeListRadio}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            className={styles.typeListInputCheckbox}
            checked={behavioral}
            name="option"
            onChange={e => {
              if (geozone || e.target.checked) {
                toggleMapOption(RiskType.BEHAVIORAL)
              }
            }}
          />
        }
        label={t(LR_BEHAVIOR)}
        className={styles.typeListLabel}
      />
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            className={styles.typeListInputCheckbox}
            checked={geozone}
            name="option"
            onChange={e => {
              if (behavioral || e.target.checked) {
                toggleMapOption(RiskType.GEOZONE)
              }
            }}
          />
        }
        label={t(LR_GEOZONE)}
        className={styles.typeListLabel}
      />
    </div>
  )
}

const TypeList = memo(({ hide, riskTypePicker }) => {
  const { t } = useTranslation()
  const { type: mapType, set: setMapType, get: getMapType } = useContext(MapTypeContext)

  // this is what we expect to show in the panel, based on the map style
  // actively being displayed
  const [isBaseTypeMap, optionLabel, optionValue, isOptionChecked] = useMemo(() => {
    if (mapType === ROADMAP || mapType === TERRAIN) {
      return [true, t(LR_TERRAIN), TERRAIN, mapType === TERRAIN]
    } else {
      return [false, t(LR_LABEL), HYBRID, mapType === HYBRID]
    }
  }, [mapType, t])

  const toggleOption = useCallback(
    ev => {
      const value = ev && ev.currentTarget && ev.currentTarget.value
      if (!value) return
      const mapType = getMapType()
      if (mapType === ROADMAP) setMapType(TERRAIN, true)
      else if (mapType === TERRAIN) setMapType(ROADMAP, true)
      else if (mapType === SATELLITE) setMapType(HYBRID, true)
      else if (mapType === HYBRID) setMapType(SATELLITE, true)
      // else... don't change anything...
    },
    [getMapType, setMapType],
  )

  const changeBaseMap = useCallback(
    ev => {
      const value = ev && ev.currentTarget && ev.currentTarget.value
      if (value) setMapType(value)
    },
    [setMapType],
  )

  return useMemo(() => {
    // whether or not we display the "select a map style" panel
    const styleTypeList = !hide ? styles.typeList : styles.typeListHidden

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        data-testid="typelist"
        className={styleTypeList}
        onClick={e => {
          e.stopPropagation()
          e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
        }}
      >
        {riskTypePicker ? (
          <>
            <RiskTypePicker />
            <div className={styles.hRule} />
          </>
        ) : null}
        <div className={styles.typeListRadio}>
          <FormControlLabel
            control={
              <Radio
                size="small"
                className={styles.typeListInputRadio}
                checked={isBaseTypeMap}
                name="type"
                onChange={changeBaseMap}
                value={ROADMAP}
                inputProps={{ 'data-testid': 'mapradio' }}
              />
            }
            label={t(LR_MAP)}
            className={styles.typeListLabel}
          />
          <FormControlLabel
            control={
              <Radio
                size="small"
                className={styles.typeListInputRadio}
                checked={!isBaseTypeMap}
                name="type"
                onChange={changeBaseMap}
                value={SATELLITE}
                inputProps={{ 'data-testid': 'satelliteradio' }}
              />
            }
            label={t(LR_SATELLITE)}
            className={styles.typeListLabel}
          />
        </div>
        <div className={styles.hRule} />
        <div data-testid="mapoption" className={styles.typeListOption}>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                className={styles.typeListInputCheckbox}
                checked={isOptionChecked}
                name="option"
                onChange={toggleOption}
                value={optionValue}
              />
            }
            label={optionLabel}
            className={styles.typeListLabel}
          />
        </div>
      </div>
    )
  }, [hide, riskTypePicker, changeBaseMap, isBaseTypeMap, t, optionValue, toggleOption, isOptionChecked, optionLabel])
})

const ZoomButtons = memo(({ mapRef, zoomLevel }) => {
  const { t } = useTranslation()
  const { privacyMode } = useClientParams()
  const privacyModeOn = privacyMode && privacyMode.mode
  const mapConfig = environment.map
  const zoomInState = useMemo(
    () => (privacyModeOn ? zoomLevel >= mapConfig.zoom.defaultMaxZoomPrivacyModeOn : zoomLevel >= mapConfig.zoom.defaultMaxZoom),
    [privacyModeOn, zoomLevel, mapConfig.zoom.defaultMaxZoomPrivacyModeOn, mapConfig.zoom.defaultMaxZoom],
  )
  const zoomOutState = useMemo(() => zoomLevel <= mapConfig.zoom.defaultMinZoom, [mapConfig.zoom.defaultMinZoom, zoomLevel])
  const zoomInLR = useMemo(() => t('map.zoomIn'), [t])
  const zoomOutLR = useMemo(() => t('map.zoomOut'), [t])
  const zoomIn = useCallback(() => mapRef && mapRef.setZoom(mapRef.getZoom() + 1), [mapRef])
  const zoomOut = useCallback(() => mapRef && mapRef.setZoom(mapRef.getZoom() - 1), [mapRef])
  return (
    <div data-testid="zoombuttons" className={styles.zoomButtons}>
      <IconButton
        data-testid="zoomin"
        className={styles.controlButton}
        onClick={zoomIn}
        disabled={zoomInState}
        title={zoomInLR}
        size="small"
      >
        <Icon aria-label={zoomInLR} icon={BasicAdd} />
      </IconButton>
      <IconButton
        data-testid="zoomout"
        className={styles.controlButton}
        onClick={zoomOut}
        disabled={zoomOutState}
        title={zoomOutLR}
        size="small"
      >
        <Icon aria-label={zoomOutLR} icon={BasicMinus} />
      </IconButton>
    </div>
  )
})

// Custom controls for zoom and map type selection
const Controls = memo(({ mapRef, noZoomButtons = false, noMapRiskType = false, zoomLevel }) => {
  const { t } = useTranslation()
  const [hideList, toggleList] = useToggle(true)
  const label = useMemo(() => t('map.toggleMapTypes'), [t])
  const controlsRef = useRef()

  const handleClickOutside = useCallback(
    event => {
      if ((!controlsRef.current || !controlsRef.current.contains(event.target)) && !hideList) {
        toggleList(event)
      }
    },
    [hideList, toggleList],
  )
  useGlobalActionListener(!hideList, handleClickOutside)

  const toggle = useCallback(
    e => {
      e.stopPropagation()
      e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
      toggleList(e)
    },
    [toggleList],
  )

  if (!mapRef) return null

  const toggleButtonStyle = classnames(styles.controlButton, styles.typeControl)
  return (
    <div data-testid="mapcontrol" className={styles.controls} ref={controlsRef}>
      <TypeList mapRef={mapRef} hide={hideList} riskTypePicker={!noMapRiskType} />
      <div>
        <IconButton data-testid="toggletypelist" onClick={toggle} title={label} className={toggleButtonStyle} size="small">
          <Icon aria-label={label} icon={ArrowLeft} className={hideList ? null : styles.flipHorizontal} />
        </IconButton>

        {noZoomButtons ? null : <ZoomButtons mapRef={mapRef} zoomLevel={zoomLevel} />}
      </div>
    </div>
  )
})

export default Controls
