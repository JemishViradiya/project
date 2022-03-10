/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { UsersApi } from '@ues-data/platform'
import { useStatefulAsyncMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

export const useResendInvitation = selectedProps => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()

  const [resendInvitationStartAction, resendInvitationState] = useStatefulAsyncMutation(UsersApi.resendInvitation, {})

  const handleConfirmResendInvitation = async () => {
    const resendInvitationPromise: any = resendInvitationStartAction({ userIds: selectedProps.selected })

    resendInvitationPromise
      .then(_response => {
        selectedProps.resetSelectedItems()
        snackbar.enqueueMessage(t('users.message.success.resendInvitation'), 'success')
      })
      .catch(error => {
        console.log(t('users.message.error.resend') + error)
        snackbar.enqueueMessage(t('users.message.error.resend'), 'error')
      })
  }

  const onResendInvitation = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.actions.resendInvitation'),
      description: t('users.actions.resendInvitationDescription', { userCount: selectedProps.selected.length }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('users.actions.resendInvitation'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      handleConfirmResendInvitation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProps.selected])

  return {
    onResendInvitation,
    resendProgressState: resendInvitationState?.loading,
  }
}
