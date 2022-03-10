import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles({
  tooltip: {
    'font-size': '12px',
  },
})

const TooltipIcon = ({ size, text }) => {
  const classes = useStyles()
  const style = {
    fontSize: size,
    position: 'absolute',
    right: -20,
    top: '50%',
    marginTop: -(size / 1.6),
  }
  return (
    <Tooltip
      classes={{
        tooltip: classes.tooltip,
      }}
      title={text}
    >
      <span className="icon-info-circle" style={style} />
    </Tooltip>
  )
}

TooltipIcon.defaultProps = {
  size: 16,
}

export default TooltipIcon
