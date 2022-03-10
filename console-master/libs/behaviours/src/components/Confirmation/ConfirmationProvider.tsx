import React, { createContext, useCallback, useState } from 'react'

import { useControlledDialog } from '../../enhancements/Dialog'
import type { ConfirmationProps } from './ConfirmationDialog'
import { ConfirmationDialog } from './ConfirmationDialog'
import { ConfirmationState } from './types'

export const ConfirmationContext = createContext(null)

export const ConfirmationProvider: React.FC = ({ children }): React.ReactElement => {
  const [options, setOptions] = useState<ConfirmationProps>()
  const [confirmationId, setConfirmationId] = useState<symbol>(null)
  const [promisedConfirmation, setPromisedConfirmation] = useState([])
  const [resolve] = promisedConfirmation

  const isConfirmationReady = promisedConfirmation.length === 2

  const confirmation: (options: ConfirmationProps) => Promise<ConfirmationState> = useCallback((options = { title: '' }) => {
    return new Promise((resolve, reject) => {
      setOptions(options)
      setConfirmationId(Symbol('confirmation-id'))
      setPromisedConfirmation([resolve, reject])
    })
  }, [])

  const handleConfirm = options?.confirmButtonLabel
    ? () => {
        resolve(ConfirmationState.Confirmed)
        setConfirmationId(null)
      }
    : undefined

  const { open, onClose } = useControlledDialog({
    dialogId: confirmationId,
    onClose: () => {
      resolve(ConfirmationState.Canceled)
      setPromisedConfirmation([])
      setConfirmationId(null)
    },
  })

  const dialogOptions = { ...options, open: open && isConfirmationReady, onConfirm: handleConfirm, onCancel: onClose }

  return (
    <>
      <ConfirmationContext.Provider value={confirmation}>{children}</ConfirmationContext.Provider>
      <ConfirmationDialog {...dialogOptions} />
    </>
  )
}
