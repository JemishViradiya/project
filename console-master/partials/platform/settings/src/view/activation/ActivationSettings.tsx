/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEqual } from 'lodash-es'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, makeStyles, TextField } from '@material-ui/core'

import { EndpointsApi } from '@ues-data/platform'
import {
  FeatureName,
  Permission,
  useFeatures,
  usePermissions,
  usePrevious,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import {
  ContentArea,
  ContentAreaPanel,
  FormButtonPanel,
  Loading,
  PageTitlePanel,
  usePageTitle,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

const useStyles = makeStyles(() => ({
  passcodeTtlField: {
    '& .MuiInputBase-root': {
      width: '160px',
      minWidth: '160px',
    },
  },
}))

const ActivationSettings = () => {
  useSecuredContent(Permission.ECS_ACTIVATIONSETTINGS_READ)
  const { t } = useTranslation(['platform/common', 'general/form'])
  usePageTitle(t('activationSettings.title.activation'))
  const classes = useStyles()
  const snackbar = useSnackbar()
  const { isEnabled } = useFeatures()
  const isMobileThreatDetectionEnabled: boolean = isEnabled(FeatureName.MobileThreatDetection)
  const [loading, setLoading] = useState<boolean>(true)

  const { hasPermission } = usePermissions()
  const hasUpdatePermission = hasPermission(Permission.ECS_ACTIVATIONSETTINGS_UPDATE)

  const passcodeTtlSettingName = 'user.passcode.ttl.minutes'
  const passcodeTtlMinValueDays = 1
  const passcodeTtlMaxValueDays = 30

  const { data: passcodeTtlInMin, loading: passcodeTtlTaskLoading, error } = useStatefulAsyncQuery(EndpointsApi.getTenantProperty, {
    variables: { propertyName: passcodeTtlSettingName },
    skip: !isMobileThreatDetectionEnabled,
  })
  const [updateTenantProperty, updateTenantPropertyState] = useStatefulAsyncMutation(EndpointsApi.updateTenantProperty, {})

  const defaultValues = useMemo(
    () => ({
      passcodeTtl: passcodeTtlInMin?.value ? '' + convertMinutesToDays(passcodeTtlInMin?.value) : '',
    }),
    [passcodeTtlInMin],
  )

  useEffect(() => {
    if (error) {
      snackbar.enqueueMessage(t('activationSettings.error.errorGettingPasscodeTtl'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const passcodeTtlField = {
    required: true,
    type: 'text',
    label: t('activationSettings.passcodeTtl.label'),
    helpLabel: t('activationSettings.passcodeTtl.helpLabel', { min: passcodeTtlMinValueDays, max: passcodeTtlMaxValueDays }),
    name: 'passcodeTtl',
  }

  const formMethods = useForm({
    mode: 'onChange',
    defaultValues,
    criteriaMode: 'all',
    resolver: yupResolver(
      yup.object().shape({
        passcodeTtl: yup
          .number()
          .typeError(t('activationSettings.passcodeTtl.error.required'))
          .required(t('activationSettings.passcodeTtl.error.required'))
          .min(
            passcodeTtlMinValueDays,
            t('activationSettings.passcodeTtl.error.outOfRange', { min: passcodeTtlMinValueDays, max: passcodeTtlMaxValueDays }),
          )
          .max(
            passcodeTtlMaxValueDays,
            t('activationSettings.passcodeTtl.error.outOfRange', { min: passcodeTtlMinValueDays, max: passcodeTtlMaxValueDays }),
          ),
      }),
    ),
  })

  const previousDefaultValues = usePrevious(defaultValues)

  useEffect(() => {
    if (!isEqual(previousDefaultValues, defaultValues)) {
      formMethods.reset(defaultValues)
    }
  }, [defaultValues, formMethods, previousDefaultValues])

  useEffect(() => {
    setLoading(passcodeTtlTaskLoading || updateTenantPropertyState?.loading)
  }, [passcodeTtlTaskLoading, updateTenantPropertyState])

  function convertMinutesToDays(srcMinutes: number | string): number {
    return srcMinutes ? moment.duration(srcMinutes, 'minutes')?.days() : undefined
  }

  function convertDaysToMinutes(srcDays: number | string): string {
    if (srcDays) {
      return `${moment.duration(srcDays, 'days')?.asMinutes()}`
    }
  }

  function resolvePasscodeTtlHelperText(): string {
    const errorMessage = formMethods.errors.passcodeTtl?.message
    return errorMessage ? errorMessage : passcodeTtlField.helpLabel
  }

  function onCancelAction() {
    formMethods.reset()
  }

  function onSaveAction() {
    const passcodeTtlDays = formMethods?.getValues()?.passcodeTtl
    if (passcodeTtlDays) {
      const updateTenantPropertyPromise: any = updateTenantProperty({
        propertyName: passcodeTtlSettingName,
        propertyValue: convertDaysToMinutes(passcodeTtlDays),
      })
      updateTenantPropertyPromise
        .then(data => {
          if (data.error) {
            snackbar.enqueueMessage(t('activationSettings.error.errorUpdatingPasscodeTtl'), 'error')
          } else {
            formMethods.reset({ passcodeTtl: passcodeTtlDays })
            snackbar.enqueueMessage(t('activationSettings.success.update'), 'success')
          }
        })
        .catch(() => {
          snackbar.enqueueMessage(t('activationSettings.error.errorUpdatingPasscodeTtl'), 'error')
        })
    }
  }

  return (
    isMobileThreatDetectionEnabled && (
      <Box display="flex" flexDirection="column" width="100%">
        <PageTitlePanel
          title={[t('activationSettings.title.settings'), t('activationSettings.title.activation')]}
          helpId={HelpLinks.ActivationSettings}
        />
        <ContentArea paddingBottom={6} style={{ alignSelf: 'baseline' }}>
          {loading ? (
            <Loading />
          ) : (
            <ContentAreaPanel title={t('activationSettings.subTitle')}>
              <FormProvider {...formMethods}>
                <form>
                  <Box>
                    <Controller
                      as={TextField}
                      size="small"
                      disabled={!hasUpdatePermission}
                      required={true}
                      label={passcodeTtlField.label}
                      name={passcodeTtlField.name}
                      control={formMethods.control}
                      error={Boolean(formMethods.errors.passcodeTtl)}
                      helperText={resolvePasscodeTtlHelperText()}
                      className={classes.passcodeTtlField}
                    />
                  </Box>
                </form>
              </FormProvider>
            </ContentAreaPanel>
          )}
        </ContentArea>
        <FormButtonPanel show={hasUpdatePermission && formMethods?.formState?.isDirty}>
          <Button variant="outlined" onClick={onCancelAction}>
            {t('general/form:commonLabels.cancel')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={!formMethods?.formState?.isValid}
            onClick={onSaveAction}
          >
            {t('general/form:commonLabels.save')}
          </Button>
        </FormButtonPanel>
      </Box>
    )
  )
}

export default ActivationSettings
