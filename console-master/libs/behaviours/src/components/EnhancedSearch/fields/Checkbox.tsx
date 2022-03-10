//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import isArray from 'lodash-es/isArray'
import React, { useEffect, useState } from 'react'

import { Box, Checkbox, FormControlLabel, makeStyles, Typography } from '@material-ui/core'

import type { EnhancedSearchFieldOption } from '../types'

const makeDefaultValue = (data = [], values = []) =>
  data.reduce(
    (acc, option) => ({
      ...acc,
      [option.value]: {
        ...option,
        checked: !!option.checked || (isArray(values) && values.some(({ value, checked }) => value === option.value && checked)),
      },
    }),
    {},
  )

const useStyles = makeStyles(theme => ({
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    background: 'transparent',
  },
  checkbox: {
    margin: 0,
    width: '100%',
    padding: 0,
    '&:hover': {
      background: theme.palette.grey[200],
    },
  },
}))

export const CheckboxFieldItem = ({ item, onChange, index, checked }) => {
  const classes = useStyles()
  const { value, checked: itemChecked, label } = item
  const name = typeof value === 'number' ? String(value) : value

  return (
    <FormControlLabel
      onClick={event => {
        event.stopPropagation()
        event.preventDefault()
        onChange(item)
      }}
      className={classes.checkbox}
      key={index}
      control={<Checkbox size="small" color="secondary" name={name} checked={itemChecked || checked || false} />}
      label={<Typography>{label}</Typography>}
    />
  )
}
interface CheckboxProps {
  onChange: (data: EnhancedSearchFieldOption[]) => void
  options: EnhancedSearchFieldOption[]
  values: EnhancedSearchFieldOption[]
}

export const CheckboxField: React.FC<CheckboxProps> = ({ onChange, options, values }) => {
  const classes = useStyles()
  const [checkboxGroupValue, setCheckboxGroupValue] = useState(makeDefaultValue(options, values))

  const handleChange = option => {
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

  useEffect(() => {
    setCheckboxGroupValue(makeDefaultValue(options, values))
  }, [options, values])

  return (
    <Box className={classes.checkboxGroup}>
      {options.map((item, index) => (
        <CheckboxFieldItem
          key={item.value}
          item={item}
          index={index}
          onChange={handleChange}
          checked={checkboxGroupValue[item?.value]?.checked}
        />
      ))}
    </Box>
  )
}
