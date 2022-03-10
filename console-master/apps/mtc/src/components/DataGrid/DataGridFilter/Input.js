import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
  textField: {
    'margin-bottom': '0px',
    '& .MuiOutlinedInput-root': {
      'border-radius': '0px',
      height: '40px',
    },
    'background-color': '#ffffff',
    '& .MuiOutlinedInput-input': {
      padding: '12px;',
    },
  },
})

export default function Input(props) {
  const classes = useStyles()

  const { placeholder, onChange, type } = props

  const handleChange = event => {
    onChange(event.target.value)
  }
  return (
    <form>
      <TextField
        classes={{
          root: classes.textField,
        }}
        placeholder={placeholder}
        variant="outlined"
        onChange={handleChange}
        type={type}
      />
    </form>
  )
}
