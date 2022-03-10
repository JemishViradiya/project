//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { RiskLevel } from '@ues-data/shared'

import type { RiskRangeValue } from './types'

export const MAP_KEY_SEPARATOR = '.'

export const RISK_LEVEL_NUMBER: Record<RiskLevel, RiskRangeValue> = {
  [RiskLevel.Secured]: 0,
  [RiskLevel.Low]: 1,
  [RiskLevel.Medium]: 2,
  [RiskLevel.High]: 3,
}
