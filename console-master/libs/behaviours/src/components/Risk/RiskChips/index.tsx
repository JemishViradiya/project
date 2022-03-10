//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Chip } from '@material-ui/core'

import { RiskLevel } from '@ues-data/shared'

import type { RiskChipsProps } from '../types'
import { useStyles } from './styles'

const RISK_LEVEL_CLASSES_MAP = {
  [RiskLevel.Secured]: 'alert-chip-secure',
  [RiskLevel.Low]: 'alert-chip-low',
  [RiskLevel.Medium]: 'alert-chip-medium',
  [RiskLevel.High]: 'alert-chip-high',
}

const RiskChips: React.FC<RiskChipsProps> = ({ value }) => {
  const classes = useStyles()
  const { t } = useTranslation(['components'])

  return (
    <Box className={classes.container}>
      {Array.from(new Set(value)).map(riskLevel => (
        <Chip
          clickable={false}
          size="small"
          key={riskLevel}
          label={t(`risk.${riskLevel.toLowerCase()}`)}
          className={RISK_LEVEL_CLASSES_MAP[riskLevel]}
        />
      ))}
    </Box>
  )
}

export { RiskChips }
