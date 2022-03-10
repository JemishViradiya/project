import { Workbox } from 'workbox-window'

import type { ExternalPromise } from './externalPromise'
import { externalPromise } from './externalPromise'

declare module 'workbox-window' {
  interface Workbox {
    state?: ServiceWorkerState
  }
}

declare const window: Window & {
  workbox: Workbox
  onworkboxstatechange: (state: ServiceWorkerState) => void
  workboxReady: ExternalPromise<Workbox>
}

window.workboxReady = externalPromise<Workbox>()

export const swPublicPath = (): string => {
  const url = new URL(document.baseURI.replace(/[^/]+[?#].*$/, '').replace(/\/docs\/[^/]+\/$/, '/'))
  const publicPath = url.href.slice(url.origin.length)
  console.log('[ServiceWorker.Client] Scope', publicPath)
  return publicPath
}

const load = async ({ entry, publicPath, externalEvents }) => {
  const stateStyles = [
    'background-color: #0092cc',
    'color: white',
    'border-radius: 3px',
    'padding: 2px 0.5em',
    'float: right',
  ].join(';')
  const stateColor = {
    activated: 'hsl(148, 50%, 40%)',
    controlling: 'hsl(199, 75%, 40%)',
    installing: 'hsl(38, 64%, 50%)',
    installed: 'hsl(52, 64%, 50%)',
    waiting: 'hsla(0, 40%, 50%, 1)',
    uninitialized: 'hsla(0, 0%, 33%, 1)',
  }

  const workbox = (window.workbox = new Workbox(publicPath + entry, {
    scope: publicPath,
  }))
  window.onworkboxstatechange =
    window.onworkboxstatechange ||
    (() => {
      /* fallback shim */
    })

  const handler = async ({ sw = undefined, type, isUpdate = undefined }) => {
    const nextState = type.replace(/^external/, '')
    if (nextState === workbox.state) {
      return
    }
    workbox.state = type.replace(/^external/, '')
    console.log('%c%s %c%s', '', 'ServiceWorker', [stateStyles, `background-color: ${stateColor[type]}`].join(';'), type)
    window.onworkboxstatechange(workbox.state)

    if (type === 'activated' || type === 'externalactivated') {
      if (sw) {
        const origin = window.location.origin
        const scriptUrl = new URL(sw.scriptURL, origin)
        const entryUrl = new URL(entry, origin)
        if (scriptUrl.search === entryUrl.search) {
          if (!(await Promise.race([workbox.controlling, new Promise(resolve => setTimeout(resolve, 15000))]))) {
            window.location.reload()
          }
          Object.assign(window.workboxReady, { loading: false })
          window.workboxReady.resolve(workbox)
          return
        }
      }
      workbox.update().catch(error => {
        console.error('Failed to update service-worker', error)
        window.workboxReady.reject(error)
      })
    }
  }
  workbox.addEventListener('activated', handler)
  workbox.addEventListener('controlling', handler)
  workbox.addEventListener('installed', handler)
  workbox.addEventListener('waiting', handler)

  if (externalEvents) {
    workbox.addEventListener('externalactivated', handler)
    workbox.addEventListener('externalinstalled', handler)
    workbox.addEventListener('externalwaiting', handler)
  }

  const reg = await workbox.register({ immediate: true })
  if (reg.active) {
    handler({ sw: reg.active, type: 'activated' })
  } else if (reg.installing) {
    handler({ sw: reg.installing, type: 'installing' })
  } else if (reg.waiting) {
    handler({ sw: reg.waiting, type: 'waiting' })
  } else {
    handler({ type: 'uninitialized' })
  }
}

const init = async opts => {
  try {
    window.workboxReady.loading = true
    await load(opts)
  } catch (error) {
    Object.assign(window.workboxReady, { error, loading: false })
    console.error(error)
    window.workboxReady.reject(error)
  }
}

/**
 * When making changes to the service-worker api, update the revision below
 * to ensure the latest service-worker is activated
 */
export default init({
  entry: 'sw.js?revision=1107',
  publicPath: swPublicPath(),
  externalEvents: true,
})
