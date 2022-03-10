import { ServiceWorkerError } from '../types'

export const checkServiceWorkerError = (initialError: Error) => {
  if (!globalThis.navigator.serviceWorker) {
    throw new ServiceWorkerError(initialError, 'Service Worker must be enabled')
  } else if (initialError.name === 'SecurityError') {
    // Firefox rejects workboxReady Promise if stored cookies are disabled
    throw new ServiceWorkerError(initialError, 'Stored cookies must be enabled')
  }
}
