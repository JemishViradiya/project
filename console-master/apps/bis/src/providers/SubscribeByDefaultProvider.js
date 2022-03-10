import { useStatefulApolloQuery, useStatefulApolloSubscription } from '@ues-data/shared'

const useSubscribeByDefault = (query, { skip, fetchPolicy = 'network-only', nextFetchPolicy = 'cache-first', ...rest } = {}) => {
  const { subscription } = query
  const commonOptions = { fetchPolicy, ...rest }
  const queryValue = useStatefulApolloQuery(query, { skip: skip || !!subscription, ...commonOptions })
  const subscriptionValue = useStatefulApolloSubscription(query, { skip: skip || !subscription, ...commonOptions })
  return subscription ? subscriptionValue : queryValue
}

export default useSubscribeByDefault
