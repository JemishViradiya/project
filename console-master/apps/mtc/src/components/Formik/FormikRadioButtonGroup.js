import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    'margin-top': '5px',
  },
})

const RadioButtonsGroup = ({ children }) => {
  const classes = useStyles()
  const [value, setValue] = React.useState('')

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormLabel component="legend" focused={false}>
        Format
      </FormLabel>
      <RadioGroup aria-label="format" name="format" value={value} onChange={handleChange}>
        {children}
      </RadioGroup>
    </FormControl>
  )
}

export default RadioButtonsGroup
