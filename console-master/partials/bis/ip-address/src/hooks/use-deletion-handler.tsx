import { noop } from 'lodash-es'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles, Typography } from '@material-ui/core'

import { IpAddressListDeleteMutation, IpAddressSettingsQuery } from '@ues-data/bis'
import { useStatefulApolloMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { TRANSLATIONS_NAMESPACES } from '../config'
import type { IpAddressEntry } from '../model'

const useStyles = makeStyles(() => ({
  deletionConfirmationList: {
    marginTop: '15px',
  },
  deletionConfirmationItem: {
    marginTop: '5px',
  },
}))

export const useDeletionHandler = (settingsVariables: any) => {
  const styles = useStyles()
  const confirmation = useConfirmation()
  const { t } = useTranslation(TRANSLATIONS_NAMESPACES)
  const { enqueueMessage } = useSnackbar()

  const DeletionConfirmationDialogContent = useCallback<React.FC<{ entries: IpAddressEntry[] }>>(
    ({ entries }) => (
      <div role="list" className={styles.deletionConfirmationList}>
        {entries.map((entry, index) => (
          <div role="listitem" className={styles.deletionConfirmationItem} key={index}>
            <Typography variant="h4">{entry.name}</Typography>
          </div>
        ))}
      </div>
    ),
    [styles],
  )

  const [deleteIpAddresses] = useStatefulApolloMutation(IpAddressListDeleteMutation, {
    onError: deleteError => console.error(deleteError),
    refetchQueries: () => [
      {
        query: IpAddressSettingsQuery.query,
        variables: settingsVariables,
        context: IpAddressListDeleteMutation.context,
      },
    ],
  })

  return useCallback(
    async (entries: IpAddressEntry[], onComplete: () => void = noop) => {
      let error

      if (entries.length === 0) {
        return
      }

      const state = await confirmation({
        cancelButtonLabel: t('bis/ues:settings.ipaddresses.deleteDialog.cancelButtonLabel'),
        confirmButtonLabel: t('bis/ues:settings.ipaddresses.deleteDialog.confirmButtonLabel'),
        content: <DeletionConfirmationDialogContent entries={entries} />,
        description: t('bis/ues:settings.ipaddresses.deleteDialog.description'),
        title: t('bis/ues:settings.ipaddresses.deleteDialog.title'),
      })

      if (state !== ConfirmationState.Confirmed) {
        return
      }

      try {
        await deleteIpAddresses({ variables: { ids: entries.map(entry => entry.id) } })
        onComplete()
      } catch (e) {
        enqueueMessage(t('bis/ues:settings.ipAddress.errorDelete'), 'error')

        error = e
      }

      return { error }
    },
    [DeletionConfirmationDialogContent, confirmation, deleteIpAddresses, enqueueMessage, t],
  )
}
