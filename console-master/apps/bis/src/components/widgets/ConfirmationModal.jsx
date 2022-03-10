import React, { memo } from 'react'

import { useControlledDialog } from '@ues/behaviours'

import Button from '../widgets/Button'
import Modal from './Modal'

const ConfirmationModal = memo(
  ({ dialogId, title, children, cancelLabel, confirmLabel, size, onClose, onConfirm, confirmInProgress }) => {
    const { open, onClose: controlledOnClose } = useControlledDialog({
      dialogId,
      onClose,
    })
    return (
      <Modal
        open={open}
        size={size}
        onClose={controlledOnClose}
        title={title}
        actions={
          <>
            <Button onClick={controlledOnClose}>{cancelLabel}</Button>
            <Button.Confirmation color="primary" onClick={onConfirm} loading={confirmInProgress}>
              {confirmLabel}
            </Button.Confirmation>
          </>
        }
      >
        {children}
      </Modal>
    )
  },
)

ConfirmationModal.displayName = 'ConfirmationModal'

export default ConfirmationModal
