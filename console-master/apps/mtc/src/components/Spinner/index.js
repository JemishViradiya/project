import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'

require('./Spinner.scss')

const Spinner = props => {
  const { checked, onChange, color, size, thickness, label, description, warning } = props
  return (
    <div className="spinner">
      <div>
        <CircularProgress {...props} checked={checked} onChange={onChange} color={color} size={size} thickness={thickness} />
      </div>
      <div className="spinner-text">
        {label && <p>{label}</p>}
        {description && <p>{description}</p>}
        {warning && <p className="warning-text">{warning}</p>}
      </div>
    </div>
  )
}

export default Spinner
