import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

require('./LimitSelection.scss')

const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      'border-radius': '0px',
      'margin-top': '-10px',
    },
  },
  select: {
    'background-color': '#ffffff',
    padding: '12px',
    width: '125px',
  },
  selectMenu: {
    overflow: 'inherit',
  },
})

const options = [
  {
    key: 10,
    value: 10,
    text: '10 items per page',
  },
  {
    key: 25,
    value: 25,
    text: '25 items per page',
  },
  {
    key: 50,
    value: 50,
    text: '50 items per page',
  },
  {
    key: 100,
    value: 100,
    text: '100 items per page',
  },
]

const LimitSelection = props => {
  const [select, setSelect] = React.useState(options[0].value)
  const { limitChangeCallback } = props

  const handleChange = (event, option) => {
    setSelect(event.target.value)
    limitChangeCallback(event, option)
  }
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
        value={select}
        onChange={handleChange}
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

export default LimitSelection
