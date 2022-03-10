import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { POLICY_TYPE } from '@ues-data/dlp'
import { PolicyData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

const usePolicyDataSource = (type: POLICY_TYPE, sortParams?, activeFilters?, maxElementsPerRequest?) => {
  const { t } = useTranslation(['dlp/policy'])
  const snackbar = useSnackbar()

  // get Policy list
  const initialSearchQueryParams = useMemo(
    () => ({
      policyType: type,
      queryParams: {
        max: maxElementsPerRequest,
        offset: 0,
        sortBy: sortParams,
        query: activeFilters,
      },
    }),
    [type, maxElementsPerRequest, sortParams, activeFilters],
  )

  const {
    error: policiesError,
    loading: policiesLoading,
    data: policiesList,
    refetch,
    fetchMore,
  } = useStatefulReduxQuery(PolicyData.queryPolicies, { variables: initialSearchQueryParams })

  useEffect(() => {
    if (policiesError) {
      snackbar.enqueueMessage(t('policy.serverError.retrievePolicies', { error: policiesError }), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policiesError, t])

  return { policiesError, policiesLoading, policiesList, refetch, fetchMore }
}

export default usePolicyDataSource
