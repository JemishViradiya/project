import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

import { RangeType } from './RangeType'
import Slider from './Slider'
import type { RiskEnginesSliderProps } from './types'

const RiskEnginesSlider = ({ disabled, onChange, value, riskLevelPath }: RiskEnginesSliderProps) => {
  const { watch } = useFormContext()
  const riskLevel = watch(riskLevelPath)
  const convertSliderValueToRiskLevel = useCallback(
    sliderValue => {
      return { ...value, min: sliderValue, max: value.max }
    },
    [value],
  )

  const handleSliderChange = useCallback(
    (e, newSliderValue) => {
      const newRiskLevel = convertSliderValueToRiskLevel(newSliderValue)
      onChange(newRiskLevel)
    },
    [onChange, convertSliderValueToRiskLevel],
  )

  const handleSliderInputChange = useCallback(
    (e, rangeType, min, max) => {
      const newValue = Number(e.target?.value?.replace('.', ''))
      if (rangeType === RangeType.MIN && newValue < min) {
        onChange({ ...value, [RangeType.MIN]: min })
      } else if (rangeType === RangeType.MIN && newValue >= value[RangeType.MAX]) {
        onChange({ ...value, [rangeType]: max, [RangeType.MAX]: max })
      } else if (newValue >= min && newValue <= max) {
        onChange({ ...value, [rangeType]: newValue })
      }
    },
    [onChange, value],
  )

  return (
    <Slider
      disabled={disabled}
      value={value}
      handleSliderInputChange={handleSliderInputChange}
      handleSliderChange={handleSliderChange}
      riskLevel={riskLevel}
    />
  )
}

export default RiskEnginesSlider
