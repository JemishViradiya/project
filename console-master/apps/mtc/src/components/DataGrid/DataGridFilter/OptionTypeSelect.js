import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      'border-radius': '0px',
      height: '40px',
    },
  },
  select: {
    'background-color': '#ffffff',
    padding: '12px',
    width: '180px',
  },
  selectMenu: {
    overflow: 'inherit',
  },
})

export default function OptionTypeSelect({ options, onChange }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [values, setValues] = useState({
    type: '',
  })

  function handleChange(event) {
    setValues(oldValues => ({
      ...oldValues,
      type: event.target.value,
    }))
    onChange(event.target.value)
  }

  return (
    <FormControl
      variant="outlined"
      classes={{
        root: classes.root,
      }}
    >
      <Select
        displayEmpty
        value={values.type}
        onChange={handleChange}
        classes={{
          root: classes.root,
          select: classes.select,
          outlined: classes.outlined,
        }}
        style={{ color: values.type === '' ? '#CDD0DB' : '' }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
          },
        }}
      >
        <MenuItem value="">{t('optionTypeSelect.menuItemTitle')}</MenuItem>
        {options.map(item => (
          <MenuItem key={item.label} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
