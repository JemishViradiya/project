import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { GeozonesListEntity } from '@ues-data/bis'
import { UpdateGeozoneMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

export const useUpdateGeozoneHandler = () => {
  const { t } = useTranslation('bis/ues')
  const { enqueueMessage } = useSnackbar()

  const [updateGeozone, { loading }] = useStatefulApolloMutation(UpdateGeozoneMutation)

  const handler = useCallback(
    async (input: GeozonesListEntity) => {
      const { id, ...rest } = input

      try {
        await updateGeozone({ variables: { id, input: rest } })
      } catch (error) {
        enqueueMessage(t('bis/ues:geozones.operations.update.error'), 'error')

        return { error: true }
      }

      enqueueMessage(t('bis/ues:geozones.operations.update.success'), 'success')

      return { error: false }
    },
    [enqueueMessage, t, updateGeozone],
  )

  return { handler, loading }
}
