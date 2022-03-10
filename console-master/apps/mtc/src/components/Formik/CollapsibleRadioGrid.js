import React from 'react'

import CollapsibleRadioGrid from '../CollapsibleRadioGrid'

const FormikCollapsibleRadioGrid = ({ id, name, value, columns, setFieldValue, selectAll, disabled }) => {
  return (
    <CollapsibleRadioGrid
      id={id}
      data={value}
      columns={columns}
      selectAll={selectAll}
      disabled={disabled}
      onChange={newValue => {
        setFieldValue(name, newValue)
      }}
    />
  )
}

export default FormikCollapsibleRadioGrid
