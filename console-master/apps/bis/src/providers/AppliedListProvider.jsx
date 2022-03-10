import PropTypes from 'prop-types'
import React, { createContext, memo, useCallback, useMemo } from 'react'

import { AppliedListAddMutation, AppliedListDeleteMutation, AppliedListQuery } from '@ues-data/bis'
import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

const { query: appliedListQuery } = AppliedListQuery

export const Context = createContext([])
const { Provider, Consumer } = Context

const sorters = {
  nameReverse: (a, b) => {
    const nameA = a.info.displayName || a.info.name || a.info.username || `Unknown ${a.__typename}`
    const nameB = b.info.displayName || b.info.name || b.info.username || `Unknown ${b.__typename}`
    if (nameA > nameB) {
      return -1
    } else if (nameA < nameB) {
      return 1
    } else {
      return 0
    }
  },
  name: (a, b) => {
    const nameA = a.info.displayName || a.info.name || a.info.username || `Unknown ${a.__typename}`
    const nameB = b.info.displayName || b.info.name || b.info.username || `Unknown ${b.__typename}`
    if (nameA > nameB) {
      return 1
    } else if (nameA < nameB) {
      return -1
    } else {
      return 0
    }
  },
}

const provideSearchText = item => ({
  ...item,
  searchText: Object.values(item.info)
    .filter(value => value)
    .join('\t')
    .toLowerCase(),
})

const defaultData = { applied: { users: [], groups: [] } }
const AppliedListProvider = memo(({ variables, children, searchText, groupOnly, onAdded, onDeleted }) => {
  const refetchQueries = useCallback(
    () => [
      {
        query: appliedListQuery,
        variables,
      },
    ],
    [variables],
  )

  // TODO: error handling
  const deleteMutationProps = useMemo(
    () => ({
      onCompleted: onDeleted,
      onError: deleteError => console.error(deleteError),
      refetchQueries,
    }),
    [onDeleted, refetchQueries],
  )
  const [deleteUsersAndGroups, { loading: deleteInProgress }] = useStatefulApolloMutation(
    AppliedListDeleteMutation,
    deleteMutationProps,
  )

  // TODO: error handling
  const addMutationProps = useMemo(
    () => ({
      onCompleted: onAdded,
      onError: addError => console.log(addError),
      refetchQueries,
    }),
    [onAdded, refetchQueries],
  )
  const [addUsersAndGroups, { loading: addUsersAndGroupsLoading }] = useStatefulApolloMutation(
    AppliedListAddMutation,
    addMutationProps,
  )

  const { loading, error, data = defaultData } = useStatefulApolloQuery(AppliedListQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables,
  })

  const preparedData = useMemo(() => {
    const { users, groups } = data.applied

    return [].concat(
      !groupOnly ? users.map(user => provideSearchText(user)) : [],
      groups.map(group => provideSearchText(group)),
    )
  }, [data.applied, groupOnly])

  const filteredData = useMemo(() => {
    if (searchText && searchText.length >= 1) {
      const match = searchText.toLowerCase()
      return preparedData.filter(item => item.searchText.includes(match))
    } else {
      return preparedData
    }
  }, [searchText, preparedData])

  const sortedData = useMemo(() => {
    return filteredData.sort(sorters.name)
  }, [filteredData])

  const value = useMemo(
    () => ({
      loading,
      error,
      data: sortedData,
      total: preparedData.length,
      deleteUsersAndGroups,
      deleteInProgress,
      addUsersAndGroups,
      addUsersAndGroupsLoading,
    }),
    [
      addUsersAndGroups,
      addUsersAndGroupsLoading,
      deleteUsersAndGroups,
      deleteInProgress,
      error,
      loading,
      preparedData.length,
      sortedData,
    ],
  )
  return <Provider value={value}>{children}</Provider>
})

AppliedListProvider.propTypes = {
  searchText: PropTypes.string.isRequired,
  variables: PropTypes.shape({
    policyId: PropTypes.string,
  }).isRequired,
  onAdded: PropTypes.func.isRequired,
  onDeleted: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

AppliedListProvider.Consumer = Consumer

export default AppliedListProvider
