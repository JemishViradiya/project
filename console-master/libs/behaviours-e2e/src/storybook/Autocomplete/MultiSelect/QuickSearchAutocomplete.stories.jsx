/* eslint-disable jsx-a11y/no-autofocus */
// dependencies
import cond from 'lodash/cond'
import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
// components
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import TextField from '@material-ui/core/TextField'
// utils
import useAutocomplete from '@material-ui/lab/useAutocomplete'

import { BasicCancel, BasicSearch } from '@ues/assets'
import { unboundServerAutocompleteProps } from '@ues/behaviours'

import { highlightMatch } from './../../Autocomplete/autocomplete.utils'

export const QuickSearchAutocomplete = ({
  defaultValue,
  suggestions = [],
  getSuggestions,
  getSuggestionLabel,
  onSelectedItemChange,
  selectedItems = [],
  helperText,
}) => {
  const {
    inputValue,
    groupedOptions,
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
  } = useAutocomplete({
    ...unboundServerAutocompleteProps(suggestions, getSuggestions),
    defaultValue,
    options: suggestions,
    disableCloseOnSelect: true,
    multiple: true,
    open: true,
  })

  // utils

  const selectedItemsIds = selectedItems.map(item => item.id)

  const endAdornment = cond([
    [
      () => inputValue,
      () => (
        <IconButton {...getClearProps()}>
          <BasicCancel />
        </IconButton>
      ),
    ],
    [() => true, () => null],
  ])()

  return (
    <Box {...getRootProps()} width={'100%'}>
      <TextField
        fullWidth
        autoFocus
        helperText={helperText}
        className="no-label"
        InputProps={{
          ...getInputProps(),
          startAdornment: <BasicSearch />,
          endAdornment,
        }}
      />
      {groupedOptions && groupedOptions.length ? (
        <MenuList
          {...getListboxProps()}
          style={{
            maxHeight: 'calc(100% - 72px)',
            overflow: 'auto',
          }}
        >
          {groupedOptions.map((option, index) => {
            return (
              <MenuItem key={index} button {...getOptionProps({ option, index })} onClick={() => onSelectedItemChange(option)}>
                <ListItemIcon>
                  <Checkbox checked={selectedItemsIds.includes(option.id)} value={index} edge="start" />
                </ListItemIcon>
                <ListItemText
                  primary={highlightMatch(getSuggestionLabel(option), inputValue)}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: 'textPrimary',
                  }}
                />
              </MenuItem>
            )
          })}
        </MenuList>
      ) : null}
    </Box>
  )
}

QuickSearchAutocomplete.decorators = [
  storyFn => {
    const [suggestions, setSuggestions] = useState([])
    const [selectedItems, setSelectedItems] = useState([])

    const onSelectedItemChange = item => {
      const isExist = selectedItems.findIndex(({ id }) => item.id === id)
      if (isExist > -1) {
        setSelectedItems(selectedItems.filter(({ id }) => item.id !== id))
      } else {
        setSelectedItems([...selectedItems, item])
      }
    }

    const getSuggestions = value => {
      const suggest =
        value && value.length >= 3
          ? [
              {
                id: 'f075f715-3b06-4f4e-b615-bfa7ff64cf66',
                userName: 'Evan Bailey',
              },
              {
                id: '682cfc5c-bd79-4c7a-b03d-9c3f8fb27796',
                userName: 'Jonathan Butler',
              },
              {
                id: '54d302c1-401a-4af4-9337-99ac5c9b331a',
                userName: 'Sebastian Carr',
              },
              {
                id: '713a55ee-384c-470a-b32c-4cac566e4df2',
                userName: 'Trevor Davies',
              },
            ]
          : []

      setSuggestions(suggest)
    }

    const props = {
      defaultValue: [],
      suggestions,
      getSuggestions,
      getSuggestionLabel: ({ userName }) => userName,
      onSelectedItemChange,
      selectedItems,
      helperText: 'helperText',
    }

    return storyFn(props)
  },
]
