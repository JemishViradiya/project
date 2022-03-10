//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { Components, Config, Types } from '@ues-gateway/shared'

import { EVENTS_GROUP_BY_LOCALIZATION_KEYS } from './constants'
import { useEventsNavigate } from './hooks'
import type { EventsTableFilter } from './types'
import { resolveDateRangeQueryFilter } from './utils'

const { GATEWAY_TRANSLATIONS_KEY } = Config
const { EventsGroupByParam } = Types
const { Select } = Components

interface EventsGroupBySelectProps {
  dateRangeFilter: EventsTableFilter
}

const EventsGroupBySelect: React.FC<EventsGroupBySelectProps> = ({ dateRangeFilter }) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const eventsNavigate = useEventsNavigate()
  const pathnameParts = useLocation().pathname.split('/')

  const checkIsGroupBy = (groupBy: Types.EventsGroupByParam) => pathnameParts.includes(groupBy)

  const defaultValue = checkIsGroupBy(EventsGroupByParam.Destination)
    ? EventsGroupByParam.Destination
    : checkIsGroupBy(EventsGroupByParam.Users)
    ? EventsGroupByParam.Users
    : EventsGroupByParam.Default

  const handleRouteChange = (value: Types.EventsGroupByParam) => {
    const dateRange = dateRangeFilter ? resolveDateRangeQueryFilter(dateRangeFilter) : { startDate: undefined, endDate: undefined }
    const groupBy = value === EventsGroupByParam.Default ? undefined : value

    eventsNavigate({ groupBy, ...dateRange })
  }

  return (
    <Select
      value={defaultValue}
      options={Object.values(EventsGroupByParam).map(item => ({
        value: item,
        label: t(EVENTS_GROUP_BY_LOCALIZATION_KEYS[item]),
      }))}
      onChange={handleRouteChange}
    />
  )
}

export default EventsGroupBySelect
