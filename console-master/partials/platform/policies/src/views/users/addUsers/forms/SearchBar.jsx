/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { FormControl, Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core'

import { BasicCancel, BasicSearch, useDefaultFormControlStyles } from '@ues/assets'

import { AddUserContext } from '../AddUserContext'
import UserList from './UserList'

const SearchBar = props => {
  const { setSearchValue, searchValue, clearSearch, fetchUsers, t, emptyResponse, resetFetchedUsers } = useContext(AddUserContext)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popperWidth, setPopperWidth] = useState(0)
  const [searchOptionsOpen, setSearchOptionsOpen] = useState(false)
  const classes = useDefaultFormControlStyles()
  const searchIconLabel = t(`general/form:commonLabels.${searchValue === '' ? 'search' : 'clear'}`)

  const handleTextChange = event => {
    const value = event.target.value
    if (!searchOptionsOpen) {
      setSearchOptionsOpen(true)
    }
    setSearchValue(value)
    if (value && value.length >= 3) {
      fetchUsers(value)
    } else {
      fetchUsers('')
    }
  }

  const handleSearchClick = event => {
    resetFetchedUsers()
    if (searchValue && searchValue.length >= 3) {
      fetchUsers(searchValue)
    } else {
      fetchUsers('')
    }
    setAnchorEl(event.currentTarget.parentNode)
    setPopperWidth(event.currentTarget.parentNode.offsetWidth)
    setSearchOptionsOpen(true)
  }

  const handleSearchClose = () => {
    setSearchOptionsOpen(false)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      fetchUsers(searchValue)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      handleSearchClose()
    }
    window.addEventListener('resize', handleResize)
  })

  return (
    <Grid item xs={12}>
      <Typography variant="h2">{t('users.add.search')}</Typography>
      <FormControl fullWidth classes={{ ...classes }} variant="outlined" margin="normal">
        <TextField
          id={uuidv4()}
          value={searchValue}
          onChange={handleTextChange}
          onFocus={handleSearchClick}
          onBlur={handleSearchClose}
          onKeyPress={handleKeyPress}
          autoComplete="new-password" // Disables autocomplete in Edge with autogenerated id
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label={searchIconLabel} edge="end" onClick={searchValue !== '' ? clearSearch : null}>
                  {searchValue !== '' ? <BasicCancel /> : <BasicSearch />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          label={t('users.add.input.search')}
        />
      </FormControl>
      <UserList
        anchorEl={anchorEl}
        popperWidth={popperWidth}
        searchOptionsOpen={searchOptionsOpen}
        emptyResponse={emptyResponse}
        handleSearchClose={handleSearchClose}
      />
    </Grid>
  )
}

export default SearchBar
