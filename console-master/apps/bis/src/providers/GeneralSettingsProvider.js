import { useCallback } from 'react'

import { GeneralSettingsMutation, GeneralSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation, useStatefulApolloQuery } from '@ues-data/shared'

const useGeneralSettings = () => {
  const value = useStatefulApolloQuery(GeneralSettingsQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    partialRefetch: true,
  })

  const [setValue, mutationValue] = useStatefulApolloMutation(GeneralSettingsMutation)
  const mutate = useCallback(
    ({ update, ...props }) => {
      setValue({
        ...props,
        update: (cache, data) => {
          GeneralSettingsMutation.update(cache, data)
          update && update(data)
        },
      })
    },
    [setValue],
  )

  return [value, mutate, mutationValue]
}

export default useGeneralSettings
