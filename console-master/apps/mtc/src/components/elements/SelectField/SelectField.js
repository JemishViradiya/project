import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const SelectField = ({
  name,
  label,
  tabIndex,
  touched,
  error,
  value,
  handleChange,
  handleBlur,
  options,
  disabled,
  edit,
  testid,
  optionLabel,
}) => {
  function onChange(event, data) {
    handleChange(name, data.value)
  }

  function onBlur(event, data) {
    handleBlur(name, data.value)
  }
  return (
    <div className={`input-container ${typeof error !== 'undefined' ? 'error' : ''}`}>
      <label htmlFor={name}>{label}</label>
      {!edit && typeof edit !== 'undefined' && <p>{value === null || value === '' ? '—' : optionLabel}</p>}
      {(edit || typeof edit === 'undefined') && (
        <div>
          <Dropdown
            placeholder="Select"
            selection
            options={options}
            value={value}
            tabIndex={tabIndex}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            data-testid={testid}
            id={`select-${name}`}
          />
          {touched && error && <span className="error">{error}</span>}
        </div>
      )}
    </div>
  )
}

export default SelectField
