//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isNil } from 'lodash-es'
import { useTranslation } from 'react-i18next'

import { RiskLevel } from '@ues-data/shared'

import { RISK_LEVEL_NUMBER } from '../constants'
import type { RiskSliderProps } from '../types'
import { makeKeyToSliderRangeMap } from '../utils'

export const useRiskSlider = (initialValue: RiskSliderProps['initialValue'], withSecured: RiskSliderProps['withSecured']) => {
  const { t } = useTranslation(['components'])

  const sliderMinValue = withSecured ? RISK_LEVEL_NUMBER.SECURED : RISK_LEVEL_NUMBER.LOW
  const sliderMaxValue = Object.values(RISK_LEVEL_NUMBER).length

  const makeInitialValue = (): number[] => {
    if (isEmpty(initialValue)) {
      return [sliderMinValue, sliderMaxValue]
    }

    const [min, max] = initialValue

    if (typeof min === 'number' && typeof max === 'number') {
      return [min, max + 1]
    }

    const maxValueKey = isNil(max) ? min : max

    return [RISK_LEVEL_NUMBER[min as string], RISK_LEVEL_NUMBER[maxValueKey as string] + 1]
  }

  const makeMarks = () => {
    const values = Object.values(RISK_LEVEL_NUMBER)

    if (!withSecured) {
      values.shift()
    }

    return values.map(value => ({ value, label: '' }))
  }

  const mappedInitialValue = makeInitialValue()
  const marks = makeMarks()

  const sliderRangeMap: Record<string, { value: RiskLevel[]; label: string }> = {
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.SECURED])]: {
      value: [RiskLevel.Secured],
      label: t('riskSlider.step.0-0'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.LOW])]: {
      value: [RiskLevel.Secured, RiskLevel.Low],
      label: t('riskSlider.step.0-1'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.MEDIUM])]: {
      value: [RiskLevel.Secured, RiskLevel.Medium],
      label: t('riskSlider.step.0-2'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.SECURED, RISK_LEVEL_NUMBER.HIGH])]: {
      value: [RiskLevel.Secured, RiskLevel.High],
      label: t('riskSlider.step.0-3'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.LOW, RISK_LEVEL_NUMBER.LOW])]: {
      value: [RiskLevel.Low],
      label: t('riskSlider.step.1-1'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.LOW, RISK_LEVEL_NUMBER.MEDIUM])]: {
      value: [RiskLevel.Low, RiskLevel.Medium],
      label: t('riskSlider.step.1-2'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.LOW, RISK_LEVEL_NUMBER.HIGH])]: {
      value: [RiskLevel.Low, RiskLevel.High],
      label: t('riskSlider.step.1-3'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.MEDIUM, RISK_LEVEL_NUMBER.MEDIUM])]: {
      value: [RiskLevel.Medium],
      label: t('riskSlider.step.2-2'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.MEDIUM, RISK_LEVEL_NUMBER.HIGH])]: {
      value: [RiskLevel.Medium, RiskLevel.High],
      label: t('riskSlider.step.2-3'),
    },
    [makeKeyToSliderRangeMap([RISK_LEVEL_NUMBER.HIGH, RISK_LEVEL_NUMBER.HIGH])]: {
      value: [RiskLevel.High],
      label: t('riskSlider.step.3-3'),
    },
  }

  return {
    mappedInitialValue,
    marks,
    sliderRangeMap,
    sliderMinValue,
    sliderMaxValue,
  }
}
