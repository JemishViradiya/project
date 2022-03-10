import moment from 'moment'
import React from 'react'
import { useTranslation } from 'react-i18next'

import type { CustomFilter } from '@ues/behaviours'
import { DateRangeFilter, useDateRangeFilter, useTableFilter } from '@ues/behaviours'

import { UserListColumnKey } from '../userList.types'

export const LastOnlineFilter: React.FC = () => {
  const { t } = useTranslation(['persona/common'])

  const filterProps = useTableFilter<CustomFilter<DateRangeFilter>>()
  const props = useDateRangeFilter({
    filterProps,
    key: UserListColumnKey.LastOnline,
    rangeMin: moment().startOf('date').subtract('89', 'days'),
  })

  return <DateRangeFilter label={t('users.columns.lastOnline')} {...props} />
}
