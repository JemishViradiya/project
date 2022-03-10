import './PasswordStrengthIndicator.scss'

import React from 'react'

const PasswordStrengthIndicator = props => {
  let { validation } = props
  if (validation === null) {
    validation = {}
  }
  return (
    <div className="password-strength-indicator">
      <p>Your password must be a minimum length of 8 characters and meet 3 additional requirements from the list below</p>
      <ul>
        <li className={validation.hasLength ? 'valid' : ''}>Minimum length of 8 characters</li>
        <li className={validation.containsLowerCase ? 'valid' : ''}>A lowercase character</li>
        <li className={validation.containsUpperCase ? 'valid' : ''}>An uppercase character</li>
        <li className={validation.containsSpecialCharacter ? 'valid' : ''}>A special character</li>
        <li className={validation.containsNumber ? 'valid' : ''}>A numeric character</li>
      </ul>
    </div>
  )
}

export default PasswordStrengthIndicator
