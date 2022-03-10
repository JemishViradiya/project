import PropTypes from 'prop-types'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { InputAdornment, TextField } from '@material-ui/core/'

import { BasicSearch } from '@ues/assets'

import { Icon } from '../shared'
import { useMapContext } from './Map'
import styles from './SearchInput.module.less'

export const SearchInput = memo(({ disabled, onSelect }) => {
  const { t } = useTranslation()
  const { google, map } = useMapContext()
  const inputRef = useRef()
  const [autocomplete, setAutocomplete] = useState()
  const local = useRef({})

  local.current.load = useCallback(() => {
    if (inputRef && map && google) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current)
      autocomplete.bindTo('bounds', map)
      autocomplete.setFields(['geometry', 'name'])
      local.current.placeChangedListenerId = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) {
          console.warn('No place found')
          return
        }

        // Due to map constraints, we need to ensure that we zoom in a lot first otherwise
        // when we fit bounds, we may get pushed away from our desired center.
        map.setZoom(17)
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport)
        } else {
          map.setCenter(place.geometry.location)
        }

        if (onSelect) {
          onSelect({ name: place.name, location: place.geometry.location })
          inputRef.current.value = ''
        }
      })
      setAutocomplete(autocomplete)
    }
  }, [google, map, onSelect])

  useEffect(() => {
    local.current.load()
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const { placeChangedListenerId } = local.current
      if (placeChangedListenerId) google.maps.event.removeListener(placeChangedListenerId)
    }
  }, [google])

  const selectInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select()
      inputRef.current.focus()
    }
  }, [])

  if (!autocomplete) {
    local.current.load()
  }

  return (
    <TextField
      className={styles.input}
      inputRef={inputRef}
      disabled={disabled}
      type="text"
      placeholder={t('geozones.addGeozone')}
      margin="none"
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Icon className={styles.icon} icon={BasicSearch} onClick={selectInput} />
          </InputAdornment>
        ),
      }}
    />
  )
})

SearchInput.propTypes = {
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
}

SearchInput.defaultProps = {
  onSelect: () => {},
  disabled: false,
}

export default SearchInput
