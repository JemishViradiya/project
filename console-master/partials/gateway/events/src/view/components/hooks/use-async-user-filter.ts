//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isEqual, isNil, uniq } from 'lodash-es'
import { useEffect } from 'react'

import { usePrevious } from '@ues-behaviour/react'
import { queryUsers } from '@ues-data/platform'
import { serializeQueryParameter, useStatefulApolloQuery } from '@ues-data/shared'
import { Utils } from '@ues-gateway/shared'

import type { UseAsyncFilterFn } from '../types'

const { isTaskResolved } = Utils

export const useAsyncUserFilter: UseAsyncFilterFn<string[]> = ({ activeFilter, refetchEvents }) => {
  const { data: usersData, refetch: refetchUsers, loading } = useStatefulApolloQuery(queryUsers, {
    variables: { sortBy: 'displayName', sortDirection: 'asc' },
    notifyOnNetworkStatusChange: true,
    skip: isNil(activeFilter),
  })
  const previousLoading = usePrevious(loading)
  const previousActiveFilter = usePrevious(activeFilter)
  const ecoIds = uniq(usersData?.platformUsers?.elements?.map(user => user.ecoId))

  // refetch for the users ecoIds, when user filter has been changed or ecoIds fetch has not been triggered
  useEffect(() => {
    if (!isEmpty(activeFilter?.value) && (!isEqual(activeFilter, previousActiveFilter) || previousLoading !== undefined)) {
      refetchUsers({ query: [serializeQueryParameter('displayName', activeFilter)].join(encodeURIComponent('&')) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  // refetch events data, when ecoIds has been retrieved
  useEffect(() => {
    if (isTaskResolved({ loading: loading }, { loading: previousLoading })) {
      refetchEvents()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return { value: ecoIds, loading }
}
