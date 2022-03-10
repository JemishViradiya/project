//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import * as httpStatus from 'http-status-codes'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useSnackbar } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../../config'
import type { Task } from '../../../utils'
import type { BaseEntityData, EntityDetailsViewProps } from '../types'

export const useEntity404ErrorHandler = (task: Task<BaseEntityData>, parentPage: EntityDetailsViewProps['parentPage']) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const { enqueueMessage } = useSnackbar()
  const navigate = useNavigate()

  useEffect(() => {
    if (task?.error?.response?.status === httpStatus.NOT_FOUND) {
      enqueueMessage(t('common.resourceNotFound'), 'error')
      navigate(parentPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, parentPage])
}
