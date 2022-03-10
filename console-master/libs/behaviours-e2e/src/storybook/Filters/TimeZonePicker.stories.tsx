import type { Moment } from 'moment'
import moment from 'moment'
import React, { useState } from 'react'

import type { SimpleFilter } from '@ues/behaviours'
import { TimeZonePicker as TimeZonePickerComp, useTimeZonePicker } from '@ues/behaviours'

export const TimeZonePicker = () => {
  const [timeZoneOffsetMinutes, setTimeZoneOffsetMinutes] = useState(-new Date().getTimezoneOffset())
  const props = useTimeZonePicker(setTimeZoneOffsetMinutes)
  return <TimeZonePickerComp {...props} />
}
