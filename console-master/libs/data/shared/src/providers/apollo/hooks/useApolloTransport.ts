import once from 'lodash/once'

import { resolveOverrideEnvironmentValue } from '../../../shared/overrideEnvironmentVariable'

const useApolloTransport = once(() => {
  const { value } = resolveOverrideEnvironmentValue('UES_APOLLO_TRANSPORT')
  return value
})

export default useApolloTransport
