import deferred from 'deferred'
import { useEffect, useState } from 'react'

import { useGoogleMapsApiKey } from './useGoogleMapsApiKey'

const API_URL = 'https://maps.googleapis.com/maps/api/js'
const GOOGLE_MAPS_LIBRARIES = ['places', 'drawing', 'geometry']
const API_LOADED_GLOBAL_CALLBACK_NAME = 'googleMapsApiLoaded'
const scriptId = 'load-google-api'
declare global {
  interface Window {
    google: typeof google & { apiKey?: string }
    [API_LOADED_GLOBAL_CALLBACK_NAME]?: () => void
    gm_authFailure?: () => void
  }
}

const toQueryString = (params: { [x: string]: string }) => {
  const search = Object.entries(params)
    .reduce<string[]>((acc, [key, val]) => [...acc, `${key}=${encodeURIComponent(val)}`], [])
    .join('&')
  return `?${search}`
}

const getApiLoadParams = (apiKey: string) => ({
  callback: API_LOADED_GLOBAL_CALLBACK_NAME,
  key: apiKey,
  libraries: GOOGLE_MAPS_LIBRARIES.join(','),
})
const logger = process.env.NODE_CONFIG_ENV === 'test' ? { log: () => null, error: () => null } : console

const unloadScript = () => {
  delete window.google
  const script = document.getElementById(scriptId)
  if (script?.parentNode) {
    script.parentNode.removeChild(script)
  }
}

const loadScript = apiKey => {
  return new Promise((resolve, reject) => {
    const fail = err => {
      unloadScript()
      reject(err)
    }

    unloadScript()

    window.googleMapsApiLoaded = () => {
      delete window?.googleMapsApiLoaded
      logger.log('GoogleMaps.loaded', !!window.google, !!window.google?.maps?.Map)
      window.requestAnimationFrame(() => {
        resolve(Object.assign(window.google, { apiKey }))
      })
    }
    window.gm_authFailure = () => fail(new Error('google maps auth failure'))

    const scriptElement = Object.assign(document.createElement('script'), {
      id: scriptId,
      async: true,
      defer: true,
      type: 'text/javascript',
      src: `${API_URL}${toQueryString(getApiLoadParams(apiKey))}`,
    })
    scriptElement.addEventListener('abort', () => fail(new Error('Aborted')))
    scriptElement.addEventListener('timeout', () => fail(new Error('Timeout')))
    scriptElement.addEventListener('error', e => fail(e))

    const scriptNode = document.getElementsByTagName('script')[0]
    scriptNode.parentNode.insertBefore(scriptElement, scriptNode)
  })
}

let loadGoogleAPIDeferred = deferred()

const loadGoogleApi = apiKey => {
  if (!apiKey) {
    throw new Error('Invalid parameters: no API key')
  }
  logger.log('loadGoogleApi')

  if (window?.google?.apiKey === apiKey) {
    return window.google
  } else if (!loadGoogleAPIDeferred.apiKey) {
    // do nothing
  } else if (apiKey !== loadGoogleAPIDeferred.apiKey) {
    delete window.google
    // return loadGoogleAPIDeferred
    loadGoogleAPIDeferred = deferred()
  } else {
    return loadGoogleAPIDeferred
  }
  // initial api loading
  loadGoogleAPIDeferred.apiKey = apiKey
  loadScript(apiKey)
    .then(google => {
      logger.log('LoadGoogleApi.loadComplete')
      loadGoogleAPIDeferred.resolve(google)
    })
    .catch(error => {
      logger.log('LoadGoogleApi.loadFailure', error)
      loadGoogleAPIDeferred.reject(error)
    })
  return loadGoogleAPIDeferred
}

export const apiKey = () => loadGoogleAPIDeferred.apiKey

export const hasLoaded = () => loadGoogleAPIDeferred

export const useGoogleMapsApi = () => {
  const [api, setApi] = useState<typeof google | null>(window.google?.maps?.Map ? window.google : null)
  const apiKey = useGoogleMapsApiKey()

  useEffect(() => {
    if (apiKey) {
      loadGoogleApi(apiKey)
      loadGoogleAPIDeferred.promise.then(setApi)
    }
  }, [api, apiKey])

  return api
}

export default loadGoogleApi
