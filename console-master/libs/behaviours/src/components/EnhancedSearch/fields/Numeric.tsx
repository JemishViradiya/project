//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  numericWrapper: {
    padding: `0 ${theme.spacing(2)}px`,
    minWidth: '140px',
    overflow: 'hidden',
  },
}))

export const Numeric = ({ onChange, value, config }) => {
  const { t } = useTranslation(['tables'])
  const min = config.min || 0
  const max = config.max || 100
  const [numericValue, setNumericValue] = useState(value || { label: min, value: min })

  const classes = useStyles()

  const handleChange = (_event: React.ChangeEvent, newRiskSliderValue: number) => {
    setNumericValue({ label: newRiskSliderValue, value: newRiskSliderValue })
  }

  const handleChangeCommitted = (event: React.ChangeEvent) => {
    onChange(numericValue, false)
  }

  return (
    <Box className={classes.numericWrapper}>
      <Box p={2}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2">
              {config.unit ? t(config.unit, { value: numericValue?.value || '0' }) : numericValue?.value || '0'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box px={2} pb={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12}>
            <Slider
              value={numericValue?.value || 0}
              onChangeCommitted={handleChangeCommitted}
              onChange={handleChange}
              valueLabelDisplay="auto"
              color="secondary"
              max={max}
              min={min}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
