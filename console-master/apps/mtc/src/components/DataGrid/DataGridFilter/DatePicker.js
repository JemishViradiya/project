import 'date-fns'

import React, { useState } from 'react'

import MomentUtils from '@date-io/moment'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const useStyles = makeStyles({
  grid: {
    '& .MuiTextField-root': {
      'margin-top': '0px',
    },
  },
  root: {
    height: '40px',
    'background-color': '#ffffff',
    'border-radius': '0px',
    '& .MuiOutlinedInput-input': {
      padding: '12px;',
      width: '90px',
    },
  },
})

export default function MaterialUIPickers(props) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { onChange } = props
  const classes = useStyles()

  const handleDateChange = date => {
    setSelectedDate(date)
    onChange(date)
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <Grid
        container
        justify="space-around"
        classes={{
          root: classes.grid,
        }}
      >
        <KeyboardDatePicker
          disableToolbar
          inputVariant="outlined"
          variant="inline"
          value={selectedDate}
          onChange={handleDateChange}
          format="MM/DD/YYYY"
          InputProps={{
            classes: {
              root: classes.root,
            },
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  )
}
