import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { IpAddressListAddMutation, IpAddressSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { TRANSLATIONS_NAMESPACES } from '../config'
import type { IpAddressEntry } from '../model'

export const useCreationHandler = (settingsVariables: any) => {
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const { enqueueMessage } = useSnackbar()

  const [addIpAddressList] = useStatefulApolloMutation(IpAddressListAddMutation, {
    refetchQueries: () => [
      {
        context: IpAddressListAddMutation.context,
        query: IpAddressSettingsQuery.query,
        variables: settingsVariables,
      },
    ],
  })

  return useCallback(
    async (data: Partial<IpAddressEntry>) => {
      let error

      try {
        await addIpAddressList({ variables: { input: data } })
      } catch (e) {
        enqueueMessage(t('bis/ues:settings.ipAddress.errorAddNew'), 'error')
        error = e
      }

      return { error }
    },
    [addIpAddressList, enqueueMessage, t],
  )
}
