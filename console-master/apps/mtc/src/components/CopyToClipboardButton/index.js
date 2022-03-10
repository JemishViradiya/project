import copy from 'copy-to-clipboard'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

import ErrorService from '../../services/errors'
import SuccessService from '../../services/success'

require('./CopyToClipboardButton.scss')

const useStyles = makeStyles({
  tooltip: {
    'font-size': '12px',
    margin: '0 auto',
  },
})

const ClipboardIcon = ({ width, height }) => (
  <span className="clipboard-icon">
    <svg width={width} height={height} viewBox="0 0 32 32">
      <g transform="scale(0.03125 0.03125)">
        <path d="M928 128h-288c0-70.692-57.306-128-128-128-70.692 0-128 57.308-128 128h-288c-17.672 0-32 14.328-32 32v832c0 17.674 14.328 32 32 32h832c17.674 0 32-14.326 32-32v-832c0-17.672-14.326-32-32-32zM512 64c35.346 0 64 28.654 64 64s-28.654 64-64 64c-35.346 0-64-28.654-64-64s28.654-64 64-64zM896 960h-768v-768h128v96c0 17.672 14.328 32 32 32h448c17.674 0 32-14.328 32-32v-96h128v768z" />
        <path d="M448 858.51l-205.254-237.254 58.508-58.51 146.746 114.744 274.742-242.744 58.514 58.508z" />
      </g>
    </svg>
  </span>
)

const CopyToClipboardButton = props => {
  const classes = useStyles()
  const copyToClipboard = () => {
    try {
      copy(props.value)
      SuccessService.resolve('Value successfully copied to clipboard.')
    } catch (error) {
      ErrorService.log('Failure', 'Failed to copy to clipboard.')
    }
  }

  return (
    <div onClick={copyToClipboard} className="icon-container">
      <Tooltip
        title="Copy to Clipboard"
        placement="top"
        classes={{
          tooltip: classes.tooltip,
        }}
      >
        <span>
          <ClipboardIcon {...props} />
        </span>
      </Tooltip>
    </div>
  )
}

export default CopyToClipboardButton
