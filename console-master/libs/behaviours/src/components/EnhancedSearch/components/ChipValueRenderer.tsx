//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isArray, isNil } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { FILTER_TYPES } from '../../../filters'
import { RiskChipValueRenderer } from '../fields/Risk'
import type { ChipValueRendererProps } from '../types'

const CommonChipValueRenderer: React.FC<ChipValueRendererProps> = ({ field, separator }) => {
  const { t } = useTranslation(['tables'])

  if (isArray(field.value) && field.value.length) {
    return (
      <>
        {`${field.value
          .filter(val => !isNil(val?.label))
          .map(val => (field.unit ? t(field.unit, { value: val.label }) : val.label))
          .join(separator)}`}
      </>
    )
  }

  if (!isArray(field.value) && field.value?.value !== '') {
    return <>{field.unit ? t(field.unit, { value: field.value.label }) : field.value.label}</>
  }

  return null
}

export const makeChipValue = (field): React.ReactNode => {
  if (!field) return ''

  switch (field.type) {
    case FILTER_TYPES.RISK:
      return <RiskChipValueRenderer field={field} />
    case FILTER_TYPES.NUMERIC_RANGE:
      return <CommonChipValueRenderer field={field} separator=" - " />
    default:
      return <CommonChipValueRenderer field={field} separator=", " />
  }
}
