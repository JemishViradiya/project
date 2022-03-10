import PropTypes from 'prop-types'
import React from 'react'

const ModalHeader = ({ children }) => <h3 className="modal-title">{children}</h3>

ModalHeader.propTypes = {
  /** Child text, will be wrapped in an h3 */
  children: PropTypes.string.isRequired,
}

export default ModalHeader
