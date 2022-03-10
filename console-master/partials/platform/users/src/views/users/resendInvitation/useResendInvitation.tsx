/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ServerSideSelectionModel } from '@ues-data/platform'
import { UsersApi } from '@ues-data/platform'
import { useStatefulAsyncMutation } from '@ues-data/shared'
import type { UseSelected } from '@ues/behaviours'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

export const useResendInvitation = (
  selectedProps: UseSelected<any>,
  selectedCount: number,
  serverSideSelectionModel: ServerSideSelectionModel,
) => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()

  const [resendInvitationStartAction, resendInvitationState] = useStatefulAsyncMutation(UsersApi.resendInvitationExt, {})

  const handleConfirmResendInvitation = async () => {
    const resendErrorMessage = 'users.message.error.resend'
    const resendInvitationPromise: any = resendInvitationStartAction({
      selectionModel: { ...serverSideSelectionModel },
    })

    const onSuccessResendActions = (partial?: boolean): void => {
      const tMessage = `users.message.success.${partial ? 'resendInvitationPartial' : 'resendInvitation'}`

      selectedProps.resetSelectedItems()
      snackbar.enqueueMessage(t(tMessage), 'success')
    }

    resendInvitationPromise
      .then(response => {
        if (response.data?.bulkActionInProcess) {
          selectedProps?.resetSelectedItems()
          snackbar.enqueueMessage(t('platform/common:message.requestAccepted'), 'success')
        } else {
          const { totalCount, failedCount } = response.data

          if (totalCount === failedCount) {
            snackbar.enqueueMessage(t(resendErrorMessage), 'error')
          } else if (failedCount === 0) {
            onSuccessResendActions()
          } else {
            onSuccessResendActions(true)
          }
        }
      })
      .catch(error => {
        console.log(t(resendErrorMessage) + error)
        snackbar.enqueueMessage(t(resendErrorMessage), 'error')
      })
  }

  const onResendInvitation = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.actions.resendInvitation'),
      description: t('users.actions.resendInvitationDescription', { userCount: selectedCount }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('users.actions.resendInvitation'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      handleConfirmResendInvitation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCount])

  return {
    onResendInvitation,
    resendProgressState: resendInvitationState?.loading,
  }
}
