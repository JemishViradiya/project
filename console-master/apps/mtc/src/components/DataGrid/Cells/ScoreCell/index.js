import PropTypes from 'prop-types'
import React from 'react'

import NullCell from '../NullCell'

require('./ScoreCell.scss')

const ScoreCell = props => {
  const { row } = props
  const value = typeof props.value === 'undefined' ? row.value : props.value
  const color = value >= 0 ? 'green' : 'red'

  let cell = <NullCell />

  if (value !== null && typeof value !== 'object' && typeof value !== 'undefined') {
    cell = <span className={`${color}-text`}>{Math.round(Math.abs(value) * 100)}</span>
  }
  return cell
}

ScoreCell.propTypes = {
  row: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  value: PropTypes.number,
}

export default ScoreCell
