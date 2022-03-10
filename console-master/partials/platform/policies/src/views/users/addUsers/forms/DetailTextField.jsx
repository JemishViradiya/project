/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'

import { Box, Grid, makeStyles, TextField } from '@material-ui/core'

import { MIN_INPUT_FIELD_WIDTH } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  spacingLeft: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(4),
    },
  },
  spacingRight: {
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(4),
    },
  },
}))

const DetailTextField = props => {
  const { id, spacingSide, disabled, value, onChange, label, helperText, error, required } = props
  const { spacingLeft, spacingRight } = useStyles()

  return (
    <Grid item xs={12} sm="auto">
      <Box className={spacingSide === 'left' ? spacingLeft : spacingRight} width={MIN_INPUT_FIELD_WIDTH}>
        <TextField
          fullWidth
          margin="normal"
          disabled={disabled}
          required={required}
          id={id}
          value={value !== null ? value : ''}
          onChange={onChange}
          label={label}
          error={error}
          helperText={helperText}
          size="small"
        />
      </Box>
    </Grid>
  )
}

export default DetailTextField
