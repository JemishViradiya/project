import type { Data, DownloadApi } from './workerCommon'
import { createSWChannel, DownloadViaIframe } from './workerCommon'

export async function workerTransferStream({ stream, ...data }: Data, dl: DownloadApi = DownloadViaIframe) {
  const id = data.id
  const port = await createSWChannel({ stream: true, ...data })

  return new Promise<void>((resolve, reject) => {
    port.onmessage = (event: MessageEvent<{ download?: string; status?: string }>) => {
      const { download, status } = event.data
      if (download) {
        console.log('[export] status', 'download', download)
        port.postMessage({ stream }, [(stream as unknown) as Transferable])
        dl.download(id, download)
      } else if (status) {
        console.log('[export] status', status)
        if (status === 'end' || status === 'abort') {
          port.close()
          port.onmessage = null
          dl.cleanup(id)

          port.close()
          if (status === 'end') {
            resolve()
          } else {
            reject(new Error('Aborted'))
          }
        }
      } else {
        console.warn(event)
      }
    }
  })
}
