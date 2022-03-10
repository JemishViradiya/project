/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ConfirmationProps } from '@ues/behaviours'
import { useControlledDialog } from '@ues/behaviours'

type UseIgnoreMobileAlertsConfirmationReturn = {
  confirmationOptions: ConfirmationProps
  confirmIgnore: (ids: any[]) => void
}

export const useIgnoreMobileAlertsConfirmation = (
  selectAllChecked: boolean,
  unselectAll: () => void,
  onIgnore: (ids: any[]) => void,
): UseIgnoreMobileAlertsConfirmationReturn => {
  const { t } = useTranslation(['mtd/common'])
  const [confirmationOptions, setConfirmationOptions] = useState<ConfirmationProps>()

  const submitIgnore = (ids: any[]) => {
    onIgnore(ids)
    unselectAll()
    setConfirmationOptions(undefined)
  }

  const { open, onClose } = useControlledDialog({
    dialogId: Symbol('confirmIgnoreMobileAlert'),
    onClose: () => setConfirmationOptions(undefined),
  })

  const confirmIgnore = (ids: any[]) => {
    let description
    if (selectAllChecked) {
      if (ids?.length > 0) {
        description = t('mobileAlert.ignore.descriptionIgnoreAllExcludes', { selected: ids?.length })
      } else {
        description = t('mobileAlert.ignore.descriptionIgnoreAll')
      }
    } else {
      description = t('mobileAlert.ignore.description', { selected: ids?.length })
    }
    setConfirmationOptions({
      open,
      title: t('mobileAlert.ignore.title'),
      description: description,
      content: t('mobileAlert.ignore.note'),
      cancelButtonLabel: t('mobileAlert.ignore.cancelButton'),
      confirmButtonLabel: t('mobileAlert.ignore.confirmButton'),
      onConfirm: () => {
        submitIgnore(ids)
      },
      onCancel: onClose,
    })
  }

  return { confirmationOptions, confirmIgnore }
}
