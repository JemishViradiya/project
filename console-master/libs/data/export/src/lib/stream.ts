// eslint-disable-next-line @typescript-eslint/ban-types
export type ExportRecord = object

export type ContentType = 'text/csv' | 'application/x-ndjson'

const DEFAULT_CONTENT_TYPE = 'text/csv'
const DEFAULT_NAME = 'export'

/*** Feature Detection ***/
interface resolveFeatures {
  (): resolveFeatures['cache']
  cache?: {
    saveFilePicker: boolean
    workerMessage: boolean
    workerTransfer: boolean
    blob: boolean
  }
}
export const resolveExportStreamFeatures: resolveFeatures = () => {
  if (resolveExportStreamFeatures.cache) return resolveExportStreamFeatures.cache

  // Apple has an implementation bug https://bugs.webkit.org/show_bug.cgi?id=202142
  const hasWorkerDownload = navigator.vendor.indexOf('Apple') === -1
  const saveFilePicker = !!window['showSaveFilePicker']
  const workerMessage =
    hasWorkerDownload &&
    test('MessageChannel', () => {
      const readable = new Uint8Array(0)
      const mc = new MessageChannel()
      mc.port1.postMessage(readable, [])
      mc.port1.close()
      mc.port2.close()
    })
  const workerTransfer =
    hasWorkerDownload &&
    test('TransferableStream', () => {
      // throw new Error('Implementation incomplete')
      // Transferable stream was first enabled in chrome v73 behind a flag
      const readable = new ReadableStream()
      const mc = new MessageChannel()
      mc.port1.postMessage(readable, [(readable as unknown) as Transferable])
      mc.port1.close()
      mc.port2.close()
    })

  resolveExportStreamFeatures.cache = {
    saveFilePicker,
    workerMessage,
    workerTransfer,
    blob: true,
  }
  return resolveExportStreamFeatures.cache
}

export type PreferredImplementation = keyof resolveFeatures['cache']

const resolveImplementation = (preferredImplementation: PreferredImplementation): Partial<resolveFeatures['cache']> => {
  const features = resolveExportStreamFeatures()
  // saveFilePicker is not enabled by default and only supported via `preferredImplementation`
  for (const f of [preferredImplementation, 'workerMessage', 'workerTransfer', 'blob']) {
    if (f && features[f]) return { [f]: true }
  }
  return {}
}

export interface ExportStreamOptions<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: ReadableStream<T> | AsyncGenerator<T, any>
  fileName?: string
  contentType?: ContentType
  preferredImplementation?: PreferredImplementation
}

export async function exportStream<T extends ExportRecord = Record<string, unknown>>({
  source,
  fileName = DEFAULT_NAME,
  contentType = DEFAULT_CONTENT_TYPE,
  preferredImplementation = 'blob',
}: ExportStreamOptions<T>) {
  const transforms = await import('./transforms')
  const src = 'next' in source ? await transforms.asyncIteratorToStream<T>(source) : source

  const dest =
    contentType !== 'text/csv'
      ? src.pipeThrough(await transforms.transformAnyToNdjson<T>())
      : src.pipeThrough(await transforms.transformJsonToCsv<T>())

  const data = {
    id: Math.random().toString().slice(2),
    fileName: `${fileName}.${contentType.replace(/.*\/(x-)?/, '')}`,
    contentType,
    stream: dest,
  }

  const impl = resolveImplementation(preferredImplementation)
  if (impl.saveFilePicker) {
    console.log('[export] using saveFilePicker implementation')
    const { saveFilePickerStream } = await import('./saveFilePickerStream')
    await saveFilePickerStream(data)
  } else if (impl.workerTransfer) {
    console.log('[export] using workerTransfer implementation')
    const { workerTransferStream } = await import('./workerTransferStream')
    await workerTransferStream(data)
  } else if (impl.workerMessage) {
    console.log('[export] using workerMessage implementation')
    const { workerMessageStream } = await import('./workerMessageStream')
    await workerMessageStream(data)
  } else {
    console.log('[export] using blob implementation')
    const { blobStream } = await import('./blobStream')
    await blobStream(data)
  }
}

/*** Utilities ***/

function test(name: string, fn: () => void): boolean {
  try {
    fn()
    console.info('[caniuse]', name, 'available')
    return true
  } catch (e) {
    console.info('[caniuse]', name, 'unavailable')
    return false
  }
}
