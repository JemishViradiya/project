interface FileHandle {
  createWritable(): {
    write(chunk: Uint8Array): Promise<void>
    close(): Promise<void>
  }
}
type ShowSaveFilePicker = (opts: {
  suggestedName?: string
  types: Array<{
    description: string
    accept: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}) => FileHandle

export const hasSaveFilePickerStream = !!window['showSaveFilePicker']

export async function saveFilePickerStream({ stream, fileName }: { stream: ReadableStream<Uint8Array>; fileName: string }) {
  const showSaveFilePicker = window['showSaveFilePicker'] as ShowSaveFilePicker

  try {
    const fileHandle = await showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'CSV File',
          accept: {
            'text/csv': ['.csv', '.txt'],
          },
        },
        {
          description: 'NDJSON File',
          accept: {
            'application/x-ndjson': ['.ndjson'],
            'text/plain': ['.ndjson'],
          },
        },
      ],
      excludeAcceptAllOption: true,
    })

    const writableStream = await fileHandle.createWritable()

    const reader = stream.getReader()
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      await writableStream.write(chunk.value)
    }
    await writableStream.close()
    console.log('[export] status', 'end')
  } catch (error) {
    console.log('[export] status', 'abort', error)
  }
}
