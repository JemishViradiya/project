import type { ExternalPromise } from '../client/externalPromise'
import { externalPromise } from '../client/externalPromise'
import workbox from '../workbox'

const { registerRoute } = workbox.routing
const { concatenateToResponse } = workbox.streams
const { publicPath } = self.swConfig

interface Data {
  type: 'ASYNC_DOWNLOAD'
  contentType?: string
  size?: number
  fileName?: string
  stream: ReadableStream<Uint8Array> | true
}
interface Metadata {
  // stream: ReadableStream<Uint8Array> | Promise<ReadableStream<Uint8Array>>
  data: Data
  port: MessagePort
}
// todo: expiry
const Downloads = new Map<string, Metadata>()

// destination.postMessage(ts, { transfer: [ts] })
const handleMessage = (event: MessageEvent<Data>) => {
  const { data, ports } = event
  const downloadUrl = publicPath + '/uc/api/download/' + Math.random()
  const port = ports[0]

  const metadata: Metadata = { data, port }

  Downloads.set(downloadUrl, metadata)
  port.postMessage({ download: downloadUrl })
}

self.addEventListener('message', (event: MessageEvent) => {
  if (event.origin === self.origin && event.data.type === 'ASYNC_DOWNLOAD') {
    try {
      handleMessage(event)
    } catch (error) {
      console.error(error)
    }
  }
})

registerRoute(/\/uc\/api\/download\/.*$/, async context => {
  const { url, event } = context

  const metadata = Downloads.get(url.pathname)
  if (!metadata)
    return new Response(undefined, {
      status: 404,
    })

  Downloads.delete(url.href)
  const { data, port } = metadata
  const stream = data.stream && data.stream !== true ? data.stream : createStream(event, port, data.stream as boolean)

  const accept = data.contentType || 'application/octet-stream' // parseAccept(request.headers.get('accept'), 'application/octet-stream')
  const fileName = encodeURIComponent(data.fileName || `download.${accept.split('/').pop()}`)
    .replace(/['()]/g, escape)
    .replace(/\*/g, '%2A')
  const csp = "default-src 'none'"
  const headers = new Headers({
    'Content-Type': `${accept}; charset=utf-8`,
    // ref: https://datatracker.ietf.org/doc/html/rfc5987
    'Content-Disposition': `attachment; filename*=UTF-8''${fileName}`,
    'Content-Security-Policy': csp,
    'X-Content-Security-Policy': csp,
    'X-WebKit-CSP': csp,
    'X-XSS-Protection': '1; mode=block',
  })

  const { done, response } = concatenateToResponse([Promise.resolve(stream)], headers)
  event.waitUntil(done)
  ;(async () => {
    try {
      await done
    } finally {
      port.postMessage({ status: 'end' })
      port.close()
    }
  })()
  return response
})

// const readQueueStrategy = new CountQueuingStrategy({ highWaterMark: 0 })
const readQueueStrategy = new ByteLengthQueuingStrategy({ highWaterMark: 1024 * 32 })
function createStream(event: FetchEvent, port: MessagePort, transferStream: boolean) {
  // Transferable stream was first enabled in chrome v73 behind a flag
  if (transferStream) {
    return new Promise<ReadableStream>(resolve => {
      port.onmessage = async (event: MessageEvent<{ stream: ReadableStream }>) => {
        port.onmessage = null
        resolve(event.data.stream)
      }
    })
  }
  let status = 'pause'
  const completion = externalPromise<void>()
  // event.waitUntil(completion)

  let idleTimer = 0
  idleTimer = setTimeout(cleanup, 5000, completion)
  const body = new ReadableStream<Uint8Array>(
    {
      start(controller) {
        cancelCleanup()
        idleTimer = setTimeout(cleanup, 5000, completion, controller)
        console.log('[async-download] start')
        // When we receive data on the messageChannel, we write
        port.onmessage = ({ data }) => {
          if (data === 'end') {
            console.log('[async-download] stream ended')
            status = 'closed'
            port.close()
            controller.close()
            return completion.resolve()
          }

          if (data === 'abort') {
            console.log('[async-download] stream aborted')
            controller.error('Aborted the download')
            status = 'closed'
            port.close()
            return completion.reject(new Error('aborted'))
          }

          controller.enqueue(data)
          if (controller.desiredSize <= 0 && status !== 'pause') {
            console.log('[async-download] pause')
            status = 'pause'
            cancelCleanup()
            idleTimer = setTimeout(cleanup, 3000, completion, controller)
            port.postMessage({ status: 'pause' })
          }
        }
      },
      cancel(reason) {
        console.warn('[async-download] cancel for', reason)
        if (status !== 'closed') {
          status = 'closed'
          cancelCleanup()
          port.postMessage({ status: 'abort' })
          port.close()
          completion.reject(new Error('cancelled'))
        }
      },
      pull() {
        if (status === 'pause') {
          status = 'resume'
          console.log('[async-download] resume')
          cancelCleanup()
          port.postMessage({ status: 'resume' })
        }
      },
    },
    readQueueStrategy,
  )
  return body

  // idle-timeout cleanup for browsers with saveAs dialogs, eg: Chromium - and the user clicks cancel
  // browser will not abort the stream, and download may or may not already be complete
  function cleanup(completion: ExternalPromise<void>, controller?: { close: () => void; error: (e?: Error) => void }) {
    console.log('[async-download] user timeout')
    port.postMessage({ status: 'abort' })
    port.close()
    const error = new Error('User timeout')
    if (controller) {
      controller.error(error)
    } else if (!body.locked) {
      body.cancel('user timeout')
    }
    completion.reject(error)
  }

  function cancelCleanup() {
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = 0
    }
  }
}
