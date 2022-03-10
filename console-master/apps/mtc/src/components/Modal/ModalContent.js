import PropTypes from 'prop-types'
import React from 'react'

const ModalContent = ({ children }) => <div className="modal-content">{children}</div>

ModalContent.propTypes = {
  /** Main content area for the modal */
  children: PropTypes.element.isRequired,
}

export default ModalContent
