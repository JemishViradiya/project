import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { GeozonesListEntity } from '@ues-data/bis'
import { CreateGeozoneMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

export const useCreateGeozoneHandler = () => {
  const { t } = useTranslation('bis/ues')
  const { enqueueMessage } = useSnackbar()

  const [createGeozone, { loading }] = useStatefulApolloMutation(CreateGeozoneMutation)

  const handler = useCallback(
    async (input: GeozonesListEntity) => {
      try {
        await createGeozone({ variables: { input } })
      } catch (error) {
        enqueueMessage(t('bis/ues:geozones.operations.create.error'), 'error')

        return { error: true }
      }

      enqueueMessage(t('bis/ues:geozones.operations.create.success'), 'success')

      return { error: false }
    },
    [createGeozone, enqueueMessage, t],
  )

  return { handler, loading }
}
