import PropTypes from 'prop-types'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import CopyToClipboardButton from '../../../CopyToClipboardButton'
import NullCell from '../NullCell'

const useStyles = makeStyles({
  tooltip: {
    'font-size': '12px',
    margin: '0 auto 0 -200px',
  },
})

const HashCell = props => {
  const { row } = props
  const classes = useStyles()
  const value = typeof props.value === 'undefined' ? row.value : props.value

  let cell = <NullCell />

  if (value !== null && typeof value !== 'object' && typeof value !== 'undefined') {
    cell = [
      <CopyToClipboardButton key={`clipboard-${value}`} width="16" height="16" value={value} />,
      <Tooltip
        key={`tooltip-${value}`}
        title={value}
        placement="top"
        classes={{
          tooltip: classes.tooltip,
        }}
      >
        <span>{value}</span>
      </Tooltip>,
    ]
  }
  return cell
}

HashCell.propTypes = {
  row: PropTypes.shape({
    value: PropTypes.string,
  }),
  value: PropTypes.string,
}

export default HashCell
