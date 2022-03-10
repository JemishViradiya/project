import { useMemo, useState } from 'react'

interface UseSettingsVariablesOptions {
  isBlacklist: boolean
}

const IP_ADDRESSES_QUERY_PARAMS = {
  OFFSET: 0,
  LIMIT: 3,
}

const SORTING_OPTIONS = {
  INIT_SORT_BY: 'name',
  INIT_SORT_DIRECTION: 'ASC',
}

const INITIAL_STATE = {
  offset: IP_ADDRESSES_QUERY_PARAMS.OFFSET,
  limit: IP_ADDRESSES_QUERY_PARAMS.LIMIT,
}

export const useSettingsVariables = ({ isBlacklist }: UseSettingsVariablesOptions) => {
  const [state] = useState(INITIAL_STATE)

  const variables = useMemo(
    () => ({
      offset: state.offset,
      sortBy: SORTING_OPTIONS.INIT_SORT_BY,
      isBlacklist,
      sortDirection: SORTING_OPTIONS.INIT_SORT_DIRECTION,
    }),
    [isBlacklist, state.offset],
  )

  return { variables }
}
