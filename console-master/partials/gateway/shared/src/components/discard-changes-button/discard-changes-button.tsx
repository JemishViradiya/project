//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Button, IconButton } from '@material-ui/core'

import { AriaElementLabel } from '@ues/assets-e2e'
import { ConfirmationState, useConfirmation } from '@ues/behaviours'

import { GATEWAY_TRANSLATIONS_KEY } from '../../config'
import type { DiscardChangesButtonProps } from './types'

const DiscardChangesButton: React.FC<DiscardChangesButtonProps> = ({
  iconButton,
  shouldDisableActionButton,
  hasUnsavedChanges,
  parentPage,
  onConfirm,
}) => {
  const { t } = useTranslation([GATEWAY_TRANSLATIONS_KEY])
  const navigate = useNavigate()
  const confirmation = useConfirmation()

  const goBack = () => {
    navigate(parentPage)
  }

  const handleOnConfirm = () => (typeof onConfirm === 'function' ? onConfirm() : goBack())

  const showConfirmation = async () => {
    const confirmationState = await confirmation({
      title: t('common.unsavedChangesTitle'),
      cancelButtonLabel: t('common.buttonCancel'),
      // TODO: add custom message not related with leaving the page
      description: t('common.unsavedChangesMessage'),
      confirmButtonLabel: t('common.yes'),
    })

    if (confirmationState === ConfirmationState.Confirmed) {
      handleOnConfirm()
    }
  }

  const buttonProps = {
    disabled: shouldDisableActionButton,
    onClick: hasUnsavedChanges && !parentPage ? showConfirmation : handleOnConfirm,
    'aria-label': AriaElementLabel.DiscardChangesButton,
  }

  return iconButton ? (
    <IconButton {...buttonProps}>{iconButton}</IconButton>
  ) : (
    <Button variant="outlined" {...buttonProps}>
      {t('common.buttonCancel')}
    </Button>
  )
}

export { DiscardChangesButton }
