import './TextField.scss'

import React from 'react'

const TextField = ({
  name,
  label,
  type,
  placeholder,
  tabIndex,
  touched,
  error,
  value,
  handleChange,
  handleBlur,
  edit,
  disabled,
  testid,
}) => (
  <div className={`input-container ${typeof error !== 'undefined' ? 'error' : ''}`}>
    <label htmlFor={name}>{label}</label>
    {!edit && typeof edit !== 'undefined' && <p>{value === null || value === '' ? '—' : value}</p>}
    {(edit || typeof edit === 'undefined') && (
      <div>
        <input
          tabIndex={tabIndex}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          name={name}
          disabled={disabled}
          data-testid={testid}
        />
        {touched && error && <span className="error">{error}</span>}
      </div>
    )}
  </div>
)

export default TextField
