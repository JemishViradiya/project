// import { setCacheNameDetails, registerQuotaErrorCallback } from 'workbox-core'
import { EXCHANGE_STATE_COMPLETED, EXCHANGE_STATE_REQUEST } from './types/base'
import workbox from './workbox'

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const { setCacheNameDetails, registerQuotaErrorCallback } = workbox.core
const logger = console

const timeoutIn = (timeout: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const exchangeToken = (activeWorker: ServiceWorker): Promise<void> =>
  new Promise(resolve => {
    const handler = msg => {
      if (msg.data?.type === EXCHANGE_STATE_COMPLETED) {
        self.removeEventListener('message', handler)
        resolve()
      }
    }
    self.addEventListener('message', handler)

    activeWorker.postMessage({ type: EXCHANGE_STATE_REQUEST })
  })

setCacheNameDetails({
  prefix: '',
  suffix: self.swConfig.isProduction ? 'prod' : 'dev',
  precache: 'precache',
  runtime: 'runtime',
})

registerQuotaErrorCallback(error => {
  logger.error('QuotaError', error)
})

const install = async (event: ExtendableEvent) => {
  await self.skipWaiting()
  logger.log('Installed: skipped waiting')
  const activeWorker = event.currentTarget?.['registration']?.['active']
  if (activeWorker) {
    await Promise.race([exchangeToken(activeWorker), timeoutIn(1000)]).catch(error => logger.warn('exchange failed', error))
  }
}

const activate = async () => {
  await self.clients.claim()
  logger.log('Activated: clients claimed')
}

self.addEventListener('install', (event: ExtendableEvent) => event.waitUntil(install(event)))

self.addEventListener('activate', (event: ExtendableEvent) => event.waitUntil(activate()))

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
