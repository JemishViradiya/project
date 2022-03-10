import React from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const useStyles = makeStyles({
  spinner: {
    margin: '0 14px 0 19px',
  },
  spinnerGroup: {
    'margin-bottom': '10px',
    'margin-top': '7px',
  },
  formHelperText: {
    'font-size': '14px',
    margin: '-8px 0 0 45px;',
  },
  warning: {
    color: 'red !important',
    'font-size': '14px',
    'padding-bottom': '30px',
  },
  tooltip: {
    'font-size': '12px',
  },
  icon: {
    'padding-left': '5px',
  },
})

export default function SpinnersGroup(props) {
  const { checked, onChange, label, description, warning, disabled, tooltip, name, color } = props
  const classes = useStyles()

  return (
    <FormControl fullWidth disabled={disabled} component="fieldset" classes={{ root: classes.spinnerGroup }}>
      <FormGroup>
        {warning && (
          <FormHelperText
            classes={{
              root: classes.warning,
            }}
          >
            {warning}
          </FormHelperText>
        )}
        <FormControlLabel
          control={
            <CircularProgress
              classes={{
                root: classes.spinner,
              }}
              checked={checked}
              onChange={onChange}
              name={name}
              color={color}
              size={25}
              thickness={4}
            />
          }
          label={
            <div>
              {label}
              {tooltip && (
                <Tooltip
                  title={tooltip}
                  placement="top"
                  classes={{
                    tooltip: classes.tooltip,
                  }}
                >
                  <InfoOutlinedIcon
                    classes={{
                      root: classes.icon,
                    }}
                  />
                </Tooltip>
              )}
            </div>
          }
        />
        {description && (
          <FormHelperText
            classes={{
              root: classes.formHelperText,
            }}
          >
            {description}
          </FormHelperText>
        )}
      </FormGroup>
    </FormControl>
  )
}
