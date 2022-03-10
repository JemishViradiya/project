import './env'
import './lifecycle'
import './cdn'
import './api'
import './navigation'
import './assets'

import { catchHandler } from './fallback'
import workbox from './workbox'

workbox.routing.setCatchHandler(catchHandler)

console.log('ServiceWorker: initialized')
