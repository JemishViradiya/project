import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'

import MaterialSpinner from '../Spinner/MaterialSpinner'

const FormikSpinner = ({ name, value, color, label, description, setFieldValue, disabled, onChange, warning, tooltip }) => (
  <MaterialSpinner
    id={name}
    name={name}
    color={color}
    checked={value || false}
    onChange={() => {
      const currentValue = value
      setFieldValue(name, !currentValue)
      if (onChange) {
        onChange()
      }
    }}
    label={label}
    description={description}
    warning={warning}
    disabled={disabled}
    tooltip={tooltip}
  />
)

const FormikSpinnerWithInfoIcon = props => (
  <div className="spinner-with-icon-container">
    <FormikSpinner {...props} />
    <Tooltip title={props.tooltip} placement="right">
      <div className="icon-info-circle" />
    </Tooltip>
  </div>
)

export { FormikSpinnerWithInfoIcon }

export default FormikSpinner
