//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty } from 'lodash-es'

import { Utils } from '@ues-gateway/shared'

const { makeDefaultDateRange, formatToTimestamp } = Utils

export const resolveDateRangeQueryFilter = activeFilter => {
  const { startDate, endDate } =
    !isEmpty(activeFilter?.minDatetime) && !isEmpty(activeFilter?.maxDatetime)
      ? {
          startDate: formatToTimestamp(activeFilter.minDatetime),
          endDate: formatToTimestamp(activeFilter.maxDatetime),
        }
      : makeDefaultDateRange()

  return { startDate, endDate }
}
