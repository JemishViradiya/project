import { useCallback, useEffect, useMemo, useState } from 'react'

import { usePrevious, useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

import { queryProfileMembers } from '../../ecs-bff-platform/profile-members'
import { queryProfileNonMembers } from '../../ecs-bff-platform/profile-non-members'
import { userGroupAssign, userGroupUnassign } from '../../ecs-reco/assign-users-groups'

export const useBaseProfileAssignmentsData = (
  serviceId: string,
  entityType: string,
  profileId: string,
  notify: (message: string, type: string) => void,
) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortDirection, setSortDirection] = useState('ASC')

  const {
    data: assignableData,
    error: assignableError,
    loading: assignableDataLoading,
    refetch: refetchAssignable,
  } = useStatefulApolloQuery(queryProfileNonMembers, {
    variables: { serviceId, entityType, entityId: profileId, searchTerm },
    fetchPolicy: 'cache-and-network',
  })

  const profileMembersVariables = useMemo(() => ({ serviceId, entityType, entityId: profileId, max: 50, sortDirection }), [
    serviceId,
    entityType,
    profileId,
    sortDirection,
  ])

  const userGroupVariables = useMemo(() => ({ serviceId, entityType, entityId: profileId }), [profileId, serviceId, entityType])

  const {
    data: assignedData,
    error: assignedError,
    loading: assignedDataLoading,
    fetchMore,
    refetch: refetchAssigned,
  } = useStatefulApolloQuery(queryProfileMembers, {
    variables: profileMembersVariables,
    notifyOnNetworkStatusChange: true,
  })

  const [unassignFn, unassignResponse] = useStatefulApolloMutation(userGroupUnassign, {
    variables: { ...userGroupVariables, payload: {} },
  })
  const unassignResponsePrev = usePrevious(unassignResponse)

  const [assignFn, assignResponse] = useStatefulApolloMutation(userGroupAssign, {
    variables: { ...userGroupVariables, payload: {} },
  })
  const assignResponsePrev = usePrevious(assignResponse)

  useEffect(() => {
    if (assignedError) {
      notify(assignedError.message, 'error')
    } else if (assignableError) {
      notify(assignableError.message, 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedError, assignableError])

  useEffect(() => {
    if (assignResponse.error) {
      notify(assignResponse.error.message, 'error')
    } else if (!assignResponse.loading && assignResponsePrev.loading) {
      notify('policy.assignment.successfulAssignment', 'success')
      refetchAssigned()
      refetchAssignable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignResponse])

  useEffect(() => {
    if (unassignResponse.error) {
      notify(unassignResponse.error.message, 'error')
    } else if (!unassignResponse.loading && unassignResponsePrev.loading) {
      notify('policy.assignment.successfulUnassignment', 'success')
      refetchAssigned()
      refetchAssignable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unassignResponse])

  useEffect(() => {
    try {
      refetchAssigned()
    } catch (error) {
      console.error(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortDirection])

  const assign = useCallback(
    data => {
      assignFn({ variables: { ...userGroupVariables, payload: data } })
    },
    [assignFn, userGroupVariables],
  )

  const unassign = useCallback(
    data => {
      unassignFn({ variables: { ...userGroupVariables, payload: data } })
    },
    [unassignFn, userGroupVariables],
  )

  return {
    assignableData: searchTerm ? assignableData : undefined,
    assignableDataLoading,
    refetchAssignable,
    assignedData: !assignedDataLoading ? assignedData : undefined,
    assignedDataLoading,
    refetchAssigned,
    fetchMore,
    assign,
    unassign,
    setSearchTerm,
    setSortDirection,
  }
}
