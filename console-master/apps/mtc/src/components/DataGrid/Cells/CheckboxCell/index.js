import PropTypes from 'prop-types'
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'

require('./CheckboxCell.scss')

const CheckboxCell = props => {
  const { checked, onChange } = props
  return <Checkbox className="grid-checkbox" onChange={onChange} checked={checked} />
}

CheckboxCell.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
}

export default CheckboxCell
