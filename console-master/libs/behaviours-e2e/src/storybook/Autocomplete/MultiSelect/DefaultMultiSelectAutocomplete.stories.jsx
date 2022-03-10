// dependencies
import React, { useState } from 'react'

// components
import Chip from '@material-ui/core/Chip'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Autocomplete from '@material-ui/lab/Autocomplete'

// data
import { top100Films } from './../autocomplete.data'

export const DefaultMultiSelectAutocomplete = () => {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <Autocomplete
      multiple
      options={top100Films.map(option => option.title)}
      disableCloseOnSelect
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option}
            variant="outlined"
            label={<Typography variant="body2">{option}</Typography>}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={params => (
        <TextField {...params} fullWidth variant="filled" placeholder="Add Chip Here" label="Add Chip" onClick={toggleOpen} />
      )}
    />
  )
}
