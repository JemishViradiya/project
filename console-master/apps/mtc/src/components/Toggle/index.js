import React from 'react'

import Switch from '@material-ui/core/Switch'

require('./Toggle.scss')

const Toggle = props => {
  const { checked, onChange, label, description, warning } = props
  return (
    <div className="toggle">
      <div>
        <Switch {...props} checked={checked} onChange={onChange} color="primary" />
      </div>
      <div className="toggle-text">
        {label && <p>{label}</p>}
        {description && <p>{description}</p>}
        {warning && <p className="warning-text">{warning}</p>}
      </div>
    </div>
  )
}

export default Toggle
