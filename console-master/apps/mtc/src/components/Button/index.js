import React from 'react'

import MaterialButton from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const styles = () => ({
  buttonContainer: {
    display: 'inline-block',
  },
  cssRoot: {
    'font-size': '14px',
    'font-weight': '600',
    'font-family': 'Titillium Web,sans-serif',
    'background-color': '#03A5EF',
    'border-radius': '0',
    'letter-spacing': '1px',
    color: '#fff',
    '&:hover': {
      'background-color': '#1770A6',
    },
    padding: '6px 15px',
    height: '40px',
    '&:disabled': {
      'border-color': 'rgba(0, 0, 0, 0.26)',
      'background-color': 'rgba(0, 0, 0, 0.08)',
    },
    'margin-right': '16px',
  },
  outlined: {
    'background-color': '#fff',
    color: '#03A5EF',
    'border-color': '#03A5EF',
    '&:hover': {
      'background-color': 'rgba(3,165,239,0.08)',
    },
  },
  spinner: {
    margin: '0 10px 0 0',
    color: 'rgba(0, 0, 0, 0.26)',
  },
})

const Button = ({ disabled, outlined, onClick, tooltip, classes, className, id, children, withSpinner }) => {
  const variant = outlined ? 'outlined' : 'text'
  const button = (
    <div className={classes.buttonContainer}>
      <MaterialButton
        disabled={disabled}
        className={className}
        color="primary"
        variant={variant}
        onClick={onClick}
        classes={{
          root: classes.cssRoot,
          outlined: classes.outlined,
        }}
        id={id}
      >
        {disabled && withSpinner ? <CircularProgress size={23} className={classes.spinner} /> : null}
        {children}
      </MaterialButton>
    </div>
  )
  if (tooltip && tooltip.active) {
    return (
      <Tooltip title={tooltip.message} placement={tooltip.placement ? tooltip.placement : 'top'}>
        {button}
      </Tooltip>
    )
  } else {
    return button
  }
}

export default withStyles(styles)(Button)
