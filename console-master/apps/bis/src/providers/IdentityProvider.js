import { IdentityQuery } from '@ues-data/bis'
import { useStatefulApolloQuery } from '@ues-data/shared'

export const useIdentity = () => {
  const { data = {} } = useStatefulApolloQuery(IdentityQuery)
  return data.identity
}
