import PropTypes from 'prop-types'
import React from 'react'

import { FormControlLabel, FormGroup, Switch } from '@material-ui/core'

import styles from './Common.module.less'

const RiskFactors = ({ className, riskFactors, onChange, canEdit }) => {
  const handleChange = factor => () => {
    factor.checked = !factor.checked
    onChange(riskFactors)
  }

  return (
    <div className={className}>
      <FormGroup row>
        {riskFactors.map(factor => (
          <FormControlLabel
            key={factor.id}
            className={styles.factor}
            control={<Switch checked={factor.checked} onChange={handleChange(factor)} value={factor.id} disableRipple />}
            label={factor.title}
            disabled={!canEdit}
            aria-label={factor.title}
          />
        ))}
      </FormGroup>
    </div>
  )
}

RiskFactors.propTypes = {
  riskFactors: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
}

RiskFactors.defaultProps = {
  canEdit: true,
}

export default RiskFactors
