import React from 'react'

require('./RadioButtonGroup.scss')

const RadioButtonGroup = ({ children, row }) => {
  const rowClass = row ? 'row' : ''
  return (
    <div>
      <fieldset className={`borderless-fieldset ${rowClass}`}>{children}</fieldset>
    </div>
  )
}

export default RadioButtonGroup
