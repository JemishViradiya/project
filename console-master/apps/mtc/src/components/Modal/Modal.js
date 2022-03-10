import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Dialog from '@material-ui/core/Dialog'
import CloseIcon from '@material-ui/icons/Close'

import ModalActions from './ModalActions'
import ModalContent from './ModalContent'
import ModalHeader from './ModalHeader'
import ModalStyled from './ModalStyled'
import ModalVerifyCheckbox from './ModalVerifyCheckbox'
import ModalVerifyText from './ModalVerifyText'
import ModalWarning from './ModalWarning'

class Modal extends Component {
  static Header = ModalHeader
  static Warning = ModalWarning
  static Actions = ModalActions
  static Content = ModalContent
  static VerifyText = ModalVerifyText
  static VerifyCheckbox = ModalVerifyCheckbox

  render() {
    const { children, closeButton, onClose, loading, minHeight, minWidth, className } = this.props
    return (
      <Dialog open={this.props.open} onClose={this.handleClose} maxWidth="lg">
        <ModalStyled minHeight={minHeight} minWidth={minWidth} className={`${className || ''} modal-container`}>
          {closeButton ? <CloseIcon className="modal-close-button" onClick={onClose} /> : null}
          {React.Children.map(children, child => React.cloneElement(child, { loading }))}
        </ModalStyled>
      </Dialog>
    )
  }
}

Modal.propTypes = {
  /** Toggle Loading */
  loading: PropTypes.bool,
  /** Toggles the modal's visibility */
  open: PropTypes.bool,
  /** Toggles the close buttons visibility */
  closeButton: PropTypes.bool,
}

export default Modal
