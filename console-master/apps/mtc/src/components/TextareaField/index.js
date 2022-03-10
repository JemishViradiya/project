import React from 'react'

require('./TextareaField.scss')

const TextareaField = ({ name, label, placeholder, tabIndex, touched, error, value, handleChange, handleBlur, edit, disabled }) => (
  <div className={`textarea-input-container ${typeof error !== 'undefined' ? 'error' : ''}`}>
    <label htmlFor={name}>{label}</label>
    {!edit && typeof edit !== 'undefined' && <div>{value ? <p>{value}</p> : <p>—</p>}</div>}
    {(edit || typeof edit === 'undefined') && (
      <div>
        <textarea
          tabIndex={tabIndex}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          name={name}
          disabled={disabled}
        />
        {touched && error && <span className="error">{error}</span>}
      </div>
    )}
  </div>
)

export default TextareaField
