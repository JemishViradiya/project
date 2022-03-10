import React from 'react'

import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

require('./Text.scss')

const Text = ({ onChange, error, endAdornment, startAdornment, ...props }) => (
  <TextField
    className="input-text"
    onChange={onChange}
    error={error || false}
    {...props}
    InputProps={{
      endAdornment: endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : null,
      startAdornment: startAdornment ? <InputAdornment position="start">{startAdornment}</InputAdornment> : null,
    }}
  />
)

export default Text
