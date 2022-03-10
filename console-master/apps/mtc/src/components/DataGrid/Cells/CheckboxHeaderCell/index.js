import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'

require('./CheckboxHeaderCell.scss')

const CheckboxHeaderCell = props => {
  const { selectAll, onChange } = props
  return (
    <Checkbox
      className="grid-checkbox-header"
      checked={selectAll === 1 || selectAll === 3}
      indeterminate={selectAll === 2}
      onChange={onChange}
    />
  )
}

CheckboxHeaderCell.propTypes = {
  selectAll: PropTypes.oneOf([0, 1, 2, 3]), // 0 = unchecked, 1 = checked, 2 = indeterminate, 3 = bulk checked
  onChange: PropTypes.func,
}

export default CheckboxHeaderCell
