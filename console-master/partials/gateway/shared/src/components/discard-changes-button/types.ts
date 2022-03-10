//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

export interface DiscardChangesButtonProps {
  iconButton?: React.ReactNode
  shouldDisableActionButton?: boolean
  hasUnsavedChanges?: boolean
  parentPage?: string
  onConfirm?: () => void
}
