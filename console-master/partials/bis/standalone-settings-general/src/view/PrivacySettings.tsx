import PropTypes from 'prop-types'
import React, { memo, useCallback, useState } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import { CONFIRM_PRIVACY_SETTING } from '../../config/consts/dialogIds'
import PrivacyConfirmation from './PrivacyConfirmation'
import { useStyles } from './styles'

const field = 'privacyMode.mode'

interface PrivacySettings {
  control: Control<Record<string, any>>
  setValue: (
    name: string,
    value: boolean,
    config?: Partial<{
      shouldValidate: boolean
      shouldDirty: boolean
    }>,
  ) => void
  disabled: boolean
}

const PrivacySettings = memo(({ control, setValue, disabled }: PrivacySettings) => {
  const { t } = useTranslation()
  const [dialog, setDialog] = useState({ dialogId: null })
  const openDialog = useCallback(() => setDialog({ dialogId: CONFIRM_PRIVACY_SETTING }), [])
  const closeDialog = useCallback(() => setDialog({ dialogId: null }), [])

  const classNames = useStyles()

  const handlePrivacyChange = useCallback(
    (onChange, event) => {
      event.stopPropagation()

      if (disabled) {
        return
      }
      if (!event.target.checked) {
        openDialog()
      }

      onChange(true)
    },
    [disabled, openDialog],
  )

  const closePopup = closeDialog

  const disable = useCallback(() => {
    setValue(field, false, { shouldValidate: true })
  }, [setValue])

  const renderSwitch = useCallback(
    ({ onChange, value }) => (
      <Switch
        color="secondary"
        onChange={event => handlePrivacyChange(onChange, event)}
        checked={value}
        edge="start"
        name={field}
        disableRipple
      />
    ),
    [handlePrivacyChange],
  )

  const switchControl = (
    <Controller
      name={field}
      control={control}
      render={renderSwitch}
      rules={{
        validate: mode => typeof mode === 'boolean',
      }}
    />
  )

  return (
    <section>
      <Typography variant="h3" gutterBottom>
        {t('settings.privacy.mode')}
      </Typography>

      <Typography variant="body1" gutterBottom>
        {t('settings.privacy.protectUserPrivacy')}
      </Typography>

      <fieldset className={classNames.fieldset} disabled={disabled}>
        <FormControlLabel control={switchControl} label={t('settings.privacy.mode')} disabled={disabled} />
      </fieldset>

      <PrivacyConfirmation dialogId={dialog.dialogId} closePopup={closePopup} disable={disable} />
    </section>
  )
})

PrivacySettings.displayName = 'PrivacySettings'

export default PrivacySettings
