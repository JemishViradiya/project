import moment from 'moment'
import React, { memo, useCallback, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { ApolloError } from '@apollo/client'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'

import { useFormButtons } from '@ues-bis/shared'
import { capability, throwServerError, useCapability } from '@ues-bis/standalone-shared'
import type { GeneralSettingsValues } from '@ues-data/bis'
import { ErrorBoundary, FormButtonPanel, Loading, PageTitlePanel, ProgressButton } from '@ues/behaviours'

import useGeneralSettings from '../providers/GeneralSettingsProvider'
import DataRetentionSettings from './DataRetentionSettings'
import OperatingModeSettings from './OperatingModeSettings'
import PrivacySettings from './PrivacySettings'

interface GeneralSettingsForm {
  defaultValues: GeneralSettingsValues
  mutating: boolean
  handleSave: ({ update, ...props }: any) => void
  error?: ApolloError
}

const GeneralSettingsForm = memo(({ defaultValues, mutating, handleSave, error }: GeneralSettingsForm) => {
  const { t } = useTranslation()

  const [capOperatingMode, capDataRetention, capPrivacyMode, capPolicies] = useCapability(
    capability.OPERATING_MODE,
    capability.DATA_RETENTION,
    capability.PRIVACY_MODE,
    capability.POLICIES,
  )
  const editable = capOperatingMode || capDataRetention || capPrivacyMode || capPolicies

  const doSave = useCallback(
    (values, { reset }) => {
      // limit the variables to only what this user is allowed to change
      const settings: GeneralSettingsValues = {}
      if (capOperatingMode && values.tenantSettings) {
        settings.tenantSettings = { operatingMode: values.tenantSettings.operatingMode }
      }
      if (capPolicies && values.tenantSettings) {
        settings.tenantSettings = settings.tenantSettings || {}
      }
      if (capDataRetention) {
        settings.dataRetentionPeriod = parseInt(values.dataRetentionPeriod)
      }
      if (capPrivacyMode && values.privacyMode) {
        settings.privacyMode = { mode: values.privacyMode.mode }
      }
      return handleSave({
        variables: { settings },
        update: ({ data: { settings } }) => reset(settings),
      })
    },
    [capDataRetention, capOperatingMode, capPolicies, capPrivacyMode, handleSave],
  )

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues,
    criteriaMode: 'all',
  })
  const { control, register, setValue, watch, errors } = formMethods
  const { resetDisabled, onReset, submitDisabled, onSubmit } = useFormButtons(formMethods, mutating, doSave)

  const content = (
    <Card>
      <OperatingModeSettings disabled={!capOperatingMode} control={control} />
      <DataRetentionSettings disabled={!capDataRetention} watch={watch} register={register} errors={errors} />
      <PrivacySettings disabled={!capPrivacyMode} control={control} setValue={setValue} />
    </Card>
  )

  if (!editable) {
    return content
  }

  if (error) {
    throwServerError(error)
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <Card>
        <Box mt={4}>{content}</Box>
      </Card>

      <FormButtonPanel show={!(resetDisabled || submitDisabled)}>
        <Button onClick={onReset} disabled={resetDisabled}>
          {t('common.cancel')}
        </Button>
        <ProgressButton onClick={onSubmit} loading={mutating} type="submit" disabled={submitDisabled}>
          {t('common.save')}
        </ProgressButton>
      </FormButtonPanel>
    </form>
  )
})

const GeneralSettings = memo(() => {
  const { t } = useTranslation()
  const [value, setGeneralSettingsFn, mutationValue] = useGeneralSettings()

  const { data: { settings: generalSettings = {} } = {}, loading, error } = value

  const { loading: mutating } = mutationValue

  const audit = generalSettings.audit
  const lastUpdated = useMemo(() => {
    if (!audit) return ''
    let userName = audit.userName
    if (!userName || userName.length === 0) {
      userName = t('common.unknown')
    }
    return audit ? t('common.lastUpdatedByAt', { name: userName, datetime: moment(audit.datetime).format('lll') }) : ''
  }, [audit, t])

  return (
    <ErrorBoundary>
      <PageTitlePanel title={t('settings.general.title')} subtitle={!loading && lastUpdated} />
      {loading ? (
        <Loading />
      ) : (
        <GeneralSettingsForm mutating={mutating} error={error} defaultValues={generalSettings} handleSave={setGeneralSettingsFn} />
      )}
    </ErrorBoundary>
  )
})

export default props => <GeneralSettings {...props} />
