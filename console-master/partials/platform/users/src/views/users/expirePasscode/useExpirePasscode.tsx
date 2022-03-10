/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import type { ServerSideSelectionModel } from '@ues-data/platform'
import { UsersApi } from '@ues-data/platform'
import { usePrevious, useStatefulAsyncMutation } from '@ues-data/shared'
import type { UseSelected } from '@ues/behaviours'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { isCompleted } from '../userUtils'

export const useExpirePasscode = (
  selectedProps: UseSelected<any>,
  selectedCount: number,
  serverSideSelectionModel: ServerSideSelectionModel,
  refetch: () => void,
) => {
  const { t } = useTranslation(['platform/common', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()

  const [expireUsersPasscodesAction, expireUsersPasscodesState] = useStatefulAsyncMutation(UsersApi.expireUsersPasscodes, {})
  const expireUsersPasscodesStatePrev = usePrevious(expireUsersPasscodesState)

  const expireUsersPasscodes = useCallback(() => {
    expireUsersPasscodesAction({
      selectionModel: { ...serverSideSelectionModel },
    })
  }, [expireUsersPasscodesAction, serverSideSelectionModel])

  useEffect(() => {
    if (isCompleted(expireUsersPasscodesState, expireUsersPasscodesStatePrev)) {
      if (expireUsersPasscodesState.error) {
        snackbar.enqueueMessage(t('users.expirePasscodes.error'), 'error')
      } else if (expireUsersPasscodesState.data?.bulkActionInProcess) {
        selectedProps?.resetSelectedItems()
        snackbar.enqueueMessage(t('message.requestAccepted'), 'success')
      } else if (expireUsersPasscodesState.data?.failedCount > 0) {
        snackbar.enqueueMessage(
          t('users.expirePasscodes.errorWithCount', { count: expireUsersPasscodesState.data?.failedCount }),
          'error',
        )
      } else {
        refetch()
        selectedProps?.resetSelectedItems()
        snackbar.enqueueMessage(t('users.expirePasscodes.success'), 'success')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expireUsersPasscodesState])

  const handleExpirePasscodes = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.expirePasscodes.title'),
      description: t('users.expirePasscodes.description', {
        userCount: selectedCount,
      }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.expire'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      expireUsersPasscodes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCount])

  return {
    handleExpirePasscodes,
    expireUsersPasscodesLoading: expireUsersPasscodesState?.loading,
  }
}
