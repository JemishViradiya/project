import isEqual from 'lodash-es/isEqual'
import React, { useCallback, useEffect, useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

import { Select, useFormButtons } from '@ues-bis/shared'
import { OperatingMode } from '@ues-data/bis/model'
import { Permission, ServiceId, usePermissions, usePrevious } from '@ues-data/shared'
import { ContentAreaPanel, FormButtonPanel, Loading, ProgressButton, SecuredContent, SecuredContentBoundary } from '@ues/behaviours'

import useSettings from '../providers/settings'
import createDefaultFormValues from '../utils/createDefaultFormValues'
import useStyles from './styles'

const AdaptiveResponseSettingsContent: React.FC = () => {
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const styles = useStyles()
  const { hasPermission } = usePermissions()

  const [{ data, loading }, setSettings, { loading: updating }] = useSettings()

  const defaultValues = useMemo(() => createDefaultFormValues(data), [data])

  const canUpdate = hasPermission(Permission.BIS_SETTINGS_UPDATE)

  const doSave = useCallback(
    (values, { reset }) => {
      const settings = {
        generalSettings: {
          tenantSettings: { operatingMode: values.tenantSettings.operatingMode },
        },
      }
      setSettings({
        variables: settings,
        update: (_, { data }) => {
          reset(createDefaultFormValues(data))
        },
      })
    },
    [setSettings],
  )

  // We should use Form from behaviors once it will support more advanced layouts and possibly export our Slider there
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues,
    criteriaMode: 'all',
  })
  const previousDefaultValues = usePrevious(defaultValues)

  useEffect(() => {
    if (!isEqual(previousDefaultValues, defaultValues)) {
      formMethods.reset(defaultValues)
    }
  }, [defaultValues, formMethods, previousDefaultValues])

  const { resetDisabled, onReset, submitDisabled, onSubmit } = useFormButtons(formMethods, updating, doSave)

  const renderOperatingModeSelect = useCallback(
    ({ onChange, value, name }) => (
      <Box>
        <Select
          label={t('bis/ues:settings.operatingMode.title')}
          labelId="adaptive-response-settings-operating-mode-select-label"
          disabled={!canUpdate}
          size="small"
          name={name}
          value={value}
          wrapperClassName={styles.operatingModeSelectWrapper}
          onChange={onChange}
        >
          <MenuItem value={OperatingMode.ACTIVE}>{t(`bis/ues:settings.operatingMode.options.${OperatingMode.ACTIVE}`)}</MenuItem>
          <MenuItem value={OperatingMode.PASSIVE}>{t(`bis/ues:settings.operatingMode.options.${OperatingMode.PASSIVE}`)}</MenuItem>
        </Select>
      </Box>
    ),
    [canUpdate, styles.operatingModeSelectWrapper, t],
  )

  if (loading) {
    return <Loading />
  }

  return (
    <FormProvider {...formMethods}>
      <Typography variant="body2">{t('bis/ues:settings.operatingMode.description')}</Typography>
      <Controller
        render={renderOperatingModeSelect}
        name="tenantSettings.operatingMode"
        rules={{
          validate: mode => mode === OperatingMode.ACTIVE || mode === OperatingMode.PASSIVE,
        }}
      />

      <form onSubmit={onSubmit} noValidate>
        <FormButtonPanel show={canUpdate}>
          <Button onClick={onReset} disabled={resetDisabled} variant="outlined">
            {t('bis/shared:common.cancel')}
          </Button>
          <ProgressButton loading={updating} color="primary" variant="contained" disabled={submitDisabled} type="submit">
            {t('bis/shared:common.save')}
          </ProgressButton>
        </FormButtonPanel>
      </form>
    </FormProvider>
  )
}

const AdaptiveResponseSettings: React.FC = () => {
  const { t } = useTranslation(['bis/ues', 'bis/shared'])
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <Box className={styles.card}>
        <ContentAreaPanel title={t('bis/ues:settings.operatingMode.title')} ContentWrapper={SecuredContentBoundary}>
          <SecuredContent requiredPermissions={Permission.BIS_SETTINGS_READ} requiredServices={ServiceId.BIG}>
            <AdaptiveResponseSettingsContent />
          </SecuredContent>
        </ContentAreaPanel>
      </Box>
    </div>
  )
}

export default AdaptiveResponseSettings
