/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { FormControl, InputLabel, Select } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'

import styles from './InputSelect.module.less'

export const InputSelect = props => {
  const {
    values,
    setInputValue,
    inputLabel,
    defaultValue = '',
    id = 'inputSelect',
    name = 'inputSelect',
    size = 'small',
    margin = 'dense',
    minWidth = '200px',
    required = false,
    className = '',
  } = props

  const [selectedValue, setSelectedValue] = useState(defaultValue)

  const handleChange = event => {
    setSelectedValue(event.target.value)
    setInputValue(event.target.value)
  }

  const renderMenuItems = () => {
    return values.map(item => (
      <MenuItem
        className={styles.menuItem}
        key={item.id}
        value={item.id}
        ListItemClasses={{ button: styles.button }}
        classes={{
          selected: styles.selected,
          gutters: styles.menuGutters,
        }}
      >
        {/* Normally, each item shoul have a localized corresponding label. The only place where value is used as a label is in the time/minute drop down */}
        {typeof item.label === 'undefined' ? item.value : item.label}
      </MenuItem>
    ))
  }

  return (
    <div className={`styles.root ${className}`}>
      {/* console.debug('Selected value: ' + selectedValue) */}
      <FormControl className={styles.formControl} required={required} variant="filled" size={size} margin={margin}>
        <InputLabel id="input-select-label">{inputLabel}</InputLabel>
        <Select
          style={{ minWidth: minWidth }}
          label={inputLabel}
          id={id}
          labelId="input-select-label"
          value={selectedValue}
          onChange={handleChange}
          className={styles.selectContainer}
          classes={{ paper: styles.menuPaper }}
          inputProps={{
            name: 'input-select-' + name,
            id: 'input-select-' + id,
          }}
          MenuProps={{
            disableScrollLock: true,
            classes: {
              list: styles.menuList,
            },
          }}
        >
          {renderMenuItems()}
        </Select>
      </FormControl>
    </div>
  )
}

InputSelect.propTypes = {
  values: PropTypes.array.isRequired,
  setInputValue: PropTypes.func.isRequired,
  inputLabel: PropTypes.string,
  defaultValue: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.string,
  minWidth: PropTypes.string,
  required: PropTypes.bool,
}
