import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { PolicyRankUpdateMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'

import PolicyRankProvider, { Context } from '../../providers/PolicyRankProvider'
import { ErrorBoundary, StandaloneCapability as capability, useCapability } from '../../shared'
import PolicyRank from './PolicyRank'
import createPolicyRankDto from './utils/createPolicyRankDto'

const swapPolicies = (policies, firstIndex, secondIndex) => {
  const policiesCopy = [...policies]

  const tempElement = policiesCopy[firstIndex]
  policiesCopy[firstIndex] = policiesCopy[secondIndex]
  policiesCopy[secondIndex] = tempElement

  return policiesCopy
}

const goBack = (navigate, location, tenant) => () => {
  const locationState = location.state

  if (locationState && locationState.goBack) {
    navigate(-1)
  } else {
    const policiesRoute = `/${tenant}/policies`
    navigate(policiesRoute)
  }
}

const PolicyRankContainer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { tenant } = useParams()
  const { loading, data } = useContext(Context)
  const [policies, setPolicies] = useState(data.policies)
  const [snackbar, setSnackbar] = useState({ open: false })
  const handleSnackbarOpen = useCallback(() => setSnackbar({ open: true }), [])
  const handleSnackbarClose = useCallback(() => setSnackbar({ open: false }), [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCancel = useCallback(goBack(navigate, location, tenant), [navigate, location, tenant])
  const [update, { loading: updating }] = useStatefulApolloMutation(PolicyRankUpdateMutation, {
    onCompleted: handleCancel,
    onError: handleSnackbarOpen,
  })
  const [canEdit] = useCapability(capability.POLICIES)

  useEffect(() => {
    setPolicies(data.policies)
  }, [data.policies])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      if (canEdit) {
        const variables = createPolicyRankDto(policies)
        update({ variables })
      }
    },
    [canEdit, policies, update],
  )

  const handleRankChange = useCallback(
    (index, diff) => {
      const secondIndexToSwap = index + diff
      const swappedPolicies = swapPolicies(policies, index, secondIndexToSwap)
      setPolicies(swappedPolicies)
    },
    [policies],
  )

  return (
    <PolicyRank
      loading={loading}
      updating={updating}
      policies={policies}
      snackbar={snackbar}
      canEdit={canEdit}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleSnackbarClose={handleSnackbarClose}
      handleRankChange={handleRankChange}
    />
  )
}

PolicyRankContainer.displayName = 'PolicyRankContainer'

const EnhancedPolicyRankContainer = memo(() => {
  return (
    <ErrorBoundary>
      <PolicyRankProvider>
        <PolicyRankContainer />
      </PolicyRankProvider>
    </ErrorBoundary>
  )
})

EnhancedPolicyRankContainer.displayName = 'EnhancedPolicyRankContainer'

export default EnhancedPolicyRankContainer
