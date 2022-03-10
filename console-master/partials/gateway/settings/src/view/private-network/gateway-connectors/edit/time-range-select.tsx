//******************************************************************************
// Copyright 2022 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'

import { getDateRangeTimestampString } from '@ues-behaviour/dashboard'
import { Components, Config } from '@ues-gateway/shared'

import { TimeIntervalId } from '../types'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { Select } = Components

interface TimeRangeSelectProps {
  initialValue: string
  onChange: (value: { startDate: string; endDate: string }) => void
}

const TimeRangeSelect: React.FC<TimeRangeSelectProps> = ({ initialValue, onChange }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY, 'dashboard'])

  const handleChange = (value: TimeIntervalId) => {
    const { startDate, endDate } = getDateRangeTimestampString({ timeInterval: value, nowTime: new Date() })

    onChange({ startDate, endDate })
  }

  return (
    <Select
      value={initialValue}
      options={Object.values(TimeIntervalId).map(item => ({
        value: item,
        label: t(`dashboard:${item}`),
      }))}
      onChange={handleChange}
    />
  )
}

export default TimeRangeSelect
