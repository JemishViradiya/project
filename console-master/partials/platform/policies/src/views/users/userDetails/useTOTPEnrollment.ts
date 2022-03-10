/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import * as httpStatus from 'http-status-codes'
import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { mutateRemoveTOTPEnrollmentStatus, queryTOTPEnrollmentStatus } from '@ues-data/eid'
import {
  FeatureName,
  Permission,
  useFeatures,
  usePrevious,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { ConfirmationState, useConfirmation, useSnackbar } from '@ues/behaviours'

import { isCompleted } from '../userUtils'

export const useTOTPEnrollment = (setTotpEnrolled, displayName, hasPermission) => {
  const snackbar = useSnackbar()
  const confirmation = useConfirmation()
  const { t } = useTranslation(['platform/common'])
  const params = useParams()
  const { isEnabled } = useFeatures()
  const eidTOTPEnrollmentEnabled = isEnabled(FeatureName.UESTOTPEnrollmentEnabled)

  const userNotFoundMsg = 'User not found'

  const { data: data_totp, loading: loading_totp, error: error_totp } = useStatefulAsyncQuery(queryTOTPEnrollmentStatus, {
    variables: { ecsUserId: params.id },
    skip: !eidTOTPEnrollmentEnabled || !hasPermission(Permission.ECS_USERS_UPDATE),
  })

  const [removeTOTPEnrollmentFn, removeTOTPEnrollmentResponse] = useStatefulAsyncMutation(mutateRemoveTOTPEnrollmentStatus, {})
  const prevRemovalState = usePrevious(removeTOTPEnrollmentResponse)

  const handleRemoval = useCallback(async () => {
    const confirmationState = await confirmation({
      title: t('users.remove.title'),
      description: t('users.remove.description', { user: displayName }),
      cancelButtonLabel: t('general/form:commonLabels.cancel'),
      confirmButtonLabel: t('general/form:commonLabels.confirm'),
      maxWidth: 'xs',
    })

    if (
      eidTOTPEnrollmentEnabled &&
      hasPermission(Permission.ECS_USERS_UPDATE) &&
      confirmationState === ConfirmationState.Confirmed
    ) {
      removeTOTPEnrollmentFn({ ecsUserId: params.id })
    }
  }, [removeTOTPEnrollmentFn, displayName, params, confirmation, hasPermission, t, eidTOTPEnrollmentEnabled])

  useEffect(() => {
    // console.log('totp: ', { data_totp, loading_totp, error_totp })
    if (loading_totp === false && error_totp) {
      // don't show error alert message if totp record was not found for user
      const hide_error_alert =
        error_totp['response']?.data?.status === httpStatus.NOT_FOUND && error_totp['response']?.data?.message === userNotFoundMsg
      if (!hide_error_alert) {
        snackbar.enqueueMessage(t('users.totp.fetchError'), 'error')
      }
    } else if (loading_totp === false && !error_totp && data_totp) {
      setTotpEnrolled(!!data_totp.activated)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data_totp, loading_totp, error_totp])

  useEffect(() => {
    if (isCompleted(removeTOTPEnrollmentResponse, prevRemovalState)) {
      const e: any = removeTOTPEnrollmentResponse.error
      if (e) {
        snackbar.enqueueMessage(t('users.totp.removeError'), 'error')
      } else {
        snackbar.enqueueMessage(t('users.totp.removeSuccess'), 'success')
        setTotpEnrolled(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeTOTPEnrollmentResponse])

  return { handleRemoval }
}
