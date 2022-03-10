import type { TFunction } from 'i18next'
import React, { memo } from 'react'

import { Chip } from '@material-ui/core'

import { RiskLevelStatus } from '@ues-data/platform'

export interface RiskChipProps {
  riskLevel: string
  t: TFunction
}

const CLASS_NAME_MAP = {
  [RiskLevelStatus.HIGH]: 'alert-chip-high',
  [RiskLevelStatus.MEDIUM]: 'alert-chip-medium',
  [RiskLevelStatus.SECURED]: 'alert-chip-secure',
  [RiskLevelStatus.LOW]: 'alert-chip-low',
}

export const RiskChip: React.FC<RiskChipProps> = memo(({ riskLevel, t }) =>
  riskLevel && riskLevel.toUpperCase() !== RiskLevelStatus.UNKNOWN ? (
    <Chip
      aria-label={t(`endpoint.risk.${riskLevel}`)}
      label={t(`endpoint.risk.${riskLevel}`)}
      className={CLASS_NAME_MAP[riskLevel]}
    />
  ) : null,
)
