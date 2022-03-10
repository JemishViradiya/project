import { useParams } from 'react-router-dom'

import type { FlattenedDevicePolicy } from '@ues-data/epp'

import { MOCK_EXISTING_FLATTENED_POLICY, MOCK_NEW_FLATTENED_POLICY } from './data.mock'

interface UseDetailsInterface {
  data: FlattenedDevicePolicy
  loading: boolean
  isEdit: boolean
}

const useDetails = (): UseDetailsInterface => {
  const { policy_id } = useParams()

  // --TODO: fetch policy details if `policy_id` is specified in the route
  const data = policy_id ? MOCK_EXISTING_FLATTENED_POLICY : MOCK_NEW_FLATTENED_POLICY
  const loading = false

  return {
    data,
    loading,
    isEdit: Boolean(policy_id),
  }
}

export default useDetails
