/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Backdrop, Box, Button, TextField, Typography } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'

import { ConnectionApi, ServerAddUEMSubStatusCode } from '@ues-data/emm'
import { FeatureName, Permission, usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import {
  ContentArea,
  ContentAreaPanel,
  FormButtonPanel,
  PageTitlePanel,
  SecuredContent,
  useFeatureCheck,
  useSnackbar,
} from '@ues/behaviours'

import { getErrorMessage, getErrorPayload } from '../../common/Util'
import makeStyles from './AddUemConnectionStyle.js'

const ERROR_TEMPLATE = { isError: false, message: '' }

const AddUemConnection = memo(() => {
  useFeatureCheck(isEnabled => isEnabled(FeatureName.UESUEMConnector))
  const { t } = useTranslation(['emm/connection'])
  const navigate = useNavigate()
  const classes = makeStyles()
  const [buttonPanelDisplayed, setButtonPanelDisplayed] = useState(false)
  const { enqueueMessage } = useSnackbar()

  const [error, setError] = useState({
    tenantId: ERROR_TEMPLATE,
    authKey: ERROR_TEMPLATE,
  })

  const [connectionDetails, setConnectionDetails] = useState({
    tenantId: '',
    authKey: '',
    sendRiskLevel: true,
    azureCloud: 'Global',
  })

  const [addAction, addState] = useStatefulReduxMutation(ConnectionApi.mutationAddConnections, {})
  const prevAddState = usePrevious(addState)

  useEffect(() => {
    if (ConnectionApi.isTaskResolved(addState, prevAddState)) {
      if (addState.error) {
        const errorPayload = getErrorPayload(addState.error)
        const errorStatus = getErrorMessage(errorPayload)
        if (ServerAddUEMSubStatusCode.includes(errorStatus)) {
          enqueueMessage(t('server.error.uem.add.' + errorStatus), 'error')
        } else {
          enqueueMessage(t('server.error.default'), 'error')
        }
      } else {
        enqueueMessage(t('emm.uem.success'), 'success')
        goBack()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addState, enqueueMessage, prevAddState, t])

  function addUEMConnection() {
    const newConns = [
      {
        type: 'UEM',
        enableSetRiskLevel: true,
        activationType: 'MDM',
        configuration: {
          azureCloud: 'Global',
          uemTenantId: connectionDetails.tenantId,
          authKey: connectionDetails.authKey,
        },
      },
    ]
    addAction({ newConnections: newConns })
  }

  function onSubmit() {
    if (isValid()) {
      addUEMConnection()
    }
  }

  function isEmpty(value) {
    return typeof value !== 'undefined' && value !== null && value.trim().length > 0
  }

  function isValid() {
    let validForm = true
    const fields = [
      {
        id: 'tenantId',
        value: connectionDetails.tenantId,
        validate: [{ validator: isEmpty, errorKey: 'emm.validation.emptyField' }],
      },
      {
        id: 'authKey',
        value: connectionDetails.authKey,
        validate: [{ validator: isEmpty, errorKey: 'emm.validation.emptyField' }],
      },
    ]

    const validateField = async field => {
      let valid = true

      for (let i = 0; i < field.validate.length && valid; i++) {
        valid = field.validate[i].validator(field.value)

        if (!valid) {
          setError(prevState => ({
            ...prevState,
            [field.id]: {
              isError: true,
              message: t(field.validate[i].errorKey),
            },
          }))
        }
        validForm = validForm && valid
      }
      return validForm
    }

    fields.forEach(validateField)

    return validForm
  }

  const updateButtonPanel = () => {
    if (!buttonPanelDisplayed) {
      setButtonPanelDisplayed(true)
    }
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
    updateButtonPanel()
  }

  const goBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Box className={classes.outerContainer}>
        <PageTitlePanel title={[t('emm.uem.title')]} goBack={goBack} helpId={HelpLinks.EmmConnection} />
        <ContentArea>
          <SecuredContent requiredPermissions={new Set([Permission.ECS_MDM_READ, Permission.ECS_MDM_CREATE])}>
            <ContentAreaPanel title={t('emm.uem.add.tenantTitle')}>
              <Box display="flex" flexDirection="column">
                <Typography paragraph align="left" variant="body2">
                  {t('emm.uem.add.tenantDescription')}
                </Typography>
                <TextField
                  className={classes.inputsContainer}
                  id="tenantId"
                  required
                  label={t('emm.uem.add.srpid')}
                  fullWidth
                  margin="normal"
                  name="tenantId"
                  onChange={handleChange}
                  value={connectionDetails.tenantId}
                  size="small"
                  error={error.tenantId.isError}
                  helperText={error.tenantId.message}
                />
                <TextField
                  className={classes.inputsContainer}
                  id="authKey"
                  required
                  label={t('emm.uem.add.authKey')}
                  fullWidth
                  margin="normal"
                  name="authKey"
                  onChange={handleChange}
                  value={connectionDetails.authKey}
                  size="small"
                  error={error.authKey.isError}
                  helperText={error.authKey.message}
                />
              </Box>
            </ContentAreaPanel>
            <FormButtonPanel show={buttonPanelDisplayed}>
              <Button variant="outlined" onClick={goBack}>
                {t('button.cancel')}
              </Button>
              <Button color="primary" variant="contained" onClick={onSubmit}>
                {t('button.save')}
              </Button>
            </FormButtonPanel>
          </SecuredContent>
        </ContentArea>
      </Box>
      <Backdrop className={classes.backdrop} open={addState.loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
})

export default AddUemConnection
