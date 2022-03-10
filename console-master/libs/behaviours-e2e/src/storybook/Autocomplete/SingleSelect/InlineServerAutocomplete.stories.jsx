// dependencies
import cond from 'lodash/cond'
import React, { useState } from 'react'

// components
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import TextField from '@material-ui/core/TextField'
import useAutocomplete from '@material-ui/lab/useAutocomplete'

import { BasicCancel } from '@ues/assets'
import { unboundServerAutocompleteProps } from '@ues/behaviours'

// data
import { mockServerData } from './../autocomplete.data'
// utils
import { highlightMatch } from './../autocomplete.utils'

export const InlineServerAutocomplete = () => {
  // simulate fetching options from an external source
  const [options, setOptions] = useState([])
  const getOptions = value => setOptions(value ? mockServerData : [])

  const {
    inputValue,
    groupedOptions,
    getRootProps,
    getInputProps,
    getClearProps,
    getListboxProps,
    getOptionProps,
  } = useAutocomplete({
    ...unboundServerAutocompleteProps(options, getOptions),
    options,
  })

  // utils

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
    <Box {...getRootProps()}>
      <TextField
        fullWidth
        className="no-label"
        {...getInputProps()}
        InputProps={{
          endAdornment,
        }}
      />
      {cond([
        [
          () => groupedOptions && groupedOptions.length,
          () => (
            <MenuList {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <MenuItem key={index} button {...getOptionProps({ option, index })}>
                  {highlightMatch(option, inputValue)}
                </MenuItem>
              ))}
            </MenuList>
          ),
        ],
        [() => true, () => null],
      ])()}
    </Box>
  )
}
