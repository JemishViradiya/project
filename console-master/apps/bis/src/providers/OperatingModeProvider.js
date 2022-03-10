import { OperatingModeQuery } from '@ues-data/bis'
import { useStatefulApolloSubscription } from '@ues-data/shared'

const useOperatingMode = () => {
  const { data: queryData } = useStatefulApolloSubscription(OperatingModeQuery)
  return queryData || {}
}

export default useOperatingMode
