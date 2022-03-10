import { throttle } from 'lodash-es'
import React, { useCallback, useEffect, useState } from 'react'

import type { InputBaseProps } from '@material-ui/core'
import { IconButton, InputBase, makeStyles, Paper } from '@material-ui/core'

import { BasicClose, BasicSearch } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  searchContainer: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  closeSearch: {
    marginLeft: 'auto',
  },
  searchIndicator: {
    color: theme.palette.secondary.main,
    marginRight: theme.spacing(2),
  },
  inputField: {
    width: '100%',
  },
}))

export type TableSearchPanelProps = {
  onSearch: (value: string) => unknown
  onReset: () => unknown
  searchPlaceholder: InputBaseProps['placeholder']
  isInputFocused?: boolean
}

export const TableSearchPanel = ({ onSearch, onReset, searchPlaceholder, isInputFocused }: TableSearchPanelProps): JSX.Element => {
  const classes = useStyles()
  const [search, setSearch] = useState('')
  const sendSearch = throttle(str => onSearch(str), 3000)

  const resetSearch = useCallback(() => {
    setSearch('')
    onReset()
    onSearch(undefined)
  }, [onSearch, onReset])

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      onReset()
    }
  }

  useEffect(() => {
    sendSearch(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <Paper elevation={10} square className={classes.searchContainer}>
      <BasicSearch className={classes.searchIndicator} />
      <InputBase
        inputRef={input => isInputFocused && input && input.focus()}
        placeholder={searchPlaceholder}
        value={search}
        onChange={event => setSearch(event.target.value)}
        onKeyPress={handleKeyPress}
        className={classes.inputField}
      />
      <IconButton onClick={resetSearch} className={classes.closeSearch}>
        <BasicClose />
      </IconButton>
    </Paper>
  )
}
