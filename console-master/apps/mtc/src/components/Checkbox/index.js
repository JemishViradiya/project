import React from 'react'

import MaterialCheckbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'

const Checkbox = ({ rightAdornment, helperText, ...props }) => (
  <React.Fragment>
    <div className="checkbox">
      <FormGroup>
        <FormControlLabel control={<MaterialCheckbox {...props} name={props.label} />} label={props.label} />
        {rightAdornment || null}
      </FormGroup>
    </div>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </React.Fragment>
)

export default Checkbox
