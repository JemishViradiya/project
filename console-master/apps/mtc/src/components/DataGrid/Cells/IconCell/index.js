import PropTypes from 'prop-types'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

require('./IconCell.scss')

const useStyles = makeStyles({
  tooltip: {
    'font-size': '12px',
    margin: '0 auto',
  },
})

const IconCell = props => {
  const classes = useStyles()
  const { callback, disabled, icon, keyId, permission, row, toolTipText } = props
  const id = typeof keyId !== 'undefined' ? keyId : 'id'
  const disabledClass = disabled ? 'disabled' : ''
  return (
    permission && (
      <Tooltip
        title={toolTipText || icon}
        placement="top"
        classes={{
          tooltip: classes.tooltip,
        }}
      >
        <span>
          <span className={`icon-${icon}  ${disabledClass} icon-button`} onClick={() => callback(row.row[id])} />
        </span>
      </Tooltip>
    )
  )
}

IconCell.propTypes = {
  callback: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  keyId: PropTypes.string,
  permission: PropTypes.bool,
  row: PropTypes.shape({
    row: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  toolTipText: PropTypes.string,
}

IconCell.defaultProps = {
  disabled: false,
  permission: true,
}

export default IconCell
