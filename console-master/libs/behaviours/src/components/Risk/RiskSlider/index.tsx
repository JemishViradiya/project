//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, FormHelperText, Slider, Typography } from '@material-ui/core'

import { useRiskSlider } from '../hooks'
import type { RiskRangeValue, RiskSliderProps } from '../types'
import { makeKeyToSliderRangeMap } from '../utils'
import useStyles from './styles'

const RiskSlider: React.FC<RiskSliderProps> = ({
  disabled = false,
  initialValue,
  onChange,
  withSecured = false,
  disabledMinButton = false,
  disabledMaxButton = false,
  helpLabel,
}) => {
  const { mappedInitialValue, marks, sliderRangeMap, sliderMinValue, sliderMaxValue } = useRiskSlider(initialValue, withSecured)
  const [riskSliderValue, setRiskSliderValue] = useState<number[]>(mappedInitialValue)
  const classes = useStyles({ riskSliderValue, withSecured, disabled })
  const { t } = useTranslation(['components'])

  const { value, label } = sliderRangeMap[makeKeyToSliderRangeMap(riskSliderValue, true)]

  const handleChange = (_event: React.ChangeEvent, newRiskSliderValue: number[]) => {
    const [newMinValue, newMaxValue] = newRiskSliderValue

    const min = disabledMinButton ? riskSliderValue[0] : newMinValue
    const max = disabledMaxButton ? riskSliderValue[1] : newMaxValue

    if (min !== max) {
      setRiskSliderValue([min, max])
    }
  }

  const handleChangeCommitted = () => {
    const [min, max] = riskSliderValue
    const riskRange = [min, max - 1] as [RiskRangeValue, RiskRangeValue]

    onChange(value, riskRange)
  }

  return (
    <Box className={classes.wrapper}>
      <Typography className={classes.title}>{label}</Typography>

      <Slider
        classes={{
          root: classes.root,
          rail: classes.rail,
          thumb: classes.thumb,
          mark: classes.mark,
          markLabel: classes.markLabel,
        }}
        name={'risk'}
        disabled={disabled}
        value={riskSliderValue}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="off"
        getAriaLabel={index => (index === 0 ? t('riskSlider.ariaLabelSliderMin') : t('riskSlider.ariaLabelSliderMax'))}
        marks={marks}
        step={1}
        min={sliderMinValue}
        max={sliderMaxValue}
        track={false}
      />

      {helpLabel && <FormHelperText className={classes.riskSliderHelperText}>{helpLabel}</FormHelperText>}
    </Box>
  )
}

export { RiskSlider }
