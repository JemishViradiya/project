/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { EndpointsApi } from '@ues-data/platform'
import { useStatefulAsyncMutation } from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

export const useDeviceDeactivation = refetchDevices => {
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const confirmation = useConfirmation()
  const snackbar = useSnackbar()
  const errorMessage = t('users.details.devices.error.remove')

  const [deviceDeactivationStartAction, deviceDeactivationState] = useStatefulAsyncMutation(EndpointsApi.deactivateDevice, {})

  const handleConfirmDeviceDeactivation = async endpointIds => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deviceDeactivationPromise: any = deviceDeactivationStartAction({ endpointIds })

    deviceDeactivationPromise
      .then(response => {
        const successfulCount = response.data.totalCount - response.data.failedCount
        if (successfulCount === 0) {
          snackbar.enqueueMessage(errorMessage, 'error')
        } else {
          snackbar.enqueueMessage(t('users.details.devices.success.remove'), 'success')
          refetchDevices()
        }
      })
      .catch(error => {
        console.log(errorMessage + error)
        snackbar.enqueueMessage(errorMessage, 'error')
      })
  }

  const onDeviceDeactivation = useCallback(async endpointIds => {
    const confirmationState = await confirmation({
      title: t('users.details.devices.dialogs.remove.title'),
      description: t('users.details.devices.dialogs.remove.description'),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.delete'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      handleConfirmDeviceDeactivation(endpointIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    onDeviceDeactivation,
    deleteInProgress: deviceDeactivationState?.loading,
  }
}
