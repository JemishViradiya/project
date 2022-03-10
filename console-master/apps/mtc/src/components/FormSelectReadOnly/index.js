import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const FormSelectReadOnly = props => {
  const { input, label, placeholder, value, options, edit } = props
  const editClass = typeof edit !== 'undefined' && edit === true ? 'editable' : 'uneditable'
  return (
    <div className={`input-container ${editClass}`}>
      <hr />
      <div className="ui input">
        {label && (
          <div>
            <label htmlFor={input.name}>{label}</label>
          </div>
        )}
        <div>
          <Dropdown {...input} placeholder={placeholder} disabled selection fluid options={options} value={value} />
        </div>
      </div>
    </div>
  )
}

export default FormSelectReadOnly
