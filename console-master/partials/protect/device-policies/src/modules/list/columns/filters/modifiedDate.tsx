import type { Moment } from 'moment'
import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DevicePolicyListItemField } from '@ues-data/epp'
import { I18nFormats } from '@ues/assets'
import type { SimpleFilter } from '@ues/behaviours'
import { DatePickerFilter, OPERATOR_VALUES, useDatePickerFilter, useTableFilter } from '@ues/behaviours'

const ModifiedDateFilter = (): JSX.Element => {
  const { t: translate } = useTranslation(['protect'])
  const label = translate('dateModified')

  const filterProps = useTableFilter<SimpleFilter<Moment>>()

  const modifiedDateFilterProps = useDatePickerFilter({
    key: DevicePolicyListItemField.modified,
    label,
    filterProps,
    defaultOperator: OPERATOR_VALUES.EQUAL,
    dateLabelFormat: I18nFormats.Date,
    ignoreTime: true,
  })

  return (
    <DatePickerFilter
      {...modifiedDateFilterProps}
      label={label}
      max={moment()}
      //autoIdPrefix={`policy-list-${col.dataKey}-filter`}
    />
  )
}

export default ModifiedDateFilter
