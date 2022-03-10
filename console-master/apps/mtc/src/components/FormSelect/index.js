import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const FormSelect = props => {
  const {
    input,
    label,
    placeholder,
    disabled,
    options,
    meta: { touched, error },
  } = props
  return (
    <div className={`input-container ${touched && error ? 'error' : ''}`}>
      <hr />
      <div className="ui input">
        {label && (
          <div>
            <label htmlFor={input.name}>{label}</label>
          </div>
        )}
        <div>
          <Dropdown
            {...input}
            placeholder={placeholder}
            disabled={disabled}
            selection
            fluid
            options={options}
            onChange={(event, data) => input.onChange(data.value)}
          />
          {touched && error && <span className="error">{error}</span>}
        </div>
      </div>
    </div>
  )
}

export default FormSelect
