import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'

import MaterialToggle from '../Toggle/MaterialToggle'

const FormikToggle = ({ id, name, value, label, description, setFieldValue, disabled, onChange, warning, tooltip }) => (
  <MaterialToggle
    id={id}
    name={name}
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

const FormikToggleWithInfoIcon = props => (
  <div className="toggle-with-icon-container">
    <FormikToggle {...props} />
    <Tooltip title={props.tooltip} placement="right">
      <div className="icon-info-circle" />
    </Tooltip>
  </div>
)

export { FormikToggleWithInfoIcon }

export default FormikToggle
