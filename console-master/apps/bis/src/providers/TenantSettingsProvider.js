import { TenantSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

const useTenantSettings = () => {
  const value = useStatefulApolloQuery(TenantSettingsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })
  return value.data ? value.data.tenantSettings : undefined
}

export default useTenantSettings
