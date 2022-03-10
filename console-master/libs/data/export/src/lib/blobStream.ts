import type { Data, DownloadApi } from './workerCommon'
import { DownloadViaLink } from './workerCommon'

export const hasBlobStream = true

export async function blobStream({ stream, ...data }: Data, dl: DownloadApi = DownloadViaLink) {
  const id = data.id
  const parts = await streamToBuffer(stream)

  return new Promise<void>((resolve, reject) => {
    try {
      const blob = new Blob(parts, { type: data.contentType })
      const url = URL.createObjectURL(blob)
      dl.download(id, url, data)
      setTimeout(() => {
        dl.cleanup(url)
        URL.revokeObjectURL(url)
        resolve()
      }, 500)
    } catch (error) {
      reject(error)
    }
  })
}

async function streamToBuffer(readableStream: ReadableStream<Uint8Array>): Promise<Uint8Array[]> {
  const reader = await readableStream.getReader()
  const parts: Uint8Array[] = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      // console.log('The stream is done.')
      break
    }
    parts.push(value)
    // console.log('Just read a chunk:', val)
  }
  return parts
}
