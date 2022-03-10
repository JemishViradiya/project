import deferred from 'deferred'
import { useMemo, useRef, useState } from 'react'

import useClientParams from '../components/hooks/useClientParams'

const scriptId = 'load-google-api'

const logger = process.env.NODE_CONFIG_ENV === 'test' ? { log: () => null, error: () => null } : console

const unloadScript = () => {
  delete window.google
  const s = document.getElementById(scriptId)
  if (s && s.parentNode) {
    s.parentNode.removeChild(s)
  }
}

const loadScript = ({ apiKey, apiVersion = 'quarterly' }) => {
  return new Promise((resolve, reject) => {
    const fail = err => {
      unloadScript()
      reject(err)
    }
    unloadScript()

    window.googleMapsApiLoaded = () => {
      delete window.googleMapsApiLoaded
      logger.log('GoogleMaps.loaded', !!window.google, !!(window.google && window.google.maps && window.google.maps.Map))
      window.requestAnimationFrame(() => {
        resolve(Object.assign(window.google, { apiKey }))
      })
    }
    const s = document.createElement('script')
    s.id = scriptId
    s.type = 'text/javascript'
    s.defer = true
    s.src = `https://maps.google.com/maps/api/js?key=${apiKey}&v=${apiVersion}&libraries=places,drawing,geometry,visualization&callback=googleMapsApiLoaded`

    // bad things...
    s.addEventListener('abort', () => fail(new Error('Aborted')))
    s.addEventListener('timeout', () => fail(new Error('Timeout')))
    s.addEventListener('error', e => fail(e))

    const x = document.getElementsByTagName('script')[0]
    x.parentNode.insertBefore(s, x)
  })
}

let loadGoogleAPIDeferred = deferred()

const LoadGoogleApi = (parameters = {}) => {
  const { apiKey } = parameters
  if (!parameters.apiKey) {
    throw new Error('Invalid parameters: no API key')
  }
  logger.log('LoadGoogleApi')
  if (window.google && window.google.apiKey === apiKey) {
    return window.google
  } else if (!loadGoogleAPIDeferred.apiKey) {
    // do nothing
  } else if (apiKey !== loadGoogleAPIDeferred.apiKey) {
    delete window.google
    loadGoogleAPIDeferred = deferred()
    logger.error('Switch tenant not supported for multiple api keys')
  } else {
    return loadGoogleAPIDeferred
  }
  // initial api loading
  loadGoogleAPIDeferred.apiKey = apiKey
  loadScript(parameters)
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

export const GoogleApiPreload = () => {
  const parameters = useClientParams('maps')
  useMemo(() => {
    if (parameters) {
      LoadGoogleApi(parameters)
    }
  }, [parameters])
  return null
}

export const useGoogle = () => {
  const [google, setGoogle] = useState(() =>
    window.google && window.google.maps && window.google.maps.Map ? window.google : undefined,
  )
  const loaded = useRef(google)
  if (!loaded.current) {
    loaded.current = true
    loadGoogleAPIDeferred.promise.then(setGoogle)
  }

  return google
}

export default LoadGoogleApi
