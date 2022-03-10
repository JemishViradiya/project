import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Button } from '@material-ui/core'

import type { Connections, ForbiddenResponse } from '@ues-data/emm'
import { ConnectionApi, ServerAddIntuneSubStatusCode } from '@ues-data/emm'
import { usePrevious, useStatefulReduxMutation } from '@ues-data/shared'
import { useSnackbar } from '@ues/behaviours'

import { createLoginPopup, getErrorMessage, getErrorPayload, getForbiddenResponse } from '../common/Util'

const SubmitButton = memo(
  (props: {
    isValid: () => boolean
    newConns: () => Connections[]
    showSpinner: (show: boolean) => void
    getTenant: () => string
    // eslint-disable-next-line sonarjs/cognitive-complexity
  }): JSX.Element => {
    const { newConns, isValid, showSpinner } = props
    const { t } = useTranslation(['emm/connection'])

    const [addAction, addState] = useStatefulReduxMutation(ConnectionApi.mutationAddConnections, {})
    const prevAddState = usePrevious(addState)
    const { enqueueMessage } = useSnackbar()
    const [redirect, setRedirect] = useState(false)
    const [authConnConfig, setAuthConnConfig] = useState(null)
    const [code, setCode] = useState('')
    const navigate = useNavigate()

    const createConnection = useCallback(
      async authCode => {
        showSpinner(true)
        const newConnections = newConns()
        newConnections[0].configuration['authCode'] = authCode
        addAction({ newConnections })
      },
      [addAction, newConns, showSpinner],
    )

    const processConsentResponse = useCallback(
      consentResponseParams => {
        const urlParams = new URLSearchParams(consentResponseParams)
        if (!urlParams.get('error') && urlParams.get('code').length > 0) {
          setCode(urlParams.get('code'))
          createConnection(urlParams.get('code'))
        } else if (urlParams.get('error')) {
          const error = t('emm.intune.add.error.consentError', {
            error: urlParams.get('error'),
          })
          if (urlParams.get('error_subcode') !== 'cancel') {
            enqueueMessage(error, 'error')
            console.error(urlParams.get('error') + ' - ' + urlParams.get('error_description'))
          } else {
            console.debug(urlParams.get('error') + ' - ' + urlParams.get('error_description'))
          }
        } else {
          enqueueMessage(t('emm.intune.add.error.consentFailed'), 'error')
          console.error('Consent failed')
        }
      },
      [createConnection, enqueueMessage, t],
    )

    const createPopup = useCallback(
      (forbiddenResponse: ForbiddenResponse) => {
        createLoginPopup(forbiddenResponse, t('emm.intune.add.adminConsent'), true)
        window.onstorage = e => {
          if (e.key === 'consentInfo' && window.localStorage.getItem('consentInfo')) {
            processConsentResponse(window.localStorage.getItem('consentInfo'))
          }
        }
      },
      [processConsentResponse, t],
    )

    useEffect(() => {
      if (ConnectionApi.isTaskResolved(addState, prevAddState)) {
        try {
          if (addState.error) {
            const errorPayload = getErrorPayload(addState.error)
            const responses = errorPayload?.data?.responses || []
            if (responses.length > 0 && responses[0]?.body?.subStatusCode === 7002 && authConnConfig) {
              createPopup(authConnConfig)
            } else if (responses.length > 0 && responses[0]?.body?.subStatusCode === 7002 && !authConnConfig) {
              enqueueMessage(t('server.error.intune.add.7002'), 'error')
              return
            } else {
              const forbiddenResponse: ForbiddenResponse = getForbiddenResponse(errorPayload)
              if (forbiddenResponse) {
                setAuthConnConfig(forbiddenResponse)
                createPopup(forbiddenResponse)
              } else {
                const errorStatus = getErrorMessage(errorPayload)
                if (ServerAddIntuneSubStatusCode.includes(errorStatus)) {
                  enqueueMessage(t('server.error.intune.add.' + errorStatus), 'error')
                } else {
                  enqueueMessage(t('server.error.default'), 'error')
                }
                setCode('')
              }
            }
          } else {
            enqueueMessage(t('emm.intune.add.success'), 'success')
            setRedirect(true)
          }
        } catch (e) {
          console.error(e)
          enqueueMessage(t('server.error.default'), 'error')
        } finally {
          showSpinner(false)
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addState, createPopup, enqueueMessage, prevAddState, showSpinner, t])

    useEffect(() => {
      if (redirect) {
        navigate(window.location.hash.substring(1, window.location.hash.indexOf('/add')) + '/intune/appconfig', {
          state: { prevPath: 'AddIntuneConnection' },
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirect])

    const onSubmit = () => {
      if (isValid()) {
        createConnection(code)
      }
    }

    return (
      <Button color="primary" variant="contained" onClick={onSubmit}>
        {t('button.next')}
      </Button>
    )
  },
)

export default SubmitButton
