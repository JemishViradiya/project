import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DevicePolicyListItem } from '@ues-data/epp'
import { DevicePolicyListItemField } from '@ues-data/epp'
import type { SimpleFilter } from '@ues/behaviours'
import { NumericRangeFilter, useNumericRangeFilter, useTableFilter } from '@ues/behaviours'

interface DeviceCountFilterPropTypes {
  data: DevicePolicyListItem[]
}

const DeviceCountFilter = ({ data }: DeviceCountFilterPropTypes): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])

  const max = useMemo(
    () => data.reduce((maxDeviceCount, row) => (row.device_count > maxDeviceCount ? row.device_count : maxDeviceCount), 0),
    [data],
  )

  const filterProps = useTableFilter<SimpleFilter<[number, number]>>()

  const deviceCountFilterProps = useNumericRangeFilter({
    key: DevicePolicyListItemField.device_count,
    filterProps,
    min: 0,
    max,
  })

  return (
    <NumericRangeFilter
      {...deviceCountFilterProps}
      label={translate('numberOfDevices')}
      min={0}
      max={max}
      //autoIdPrefix={`policy-list-${col.dataKey}-filter`}
    />
  )
}

export default DeviceCountFilter
