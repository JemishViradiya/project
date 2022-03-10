import React from 'react'
import { useTranslation } from 'react-i18next'

import { UserState } from '@ues-data/persona'
import type { SimpleFilter } from '@ues/behaviours'
import { RadioFilter, useRadioFilter, useTableFilter } from '@ues/behaviours'

import { USER_STATE_I18N_MAP } from '../../../constants'
import { UserListColumnKey } from '../userList.types'

export const StateFilterComponent = () => {
  const { t } = useTranslation(['persona/common'])

  const filterProps = useTableFilter<SimpleFilter<UserState>>()
  const props = useRadioFilter({ filterProps, key: UserListColumnKey.State })

  return (
    <RadioFilter
      label={t('users.columns.state')}
      items={[UserState.ONLINE, UserState.OFFLINE]}
      itemsLabels={{
        [UserState.ONLINE]: t(USER_STATE_I18N_MAP[UserState.ONLINE]),
        [UserState.OFFLINE]: t(USER_STATE_I18N_MAP[UserState.OFFLINE]),
      }}
      closeAfterSelect
      {...props}
    />
  )
}
