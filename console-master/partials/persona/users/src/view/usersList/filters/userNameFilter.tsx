import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import type { GetUserContainingUsernameParams, ShortUserItem } from '@ues-data/persona'
import { usersActions, UsersApi, UsersMockApi, usersSelectors } from '@ues-data/persona'
import { useMock } from '@ues-data/shared'
import type { SimpleFilter } from '@ues/behaviours'
import { AutocompleteSearchFilter, OPERATOR_VALUES, useAutocompleteSearchFilter, useTableFilter } from '@ues/behaviours'

import { UserListColumnKey } from '../userList.types'

export const UserNameFilterComponent = () => {
  const { t } = useTranslation(['persona/common'])

  const dispatch = useDispatch()
  const isMock = useMock()

  const { result } = useSelector(usersSelectors.getSearchUsersByUsernameDataTask)

  const getUsersSearchAutocompleteList = useCallback(
    (params: GetUserContainingUsernameParams) => {
      const api = isMock ? UsersMockApi : UsersApi

      dispatch(usersActions.searchUsersByUsernameStart(params, api))
    },
    [dispatch, isMock],
  )

  const getOptions = useCallback(
    (userName: string) => {
      getUsersSearchAutocompleteList({ userName })
    },
    [getUsersSearchAutocompleteList],
  )

  const clearOptions = useCallback(() => {
    dispatch(usersActions.searchUsersByUsernameReset())
  }, [dispatch])

  const filterProps = useTableFilter<SimpleFilter<ShortUserItem>>()
  const props = useAutocompleteSearchFilter({
    filterProps,
    key: UserListColumnKey.Username,
    defaultOperator: OPERATOR_VALUES.EQUAL,
    minCharacters: 3,
    getOptions,
    clearOptions,
    getLabel: ({ userName }) => userName,
    options: result ?? [],
  })

  return <AutocompleteSearchFilter label={t('users.columns.userName')} operators={[]} {...props} />
}
