import cn from 'classnames'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Theme } from '@material-ui/core/'
import { Checkbox, Divider, FormControlLabel, Icon, IconButton, makeStyles, Menu, MenuItem, Radio } from '@material-ui/core/'

import { BasicLayers } from '@ues/assets'

import { useGoogleMapContext } from '../../GoogleMaps'
import { Tooltip } from '../../Tooltip'
import { useMapType } from './useMapType'

interface MapTypeControlsContainerProps {
  existsAlone: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
  typeList: {
    marginLeft: -53,
    marginTop: -20,
    minWidth: 150,
  },
  typeListInput: {
    padding: '4px',
  },
  controlButton: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
  },
  typeControl: {
    marginBottom: 10,
  },
}))

interface MapTypeControlsProps {
  anchorEl: Element
  isBaseTypeMap: boolean
  optionLabel: string
  optionValue: string
  isOptionChecked: boolean
  hide: boolean
  toggle: () => void
  toggleOption: () => void
  changeBaseMap: (e: React.FormEvent<HTMLInputElement>) => void
}

const MapTypeControls: React.FC<MapTypeControlsProps> = memo(
  ({ toggle, hide, anchorEl, isBaseTypeMap, changeBaseMap, isOptionChecked, toggleOption, optionValue, optionLabel }) => {
    const styles = useStyles()
    const { t } = useTranslation('behaviour/google-maps')
    const { ROADMAP, SATELLITE } = google.maps.MapTypeId
    return useMemo(() => {
      return (
        <Menu
          className={styles.typeList}
          anchorEl={anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          keepMounted
          open={!hide}
          onClose={toggle}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Radio
                  size="small"
                  className={styles.typeListInput}
                  checked={isBaseTypeMap}
                  name="type"
                  onChange={changeBaseMap}
                  value={ROADMAP}
                />
              }
              label={t('common.map')}
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Radio
                  size="small"
                  className={styles.typeListInput}
                  checked={!isBaseTypeMap}
                  name="type"
                  onChange={changeBaseMap}
                  value={SATELLITE}
                />
              }
              label={t('satellite')}
            />
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              onClick={event => event.stopPropagation()}
              control={
                <Checkbox
                  size="small"
                  className={styles.typeListInput}
                  checked={isOptionChecked}
                  name="option"
                  onChange={toggleOption}
                  value={optionValue}
                />
              }
              label={optionLabel}
            />
          </MenuItem>
        </Menu>
      )
    }, [
      ROADMAP,
      SATELLITE,
      anchorEl,
      changeBaseMap,
      hide,
      isBaseTypeMap,
      isOptionChecked,
      optionLabel,
      optionValue,
      styles.typeList,
      styles.typeListInput,
      t,
      toggle,
      toggleOption,
    ])
  },
)

export const MapTypeControlsContainer: React.FC<MapTypeControlsContainerProps> = memo(({ existsAlone }) => {
  const styles = useStyles({ existsAlone: existsAlone })
  const { t } = useTranslation('behaviour/google-maps')
  const { google, map, mapContainerRef } = useGoogleMapContext()

  const { ROADMAP, TERRAIN, HYBRID, SATELLITE } = google?.maps?.MapTypeId
  const [hideTypeList, setHideTypeList] = useState(true)
  const label = useMemo(() => t('toggleMapTypes'), [t])

  const toggleTypeListOpen = useCallback(() => {
    setHideTypeList(!hideTypeList && !!google)
  }, [google, hideTypeList])

  const { type: mapType, set: setMapType, get: getMapType } = useMapType(map)

  const [isBaseTypeMap, optionLabel, optionValue, isOptionChecked] = useMemo(() => {
    if (mapType === ROADMAP || mapType === TERRAIN) {
      return [true, t('terrain'), TERRAIN, mapType === TERRAIN]
    } else {
      return [false, t('label'), HYBRID, mapType === HYBRID]
    }
  }, [HYBRID, ROADMAP, TERRAIN, mapType, t])

  const toggleOption = useCallback(() => {
    const mapType = getMapType()

    if (mapType === ROADMAP) setMapType(TERRAIN, true)
    else if (mapType === TERRAIN) setMapType(ROADMAP, true)
    else if (mapType === SATELLITE) setMapType(HYBRID, true)
    else if (mapType === HYBRID) setMapType(SATELLITE, true)
  }, [HYBRID, ROADMAP, SATELLITE, TERRAIN, getMapType, setMapType])

  const changeBaseMap = useCallback(
    e => {
      const value = e?.currentTarget?.value
      if (value) setMapType(value, false)
    },
    [setMapType],
  )

  return (
    <div data-testid="mapcontrol">
      <MapTypeControls
        hide={hideTypeList}
        anchorEl={mapContainerRef?.current}
        optionLabel={optionLabel}
        optionValue={optionValue}
        toggleOption={toggleOption}
        toggle={toggleTypeListOpen}
        isBaseTypeMap={isBaseTypeMap}
        changeBaseMap={changeBaseMap}
        isOptionChecked={isOptionChecked}
      />
      <Tooltip title={label}>
        <div className={cn({ [styles.controlButton]: true, [styles.typeControl]: !existsAlone })}>
          <IconButton onClick={toggleTypeListOpen} size="small" aria-label={label}>
            <Icon component={BasicLayers} />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  )
})

export default MapTypeControlsContainer
