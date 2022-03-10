//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'

import { Box, makeStyles, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  textItem: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(4)}px`,
    '&:hover': {
      background: theme.palette.grey[200],
    },
  },
}))

export const Text = ({ options, onChange }) => {
  const classes = useStyles()

  return (
    <Box>
      {options.map(option => (
        <Box key={option.value}>
          <Typography className={classes.textItem} onClick={() => onChange(option)}>
            {option.label}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
