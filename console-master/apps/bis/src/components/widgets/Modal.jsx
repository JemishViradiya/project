import PropTypes from 'prop-types'
import React from 'react'

import { Dialog } from '@material-ui/core'

import { DialogChildren } from '@ues/behaviours'

/**
 * If there is a confirmation that is necessary, or a brief message then an alert dialog can be used.
 * Alert dialog is basically a DialogChildren without the title.
 * If there is an action necessary, like a radio buttons or checkboxes or any type of form field,
 * then you use the standard dialog (DialogChildren with title).
 */
const Modal = ({ children, open, size = 'md', onClose, title, description, actions, ...rest }) => (
  <Dialog disableBackdropClick open={open} onClose={onClose} maxWidth={size} {...rest}>
    <DialogChildren onClose={onClose} content={children} actions={actions} title={title} description={description} />
  </Dialog>
)

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  size: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  actions: PropTypes.node,
}

export default Modal
