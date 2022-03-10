import { UESRiskEnginesSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

export const useSettings = () => {
  const queryResult = useStatefulApolloQuery(UESRiskEnginesSettingsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  return [queryResult] as const
}
