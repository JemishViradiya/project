import React, { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'

import { Select } from '../Select'
import useStyles from './styles'
import type { RiskLevelSelectProps } from './types'

const RiskLevelSelect = memo(({ labelId, options, onChange, value, disabled, name }: RiskLevelSelectProps) => {
  const { t } = useTranslation('bis/shared')
  const styles = useStyles()
  const handlLevelSelect = useCallback(
    e => {
      const newRiskLevel = e.target.value
      onChange(newRiskLevel)
    },
    [onChange],
  )
  const inputProps = useMemo(
    () => ({
      'data-testid': `risk-level-select-${name}`,
    }),
    [name],
  )

  const riskLevelSelectOptions = useMemo(
    () =>
      options.map(({ key, text }) => (
        <MenuItem key={key} value={key}>
          {t(text)}
        </MenuItem>
      )),
    [options, t],
  )

  return (
    <Select
      labelId={labelId}
      wrapperClassName={styles.selectWrapper}
      size="small"
      onChange={handlLevelSelect}
      value={value}
      disabled={disabled}
      inputProps={inputProps}
    >
      {riskLevelSelectOptions}
    </Select>
  )
})

export default RiskLevelSelect
