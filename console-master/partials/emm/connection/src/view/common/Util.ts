/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import * as httpStatus from 'http-status-codes'
import { JSEncrypt } from 'jsencrypt'

import type { ForbiddenResponse, MultiStatusResponse, MultiStatusResult, Result } from '@ues-data/emm'
import { ServerAddConnectionAppConfigSubStatusCode } from '@ues-data/emm'
import { FeatureName } from '@ues-data/shared'

export const getErrorPayload = error => {
  return parseJson(error)
}

const validateForbiddenResponse = (response: ForbiddenResponse) => {
  if (response && response.clientId && response.consentUrl && response.publicKeyInfo && response.publicKeyInfo.key) {
    return response
  } else {
    throw new Error('Insufficient data to login azure user')
  }
}

export const getForbiddenResponse = errorPayload => {
  let forbiddenResponse: ForbiddenResponse
  if (errorPayload['data']['responses']) {
    const multiResponse = errorPayload['data'] as MultiStatusResponse
    if (multiResponse.responses[0]?.error) {
      if (multiResponse.responses[0].error.subStatusCode !== httpStatus.FORBIDDEN) {
        return null
      }
      forbiddenResponse = parseJson(multiResponse.responses[0].error.message)
    } else if (multiResponse.responses[0].status) {
      if (multiResponse.responses[0].status !== httpStatus.FORBIDDEN) {
        return null
      }
      forbiddenResponse = multiResponse.responses[0]['body']
    }
  } else if (errorPayload['data']['results']) {
    const multiResult = errorPayload['data'] as MultiStatusResult
    if (multiResult.results[0].status !== httpStatus.FORBIDDEN) {
      return null
    }
    forbiddenResponse = multiResult.results[0].unConsentedConnectionDetails
  }
  return validateForbiddenResponse(forbiddenResponse)
}

export const getErrorMessage = errorPayload => {
  if (errorPayload['status'] === httpStatus.INTERNAL_SERVER_ERROR) {
    return httpStatus.INTERNAL_SERVER_ERROR
  }

  let errorMsg: unknown
  let status: number
  let subStatusCode: number
  if (errorPayload['data']['responses']) {
    const multiResponse = errorPayload['data'] as MultiStatusResponse
    status = multiResponse.responses[0].status
    errorMsg = multiResponse.responses[0]?.error.message
    subStatusCode = multiResponse.responses[0]?.error.subStatusCode
  } else if (errorPayload['data']['results']) {
    const multiResult = errorPayload['data'] as MultiStatusResult
    status = multiResult.results[0].status
    errorMsg = multiResult.results[0].error.message
    subStatusCode = multiResult.results[0].error.subStatusCode
  }

  console.error('Error - ' + status + ' - ' + errorMsg)
  return subStatusCode
}

export function parseJson(error) {
  try {
    return JSON.parse(error)
  } catch (e) {
    console.error(e)
    return undefined
  }
}

export const encryptMessage = (publicKey, message) => {
  const jsEncrypt = new JSEncrypt(null)
  jsEncrypt.setPublicKey(publicKey)
  return jsEncrypt.encrypt(message)
}

export const prepareConnectorList = (connections, isEnabled) => {
  const connectorList = []
  let foundIntune = false
  let foundUEM = false
  const intuneConnectorEnabled = isEnabled(FeatureName.UESIntuneConnector)
  const uemConnectorEnabled = isEnabled(FeatureName.UESUEMConnector)
  if (connections && connections.length > 0) {
    connections.forEach(connection => {
      if (connection && connection.type && connection.type === 'INTUNE') {
        foundIntune = true
      } else if (connection && connection.type && connection.type === 'UEM') {
        foundUEM = true
      }
    })
  }
  if (!foundIntune && intuneConnectorEnabled) {
    connectorList.push({ type: 'INTUNE', value: 'emm.page.menu.intune', to: 'add/AddIntuneConnection' })
  }
  if (!foundUEM && uemConnectorEnabled) {
    connectorList.push({ type: 'UEM', value: 'emm.page.menu.uem', to: 'add/AddUEMConnection' })
  }
  return connectorList
}

