//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'

import { Box, InputAdornment, TextField } from '@material-ui/core'
import type { SliderProps } from '@material-ui/core/Slider'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

import type { BaseFormFieldInputProps } from '../../types'
import useStyles from './styles'

interface SliderFieldProps extends BaseFormFieldInputProps<number> {
  unit?: string
  min?: number
  max?: number
}

const SliderField: React.FC<SliderFieldProps> = ({
  onChange,
  unit,
  min = 0,
  max = 100,
  value = min,
  disabled,
  required,
  muiProps,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(value)
  const classes = useStyles()

  useEffect(() => {
    setSliderValue(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSliderValueChange = (value: number) => {
    onChange(value)
    setSliderValue(value)
  }

  return (
    <Box className={classes.box}>
      <TextField
        hiddenLabel
        size="small"
        value={sliderValue}
        required={required}
        InputProps={{
          endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
        }}
        placeholder={value?.toString()}
        onChange={event => handleSliderValueChange(Number(event.currentTarget.value))}
        variant="filled"
        disabled={disabled}
        className={classes.textField}
        color="secondary"
        type="number"
        inputProps={{ className: classes.textFieldInput }}
      />
      <Slider
        {...(muiProps as SliderProps)}
        color="secondary"
        defaultValue={value}
        value={sliderValue}
        onChange={(_, value) => handleSliderValueChange(value as number)}
        aria-labelledby="continuous-slider"
        valueLabelDisplay="auto"
        min={min}
        max={max}
        disabled={disabled}
        className={classes.slider}
      />
      <Typography>
        {max}
        {unit}
      </Typography>
    </Box>
  )
}

export default SliderField
