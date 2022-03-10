import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { DeleteGeozonesMutation } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

export const useDeleteGeozoneHandler = () => {
  const { t } = useTranslation('bis/ues')
  const { enqueueMessage } = useSnackbar()

  const [deleteGeozones, { loading }] = useStatefulApolloMutation(DeleteGeozonesMutation)

  const handler = useCallback(
    async (ids: string[]) => {
      try {
        await deleteGeozones({ variables: { ids } })
      } catch (error) {
        enqueueMessage(t('bis/ues:geozones.operations.delete.error'), 'error')

        return { error: true }
      }

      enqueueMessage(t('bis/ues:geozones.operations.delete.success'), 'success')

      return { error: false }
    },
    [deleteGeozones, enqueueMessage, t],
  )

  return { handler, loading }
}
