import React from 'react'

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
    width: '90px',
  },
  selectMenu: {
    overflow: 'inherit',
  },
})

export default function SelectType(props) {
  const { options, onChange, value } = props

  const classes = useStyles()

  return (
    <FormControl
      variant="outlined"
      classes={{
        root: classes.root,
      }}
    >
      <Select
        autoWidth
        value={value}
        onChange={onChange}
        classes={{
          root: classes.root,
          select: classes.select,
          selectMenu: classes.selectMenu,
        }}
        MenuProps={{
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
          },
        }}
      >
        {options.map(item => (
          <MenuItem key={item.key} value={item.value}>
            {item.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
