import cn from 'clsx'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import IconButton from '@material-ui/core/IconButton'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import { BasicSearch, useInputFormControlStyles } from '@ues/assets'

import type { PositionFunc } from '../../GoogleMaps'
import { useGoogleMapContext } from '../../GoogleMaps'
import useStyles from './styles'

interface SearchInputProps {
  onSelect: (name: string, location: PositionFunc) => void
  disabled: boolean
}

export const SearchInput: React.FC<SearchInputProps> = memo(({ disabled, onSelect }) => {
  const { t } = useTranslation('behaviour/geozones-map')
  const { google, map } = useGoogleMapContext()
  const theme = useTheme()
  const styles = useStyles()
  const inputRef = useRef<HTMLInputElement>()
  const { iconButton } = useInputFormControlStyles(theme)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult>(null)
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete>(null)

  const reselectPlace = useCallback(() => {
    if (selectedPlace) {
      const { location } = selectedPlace.geometry
      onSelect(selectedPlace.name, location)
      map.panTo(location)
    }
  }, [map, onSelect, selectedPlace])

  const onInputKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (
        (event.code === 'Enter' || event.code === 'NumpadEnter') &&
        selectedPlace &&
        inputRef.current?.value === selectedPlace.name
      ) {
        reselectPlace()
      }
    },
    [reselectPlace, selectedPlace],
  )

  const onPlaceSelected = useCallback(() => {
    const place = autocomplete.getPlace()
    if (!place.geometry) {
      setSelectedPlace(null)
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

    setSelectedPlace(place)
    onSelect(place.name, place.geometry.location)
  }, [autocomplete, map, onSelect])

  useEffect(() => {
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current)
    autocomplete.bindTo('bounds', map)
    autocomplete.setFields(['geometry', 'name'])
    setAutocomplete(autocomplete)
  }, [google, map])

  useEffect(() => {
    if (autocomplete) {
      autocomplete.addListener('place_changed', onPlaceSelected)
      return () => {
        google.maps.event.clearInstanceListeners(autocomplete)
      }
    }
  }, [autocomplete, google, onPlaceSelected])

  useEffect(() => {
    const input = inputRef.current
    input.addEventListener('keyup', onInputKeyUp)
    return () => {
      input.removeEventListener('keyup', onInputKeyUp)
    }
  }, [onInputKeyUp])

  const selectInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.select()
      inputRef.current.focus()
      reselectPlace()
    }
  }, [reselectPlace])

  return (
    <TextField
      className={cn(styles.searchInput, 'no-label')}
      inputRef={inputRef}
      disabled={disabled}
      type="text"
      size="small"
      placeholder={t('operationBar.search.input')}
      InputProps={{
        classes: { root: styles.searchInputArea },
        endAdornment: (
          <IconButton
            aria-label={t('operationBar.search.iconAriaLabel')}
            onClick={selectInput}
            classes={{ root: iconButton }}
            disabled={disabled}
          >
            <BasicSearch />
          </IconButton>
        ),
      }}
    />
  )
})

export default SearchInput
