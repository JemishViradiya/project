import React, { memo, useMemo } from 'react'
import type { DeepMap, FieldError } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import type { GeneralSettingsValues } from '@ues-data/bis'

import { useStyles } from './styles'

const dataRetentionPeriodField = 'dataRetentionPeriod'
const dataRetentionSettingsRangeExceededError = 'settings.general.dataRetentionInvalid'
const VALID_KEYS = ['Backspace', 'Delete', 'ArrowUp', 'ArrowDown']
const digitRegex = /^[\d]*$/

const handleChange = event => {
  if (!digitRegex.test(event.key) && !VALID_KEYS.includes(event.key)) {
    event.preventDefault()
  }
  return event.target.value
}

const day30Style = { color: '#686868' }

interface DataRetentionSettings {
  disabled: boolean
  watch: (p: string) => boolean
  register: any
  errors: DeepMap<GeneralSettingsValues, FieldError>
}

const DataRetentionSettings = memo(({ disabled, watch, register, errors }: DataRetentionSettings) => {
  const { t } = useTranslation()
  const dataRetentionPeriod = watch('dataRetentionPeriod') || 30
  const inputProps = useMemo(
    () => ({
      style: dataRetentionPeriod == 30 ? day30Style : undefined, // eslint-disable-line eqeqeq
      min: 1,
      max: 30,
      step: 1,
    }),
    [dataRetentionPeriod],
  )
  const errorMessage = errors[dataRetentionPeriodField]?.message

  const helperText = useMemo(() => errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>, [errorMessage])

  const classNames = useStyles()

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('settings.general.dataRetention')}
      </Typography>

      <Typography align="justify" variant="body1" gutterBottom>
        {t('settings.general.dataRetentionInfo')}
      </Typography>

      <TextField
        className={classNames.textField}
        type="number"
        label={t('settings.general.dataRetentionDays')}
        id="data-retention-input"
        name={dataRetentionPeriodField}
        inputRef={register({
          required: t(dataRetentionSettingsRangeExceededError),
          pattern: {
            value: digitRegex,
            message: t(dataRetentionSettingsRangeExceededError),
          },
          max: {
            value: 30,
            message: t(dataRetentionSettingsRangeExceededError),
          },
          min: {
            value: 1,
            message: t(dataRetentionSettingsRangeExceededError),
          },
        })}
        required
        disabled={disabled}
        inputProps={inputProps}
        onKeyDown={handleChange}
        margin="none"
        size="small"
        error={!!errors[dataRetentionPeriodField]}
        helperText={helperText}
        fullWidth
      />
    </section>
  )
})

DataRetentionSettings.displayName = 'DataRetentionSettings'

export default DataRetentionSettings
