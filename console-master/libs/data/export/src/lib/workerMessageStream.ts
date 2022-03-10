import type { Data, DownloadApi } from './workerCommon'
import { createSWChannel, DownloadViaIframe } from './workerCommon'

const EXPORT_STATUS = '[export] status'

export async function workerMessageStream({ stream, ...data }: Data, dl: DownloadApi = DownloadViaIframe) {
  const id = data.id
  const port = await createSWChannel({ ...data })

  // eslint-disable-next-line sonarjs/cognitive-complexity
  return new Promise<void>((resolve, reject) => {
    let STATUS = 'pending'
    const reader = stream.getReader()

    const read = async () => {
      try {
        if (STATUS !== 'resume') {
          return STATUS
        }
        for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
          if (STATUS !== 'resume') {
            return STATUS
          }
          port.postMessage(chunk.value)
        }
        STATUS = 'end'
        console.log(EXPORT_STATUS, 'success')
        port.postMessage('end')
        port.close()
        port.onmessage = null
        dl.cleanup(id)
        resolve()
      } catch (error) {
        STATUS = 'end'
        console.log(EXPORT_STATUS, 'abort', error)
        port.postMessage('abort')
        port.close()
        port.onmessage = null
        dl.cleanup(id)
        reject(error)
      }
    }
    port.onmessage = async (event: MessageEvent<{ download?: string; status?: string }>) => {
      const { download, status } = event.data
      if (STATUS === 'end' || STATUS === 'abort') {
        console.warn('[export] status-invalid')
        return
      }

      if (download) {
        console.log(EXPORT_STATUS, 'download', download)
        dl.download(id, download)
      } else if (status) {
        STATUS = status
        console.log(EXPORT_STATUS, status)
        if (status === 'resume') {
          read()
        } else if (status === 'abort' || status === 'end') {
          // browser implementations may be incomplete
          if (status === 'abort') {
            if (stream.locked && reader.releaseLock) {
              try {
                reader.releaseLock()
              } catch (error) {
                console.warn(error.message)
              }
            }
            stream.cancel()
          }
          port.close()
          port.onmessage = null
          dl.cleanup(id)
          resolve()
        }
      }
    }
  })
}
