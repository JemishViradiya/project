import type { Moment } from 'moment'
import moment from 'moment'
import React from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import { DateRangeFilter as DateRangeFilterComp, useDateRangeFilter, useFilter } from '@ues/behaviours'

export const DateRangeFilter = ({
  dateRangeMin,
  dateRangeMax,
  disabled,
  chipIcon,
}: { dateRangeMin?: string; dateRangeMax?: string; disabled?: boolean; chipIcon?: boolean } = {}) => {
  const filterProps = useFilter<SimpleFilter<Moment>>()
  const props = useDateRangeFilter({
    filterProps,
    key: 'test',
    rangeMin: moment(dateRangeMin),
    rangeMax: moment(dateRangeMax),
  })

  const customMessages = {
    ...props.messages,
    InvalidDatetime: 'Custom invalid date message',
  }
  return (
    <DateRangeFilterComp label="Date Range Filter" {...props} disabled={disabled} chipIcon={chipIcon} messages={customMessages} />
  )
}

DateRangeFilter.args = {
  dateRangeMin: moment().startOf('date').subtract('9', 'days').toISOString(),
  dateRangeMax: moment().toISOString(),
  disabled: false,
  chipIcon: false,
}
DateRangeFilter.argTypes = {
  dateRangeMin: {
    control: {
      type: 'date',
    },
    defaultValue: { summary: moment().startOf('date').subtract('9', 'days').toISOString() },
    description: 'Min date that can be selected',
  },
  dateRangeMax: {
    control: {
      type: 'date',
    },
    defaultValue: { summary: moment().toISOString() },
    description: 'Max date that can be selected',
  },
  disabled: {
    control: {
      type: 'boolean',
    },
    description: 'Disable filter component.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
  chipIcon: {
    control: {
      type: 'boolean',
    },
    description: 'Use chip anchor icon.',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
}
DateRangeFilter.parameters = {
  docs: { source: { code: 'Disabled. Blocked by https://jirasd.rim.net/browse/UES-6921' } },
}
