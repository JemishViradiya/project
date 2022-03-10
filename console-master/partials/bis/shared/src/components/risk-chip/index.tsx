import type { TFunction } from 'i18next'
import React, { memo } from 'react'

import { Chip } from '@material-ui/core'

import { RiskLevelTypes } from '@ues-data/bis/model'

export interface RiskChipProps {
  riskLevel: string
  t: TFunction
}

const CLASS_NAME_MAP = {
  [RiskLevelTypes.CRITICAL]: 'alert-chip-critical',
  [RiskLevelTypes.HIGH]: 'alert-chip-high',
  [RiskLevelTypes.LOW]: 'alert-chip-low',
  [RiskLevelTypes.MEDIUM]: 'alert-chip-medium',
  [RiskLevelTypes.UNKNOWN]: 'alert-chip-info',
}

export const RiskChip: React.FC<RiskChipProps> = memo(({ riskLevel, t }) => (
  <Chip label={t(`bis/shared:risk.level.${riskLevel}`)} className={CLASS_NAME_MAP[riskLevel]} />
))
