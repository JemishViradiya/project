//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePrevious } from '@ues-behaviour/react'
import { AriaElementLabel } from '@ues/assets-e2e'
import { FormButtonPanel, ProgressButton, useDialogPrompt } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import { isTaskResolved } from '../../utils'
import type { DiscardChangesButtonProps } from '../discard-changes-button'
import { DiscardChangesButton } from '../discard-changes-button'

interface StickyActionsProps {
  isAddMode?: boolean
  disableCancelButton?: boolean
  disableConfirmButton?: boolean
  show: boolean
  loading?: boolean
  onCancel?: () => void
  onSave: () => void
  parentPage?: string
  hideConfirmation?: boolean
}

const StickyActions: React.FC<StickyActionsProps> = ({
  isAddMode,
  disableCancelButton,
  disableConfirmButton,
  show,
  loading,
  onCancel,
  onSave,
  parentPage,
  hideConfirmation = false,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const [saveButtonSubmitted, setSaveButtonSubmitted] = useState<boolean>(false)

  const previousLoading = usePrevious(loading)

  useEffect(() => {
    if (isTaskResolved({ loading }, { loading: previousLoading })) {
      setSaveButtonSubmitted(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const UnsavedConfirmationDialog = useDialogPrompt(
    'gateway/common:common.unsavedChangesMessage',
    !saveButtonSubmitted && show && !hideConfirmation,
  )

  const discardChangesButtonProps: DiscardChangesButtonProps = {
    hasUnsavedChanges: show,
    shouldDisableActionButton: disableCancelButton,
    onConfirm: onCancel,
    parentPage,
  }

  const handleOnSave = () => {
    setSaveButtonSubmitted(true)
    onSave()
  }

  return (
    <FormButtonPanel show={isAddMode || show}>
      <DiscardChangesButton {...discardChangesButtonProps} />
      <ProgressButton
        aria-label={AriaElementLabel.StickyActionsSaveButton}
        loading={loading}
        color="primary"
        variant="contained"
        disabled={disableConfirmButton}
        onClick={handleOnSave}
      >
        {isAddMode ? t('common.buttonAdd') : t('common.buttonSave')}
      </ProgressButton>
      {UnsavedConfirmationDialog}
    </FormButtonPanel>
  )
}

export { StickyActions }
