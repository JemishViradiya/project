/* eslint-disable jsx-a11y/no-autofocus */
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getTimeZones } from '@vvo/tzdb'

import type { PopoverOrigin } from '@material-ui/core'
import { Box, IconButton, List, ListItem, ListItemText, ListSubheader, Popover, TextField, useTheme } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'
import { BasicCancel, BasicSearch, BasicTime, boxPaddingProps } from '@ues/assets'

const PopoverPosProps = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  } as PopoverOrigin,
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  } as PopoverOrigin,
  marginThreshold: 0,
}

interface TimeZonePickerProps {
  onBoxClick: (value: any) => void
  onListItemClick: (event: any, timeZoneName: string, timeZoneOffset: number) => void
  searchInput: string
  searchRef: any
  textFieldRef: any
  clearSearch: () => void
  onSearchChange: (value: any) => void
  selectedTimeZoneName: string
  popoverProps?: any
}

export const TimeZonePicker = ({
  onBoxClick,
  onListItemClick,
  searchInput,
  searchRef,
  textFieldRef,
  clearSearch,
  onSearchChange,
  selectedTimeZoneName,
  popoverProps,
}: TimeZonePickerProps) => {
  const theme = useTheme<UesTheme>()
  const alphabeticalTimeZoneList = getTimeZones().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 1))
  const { t } = useTranslation('components')

  const timeZoneList = useMemo(() => {
    const filterValue = searchInput.toLowerCase()
    return alphabeticalTimeZoneList.filter(
      element =>
        element.name.toLowerCase().includes(filterValue) ||
        element.countryName.toLowerCase().includes(filterValue) ||
        element.abbreviation.toLowerCase().includes(filterValue) ||
        `UTC${element.rawFormat.substring(0, 6)}`.toLowerCase().includes(filterValue),
    )
  }, [alphabeticalTimeZoneList, searchInput])

  return (
    <>
      <Box onClick={onBoxClick} {...boxPaddingProps} paddingBottom={0}>
        <TextField
          label={t('timeZonePicker.timeZone')}
          fullWidth={true}
          value={selectedTimeZoneName}
          ref={textFieldRef}
          InputProps={{
            readOnly: true,
            endAdornment: <BasicTime />,
          }}
        />
      </Box>
      <Popover
        {...popoverProps}
        {...PopoverPosProps}
        PaperProps={{
          className: 'timezone-picker',
          style: { width: '656px', maxHeight: '500px' },
        }}
      >
        <Box paddingTop={0} paddingLeft={4} paddingRight={4} paddingBottom={2}>
          <List disablePadding>
            <ListSubheader disableGutters>
              <Box paddingTop={4}>
                <TextField
                  className="no-label"
                  placeholder={t('timeZonePicker.searchPlaceholder')}
                  fullWidth={true}
                  inputRef={searchRef}
                  onChange={onSearchChange}
                  InputProps={{
                    startAdornment: <BasicSearch />,
                    endAdornment: (
                      <IconButton onClick={clearSearch}>
                        <BasicCancel />
                      </IconButton>
                    ),
                  }}
                ></TextField>
              </Box>
            </ListSubheader>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {timeZoneList.map(element => (
                <li key={element.name}>
                  <ListItem
                    disableGutters
                    button
                    onClick={event => onListItemClick(event, element.name, element.currentTimeOffsetInMinutes)}
                  >
                    <Box textAlign="right" style={{ paddingRight: 8 }}>
                      {element.name}
                    </Box>
                    <ListItemText secondary={`  ${element.countryName}, ${element.abbreviation}`} />
                    <Box paddingRight={4}>
                      <ListItemText
                        secondaryTypographyProps={{ align: 'right' }}
                        secondary={`UTC${element.currentTimeFormat.substring(0, 6)}`}
                      />
                    </Box>
                  </ListItem>
                </li>
              ))}
            </ul>
          </List>
        </Box>
      </Popover>
    </>
  )
}

export const useTimeZonePicker = (setTimeZoneOffset: (value: number) => void) => {
  const [popoverAnchorEl, setAnchorEl] = useState(null)

  const handlePopoverClick = useCallback(event => {
    setAnchorEl(textFieldRef.current)
  }, [])

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null)
    setSearchValue('')
  }, [])

  const popoverIsOpen = Boolean(popoverAnchorEl)

  const [selectedTimeZoneName, setSelectedTimeZoneName] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const textInput = useRef(null)
  const textFieldRef = useRef(null)

  const handleSearchClear = () => {
    textInput.current.value = ''
    setSearchValue('')
  }
  const handleSearchChange = value => {
    setSearchValue(value.target.value)
  }

  const handleListItemClick = (event: any, timeZoneName: string, timeZoneOffset: number) => {
    setSelectedTimeZoneName(timeZoneName)
    setTimeZoneOffset(timeZoneOffset)
    handlePopoverClose()
  }

  return {
    onBoxClick: handlePopoverClick,
    onListItemClick: handleListItemClick,
    searchInput: searchValue,
    searchRef: textInput,
    textFieldRef: textFieldRef,
    clearSearch: handleSearchClear,
    onSearchChange: handleSearchChange,
    selectedTimeZoneName: selectedTimeZoneName,
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
  }
}
