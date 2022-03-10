import PropTypes from 'prop-types'
import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const CheckboxListRowView = ({ id, label, checked, className, onChange, indeterminate, headerKey }) => (
  <div className={className}>
    <Checkbox
      name={id}
      label={label}
      onChange={(event, object) => onChange(object, headerKey)}
      checked={checked}
      value={id}
      indeterminate={indeterminate}
    />
  </div>
)

CheckboxListRowView.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  checked: PropTypes.bool,
  className: PropTypes.string,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  headerKey: PropTypes.string,
}

export default CheckboxListRowView
