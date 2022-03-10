import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrevious, useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import { queryProfiles } from '../../ecs-bff-platform/profiles'
import { rankUpdate } from '../../ecs-reco/rank-update'

const DEFAULT_MAX = 100

export const useBaseProfilesData = (
  serviceId: string,
  entityType: string,
  notify: (message: string, type: string) => void,
  skip = false,
) => {
  const { t } = useTranslation(['profiles', 'platform/common'])
  const [sort, setSort] = useState('rank ASC')
  const [query, setQuery] = useState('entityType=' + entityType)
  const { data, error, loading, refetch, fetchMore } = useStatefulApolloQuery(queryProfiles, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: { sortBy: sort, query, max: DEFAULT_MAX },
    notifyOnNetworkStatusChange: true,
    skip: skip,
  })

  const rankVariables = useMemo(() => ({ serviceId, entityType }), [serviceId, entityType])

  const [updateRankFn, updateRankResponse] = useStatefulApolloMutation(rankUpdate, {
    variables: { ...rankVariables, payload: [] },
  })
  const updateRankResponsePrev = usePrevious(updateRankResponse)

  useEffect(() => {
    if (error) {
      console.log(error.message)
      notify(t('platform/common:genericErrorMessage'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  useEffect(() => {
    if (data?.profiles?.hasMore && data?.profiles?.cursor) {
      const variables = {
        variables: { cursor: data?.profiles?.cursor, max: DEFAULT_MAX },
      }

      fetchMore(variables)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (updateRankResponse.error) {
      console.log(updateRankResponse.error.message)
      notify(t('platform/common:genericErrorMessage'), 'error')
    } else if (!updateRankResponse.loading && updateRankResponsePrev.loading) {
      notify(t('profiles:policy.rank.successfulUpdate'), 'success')
      refetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRankResponse])

  const handleSearch = useCallback(
    (str: string) => {
      if (str && str.trim() !== '') {
        setQuery(`entityType=${entityType},name=*${str}*`)
      } else {
        setQuery('entityType=' + entityType)
      }
    },
    [entityType, setQuery],
  )

  const updateRank = useCallback(
    (rankViews: { entityId: string; rank: number }[]) => {
      const variables = {
        ...rankVariables,
        payload: rankViews,
      }

      updateRankFn({ variables })
    },
    [updateRankFn, rankVariables],
  )

  return {
    profilesData: data,
    profilesLoading: loading,
    profilesError: error,
    setSort,
    updateRank,
    handleSearch,
    refetchProfiles: refetch,
  }
}
