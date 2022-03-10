import PropTypes from 'prop-types'
import React from 'react'

import WarningIcon from '@material-ui/icons/Warning'

const ModalWarning = ({ dangerText }) => {
  return (
    <div className="modal-warning">
      <div className="modal-warning-info">
        <WarningIcon />
        {dangerText}
      </div>
    </div>
  )
}

ModalWarning.propTypes = {
  /** Text displayed in the warning area */
  dangerText: PropTypes.element.isRequired,
}

export default ModalWarning
