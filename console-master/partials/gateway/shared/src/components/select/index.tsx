//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'

import { FormControl, MenuItem, Select as MuiSelect } from '@material-ui/core'

import useStyles from './styles'

interface SelectProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange: (value: string) => void
  options: {
    value: string
    label: string
  }[]
}

const Select: React.FC<SelectProps> = ({ value, defaultValue, onChange, options, placeholder }) => {
  const [selectValue, setSelectValue] = useState<string>(defaultValue ?? value)
  const classes = useStyles()

  useEffect(() => {
    setSelectValue(value)
  }, [value])

  return (
    <FormControl className={classes.formControl}>
      <MuiSelect
        disableUnderline
        value={selectValue}
        onChange={(event: React.ChangeEvent<{ value: string }>) => {
          onChange(event.target.value)
          setSelectValue(event.target.value)
        }}
        name="select"
        classes={{
          select: classes.select,
          selectMenu: classes.selectMenu,
          icon: classes.selectIcon,
        }}
        MenuProps={{
          disableScrollLock: true,
          elevation: 4,
          className: classes.selectMenu,
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          classes: {
            list: classes.menuList,
            paper: classes.menuPaper,
          },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}

export { Select }
