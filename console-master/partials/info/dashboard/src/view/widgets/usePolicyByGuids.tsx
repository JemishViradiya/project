import { useMemo } from 'react'

import { PolicyData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'

export const usePolicyByGuids = (guids: string[]) => {
  const initialSearchByGuidsQueryParams = useMemo(
    () => ({
      guidList: guids,
    }),
    [guids],
  )
  const {
    error: policiesByGuidsError,
    loading: policiesByGuidsLoading,
    data: policiesByGuidsList,
  } = useStatefulReduxQuery(PolicyData.queryPoliciesByGuids, { variables: initialSearchByGuidsQueryParams })

  return { policiesByGuidsList }
}
