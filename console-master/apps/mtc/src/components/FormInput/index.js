import React from 'react'

const FormInput = props => {
  const {
    input,
    input: { value },
    type,
    label,
    placeholder,
    disabled,
    edit,
    meta: { touched, error, initial, pristine },
    tabindex,
  } = props
  const displayValue = !value && pristine ? initial : value
  const placeholderValue =
    !edit && (typeof displayValue === 'undefined' || displayValue === null || displayValue.length === 0) ? '—' : placeholder
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
          <input
            {...input}
            placeholder={placeholderValue}
            type={type}
            disabled={disabled}
            value={displayValue}
            tabIndex={tabindex || null}
          />
          {touched && error && <span className="error">{error}</span>}
        </div>
      </div>
    </div>
  )
}

export default FormInput
