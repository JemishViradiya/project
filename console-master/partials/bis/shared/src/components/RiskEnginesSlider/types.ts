import type { RiskLevelTypes } from '@ues-data/bis/model'

import type { RangeType } from './RangeType'

interface Value {
  min: number
  max: number
}

interface InputOnChangeCallback {
  (e, rangeType: RangeType, min: number, max: number): void
}

export interface InputProps extends Value {
  value: number
  onChange: InputOnChangeCallback
  rangeType: RangeType
}

interface SliderOnChangeCallback {
  (e, value: number): void
}

export interface SliderProps {
  disabled?: boolean
  value: Value
  riskLevel: RiskLevelTypes
  handleSliderChange: SliderOnChangeCallback
  handleSliderInputChange: InputOnChangeCallback
}

interface OnChangeCallback {
  (value: Value): void
}

export interface RiskEnginesSliderProps {
  disabled?: boolean
  riskLevelPath: string
  onChange: OnChangeCallback
  value: Value
}
