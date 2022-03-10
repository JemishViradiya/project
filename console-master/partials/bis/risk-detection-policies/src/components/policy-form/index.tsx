import classNames from 'classnames'
import { memoize } from 'lodash-es'
import isEqual from 'lodash-es/isEqual'
import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Typography, useTheme } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextField from '@material-ui/core/TextField'

import { usePrevious } from '@ues-behaviour/react'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { ContentAreaPanel } from '@ues/behaviours'

import { PolicyFormContext } from '../../contexts/policy-form-context'
import type { PolicyFormValues } from '../../model'
import { PolicyFormMode } from '../../model'
import { AutomaticRiskReductionField } from './automatic-risk-reduction'
import { PolicyFormContainer } from './container'
import { DetectionsField } from './detections'
import { usePolicyFormFieldsValidationRules } from './validation'

export type PolicyFormOnSubmitCallback = (values: PolicyFormValues) => void

export interface PolicyFormProps {
  defaultValues: PolicyFormValues
  readOnly?: boolean
  loading?: boolean
  onCancel: () => void | Promise<void>
  onSubmit: PolicyFormOnSubmitCallback
  mode?: PolicyFormMode
  isDefault?: boolean
}

const useStyles = makeStyles(theme => ({
  lastInput: {
    marginBottom: theme.spacing(0),
  },
}))

const createOnChangeHandler = (defaultValue: any, controllerOnChange: (value: any) => void) => (value: any) => {
  // If the local and default values are the same notify with the default one to keep the object reference.
  // Required for react-hook-form isDirty property to work correctly.
  return controllerOnChange(!isEqual(value, defaultValue) ? value : defaultValue)
}

export const PolicyForm = memo<PolicyFormProps>(
  ({ defaultValues, readOnly = false, onSubmit, onCancel, loading = false, mode = PolicyFormMode.Edit, isDefault = false }) => {
    const { t } = useTranslation('bis/ues')
    const labelName = t('bis/ues:detectionPolicies.form.labels.name')
    const labelDescription = t('bis/ues:detectionPolicies.form.labels.description')
    const theme = useTheme()
    const styles = useStyles()
    const { setHasChanges, setValuesGetter } = useContext(PolicyFormContext)
    const validationRules = usePolicyFormFieldsValidationRules(t)
    const features = useFeatures()
    const arrEnabled = features.isEnabled(FeatureName.ARR)

    const formMethods = useForm({
      mode: 'onChange',
      defaultValues,
      criteriaMode: 'all',
    })

    const {
      reset,
      errors,
      control,
      formState: { isValid, isDirty },
      handleSubmit,
      getValues,
    } = formMethods

    useEffect(() => {
      setHasChanges(isDirty)
    }, [isDirty, setHasChanges])

    useEffect(() => {
      setValuesGetter(getValues)
    }, [getValues, setValuesGetter])

    useEffect(
      () => () => {
        setHasChanges(false)
        setValuesGetter(() => undefined)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    )

    const previousDefaultValues = usePrevious(defaultValues)
    useEffect(() => {
      if (previousDefaultValues !== defaultValues) {
        reset(defaultValues)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValues])

    const onSubmitForm = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit])

    const DetectionsFieldComponent = useCallback(
      ({ onChange, value }: ControllerRenderProps) => (
        <DetectionsField onChange={createOnChangeHandler(defaultValues.detections, onChange)} value={value} readOnly={readOnly} />
      ),
      [defaultValues, readOnly],
    )

    const AutomaticRiskReductionFieldComponent = useCallback(
      ({ onChange, value }: ControllerRenderProps) =>
        arrEnabled && (
          <AutomaticRiskReductionField
            onChange={createOnChangeHandler(defaultValues.automaticRiskReduction, onChange)}
            value={value}
            readOnly={readOnly}
          />
        ),
      [arrEnabled, defaultValues, readOnly],
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getContentAreaPanelBoxProps = useCallback(
      memoize<any>((isLast = false) => ({
        width: '100%',
        maxWidth: '1024px',
        minWidth: 0,
        marginBottom: isLast ? 0 : theme.spacing(1),
      })),
      [theme],
    )

    return (
      <PolicyFormContainer
        readOnly={readOnly}
        loading={loading}
        isDirty={isDirty}
        isValid={isValid}
        mode={mode}
        onCancel={onCancel}
        onSubmit={onSubmitForm}
      >
        <ContentAreaPanel title={t('bis/ues:risk.common.generalInfo')} fullWidth boxProps={getContentAreaPanelBoxProps()}>
          <Controller
            control={control}
            rules={validationRules.name}
            name="name"
            as={
              <TextField
                required
                disabled={isDefault || readOnly}
                label={labelName}
                inputProps={{ 'aria-label': labelName }}
                id={labelName}
                helperText={errors.name?.message}
                error={!!errors.name}
                size="small"
                className="narrow"
              />
            }
          />
          <Controller
            control={control}
            rules={validationRules.description}
            name="description"
            as={
              <TextField
                disabled={readOnly}
                label={labelDescription}
                inputProps={{ 'aria-label': labelDescription }}
                id={labelDescription}
                helperText={errors.description?.message}
                error={!!errors.description}
                size="small"
                className={classNames('narrow', styles.lastInput)}
              />
            }
          />
        </ContentAreaPanel>

        <ContentAreaPanel
          title={t('bis/ues:detectionPolicies.assessment.info.title')}
          fullWidth
          boxProps={getContentAreaPanelBoxProps(true)}
        >
          <Typography variant="body2">{t('bis/ues:detectionPolicies.assessment.info.paragraph')}</Typography>

          <Controller control={control} name="automaticRiskReduction" render={AutomaticRiskReductionFieldComponent} />

          <Controller control={control} name="detections" render={DetectionsFieldComponent} />
        </ContentAreaPanel>
      </PolicyFormContainer>
    )
  },
)
