import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from '../../components/Checkbox/index'

const ModalVerifyCheckbox = ({ text, onCheck }) => (
  <div className="modal-verify modal-verify-checkbox">
    <Checkbox onChange={onCheck} />
    <p>{text}</p>
  </div>
)

ModalVerifyCheckbox.propTypes = {
  /**  Function to be executed when the checkbox is checked */
  onCheck: PropTypes.func.isRequired,
  /**  Checkbox label text */
  text: PropTypes.string.isRequired,
}

export default ModalVerifyCheckbox
