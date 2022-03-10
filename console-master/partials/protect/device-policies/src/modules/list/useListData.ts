import { useSelector } from 'react-redux'

import type { DevicePoliciesState, DevicePolicyListItem } from '@ues-data/epp'
import { DevicePoliciesReduxSlice, fetchDevicePolicyList } from '@ues-data/epp'
import { useStatefulReduxQuery } from '@ues-data/shared'

interface UseListDataInterface {
  data: DevicePolicyListItem[]
  loading: boolean
  error: Error
  refetch: (variables?: null) => unknown
}

const useListData = (): UseListDataInterface => {
  const { refetch } = useStatefulReduxQuery(fetchDevicePolicyList)
  const {
    fetchDevicePolicyList: { error, loading, result },
  } = useSelector(state => (state[DevicePoliciesReduxSlice] as DevicePoliciesState).tasks)

  return {
    data: result,
    loading,
    error,
    refetch,
  }
}

export default useListData
