//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { throttle } from 'lodash-es'
import isArray from 'lodash-es/isArray'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Box, IconButton, makeStyles, TextField } from '@material-ui/core'
import { XGrid as MuiXGrid } from '@material-ui/x-grid'

import { BasicCancel, BasicSearch } from '@ues/assets'

import { useOptionsInputBackspaceEventHandler } from '../hooks'
import type { EnhancedSearchAsyncFieldProps, EnhancedSearchFieldOption, EnhancedSearchListFieldProps } from '../types'
import { CheckboxFieldItem } from './Checkbox'

interface ListFieldProps extends Pick<EnhancedSearchListFieldProps, 'onFetchMore' | 'onSearch'> {
  searchValue?: string
  updateSearchField: (value: string) => void
  onChange: (data: EnhancedSearchFieldOption[]) => void
  values: EnhancedSearchFieldOption[]
  asyncProps: EnhancedSearchAsyncFieldProps
}

const getRowId = (row: EnhancedSearchFieldOption) => row.value

const makeDefaultValue = (data = [], values = []) => {
  const valuesMap = isArray(values) ? values?.reduce((acc, item) => ({ ...acc, [item.value]: item }), {}) : {}

  return data.reduce((acc, option) => ({ ...acc, [option.value]: { ...option, checked: !!valuesMap[option.value] } }), {})
}

const useStyles = makeStyles(theme => ({
  listContainer: {
    width: '100%',
    height: '100%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  listSearchContainer: {
    padding: `0 ${theme.spacing(4)}px`,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: 240,
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(6),
    },
    '& .MuiInputBase-adornedStart': {
      padding: `0 ${theme.spacing(2)}px`,
    },
    '& input': {
      padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    },
  },
  listTableContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',

    '& .MuiDataGrid-main': {
      minHeight: 200,
    },
    '& .MuiDataGrid-cell': {
      padding: `0 ${theme.spacing(2)}px`,
      border: 'none',
    },
    '& label:hover': {
      background: 'transparent',
    },
    '& checkbox:hover': {
      background: 'transparent',
    },
    '& span.MuiFormControlLabel-label': {
      maxWidth: 190,
    },
  },
}))

export const ListField: React.FC<ListFieldProps> = ({
  searchValue = '',
  onSearch,
  onFetchMore,
  onChange,
  values,
  asyncProps,
  updateSearchField,
}) => {
  const { options, loading, total } = asyncProps
  const classes = useStyles()

  const [searchInputValue, setSearchInputValue] = useState<string>(searchValue)
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(makeDefaultValue(options, values))
  const searchInputRef = useRef<HTMLInputElement>()

  useOptionsInputBackspaceEventHandler(searchInputRef)

  useEffect(() => {
    setCheckboxGroupValue(makeDefaultValue(options, values))
  }, [options, values, values.length])

  const throttledOnSearch = useMemo(() => throttle(value => onSearch(value), 600), [onSearch])

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value)
    updateSearchField(value)
    throttledOnSearch(value)
  }

  const handleCheckboxChange = option => {
    const updated: EnhancedSearchFieldOption = {
      ...checkboxGroupValue,
      [option.value]: {
        ...option,
        checked: !checkboxGroupValue[option.value]?.checked,
      },
    }
    setCheckboxGroupValue(updated)
    onChange(Object.values(updated).filter(({ checked }) => checked))
  }

  const columns = [
    {
      field: 'option',
      flex: 1,
      renderCell: ({ row, id }) => {
        return (
          <CheckboxFieldItem
            index={id}
            item={row}
            onChange={handleCheckboxChange}
            checked={checkboxGroupValue[row.value]?.checked}
          />
        )
      },
    },
  ]

  const handleRowsScrollEnd = () => {
    const nextOffset = options.length

    if (nextOffset >= total) return

    if (typeof onFetchMore === 'function') {
      onFetchMore({ offset: nextOffset, searchValue: searchInputValue })
    }
  }

  return (
    <Box
      className={classes.listContainer}
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
      }}
    >
      <Box className={classes.listSearchContainer} onClick={() => searchInputRef?.current?.focus()}>
        <TextField
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          inputRef={searchInputRef}
          onChange={({ target: { value } }) => {
            handleSearchChange(value)
            updateSearchField(value)
          }}
          onClick={() => searchInputRef?.current?.focus()}
          value={searchInputValue}
          size="small"
          InputProps={{
            startAdornment: <BasicSearch fontSize="small" />,
            endAdornment: (
              <IconButton onClick={() => handleSearchChange('')} disabled={!searchInputValue?.length}>
                <BasicCancel fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>

      <Box className={classes.listTableContainer}>
        <MuiXGrid
          hideFooter
          hideFooterSelectedRowCount
          hideFooterPagination
          disableColumnReorder
          disableSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnResize
          disableColumnSelector
          disableDensitySelector
          disableMultipleColumnsFiltering
          disableMultipleColumnsSorting
          disableMultipleSelection
          disableExtendRowFullWidth
          headerHeight={0}
          getRowId={getRowId}
          scrollEndThreshold={500}
          rows={options}
          loading={loading}
          onRowsScrollEnd={handleRowsScrollEnd}
          columns={columns}
          rowHeight={36}
        />
      </Box>
    </Box>
  )
}
