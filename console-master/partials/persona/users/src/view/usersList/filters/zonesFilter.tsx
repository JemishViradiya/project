import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import type { ShortZoneDetails } from '@ues-data/persona'
import { usersActions, usersSelectors, ZonesApi, ZonesMockApi } from '@ues-data/persona'
import { useMock } from '@ues-data/shared'
import type { SimpleFilter } from '@ues/behaviours'
import { AutocompleteSearchFilter, OPERATOR_VALUES, useAutocompleteSearchFilter, useTableFilter } from '@ues/behaviours'

import { UserListColumnKey } from '../userList.types'

export const ZonesFilterComponent = () => {
  const { t } = useTranslation(['persona/common'])

  const dispatch = useDispatch()
  const isMock = useMock()

  const { result } = useSelector(usersSelectors.getSearchZoneByNameDataTask)

  const getZonesByName = useCallback(
    (zoneName: string) => {
      const api = isMock ? ZonesMockApi : ZonesApi

      dispatch(usersActions.searchZonesByNameStart(zoneName, api))
    },
    [dispatch, isMock],
  )

  const getOptions = useCallback(
    (zoneName: string) => {
      getZonesByName(zoneName)
    },
    [getZonesByName],
  )

  const clearOptions = useCallback(() => {
    dispatch(usersActions.searchZonesByNameReset())
  }, [dispatch])

  const filterProps = useTableFilter<SimpleFilter<ShortZoneDetails>>()
  const props = useAutocompleteSearchFilter({
    filterProps,
    key: UserListColumnKey.Zones,
    defaultOperator: OPERATOR_VALUES.EQUAL,
    minCharacters: 3,
    getOptions,
    clearOptions,
    getLabel: ({ name }) => name,
    options: result ?? [],
  })

  return <AutocompleteSearchFilter label={t('users.columns.zones')} operators={[]} {...props} />
}
