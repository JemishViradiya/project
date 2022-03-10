import classNames from 'classnames'
import { isEqual } from 'lodash-es'
import React, { memo, useCallback, useContext, useEffect } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import Button from '@material-ui/core/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'
import TextField from '@material-ui/core/TextField'

import { usePrevious } from '@ues-behaviour/react'
import { ContentAreaPanel, FormButtonPanel, ProgressButton } from '@ues/behaviours'

import { DEFAULT_POLICY_FORM_VALUES, TRANSLATION_NAMESPACES } from '../../config'
import { PolicyFormContext } from '../../contexts/policy-form-context'
import type { PolicyData, PolicyFormValues } from '../../model'
import { PolicyFormField } from '../../model'
import { RiskEnginesSettingsField } from './custom-controls/risk-engines'
import { usePolicyFormFieldsValidationRules } from './validation'

export type PolicyFormOnSubmitCallback = (values: PolicyFormValues) => void

export enum PolicyFormMode {
  Add = 'add',
  Copy = 'copy',
  Edit = 'edit',
}

export interface PolicyFormProps {
  /** Default values for the form */
  defaultValues?: PolicyFormValues
  readOnly?: boolean
  loading?: boolean
  onCancel: () => void | Promise<void>
  onSubmit: PolicyFormOnSubmitCallback
  mode?: PolicyFormMode
}

const useStyles = makeStyles(theme => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  cardContainer: {
    marginBottom: theme.spacing(4),
  },
  lastInput: {
    marginBottom: theme.spacing(0),
  },
}))

export const PolicyForm = memo<PolicyFormProps>(
  ({
    defaultValues = DEFAULT_POLICY_FORM_VALUES,
    readOnly = false,
    onSubmit,
    onCancel,
    loading = false,
    mode = PolicyFormMode.Edit,
  }) => {
    const { t } = useTranslation(TRANSLATION_NAMESPACES)
    const { setHasChanges, setValuesGetter } = useContext(PolicyFormContext)
    const validationRules = usePolicyFormFieldsValidationRules(t)
    const styles = useStyles()
    const labelName = t('bis/ues:policies.form.labels.name')
    const labelDescription = t('bis/ues:policies.form.labels.description')

    const formMethods = useForm<PolicyFormValues>({
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

    const previousDefaultValues = usePrevious(defaultValues)
    useEffect(() => {
      if (!isEqual(previousDefaultValues, defaultValues)) {
        reset(defaultValues)
      }
    }, [defaultValues, previousDefaultValues, reset])

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

    const RiskEnginesSettingsFieldComponent = useCallback(
      ({ onChange: controllerOnChange, value }: ControllerRenderProps) => {
        const defaultValue = defaultValues.policyData

        // If the local and default values are the same notify with the default one to keep the object reference.
        // Required for react-hook-form isDirty property to work correctly.
        const onChange = (changedValue: PolicyData) =>
          controllerOnChange(!isEqual(changedValue, defaultValue) ? changedValue : defaultValue)

        return <RiskEnginesSettingsField onChange={onChange} value={value} readOnly={readOnly} />
      },
      [defaultValues.policyData, readOnly],
    )

    return (
      <>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <ContentAreaPanel title={t('bis/ues:risk.common.generalInfo')}>
              <Controller
                control={control}
                rules={validationRules[PolicyFormField.Name]}
                name={PolicyFormField.Name}
                as={
                  <TextField
                    required
                    disabled={readOnly}
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
                rules={validationRules[PolicyFormField.Description]}
                name={PolicyFormField.Description}
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
          </div>

          <ContentAreaPanel title={t('bis/ues:risk.common.identityRiskResponseActions')}>
            <Controller control={control} name={PolicyFormField.PolicyData} render={RiskEnginesSettingsFieldComponent} />
          </ContentAreaPanel>
        </div>

        <FormButtonPanel show={!readOnly && (mode === PolicyFormMode.Add || mode === PolicyFormMode.Copy || isDirty)}>
          <Button onClick={onCancel} variant="outlined" disabled={loading}>
            {t('bis/shared:common.cancel')}
          </Button>
          <ProgressButton
            loading={loading}
            color="primary"
            variant="contained"
            disabled={!isDirty || !isValid || loading}
            onClick={handleSubmit(onSubmit)}
          >
            {mode === PolicyFormMode.Add ? t('bis/shared:common.add') : t('bis/shared:common.save')}
          </ProgressButton>
        </FormButtonPanel>
      </>
    )
  },
)
