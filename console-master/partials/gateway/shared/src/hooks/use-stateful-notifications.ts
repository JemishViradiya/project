//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { pick } from 'lodash-es'
import { useEffect } from 'react'

import { usePrevious } from '@ues-behaviour/react'
import { useSnackbar } from '@ues/behaviours'

import type { Task } from '../utils'
import { isTaskRejected, isTaskResolved } from '../utils'

enum NotificationType {
  Success = 'success',
  Error = 'error',
}

type NotificationMessageFn = (data: Task) => string
export type NotificationMessages = { [key in NotificationType]?: string | NotificationMessageFn }

export const useStatefulNotifications = <TOperationArguments>(
  operationArguments: TOperationArguments,
  notificationMessages: NotificationMessages,
): TOperationArguments => {
  const operationState = pick(Array.isArray(operationArguments) ? operationArguments[1] : operationArguments, [
    'data',
    'error',
    'loading',
  ])
  const previousOperationState = usePrevious(operationState)
  const { enqueueMessage } = useSnackbar()

  const displayNotification = (notificationType: NotificationType) => {
    const extractedMessage = notificationMessages[notificationType]
    const message = typeof extractedMessage === 'string' ? extractedMessage : extractedMessage(operationState)
    enqueueMessage(message, notificationType)
  }

  useEffect(() => {
    if (notificationMessages.success && isTaskResolved(operationState, previousOperationState)) {
      displayNotification(NotificationType.Success)
    }

    if (notificationMessages.error && isTaskRejected(operationState, previousOperationState)) {
      displayNotification(NotificationType.Error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationState])

  return operationArguments
}
