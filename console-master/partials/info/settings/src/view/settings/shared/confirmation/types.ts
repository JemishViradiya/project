/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export enum CONFIRMATION_DIALOG_TYPE {
  CREATED = 'createdConfirmationDialog',
  MODIFIED = 'modifiedConfirmationDialog',
  DELETE = 'deleteConfirmationDialog',
  DISABLE = 'disableConfirmationDialog',
  ENABLE = 'enableConfirmationDialog',
}

export enum CONFIRMATION_DIALOG_ELEMENT {
  TITLE = 'title',
  DESCRIPTION = 'description',
  CANCEL_BUTTON = 'cancelButton',
  CONFIRM_BUTTON = 'confirmButton',
}

export interface ConfirmationProps {
  confirmationId: symbol
  type: CONFIRMATION_DIALOG_TYPE
  onConfirm: () => void
  onCancel?: () => void
  title?: string
  description?: string
  content?: any
  cancelButton?: string
  confirmButton?: string
  base?: string
}
