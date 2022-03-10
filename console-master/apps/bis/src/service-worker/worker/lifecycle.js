// import { setCacheNameDetails, registerQuotaErrorCallback } from 'workbox-core'
import workbox from './workbox'

const { setCacheNameDetails, registerQuotaErrorCallback } = workbox.core
const logger = console

setCacheNameDetails({
  prefix: 'bis-',
  suffix: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  precache: 'precache',
  runtime: 'runtime',
})

registerQuotaErrorCallback(error => {
  logger.error('QuotaError', error)
})

self.addEventListener('install', event =>
  event.waitUntil(
    self.skipWaiting().then(() => {
      logger.log('Installed: skipped waiting')
    }),
    // TODO: catch ?
  ),
)

self.addEventListener('activate', event =>
  event.waitUntil(
    self.clients.claim().then(() => {
      logger.log('Activated: clients claimed')
    }),
    // TODO: catch ?
  ),
)

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
