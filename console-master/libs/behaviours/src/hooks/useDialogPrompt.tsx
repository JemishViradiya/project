import type { Transition } from 'history'
import React, { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBlocker } from 'react-router-dom'

import { ConfirmationDialog as ConfirmationDialogComponent } from '../components/Confirmation'

const DialogPrompt: React.FC<{
  message: string
  url?: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
}> = ({ message, open, onClose, onConfirm, url }) => {
  const { t } = useTranslation(['general/form'])
  return (
    <ConfirmationDialogComponent
      open={open}
      title={t('confirmation.title')}
      description={t(message, { url })}
      cancelButtonLabel={t('confirmation.cancel')}
      confirmButtonLabel={t('confirmation.confirm')}
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/ban-types
type SimpleObject = object

export function useDialogPrompt(message: string, when = true, onSubmit?: () => void) {
  const [transition, setTransition] = useState<Transition>(null)
  const bref = useRef<Transition>(null)
  const onClose = useCallback(() => setTransition(null), [])
  const onConfirm = useCallback(() => {
    bref.current = transition
    if (onSubmit) {
      onSubmit()
    }
    transition.retry()
  }, [transition, onSubmit])

  const blocker = useCallback((tx: Transition) => {
    bref.current = null
    setTransition(tx)
  }, [])

  useBlocker(blocker, when)

  return (
    <DialogPrompt
      open={!!(transition && !bref.current)}
      onClose={onClose}
      onConfirm={onConfirm}
      message={message}
      url={transition?.location?.pathname}
    />
  )
}
