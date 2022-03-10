import React, { memo, useCallback, useContext, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Box, Button } from '@material-ui/core'

import { useFormButtons } from '@ues-bis/shared'
import { capability, throwServerError, useCapability, useClientParams } from '@ues-bis/standalone-shared'
import { ErrorBoundary, FormButtonPanel, Loading, PageTitlePanel, ProgressButton } from '@ues/behaviours'

import {
  Context as RiskEnginesSettingsContext,
  default as RiskEngineSettingsProvider,
} from '../../providers/RiskEngineSettingsProvider'
import RiskEnginesSettings from './RiskEnginesSettings'
import createDefaultFormValues from './utils/createDefaultFormValues'
import createRiskEnginesSettingsDto from './utils/createRiskEnginesSettingsDto'

interface RiskEngineSettingsFormProps {
  defaultValues: any
  ipAddressRisk: boolean
  NetworkAnomalyDetection: boolean
  editable: boolean
  saving: boolean
  update: (data: any) => void
}

const RiskEngineSettingsForm: React.FC<RiskEngineSettingsFormProps> = memo(
  ({ defaultValues, ipAddressRisk, NetworkAnomalyDetection, editable, saving, update }) => {
    const { t } = useTranslation()

    const doSave = useCallback(
      (formValues, { reset }) => {
        const riskEnginesSettingsDto = createRiskEnginesSettingsDto(
          defaultValues,
          formValues,
          ipAddressRisk,
          NetworkAnomalyDetection,
        )

        update({
          variables: riskEnginesSettingsDto,
          update: settings => {
            reset(createDefaultFormValues(settings, ipAddressRisk, NetworkAnomalyDetection))
          },
        })
      },
      [defaultValues, ipAddressRisk, NetworkAnomalyDetection, update],
    )
    const formMethods = useForm({
      mode: 'onChange',
      defaultValues,
      criteriaMode: 'all',
    })
    const { resetDisabled, onReset, submitDisabled, onSubmit } = useFormButtons(formMethods, saving, doSave)

    return (
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit} noValidate>
          <RiskEnginesSettings editable={editable} />
          <FormButtonPanel show={!(resetDisabled || submitDisabled) && editable}>
            <Button onClick={onReset} disabled={resetDisabled} variant="outlined">
              {t('bis/shared:common.cancel')}
            </Button>
            <ProgressButton variant="contained" color="primary" loading={saving} type="submit" disabled={submitDisabled}>
              {t('bis/shared:common.save')}
            </ProgressButton>
          </FormButtonPanel>
        </form>
      </FormProvider>
    )
  },
)

const RiskEnginesSettingsContainer = () => {
  const { t } = useTranslation()
  const { features: { IpAddressRisk = false, NetworkAnomalyDetection = false } = {} } = useClientParams()
  const { loading, data, update, saving, error } = useContext(RiskEnginesSettingsContext)
  const defaultValues = useMemo(() => createDefaultFormValues(data, IpAddressRisk, NetworkAnomalyDetection), [
    data,
    IpAddressRisk,
    NetworkAnomalyDetection,
  ])
  const [editable] = useCapability(capability.RISK_ENGINES_SETTINGS)

  if (error) {
    throwServerError(error)
  }
  if (loading) {
    return (
      <>
        <PageTitlePanel title={t('settings.riskEngines.title')} />
        <Loading />
      </>
    )
  }

  return (
    <>
      <PageTitlePanel title={t('settings.riskEngines.title')} />
      <Box>
        <RiskEngineSettingsForm
          editable={editable}
          defaultValues={defaultValues}
          ipAddressRisk={IpAddressRisk}
          NetworkAnomalyDetection={NetworkAnomalyDetection}
          saving={saving}
          update={update}
        />
      </Box>
    </>
  )
}

const EnhancedSettingsRiskEnginesContainer = () => (
  <ErrorBoundary>
    <RiskEngineSettingsProvider>
      <RiskEnginesSettingsContainer />
    </RiskEngineSettingsProvider>
  </ErrorBoundary>
)

export default EnhancedSettingsRiskEnginesContainer
