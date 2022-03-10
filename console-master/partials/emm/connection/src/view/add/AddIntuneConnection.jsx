/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Backdrop, Box, Button, CircularProgress, TextField, Typography } from '@material-ui/core'

import { Permission } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ContentArea, ContentAreaPanel, FormButtonPanel, PageTitlePanel, SecuredContent } from '@ues/behaviours'

import makeStyles from './AddIntuneConnectionStyles.js'
import SubmitButton from './SubmitButton'
// eslint-disable-next-line sonarjs/cognitive-complexity
const AddIntuneConnection = memo(() => {
  const ERROR_TEMPLATE = { isError: false, message: '' }
  const { t } = useTranslation(['emm/connection'])
  const navigate = useNavigate()
  const classes = makeStyles()
  const [buttonPanelDisplayed, setButtonPanelDisplayed] = useState(false)
  const [integrationRadioValue] = useState('MDM')
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    const postMessage = () => {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(window.location.search.toLowerCase(), `${window.location}`)
      }
    }
    postMessage()
  }, [])

  const [connectionDetails, setConnectionDetails] = useState({
    tenantId: '',
    sendRiskLevel: true,
    azureCloud: 'Global',
  })

  const [error, setError] = useState({
    tenantId: ERROR_TEMPLATE,
  })

  const getConnections = () => {
    return [
      {
        type: 'INTUNE',
        enableSetRiskLevel: connectionDetails.sendRiskLevel,
        activationType: integrationRadioValue,
        configuration: {
          azureCloud: connectionDetails.azureCloud,
          aadTenantId: connectionDetails.tenantId,
        },
      },
    ]
  }

  const getTenantId = () => {
    return connectionDetails.tenantId
  }

  const visibleSpinner = show => {
    setShowSpinner(show)
  }

  const isEmpty = value => {
    return typeof value !== 'undefined' && value.length > 0
  }

  function isValid() {
    let validForm = true
    const fields = [
      {
        id: 'tenantId',
        value: connectionDetails.tenantId,
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
        validForm &= valid
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

  const checkAction = () => {
    if (window.location.href.indexOf('?') === -1) {
      return ''
    }
    const queryParams = window.location.href.substring(window.location.href.indexOf('?'))
    if (queryParams.indexOf('code') > -1 || queryParams.indexOf('error') > -1) {
      window.localStorage.setItem('consentInfo', queryParams)
      return window.close()
    }
  }

  return (
    <>
      <div>{checkAction()}</div>
      <Box className={classes.outerContainer}>
        <PageTitlePanel title={t('emm.intune.add.title')} goBack={goBack} helpId={HelpLinks.EmmConnection} />
        <ContentArea>
          <SecuredContent requiredPermissions={new Set([Permission.ECS_MDM_READ, Permission.ECS_MDM_CREATE])}>
            <ContentAreaPanel title={t('emm.intune.add.azureInfoTitle')}>
              <Box display="flex" flexDirection="column">
                <Typography paragraph align="left" variant="body2">
                  {t('emm.intune.add.azureInfoDescription')}
                </Typography>
                <TextField
                  className={classes.inputsContainer}
                  id="tenantId"
                  required
                  label={t('emm.intune.add.tenantId')}
                  fullWidth
                  margin="normal"
                  name="tenant"
                  onChange={handleChange}
                  value={connectionDetails.tenantId}
                  size="small"
                  error={error.tenantId.isError}
                  helperText={error.tenantId.message}
                />
              </Box>
            </ContentAreaPanel>
            <FormButtonPanel show={buttonPanelDisplayed}>
              <Button variant="outlined" onClick={goBack}>
                {t('button.cancel')}
              </Button>
              <SubmitButton isValid={isValid} newConns={getConnections} showSpinner={visibleSpinner} getTenant={getTenantId} />
            </FormButtonPanel>
          </SecuredContent>
        </ContentArea>
        <Backdrop className={classes.backdrop} open={showSpinner}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </>
  )
})

export default AddIntuneConnection
