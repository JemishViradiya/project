import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { IpAddressListUpdateMutation, IpAddressSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { TRANSLATIONS_NAMESPACES } from '../config'
import type { IpAddressEntry } from '../model'

export const useUpdationHandler = (settingsVariables: any) => {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const { enqueueMessage } = useSnackbar()

  const [updateIpAddressList] = useStatefulApolloMutation(IpAddressListUpdateMutation, {
    refetchQueries: () => [
      {
        query: IpAddressSettingsQuery.query,
        variables: settingsVariables,
        context: IpAddressListUpdateMutation.context,
      },
    ],
  })

  return useCallback(
    async (id: string, input: Partial<Omit<IpAddressEntry, 'id'>>) => {
      let error

      try {
        await updateIpAddressList({ variables: { id, input } })
      } catch (e) {
        enqueueMessage(t('bis/ues:settings.ipAddress.errorUpdate'), 'error')

        error = e
      }

      return { error }
    },
    [enqueueMessage, t, updateIpAddressList],
  )
}
