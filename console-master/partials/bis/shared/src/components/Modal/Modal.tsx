import type PropTypes from 'prop-types'
import React from 'react'

import { Dialog } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

/**
 * If there is a confirmation that is necessary, or a brief message then an alert dialog can be used.
 * Alert dialog is basically a DialogChildren without the title.
 * If there is an action necessary, like a radio buttons or checkboxes or any type of form field,
 * then you use the standard dialog (DialogChildren with title).
 *
 */
export type ModalSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false

interface Modal {
  onClose: () => void
  open?: boolean
  size?: ModalSize
  title?: string
  description?: string
  children?: React.ReactNode
  actions?: React.ReactNode
}

export const Modal = ({ children, open, size = 'md', onClose, title, description, actions, ...rest }: Modal) => (
  <Dialog disableBackdropClick open={open} onClose={onClose} maxWidth={size} {...rest}>
    <DialogChildren onClose={onClose} content={children} actions={actions} title={title} description={description} />
  </Dialog>
)
