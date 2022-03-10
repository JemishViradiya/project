import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Button, Grid, Input, InputLabel, MenuItem, Paper, TextField, useTheme } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

import { usePrevious } from '@ues-behaviour/react'
import type { Authenticator as AuthenticatorType, OIDCClientConfiguartion } from '@ues-data/eid'
import {
  AuthenticationType,
  mutateCreateAuthenticator,
  mutateUpdateAuthenticator,
  queryAuthenticator,
  SigningType,
  UsernameFormat,
} from '@ues-data/eid'
import {
  FeatureName,
  Permission,
  useFeatures,
  usePermissions,
  useStatefulAsyncMutation,
  useStatefulAsyncQuery,
} from '@ues-data/shared'
import { boxFlexCenterProps, HelpLinks, useInputFormControlStyles, useSwitchFormGroupStyles } from '@ues/assets'
import {
  ContentArea,
  ContentAreaPanel,
  FormButtonPanel,
  PageTitlePanel,
  Select,
  useSecuredContent,
  useSnackbar,
} from '@ues/behaviours'

import makeStyles from './authenticatorstyles'

const isCompleted = (current, previous) => {
  return current && !current.loading && previous.loading
}

const defaultValues: typeof AuthenticatorType = {
  id: '',
  type: AuthenticationType.ENTERPRISE,
  name: '',
  description: '',
  configuration: {
    discovery_url: '',
    client_authentication: {
      client_id: '',
      jwks: `{"keys": []}`,
    },
  },
}
function IsJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
// eslint-disable-next-line
const hostnameRegEx = /^(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
const rHostname = new RegExp(hostnameRegEx)
const authDomainRegEx = /^(?!https?:\/\/).+/
const rAuthDomain = new RegExp(authDomainRegEx)
const schema = function (t) {
  return yup.object().shape({
    // eslint-disable-next-line sonarjs/no-duplicate-string
    type: yup.string().required(t('general/form:validationErrors.required')),
    name: yup
      .string()
      .required(t('general/form:validationErrors.required'))
      .trim(t('general/form:validationErrors.whitespace'))
      .strict(true),
    configuration: yup
      .object()
      .when('type', {
        is: val => val === AuthenticationType.DUO_MFA.toString(),
        then: yup.object().shape({
          auth_api_hostname: yup
            .string()
            // eslint-disable-next-line sonarjs/no-duplicate-string
            .required(t('general/form:validationErrors.required'))
            // eslint-disable-next-line sonarjs/no-duplicate-string
            .test('isHostname', t('general/form:validationErrors.invalid'), value => rHostname.test(value)),
          auth_secret_key: yup.string().required(t('general/form:validationErrors.required')),
          auth_integration_key: yup.string().required(t('general/form:validationErrors.required')),
        }),
      })
      .when('type', {
        is: val => val === AuthenticationType.OKTA.toString() || val === AuthenticationType.PING.toString(),
        then: yup.object().shape({
          discovery_url: yup
            .string()
            // eslint-disable-next-line sonarjs/no-duplicate-string
            .required(t('general/form:validationErrors.required'))
            .url(t('general/form:validationErrors.invalid')),
          client_authentication: yup.object().shape({
            client_id: yup.string().required(t('general/form:validationErrors.required')),
            jwks: yup
              .string()
              // eslint-disable-next-line sonarjs/no-duplicate-string
              .test('isEmpty', t('general/form:validationErrors.required'), value => value.length !== 0)
              .test('isObject', t('general/form:validationErrors.invalid'), value => IsJsonString(value)),
          }),
        }),
      })
      .when('type', {
        is: val => val === AuthenticationType.OKTA_MFA.toString(),
        then: yup.object().shape({
          auth_api_key: yup.string().required(t('general/form:validationErrors.required')),
          auth_domain: yup
            .string()
            // eslint-disable-next-line sonarjs/no-duplicate-string
            .required(t('general/form:validationErrors.required'))
            .test('isAuthDomain', t('general/form:validationErrors.invalid'), value => rAuthDomain.test(value)),
        }),
      })
      .when('type', {
        is: val => val === AuthenticationType.TOTP.toString(),
        then: yup.object().shape({
          window: yup
            .number()
            // eslint-disable-next-line sonarjs/no-duplicate-string
            .typeError(t('general/form:validationErrors.integerMinimum', { min: 0 }))
            .integer(t('general/form:validationErrors.integerMinimum', { min: 0 }))
            .min(0, t('general/form:validationErrors.integerMinimum', { min: 0 }))
            .required(t('general/form:validationErrors.required')),
        }),
      }),
  })
}

const Loading = theme => {
  ///This should really be a built in widget;

  return (
    <Box
      bgcolor={theme.palette.grey[200]} // just to show the loading container
      height="calc(100vh - 32px)" // -32px due to default padding applied in config.js
      width="100%"
      {...boxFlexCenterProps}
    >
      <Box p={6} borderRadius={2} bgcolor={theme.palette.common.white} flexDirection="column" {...boxFlexCenterProps}>
        <CircularProgress color="secondary" />
        <Box pt={4}>
          <Typography variant="body2" color="textSecondary">
            Loading ...
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function Authenticator(): JSX.Element {
  useSecuredContent(Permission.ECS_IDENTITY_READ)
  const { t } = useTranslation(['eid/common', 'general/form'])
  const { id } = useParams()
  const isEdit = id !== undefined
  const { enqueueMessage } = useSnackbar()

  const { isEnabled } = useFeatures()
  const eidTOTPAuthenticatorEnabled = isEnabled(FeatureName.UESTOTPAuthenticatorEnabled)

  const theme = useTheme()
  const inputFormControlStyles = useInputFormControlStyles(theme)
  const switchStyle = useSwitchFormGroupStyles(theme)

  const { hasPermission } = usePermissions()
  const createable: boolean = hasPermission(Permission.ECS_IDENTITY_CREATE)
  const updateable: boolean = hasPermission(Permission.ECS_IDENTITY_UPDATE)

  const classes = makeStyles()
  const navigate = useNavigate()
  const { data: authenticatorData, loading } = useStatefulAsyncQuery(queryAuthenticator, {
    variables: { id: id },
    skip: id === undefined,
  })

  const [createAuthenticator, createAuthenticatorState] = useStatefulAsyncMutation(mutateCreateAuthenticator, {})
  const [updateAuthenticator, updateAuthenticatorState] = useStatefulAsyncMutation(mutateUpdateAuthenticator, {})

  const prevCreateState = usePrevious(createAuthenticatorState)
  const prevUpdateState = usePrevious(updateAuthenticatorState)

  const { register, handleSubmit, errors, setValue, getValues, watch, control, formState, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema(t)),
  })

  const { isDirty } = formState
  const type = watch('type')

  const onSubmit = useCallback(
    async data => {
      if (data.configuration !== undefined) {
        Object.keys(data.configuration).forEach(k => {
          if (data.configuration[k] === undefined || data.configuration[k].length === 0) {
            delete data.configuration[k]
          }
        })
      }
      if (data.configuration?.client_authentication?.jwks) {
        data.configuration.client_authentication.jwks = JSON.parse(data.configuration.client_authentication.jwks)
      }

      try {
        if (isEdit) {
          await updateAuthenticator({ id: id, authenticator: data })
        } else {
          await createAuthenticator({ authenticator: data })
        }
      } catch (e) {
        if (isEdit) {
          enqueueMessage(t('common.failure.update', { reason: e }), 'error')
        } else {
          enqueueMessage(t('common.failure.create', { reason: e }), 'error')
        }
      }
    },
    [isEdit, updateAuthenticator, id, enqueueMessage, t, createAuthenticator],
  )

  useEffect(() => {
    if (isCompleted(createAuthenticatorState, prevCreateState)) {
      const e: any = createAuthenticatorState.error
      if (e) {
        enqueueMessage(t('common.failure.create', { reason: e.response?.data?.message }), 'error')
      } else {
        enqueueMessage(t('common.success.create'), 'success')
        handleCancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createAuthenticatorState])

  useEffect(() => {
    if (isCompleted(updateAuthenticatorState, prevUpdateState)) {
      const e: any = updateAuthenticatorState.error
      if (e) {
        enqueueMessage(t('common.failure.update', { reason: e.response?.data?.message }), 'error')
      } else {
        enqueueMessage(t('common.success.update'), 'success')
        handleCancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateAuthenticatorState])

  const handleCancel = () => {
    navigate(-1)
  }

  const resolveWindowHelperText = (): string => {
    const errorMessage = errors.configuration?.window?.message
    return errorMessage ? errorMessage : t('authenticators.windowHelperText')
  }

  useEffect(() => {
    if (authenticatorData !== undefined) {
      if (authenticatorData.configuration !== undefined && authenticatorData.configuration['client_authentication'] !== undefined) {
        const config = authenticatorData.configuration as OIDCClientConfiguartion
        authenticatorData.configuration['client_authentication']['jwks'] = JSON.stringify(
          config.client_authentication.jwks,
          null,
          2,
        )
      }
      reset({ ...authenticatorData })
    }
  }, [authenticatorData, reset])

  if (loading) {
    return <Loading {...theme} />
  }

  const showAuthType = authType => {
    if (authType === AuthenticationType.TOTP) {
      return eidTOTPAuthenticatorEnabled
    } else {
      return true
    }
  }

  return (
    <>
      <PageTitlePanel
        goBack={handleCancel}
        subtitle=""
        title={isEdit ? t('authenticators.edit') : t('authenticators.add')}
        helpId={HelpLinks.AuthenticationSettings}
      />
      <div className={classes.root}>
        <form>
          <ContentArea>
            <ContentAreaPanel title={t('authenticators.type')}>
              <div>
                <Controller
                  as={
                    <Select>
                      {Object.keys(AuthenticationType).map(type => {
                        return showAuthType(type) ? (
                          // eslint-disable-next-line sonarjs/no-duplicate-string
                          <MenuItem value={type.toString()}>{t('authenticators.' + type.toString())}</MenuItem>
                        ) : null
                      })}
                    </Select>
                  }
                  name="type"
                  title="type"
                  disabled={isEdit || !createable}
                  error={errors.type ? true : false}
                  helperText={errors.type?.message}
                  defaultValue={AuthenticationType.ENTERPRISE.toString()}
                  control={control}
                  required={true}
                  size="small"
                  variant="filled"
                  className="no-label"
                />
              </div>
            </ContentAreaPanel>
            <ContentAreaPanel title={t('authenticators.general')}>
              <Controller
                id="authenticatorsName"
                as={TextField}
                label={t('authenticators.name')}
                title="name"
                name="name"
                fullWidth
                control={control}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                required={true}
                size="small"
                classes={inputFormControlStyles}
                disabled={isEdit ? !updateable : !createable}
              />
            </ContentAreaPanel>
            {type === AuthenticationType.DUO_MFA.toString() && (
              <ContentAreaPanel title={t('authenticators.duomfaconfiguration')}>
                <div>
                  <Controller
                    id="authenticatorsAuthApiHostname"
                    as={TextField}
                    label={t('authenticators.auth_api_hostname')}
                    name="configuration.auth_api_hostname"
                    title="configuration.auth_api_hostname"
                    control={control}
                    fullWidth
                    error={errors.configuration?.auth_api_hostname ? true : false}
                    helperText={errors.configuration?.auth_api_hostname?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAuthSecretKey"
                    as={TextField}
                    label={t('authenticators.auth_secret_key')}
                    name="configuration.auth_secret_key"
                    title="configuration.auth_secret_key"
                    control={control}
                    fullWidth
                    error={errors.configuration?.auth_secret_key ? true : false}
                    helperText={errors.configuration?.auth_secret_key?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAuthIntegrationKey"
                    as={TextField}
                    label={t('authenticators.auth_integration_key')}
                    name="configuration.auth_integration_key"
                    title="configuration.auth_integration_key"
                    control={control}
                    fullWidth
                    error={errors.configuration?.auth_integration_key ? true : false}
                    helperText={errors.configuration?.auth_integration_key?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAdminApiHostname"
                    as={TextField}
                    label={t('authenticators.admin_api_hostname')}
                    name="configuration.admin_api_hostname"
                    title="configuration.admin_api_hostname"
                    control={control}
                    fullWidth
                    error={errors.configuration?.admin_api_hostname ? true : false}
                    helperText={errors.configuration?.admin_api_hostname?.message}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAdminSecretKey"
                    as={TextField}
                    label={t('authenticators.admin_secret_key')}
                    name="configuration.admin_secret_key"
                    title="configuration.admin_secret_key"
                    control={control}
                    fullWidth
                    error={errors.configuration?.admin_secret_key ? true : false}
                    helperText={errors.configuration?.admin_secret_key?.message}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAdminIntegrationKey"
                    as={TextField}
                    label={t('authenticators.admin_integration_key')}
                    name="configuration.admin_integration_key"
                    title="configuration.admin_integration_key"
                    control={control}
                    fullWidth
                    error={errors.configuration?.admin_integration_key ? true : false}
                    helperText={errors.configuration?.admin_integration_key?.message}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    as={
                      <Select>
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={UsernameFormat.USERNAME}>{t('authenticators.' + UsernameFormat.USERNAME)}</MenuItem>
                        <MenuItem value={UsernameFormat.EMAIL}>{t('authenticators.' + UsernameFormat.EMAIL)}</MenuItem>
                      </Select>
                    }
                    name="configuration.username_format"
                    error={errors.configuration?.username_format ? true : false}
                    helperText={errors.configuration?.username_format?.message}
                    control={control}
                    fullWidth
                    size="small"
                    variant="filled"
                    label={t('authenticators.username_format')}
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                </div>
              </ContentAreaPanel>
            )}
            {type === AuthenticationType.OKTA_MFA.toString() && (
              <ContentAreaPanel title={t('authenticators.oktamfaconfiguration')}>
                <div>
                  <Controller
                    id="authenticatorsAuthApiKey"
                    as={TextField}
                    label={t('authenticators.auth_api_key')}
                    name="configuration.auth_api_key"
                    title="configuration.auth_api_key"
                    control={control}
                    fullWidth
                    error={errors.configuration?.auth_api_key ? true : false}
                    helperText={errors.configuration?.auth_api_key?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsAuthDomain"
                    as={TextField}
                    label={t('authenticators.auth_domain')}
                    name="configuration.auth_domain"
                    title="configuration.auth_domain"
                    control={control}
                    fullWidth
                    error={errors.configuration?.auth_domain ? true : false}
                    helperText={errors.configuration?.auth_domain?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                </div>
              </ContentAreaPanel>
            )}
            {(type === AuthenticationType.OKTA.toString() || type === AuthenticationType.PING.toString()) && (
              <ContentAreaPanel title={t('authenticators.identityproviderclient')}>
                <div>
                  <Controller
                    id="authenticatorsDiscoveryUrl"
                    as={TextField}
                    label={t('authenticators.discovery_url')}
                    name="configuration.discovery_url"
                    title="configuration.discovery_url"
                    control={control}
                    fullWidth
                    error={errors.configuration?.discovery_url ? true : false}
                    helperText={errors.configuration?.discovery_url?.message}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsClientId"
                    as={TextField}
                    label={t('authenticators.client_id')}
                    name="configuration.client_authentication.client_id"
                    title="configuration.client_authentication.client_id"
                    error={errors.configuration?.client_authentication?.client_id ? true : false}
                    helperText={errors.configuration?.client_authentication?.client_id?.message}
                    control={control}
                    fullWidth
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    id="authenticatorsJwks"
                    as={TextField}
                    multiline
                    rows={4}
                    label={t('authenticators.jwks')}
                    name="configuration.client_authentication.jwks"
                    title="configuration.client_authentication.jwks"
                    error={errors.configuration?.client_authentication?.jwks ? true : false}
                    helperText={errors.configuration?.client_authentication?.jwks?.message}
                    control={control}
                    fullWidth
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                  <Controller
                    as={
                      type === AuthenticationType.OKTA ? (
                        <>
                          {setValue('configuration', {
                            client_authentication: { id_token_signed_response_alg: SigningType.RS256 },
                          })}
                        </>
                      ) : (
                        <Select>
                          <MenuItem value={SigningType.ES256}>{t('authenticators.' + SigningType.ES256)}</MenuItem>
                          <MenuItem value={SigningType.ES384}>{t('authenticators.' + SigningType.ES384)}</MenuItem>
                          <MenuItem value={SigningType.ES512}>{t('authenticators.' + SigningType.ES512)}</MenuItem>
                          {!isEdit &&
                          (getValues('configuration.client_authentication.id_token_signed_response_alg') === undefined ||
                            getValues('configuration.client_authentication.id_token_signed_response_alg') === SigningType.RS256)
                            ? setValue('configuration', {
                                client_authentication: { id_token_signed_response_alg: SigningType.ES256 },
                              })
                            : false}
                        </Select>
                      )
                    }
                    defaultValue={type === AuthenticationType.OKTA ? SigningType.RS256 : SigningType.ES256}
                    name="configuration.client_authentication.id_token_signed_response_alg"
                    title="configuration.client_authentication.id_token_signed_response_alg"
                    error={errors.configuration?.client_authentication?.id_token_signed_response_alg ? true : false}
                    helperText={errors.configuration?.client_authentication?.id_token_signed_response_alg?.message}
                    control={control}
                    fullWidth
                    required={true}
                    size="small"
                    label={t('authenticators.signing_type')}
                    variant="filled"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                </div>
              </ContentAreaPanel>
            )}
            {type === AuthenticationType.TOTP.toString() && (
              <ContentAreaPanel title={t('authenticators.totpconfiguration')}>
                <div>
                  <Controller
                    id="authenticatorsWindow"
                    as={TextField}
                    label={t('authenticators.window')}
                    name="configuration.window"
                    title="configuration.window"
                    control={control}
                    fullWidth
                    error={errors.configuration?.window ? true : false}
                    helperText={resolveWindowHelperText()}
                    required={true}
                    size="small"
                    classes={inputFormControlStyles}
                    disabled={isEdit ? !updateable : !createable}
                  />
                </div>
              </ContentAreaPanel>
            )}
          </ContentArea>
        </form>
        <FormButtonPanel show={isDirty}>
          <Button variant="outlined" onClick={handleCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isEdit ? !updateable : !createable}
            onClick={handleSubmit(data => onSubmit(data))}
          >
            {t('common.save')}
          </Button>
        </FormButtonPanel>
      </div>
    </>
  )
}
