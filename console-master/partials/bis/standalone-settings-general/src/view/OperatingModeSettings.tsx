import PropTypes from 'prop-types'
import React, { memo, useCallback } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { Select } from '@ues-bis/shared'
import type { GeneralSettingsValues } from '@ues-data/bis'
import { OperatingMode } from '@ues-data/bis/model'

import { useStyles } from './styles'

interface OperatingModeSettings {
  control: Control<GeneralSettingsValues>
  disabled: boolean
}

const OperatingModeSettings = memo(({ control, disabled }: OperatingModeSettings) => {
  const { t } = useTranslation()

  const classNames = useStyles()

  const renderInput = useCallback(
    ({ value, onChange, name }) => (
      <Select
        label={t('settings.general.operatingMode')}
        labelId="general-settings-operating-mode-select-label"
        name={name}
        disabled={disabled}
        size="small"
        fullWidth
        className={classNames.textField}
        value={value}
        onChange={onChange}
      >
        <MenuItem value={OperatingMode.ACTIVE}>{t(`common.operatingMode.${OperatingMode.ACTIVE}`)}</MenuItem>
        <MenuItem value={OperatingMode.PASSIVE}>{t(`common.operatingMode.${OperatingMode.PASSIVE}`)}</MenuItem>
      </Select>
    ),
    [classNames.textField, disabled, t],
  )

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('settings.general.operatingMode')}
      </Typography>

      <Typography align="justify" variant="body1" gutterBottom>
        {t('settings.general.operatingModeInfo')}
      </Typography>

      <Controller
        name="tenantSettings.operatingMode"
        control={control}
        render={renderInput}
        rules={{
          validate: mode => mode === OperatingMode.ACTIVE || mode === OperatingMode.PASSIVE,
        }}
      />
    </section>
  )
})

export default OperatingModeSettings
