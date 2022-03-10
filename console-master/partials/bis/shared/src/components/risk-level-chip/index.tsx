import type { TFunction } from 'i18next'
import React, { memo } from 'react'

import { Chip } from '@material-ui/core'

import type { RiskLevel } from '@ues-data/shared-types'

export interface RiskLevelChipProps {
  riskLevel: RiskLevel
  t: TFunction
}

const CLASS_NAME_MAP: Record<RiskLevel, string> = {
  HIGH: 'alert-chip-high',
  LOW: 'alert-chip-low',
  MEDIUM: 'alert-chip-medium',
  SECURED: 'alert-chip-secure',
}

export const RiskLevelChip: React.FC<RiskLevelChipProps> = memo(({ riskLevel, t }) => (
  <Chip label={t(`bis/shared:risk.level.${riskLevel}`)} className={CLASS_NAME_MAP[riskLevel]} />
))
