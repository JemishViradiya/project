import type { Moment } from 'moment'
import React from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import { DatePickerFilter as DatePickerFilterComp, OPERATOR_VALUES, useDatePickerFilter, useFilter } from '@ues/behaviours'

export const DatePickerFilter = () => {
  const filterProps = useFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: 'test', defaultOperator: OPERATOR_VALUES.BEFORE })
  return <DatePickerFilterComp label="Date Picker Filter" {...props} />
}
