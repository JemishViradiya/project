/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import type { TFuncKey, TransProps } from 'react-i18next'
import { useTranslation } from 'react-i18next'

import type { SnackbarProviderContext } from '@ues/behaviours'
import { useSnackbar } from '@ues/behaviours'

let snackbarRef: SnackbarProviderContext
let translations: TransProps<TFuncKey>

export enum ENQUEUE_TYPE {
  DEFAULT = 'default',
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
}

export const NotificationProvider = ({ children }): JSX.Element => {
  const _snackbarRef = useSnackbar()
  const _translations = useTranslation(['dlp/common'])
  React.useEffect(() => {
    snackbarRef = _snackbarRef
    translations = _translations
  }, [_snackbarRef, _translations])
  return children
}

export function notification(variant: ENQUEUE_TYPE, message: string): void {
  snackbarRef.enqueueMessage(translations.t(message), variant)
}

export function notificationArgs(variant: ENQUEUE_TYPE, message: string, formatArgs: any): void {
  snackbarRef.enqueueMessage(translations.t(message, formatArgs), variant)
}
