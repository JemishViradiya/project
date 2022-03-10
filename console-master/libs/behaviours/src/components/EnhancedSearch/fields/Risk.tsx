//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.
import isArray from 'lodash-es/isArray'
import React from 'react'

import { Box, makeStyles } from '@material-ui/core'

import type { RiskLevel } from '@ues-data/shared'

import type { RiskSliderProps, RiskValue } from '../../Risk'
import { RISK_LEVEL_NUMBER, RiskChips, RiskSlider } from '../../Risk'
import type { ChipValueRendererProps, EnhancedSearchFieldOption, EnhancedSearchRiskFieldProps } from '../types'

interface RiskFieldProps extends EnhancedSearchRiskFieldProps {
  onChange: (value: EnhancedSearchFieldOption[]) => void
  value?: EnhancedSearchFieldOption[]
}

const useStyles = makeStyles(theme => ({
  riskSliderWrapper: {
    width: '100%',
    margin: 0,
    padding: `0 ${theme.spacing(4)}px`,
    minWidth: '140px',
    overflow: 'hidden',
  },
}))

const RISK_LEVEL_NUMBER_KEYS = Object.keys(RISK_LEVEL_NUMBER)

export const RiskChipValueRenderer: React.FC<ChipValueRendererProps<{ value: RiskValue }>> = ({ field }) => {
  if (isArray(field?.value)) {
    const [minFieldValue, maxFieldValue] = field.value

    const minRiskValue = RISK_LEVEL_NUMBER[minFieldValue?.value] ?? 0
    const maxRiskValue = RISK_LEVEL_NUMBER[maxFieldValue?.value] ?? minRiskValue

    const riskRangeValue = RISK_LEVEL_NUMBER_KEYS.slice(minRiskValue, maxRiskValue + 1) as RiskValue

    return <RiskChips value={riskRangeValue} />
  }

  return null
}

export const RiskField: React.FC<RiskFieldProps> = ({ withSecured, onChange, value }) => {
  const classes = useStyles()

  const values = isArray(value) ? value.map(({ value }) => value as RiskLevel) : []

  const handleChange: RiskSliderProps['onChange'] = risk => {
    const result = risk.map(value => ({ value }))
    onChange(result)
  }

  return (
    <Box className={classes.riskSliderWrapper}>
      <RiskSlider withSecured={withSecured} onChange={handleChange} initialValue={values} />
    </Box>
  )
}
