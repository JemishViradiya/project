import type { Workbox } from 'workbox-window'

declare const window: Window & {
  workbox?: Workbox
  workboxReady: Promise<Workbox>
}

export interface Data {
  id: string
  contentType?: string
  // size?: number
  fileName?: string
  stream: ReadableStream<Uint8Array>
}

export const createSWChannel = async (data: Omit<Data, 'stream'> & { stream?: true }) => {
  await (window.workboxReady || null)
  const workbox: Workbox = window.workbox
  if (!workbox) {
    throw new Error('Unable to find a registered service-worker')
  }
  const _sw = await workbox.getSW()
  const sw = navigator.serviceWorker.controller || _sw

  const messageChannel = new MessageChannel()
  sw.postMessage({ type: 'ASYNC_DOWNLOAD', ...data }, [messageChannel.port2])

  return messageChannel.port1
}

export interface DownloadApi {
  download(id: string, url: string, opts?: { fileName?: string }): void
  cleanup(id: string): void
}

export const DownloadViaIframe: DownloadApi = {
  download(id: string, url: string) {
    // TODO: multiple in-flight downloads
    let frame = document.getElementById(id) as HTMLIFrameElement
    if (frame) {
      frame.src = url
    } else {
      frame = document.createElement('iframe')
      frame.style.visibility = 'hidden'
      frame.style.position = 'absolute'
      frame.id = id
      // frame.setAttribute('sandbox', 'allow-downloads allow-same-origin')

      frame.src = url
      document.body.appendChild(frame)
    }
  },
  cleanup(id: string) {
    const frame = document.getElementById(id) as HTMLIFrameElement
    if (frame) {
      document.body.removeChild(frame)
    }
  },
}

export const DownloadViaLink: DownloadApi = {
  download(id: string, url: string, { fileName }) {
    let link = document.getElementById(id) as HTMLAnchorElement
    if (link) {
      URL.revokeObjectURL(link.href)
      if (fileName) link.download = fileName
      link.href = url
    } else {
      link = document.createElement('a')
      link.id = id
      link.style.display = 'none'
      if (fileName) link.download = fileName
      link.href = url
      document.body.appendChild(link)
    }
    link.click()
  },
  cleanup(id: string) {
    const link = document.getElementById(id) as HTMLAnchorElement
    if (link) document.body.removeChild(link)
  },
}
