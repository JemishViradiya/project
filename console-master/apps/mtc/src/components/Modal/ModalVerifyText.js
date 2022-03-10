import PropTypes from 'prop-types'
import React from 'react'

import Text from '../Input/Text'

const ModalVerifyText = ({ toMatch, onChange }) => (
  <div className="modal-verify modal-verify-text">
    <p>
      To confirm your decision, please type <strong>{toMatch}</strong>
    </p>
    <Text
      label={`Enter ${toMatch}`}
      helperText={`Must enter ${toMatch} to continue.`}
      onChange={onChange}
      id={`${toMatch}`}
      fullWidth
    />
  </div>
)

ModalVerifyText.propTypes = {
  /** Text that the user must enter to enable submit button */
  toMatch: PropTypes.string.isRequired,
  /**  Function to be executed when the string changes */
  onChange: PropTypes.func.isRequired,
}

export default ModalVerifyText
