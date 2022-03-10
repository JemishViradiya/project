import React, { memo, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { RiskLevelTypes as RiskLevel } from '@ues-data/bis/model'

import convertToMeters from '../../utils/convertToMeters'
import { INNER_RADIUS_FIELD, INNER_RADIUS_VALUE, OUTER_RADIUS_FIELD, OUTER_RADIUS_VALUE } from './consts'
import RiskDistanceInput from './RiskDistanceInput'

const INVALID_CHARS = ['e', 'E', '-', '+', ',', '.']
const DISTANCE_MAX = 20000
const DISTANCE_MIN = 1
const EXCEEDED_EXTREME_MESSAGE = {
  LOW: 'settings.riskEngines.learnedGeozoneLowRiskRadiusInvalid',
  MEDIUM: 'settings.riskEngines.learnedGeozoneMediumRiskRadiusInvalid',
}
const RISK_LEVEL_VALUE_MISMATCH_MESSAGE = {
  LOW: 'settings.riskEngines.learnedGeozoneLowRiskDistanceInvalid',
  MEDIUM: 'settings.riskEngines.learnedGeozoneMediumRiskDistanceInvalid',
}

const checkWhetherExceedExtremes = value => value > DISTANCE_MAX || value < DISTANCE_MIN

const checkWhetherAllRangesAreValid = (innerRadius, outerRadius) =>
  convertToMeters(outerRadius.value, outerRadius.unit) > convertToMeters(innerRadius.value, innerRadius.unit)

const checkWhetherIsWithinRange = (innerRadius, outerRadius, riskKey, t) => () => {
  if (!innerRadius.value || !outerRadius.value) return true

  const currentRiskRadiusValue = riskKey === RiskLevel.LOW ? innerRadius.value : outerRadius.value
  if (checkWhetherExceedExtremes(currentRiskRadiusValue)) {
    return t(EXCEEDED_EXTREME_MESSAGE[riskKey])
  }

  return checkWhetherAllRangesAreValid(innerRadius, outerRadius) || t(RISK_LEVEL_VALUE_MISMATCH_MESSAGE[riskKey])
}

const doesValueChanged = (prev, current) => prev && (current.value !== prev.value || current.unit !== prev.unit)

const handleChange = event => {
  if (INVALID_CHARS.includes(event.key)) {
    event.preventDefault()
  }
  return event.target.value
}

const handlePaste = event => {
  event.preventDefault()
  return false
}

interface RiskDistanceInputContainerProps {
  valueFieldName: string
  unitFieldName: string
  riskKey: string
  disabled: boolean
}

const RiskDistanceInputContainer: React.FC<RiskDistanceInputContainerProps> = memo(
  ({ valueFieldName, unitFieldName, riskKey, disabled }) => {
    const { t } = useTranslation()
    const { watch, trigger } = useFormContext()
    const { [INNER_RADIUS_FIELD]: innerRadius, [OUTER_RADIUS_FIELD]: outerRadius } = watch([INNER_RADIUS_FIELD, OUTER_RADIUS_FIELD])
    const riskRadius = riskKey === RiskLevel.LOW ? innerRadius : outerRadius
    const isWithinRange = checkWhetherIsWithinRange(innerRadius, outerRadius, riskKey, t)

    const prevRiskRadiuseRef = useRef()
    useEffect(() => {
      if (doesValueChanged(prevRiskRadiuseRef.current, riskRadius)) {
        trigger([INNER_RADIUS_VALUE, OUTER_RADIUS_VALUE])
      }
      prevRiskRadiuseRef.current = riskRadius
    }, [trigger, valueFieldName, riskRadius])

    return (
      <RiskDistanceInput
        valueFieldName={valueFieldName}
        unitFieldName={unitFieldName}
        handleChange={handleChange}
        handlePaste={handlePaste}
        disabled={disabled}
        isWithinRange={isWithinRange}
      />
    )
  },
)

export default RiskDistanceInputContainer
