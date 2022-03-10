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

export const NumericRange = ({ onChange, value, config }) => {
  const { t } = useTranslation(['tables'])
  const min = config.min || 0
  const max = config.max || 100

  const classes = useStyles()

  const [values, setValues] = useState({
    min: value[0]?.value,
    max: value[1]?.value,
  })

  const minValueLabel = config.unit ? t(config.unit, { value: values.min }) : values.min
  const maxValueLabel = config.unit ? t(config.unit, { value: values.max }) : values.max

  const onSliderChange = (event, [newMin, newMax]) => {
    setValues({
      min: newMin,
      max: newMax,
    })
  }
  const handleChangeCommitted = () => {
    onChange(
      [
        {
          label: values.min,
          value: values.min,
        },
        {
          label: values.max,
          value: values.max,
        },
      ],
      false,
    )
  }
  const labelText =
    (values.min === undefined && values.max === undefined) || (values.min === min && values.max === max)
      ? t('allData')
      : `${minValueLabel} - ${maxValueLabel}`

  return (
    <Box className={classes.numericWrapper}>
      <Box p={2}>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2">{labelText}</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box px={2} pb={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={12}>
            <Slider
              value={[values?.min || min, values?.max || max]}
              onChange={onSliderChange}
              onChangeCommitted={handleChangeCommitted}
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
