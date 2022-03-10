import React from 'react'

import MaterialCheckbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'

export default function FormCheckbox(props) {
  const [checked, setChecked] = React.useState(props.checked)

  const handleChange = (event, data) => {
    setChecked(event.target.checked)
    props.onChange(event, data)
  }

  return (
    <div>
      <div className="checkbox">
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialCheckbox
                id={props.id}
                name={props.name}
                checked={checked}
                disabled={props.disabled}
                onChange={handleChange}
              />
            }
            label={props.label}
          />
          {props.rightAdornment || null}
        </FormGroup>
      </div>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </div>
  )
}
