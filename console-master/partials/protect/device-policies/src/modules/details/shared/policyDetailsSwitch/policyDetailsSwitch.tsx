import React from 'react'

import Box from '@material-ui/core/Box'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import { CAPTION_TOP_MARGIN, SWITCH_RIGHT_PAD } from './../../constants'

const PolicyDetailsSwitch = ({
  formSection,
  controlProps,
  name,
  onChange,
  checked,
  label,
  caption = null,
  disabled = false,
  dataAutoid = null,
}) => (
  <FormControlLabel
    disabled={disabled}
    control={
      <Box alignSelf="flex-start" pr={SWITCH_RIGHT_PAD} mt={-2}>
        <Switch
          {...controlProps({
            name,
            onChange,
          })}
          checked={checked}
          disabled={disabled}
          data-autoid={dataAutoid || `${formSection}-${name}`}
        />
      </Box>
    }
    label={
      <>
        <Typography component="div" variant="body1">
          {label}
        </Typography>
        {caption ? (
          <Box mt={CAPTION_TOP_MARGIN}>
            <Typography component="div" variant="caption" color="textSecondary">
              {caption}
            </Typography>
          </Box>
        ) : null}
      </>
    }
  />
)

export default PolicyDetailsSwitch
