/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button, FormControl, FormGroup, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'

import { BcnApi } from '@ues-data/platform'
import { Permission, usePermissions, useStatefulAsyncMutation, useStatefulReduxQuery } from '@ues-data/shared'
import {
  HelpLinkScope,
  isEmpty,
  isValidAge,
  isValidHost,
  isValidPort,
  isValidSize,
  usePlatformHelpLink,
} from '@ues-platform/shared'
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

import DebugLevel from './inputs/DebugLevel'
import LogFile from './inputs/LogFile'
import SysLog from './inputs/SysLog'

const ERROR_TEMPLATE = { isError: false, message: '' }
const SETTINGS_MAP = BcnApi.BCN_SETTINGS_MAP

const BCNSettings = () => {
  useSecuredContent(Permission.ECS_BCN_READ)
  const { t } = useTranslation(['platform/common', 'general/form'])
  usePageTitle(t('platform/common:bcn.settings.pageDetailsTitle'))

  const theme = useTheme()
  const { enqueueMessage } = useSnackbar()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const [error, setError] = useState({
    host: { ...ERROR_TEMPLATE },
    port: { ...ERROR_TEMPLATE },
    maximumLogFileSize: { ...ERROR_TEMPLATE },
    maximumServerLogFileAge: { ...ERROR_TEMPLATE },
  })

  const [saveSettingsAction, saveSettingsState] = useStatefulAsyncMutation(BcnApi.saveBcnConfig, {})

  const { data, loading, error: loadingSettingsError } = useStatefulReduxQuery(BcnApi.querySettings, {})

  const { hasPermission } = usePermissions()
  const updateable = hasPermission(Permission.ECS_BCN_UPDATE)

  useEffect(() => {
    if (loadingSettingsError) {
      enqueueMessage(t('bcn.errors.errorGettingBCNSettings'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingSettingsError])

  const handleSwitchChange = event => {
    const id = event.target.id
    const checked = event.target.checked
    if (id === 'common.logging.syslog.enabled') {
      setError(prevState => ({
        ...prevState,
        host: { ...ERROR_TEMPLATE },
        port: { ...ERROR_TEMPLATE },
      }))
      dispatch(
        BcnApi.setLocalBcnSettings({
          ...data,
          [SETTINGS_MAP.bcpHost]: '',
          [SETTINGS_MAP.bcpPort]: '',
        }),
      )
    } else if (id === 'common.logging.file.enabled') {
      setError(prevState => ({
        ...prevState,
        maximumLogFileSize: { ...ERROR_TEMPLATE },
        maximumServerLogFileAge: { ...ERROR_TEMPLATE },
      }))
      dispatch(
        BcnApi.setLocalBcnSettings({
          ...data,
          [SETTINGS_MAP.maximumSizeMb]: '',
          [SETTINGS_MAP.maximumAgeDays]: '',
        }),
      )
    }
    dispatch(BcnApi.setLocalBcnSettings({ ...data, [id]: checked }))
  }

  const handleTextChange = event => {
    const { id, value } = event.target
    dispatch(BcnApi.setLocalBcnSettings({ ...data, [id]: value }))
    setError(prevState => ({ ...prevState, [id]: { ...ERROR_TEMPLATE } }))
  }

  useEffect(() => {
    if (data) {
      isValid()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const saveSettings = () => {
    saveSettingsAction({ newSettings: data })
      .then(response => {
        enqueueMessage(t('form.success'), 'success')
      })
      .catch(error => {
        enqueueMessage(t('bcn.errors.errorUpdatingSettings'), 'error')
      })
      .finally(() => {
        setSubmitButtonDisabled(false)
      })
  }

  useEffect(() => {
    setSubmitButtonDisabled(Object.values(error).filter(x => x.isError).length !== 0)
  }, [error])

  const onSubmit = () => {
    setSubmitButtonDisabled(true)
    if (isValid()) {
      saveSettings()
    }
  }

  const isValid = () => {
    const sysLogFields = [
      {
        id: 'host',
        value: data[SETTINGS_MAP.bcpHost],
        validate: [
          { validator: isEmpty, errorKey: 'emptyField' },
          { validator: isValidHost, errorKey: 'invalidField' },
        ],
      },
      {
        id: 'port',
        value: data[SETTINGS_MAP.bcpPort],
        validate: [
          { validator: isEmpty, errorKey: 'emptyField' },
          { validator: isValidPort, errorKey: 'invalidField' },
        ],
      },
    ]
    const filefields = [
      {
        id: 'maximumLogFileSize',
        value: data[SETTINGS_MAP.maximumSizeMb],
        validate: [
          { validator: isEmpty, errorKey: 'emptyField' },
          { validator: isValidSize, errorKey: 'invalidField' },
        ],
      },
      {
        id: 'maximumServerLogFileAge',
        value: data[SETTINGS_MAP.maximumAgeDays],
        validate: [
          { validator: isEmpty, errorKey: 'emptyField' },
          { validator: isValidAge, errorKey: 'invalidField' },
        ],
      },
    ]
    let fields = []
    if (data[SETTINGS_MAP.sysLogEnabled]) fields = [...fields, ...sysLogFields]
    if (data[SETTINGS_MAP.loggingFileEnabled]) fields = [...fields, ...filefields]

    let validForm = true
    const validateField = field => {
      let valid = true
      for (let i = 0; i < field.validate.length && valid; i++) {
        valid = field.validate[i].validator(field.value)
        if (!valid) {
          setError(prevState => ({
            ...prevState,
            [field.id]: {
              isError: true,
              message: t('bcn.settings.validation.' + field.validate[i].errorKey, {
                fieldName: t(`bcn.settings.${field.id}`),
              }),
            },
          }))
        } else {
          setError(prevState => ({
            ...prevState,
            [field.id]: {
              isError: false,
              message: t('bcn.settings.validation.' + field.validate[i].errorKey, {
                fieldName: t(`bcn.settings.${field.id}`),
              }),
            },
          }))
        }
        validForm &= valid
      }
      return validForm
    }

    fields.forEach(validateField)
    return validForm
  }

  const buttons = [
    {
      variant: 'outlined',
      onClick: () => navigate(-1),
      text: t('general/form:commonLabels.cancel'),
    },
    {
      variant: 'contained',
      color: 'primary',
      disabled: submitButtonDisabled,
      onClick: onSubmit,
      text: t('general/form:commonLabels.save'),
    },
  ]

  const pageTitle = updateable ? t('bcn.settings.pageTitle') : t('bcn.settings.pageViewTitle')
  const helpId = usePlatformHelpLink(HelpLinkScope.CONNECTIVITY_NODE)

  return loading ? (
    <Loading />
  ) : (
    <>
      <PageTitlePanel title={pageTitle} goBack={() => navigate(-1)} helpId={helpId} />
      <ContentArea>
        <ContentAreaPanel title={t('bcn.settings.title')}>
          <Typography variant="body2">{t('bcn.settings.bcnLoggingDescription')}</Typography>
          <FormControl component="fieldset">
            <FormGroup style={{ flexWrap: 'nowrap' }}>
              <DebugLevel updateable={updateable} SETTINGS_MAP={SETTINGS_MAP} />
              <SysLog
                SETTINGS_MAP={SETTINGS_MAP}
                error={error}
                updateable={updateable}
                handleSwitchChange={handleSwitchChange}
                handleTextChange={handleTextChange}
              />
              <LogFile
                SETTINGS_MAP={SETTINGS_MAP}
                error={error}
                updateable={updateable}
                handleSwitchChange={handleSwitchChange}
                handleTextChange={handleTextChange}
              />
            </FormGroup>
          </FormControl>
        </ContentAreaPanel>
      </ContentArea>
      <FormButtonPanel show={updateable}>
        {buttons.map((button, index) => (
          <Button key={index} {...button} style={{ margin: theme.spacing(2) }}>
            {button.text}
          </Button>
        ))}
      </FormButtonPanel>
    </>
  )
}

export default BCNSettings
