import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

const useStyles = makeStyles({
  inputRoot: {
    '&[class*="MuiOutlinedInput-root"]': {
      padding: '2px',
      'border-radius': '0px',
      background: '#ffffff',
    },
  },
  textField: {
    'margin-bottom': '0px',
  },
})

export default function PartnerFilterAutoComplete(props) {
  const { options, onChange, disabled, isLoading } = props
  const classes = useStyles()
  return (
    <Autocomplete
      classes={{
        inputRoot: classes.inputRoot,
        inputFocused: classes.inputFocused,
      }}
      options={options}
      onChange={onChange}
      getOptionLabel={option => option.label}
      getOptionSelected={option => option.value}
      disabled={disabled}
      loading={isLoading}
      renderInput={params => (
        <TextField {...params} placeholder="Filter by partner" variant="outlined" classes={{ root: classes.textField }} />
      )}
    />
  )
}
