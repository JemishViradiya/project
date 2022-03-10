/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import {
  AZURE_DIRECTORY_CLIENT_ID_KEY,
  AZURE_DIRECTORY_CLIENT_KEY_KEY,
  AZURE_DIRECTORY_DOMAIN_KEY,
  AZURE_DIRECTORY_KEY,
  DIRECTORY_TYPE_KEY,
  DirectoryApi,
} from '@ues-data/platform'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { Permission } from '@ues-data/shared-types'
import { HelpLinkScope, isEmpty, isValidDomainName, PageBase, usePlatformHelpLink } from '@ues-platform/shared'
import { ContentArea, ContentAreaPanel, FormButtonPanel, useSecuredContent, useSnackbar } from '@ues/behaviours'

import { useDirectoryPermissions } from './directoryHooks'

const ERROR_TEMPLATE = { isError: false, message: '' }

const AddAzureConnection = memo(() => {
  const { t } = useTranslation(['platform/common', 'platform/validation', 'general/form'])
  const { canCreate, canRead } = useDirectoryPermissions()
  const cancelButtonTitle = t('general/form:commonLabels.cancel')

  useSecuredContent(Permission.ECS_DIRECTORY_CREATE)

  const navigate = useNavigate()
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const { enqueueMessage } = useSnackbar()
  const [connectionDetails, setConnectionDetails] = useState({
    connectionName: '',
    domain: '',
    clientId: '',
    clientKey: '',
  })
  const helpId = usePlatformHelpLink(HelpLinkScope.DIRECTORY_CONNECTIONS)

  const [error, setError] = useState({
    connectionName: ERROR_TEMPLATE,
    domain: ERROR_TEMPLATE,
    clientId: ERROR_TEMPLATE,
    clientKey: ERROR_TEMPLATE,
  })

  const [redirect, setRedirect] = useState(false)
  const [addDirectoryStartAction, addTask] = useStatefulReduxMutation(DirectoryApi.mutationAddDirectory)
  const prevAddTask = usePrevious(addTask)

  useEffect(() => {
    if (!DirectoryApi.isTaskResolved(addTask, prevAddTask)) {
      return
    }
    if (addTask.error) {
      if (addTask.error.response.data?.subStatusCode === 1001) {
        setError(prevState => ({
          ...prevState,
          connectionName: {
            isError: true,
            message: t('directory.error.duplicateName'),
          },
        }))
      } else {
        enqueueMessage(t('directory.error.createConnection'), 'error')
      }
    } else {
      setSuccess(true)
      enqueueMessage(t('form.success'), 'success')
      setRedirect(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTask, prevAddTask])

  const createConnection = async () => {
    const newConnection = {
      name: connectionDetails.connectionName,
      [AZURE_DIRECTORY_KEY]: true,
      [DIRECTORY_TYPE_KEY]: 'AZURE',
      [AZURE_DIRECTORY_CLIENT_ID_KEY]: connectionDetails.clientId,
      [AZURE_DIRECTORY_CLIENT_KEY_KEY]: connectionDetails.clientKey,
      [AZURE_DIRECTORY_DOMAIN_KEY]: connectionDetails.domain,
      directorygroup: [],
    }
    // console.debug(`Creating new connection: ${JSON.stringify(newConnection)}`)

    addDirectoryStartAction(newConnection)
  }

  function onSubmit() {
    if (isValid()) {
      createConnection()
    }
  }

  function isValid() {
    let validForm = true
    const fields = [
      {
        id: 'connectionName',
        value: connectionDetails.connectionName,
        validate: [{ validator: isEmpty, errorKey: 'emptyField' }],
      },
      {
        id: 'domain',
        value: connectionDetails.domain,
        validate: [
          { validator: isEmpty, errorKey: 'emptyField' },
          { validator: isValidDomainName, errorKey: 'invalidField' },
        ],
      },
      {
        id: 'clientId',
        value: connectionDetails.clientId,
        validate: [{ validator: isEmpty, errorKey: 'emptyField' }],
      },
      {
        id: 'clientKey',
        value: connectionDetails.clientKey,
        validate: [{ validator: isEmpty, errorKey: 'emptyField' }],
      },
    ]

    const validateField = async field => {
      // console.debug('Validating : ' + JSON.stringify(field) + ', validators: ' + field.validate.length)
      let valid = true

      for (let i = 0; i < field.validate.length && valid; i++) {
        valid = field.validate[i].validator(field.value)
        if (!valid) {
          setError(prevState => ({
            ...prevState,
            [field.id]: {
              isError: true,
              message: t('platform/validation:' + field.validate[i].errorKey, {
                fieldName: t(`directory.${field.id}`),
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

  const updateSubmitButton = () => {
    console.debug('error ' + JSON.stringify(error))
    setSubmitButtonDisabled(Object.values(error).filter(x => x.isError).length > 0)
  }

  const handleChange = e => {
    const { id, value } = e.target
    setConnectionDetails(prevState => ({
      ...prevState,
      [id]: value,
    }))

    setError(prevState => ({
      ...prevState,
      [id]: ERROR_TEMPLATE,
    }))

    updateSubmitButton()
  }

  const [success, setSuccess] = useState(false)
  // useEffect(() => {}, [redirect, success, submitError, submitErrorMessage])

  if (redirect) {
    return <Navigate push to={-1} />
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <PageBase
      title={t('directory.azureConnection.add.header')}
      showSpinner={addTask?.loading}
      goBack={goBack}
      borderBottom
      bottomPadding
      overflowAuto
      canAccess={canCreate}
      helpId={helpId}
    >
      {success && enqueueMessage(t('form.success'), 'success')}
      <ContentArea alignItems="center">
        <ContentAreaPanel title={t('directory.azureConnection.add.page.title')}>
          <Typography variant="body2">{t('directory.azureConnection.add.page.description')}</Typography>
          <Grid item style={{ maxWidth: 720 }}>
            <TextField
              id="connectionName"
              required
              label={t('directory.connectionName')}
              fullWidth
              margin="normal"
              size="small"
              name="connectionName"
              onChange={handleChange}
              value={connectionDetails.connectionName}
              error={error.connectionName.isError}
              helperText={error.connectionName.message}
            />
            <TextField
              id="domain"
              required
              label={t('directory.domain')}
              fullWidth
              margin="normal"
              size="small"
              name="domain"
              onChange={handleChange}
              value={connectionDetails.domain}
              error={error.domain.isError}
              helperText={error.domain.message}
            />
            <TextField
              id="clientId"
              required
              label={t('directory.clientId')}
              fullWidth
              margin="normal"
              size="small"
              name="clientId"
              onChange={handleChange}
              value={connectionDetails.clientId}
              error={error.clientId.isError}
              helperText={error.clientId.message}
            />
            <TextField
              id="clientKey"
              required
              label={t('directory.clientKey')}
              fullWidth
              margin="normal"
              size="small"
              name="clientKey"
              onChange={handleChange}
              value={connectionDetails.clientKey}
              error={error.clientKey.isError}
              helperText={error.clientKey.message}
            />
          </Grid>
        </ContentAreaPanel>
      </ContentArea>
      <FormButtonPanel show={canRead}>
        <Button variant="outlined" onClick={goBack} aria-label={cancelButtonTitle}>
          {cancelButtonTitle}
        </Button>
        <Button
          color="primary"
          variant="contained"
          aria-label={t('button.addLabel')}
          onClick={onSubmit}
          type="submit"
          value="submit"
          disabled={submitButtonDisabled}
        >
          {t('general/form:commonLabels.add')}
        </Button>
      </FormButtonPanel>
    </PageBase>
  )
})

export default AddAzureConnection
