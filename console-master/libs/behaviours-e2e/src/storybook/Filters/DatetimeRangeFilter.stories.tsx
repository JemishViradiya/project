import React from 'react'

import { Meta, Story } from '@storybook/react'

import type { CustomFilter } from '@ues/behaviours'
import { DatetimeRangeFilter as DatetimeRangeFilterComp, useDatetimeRangeFilter, useFilter } from '@ues/behaviours'

export const DatetimeRangeFilter = ({ includeTimeZonePicker }: { includeTimeZonePicker?: boolean }) => {
  const filterProps = useFilter<CustomFilter<DatetimeRangeFilterComp>>()

  const props = useDatetimeRangeFilter({ filterProps, key: 'test', includeTimeZonePicker })
  return (
    <div>
      <br />
      <DatetimeRangeFilterComp label="Datetime Range Filter" {...props} />
    </div>
  )
}

DatetimeRangeFilter.args = {
  includeTimeZonePicker: false,
}
DatetimeRangeFilter.argTypes = {
  includeTimeZonePicker: {
    control: {
      type: 'boolean',
    },
    description:
      'Include the TimeZonePicker Component within the DatetimeRangeFilter. If set to false, the internal timezone will stay as the browser/system time',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: false },
    },
  },
}
DatetimeRangeFilter.parameters = {
  docs: { source: { code: 'Disabled. Blocked by https://jirasd.rim.net/browse/UES-6921' } },
}
