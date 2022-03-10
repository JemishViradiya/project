import type { RiskLevelTypes } from '@ues-data/bis/model'

interface OnChangeCallback {
  (value: RiskLevelTypes): void
}

interface Option {
  key: RiskLevelTypes
  text: string
}

export interface RiskLevelSelectProps {
  labelId: string
  disabled?: boolean
  onChange: OnChangeCallback
  options: Option[]
  value: RiskLevelTypes
  name: string
}
