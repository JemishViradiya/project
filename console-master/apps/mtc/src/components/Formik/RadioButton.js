import React from 'react'

import Radio from '@material-ui/core/Radio'

const RadioButton = ({ id, label, className, value, name, onChange, ...props }) => {
  return (
    <div>
      <Radio
        name={name}
        id={id}
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        {...props}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default RadioButton
