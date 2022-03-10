import clsx from 'clsx'
import React, { useCallback } from 'react'

import TextField from '@material-ui/core/TextField'

import type { InputProps } from '../types'
import useStyles from './styles'

const Input = ({ value, onChange, rangeType, min, max }: InputProps) => {
  const styles = useStyles()
  const handleInputChange = useCallback(e => onChange(e, rangeType, min, max), [onChange, rangeType, min, max])
  return (
    <div className={styles.container}>
      <TextField
        className={clsx('no-label', styles.input)}
        inputProps={{ min, max, 'data-testid': 'risk-engines-input' }}
        onChange={handleInputChange}
        type="number"
        value={value}
        size="small"
        margin="none"
      />
      <p className={styles.text}>%</p>
    </div>
  )
}

export default Input
