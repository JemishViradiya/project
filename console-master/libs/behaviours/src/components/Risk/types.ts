//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { RiskLevel } from '@ues-data/shared'

export type RiskRangeValue = 0 | 1 | 2 | 3 | number

export type RiskValue = RiskLevel[]

export interface RiskSliderProps {
  disabled?: boolean
  disabledMaxButton?: boolean
  disabledMinButton?: boolean
  helpLabel?: string
  initialValue?: RiskValue | [RiskRangeValue, RiskRangeValue]
  onChange: (risk: RiskValue, riskRange: [RiskRangeValue, RiskRangeValue]) => void
  withSecured?: boolean
}

export interface RiskChipsProps {
  value: RiskValue
}