const popupWindowWidth = 500
const popupWindowHeight = 500

export const createLoginPopup = (forbiddenResponse: ForbiddenResponse, target: string, promtForConsent: boolean) => {
  const left = window.screenX + (window.outerWidth - popupWindowWidth) / 2
  const top = window.screenY + (window.outerHeight - popupWindowHeight) / 2.5
  const redirectUrl = encodeURIComponent(forbiddenResponse.redirectUrl)
  let state = 'redirect=' + window.location.toString() + ',nonce=NonceValue,responseType=redirect'
  state = encodeURIComponent(encryptMessage(forbiddenResponse.publicKeyInfo.key, state))
  const url = `${forbiddenResponse.consentUrl}/${forbiddenResponse.connectionConfiguration['aadTenantId']}/oauth2/authorize?response_type=code&client_id=${forbiddenResponse.clientId}&redirect_uri=${redirectUrl}&state=${state}`
  const windowFeatures = `resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no,directories=no,titlebar=no,modal=yes,width=${popupWindowWidth},height=${popupWindowHeight},top=${top},left=${left}`

  window.open(url, target, windowFeatures)
}

export const getAppConfigForbiddenResponse = result => {
  let forbiddenResponse: ForbiddenResponse
  if (
    result.status === httpStatus.FORBIDDEN &&
    result.unConsentedConnectionDetails &&
    result.request['devicePlatform'] === 'ANDROID'
  ) {
    forbiddenResponse = result.unConsentedConnectionDetails
  } else {
    return null
  }
  return validateForbiddenResponse(forbiddenResponse)
}

export const appConfigMultiStatusErrorMessage = (errorPayload, t, enqueueMessage) => {
  if (errorPayload['status'] === httpStatus.INTERNAL_SERVER_ERROR) {
    enqueueMessage(t('server.error.intune.addAppConfig.500'), 'error')
    return null
  }

  let errorMsg: unknown
  let status: number
  let subStatusCode: number
  let results: Result[]
  if (errorPayload['data'] && errorPayload['data']['results']) {
    const appConfigResponse = {
      IOS: {
        value: false,
        success: false,
        message: '',
      },
      ANDROID: {
        value: false,
        success: false,
        message: '',
        forbiddenResponse: null,
      },
    }
    results = errorPayload['data']['results']
    results.forEach(result => {
      status = result.status
      errorMsg = result?.error?.message
      subStatusCode = result?.error?.subStatusCode
      const devicePlatform = result.request['devicePlatform']
      console.error('Error - ' + status + ' - ' + errorMsg)
      const forbiddenResponse: ForbiddenResponse = getAppConfigForbiddenResponse(result)

      if (status === httpStatus.OK) {
        appConfigResponse[devicePlatform].value = true
        appConfigResponse[devicePlatform].success = true
        appConfigResponse[devicePlatform].message = t('emm.appConfig.multiStatusSuccess', { DEVICE_TYPE: devicePlatform })
      } else if (forbiddenResponse && forbiddenResponse !== null) {
        appConfigResponse['ANDROID'].value = true
        appConfigResponse['ANDROID'].forbiddenResponse = forbiddenResponse
      } else if (ServerAddConnectionAppConfigSubStatusCode.includes(subStatusCode)) {
        appConfigResponse[devicePlatform].value = true
        appConfigResponse[devicePlatform].message = t(`server.error.intune.addAppConfig.${subStatusCode}`, {
          platform: devicePlatform.toLowerCase(),
        })
      } else {
        appConfigResponse[devicePlatform].value = true
        appConfigResponse[devicePlatform].message = t('server.error.default')
      }
    })
    return appConfigResponse
  } else if (errorPayload['response']['data']['subStatusCode']) {
    subStatusCode = errorPayload['response']['data']['subStatusCode']
    if (ServerAddConnectionAppConfigSubStatusCode.includes(subStatusCode)) {
      enqueueMessage(t('server.error.intune.addAppConfig.' + subStatusCode), 'error')
    } else {
      enqueueMessage(t('server.error.default'), 'error')
    }
    return null
  }
}
