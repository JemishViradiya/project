//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as httpStatus from 'http-status-codes'
import { noop } from 'lodash-es'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePrevious } from '@ues-behaviour/react'
import { RequestError } from '@ues-data/gateway'
import { useStatefulReduxMutation } from '@ues-data/shared'

import { useStatefulNotifications } from '../../../hooks'
import type { Task } from '../../../utils'
import { isTaskResolved } from '../../../utils'
import type { EntityDetailsViewProps } from '../types'

export const useStatefulReduxMutationResolver = dataLayer =>
  // trigger hook conditionally
  dataLayer ? useStatefulReduxMutation : (): ReturnType<typeof useStatefulReduxMutation> => [noop, { loading: false }]

type UseMutationListenersFn = (
  args: Pick<EntityDetailsViewProps, 'saveAction' | 'removeAction' | 'parentPage'>,
) => {
  removeEntity: (variables?: unknown) => unknown
  removeEntityTask: Task
  saveEntity: (variables?: unknown) => unknown
  saveEntityTask: Task
}

export const useMutationListeners: UseMutationListenersFn = ({ saveAction, removeAction, parentPage }) => {
  const navigate = useNavigate()

  const [saveEntity, saveEntityTask] = useStatefulNotifications(
    useStatefulReduxMutationResolver(saveAction?.dataLayer)(saveAction?.dataLayer),
    {
      success: saveAction?.notificationMessages?.success,
      error: ({ error }) => {
        if (error?.response?.status === httpStatus.BAD_REQUEST && error?.response?.data?.error === RequestError.NameAlreadyUsed) {
          return saveAction?.notificationMessages?.nameAlreadyUsedError
        } else {
          return saveAction?.notificationMessages?.error ?? error?.message
        }
      },
    },
  )
  const previousSubmitEntityTask = usePrevious(saveEntityTask)

  const [removeEntity, removeEntityTask] = useStatefulNotifications(
    useStatefulReduxMutationResolver(removeAction?.dataLayer)(removeAction?.dataLayer),
    {
      success: removeAction?.notificationMessages?.success,
      error: ({ error }) => {
        const extractedMessage = removeAction?.notificationMessages?.error ?? error.message
        return typeof extractedMessage === 'string' ? extractedMessage : extractedMessage({ error })
      },
    },
  )
  const previousRemoveEntityTask = usePrevious(removeEntityTask)

  useEffect(() => {
    const mutationListeners = [
      { onSuccess: saveAction?.onSuccess, currentTask: saveEntityTask, previousTask: previousSubmitEntityTask },
      { onSuccess: removeAction?.onSuccess, currentTask: removeEntityTask, previousTask: previousRemoveEntityTask },
    ]

    mutationListeners.forEach(({ currentTask, previousTask, onSuccess }) => {
      const isCurrentTaskResolved = isTaskResolved(currentTask, previousTask)

      if (isCurrentTaskResolved && onSuccess) onSuccess(currentTask?.data)

      if (isCurrentTaskResolved && !onSuccess) navigate(parentPage)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveEntityTask, removeEntity])

  return { saveEntity, saveEntityTask, removeEntityTask, removeEntity }
}
