import { browserStreamsWithPolyfill } from './browser-streams'

// eslint-disable-next-line @typescript-eslint/ban-types
type TransformRecord = object

const BOM = '\ufeff'

const DefaultQueueingStrategy = undefined // or queue with new CountQueuingStrategy({ highWaterMark: 128 })
const ZeroQueueingStrategy = new CountQueuingStrategy({ highWaterMark: 0 })

export async function iteratorToStream<T extends unknown>(iterator: Generator<T, void>): Promise<ReadableStream<T>> {
  const { ReadableStream } = await browserStreamsWithPolyfill()
  return new ReadableStream<T>(
    {
      pull(controller) {
        const { value, done } = iterator.next()
        if (done) {
          controller.close()
        } else {
          controller.enqueue(value as T)
        }
      },
    },
    ZeroQueueingStrategy,
  )
}
export async function asyncIteratorToStream<T extends unknown>(iterator: AsyncGenerator<T, void>): Promise<ReadableStream<T>> {
  const { ReadableStream } = await browserStreamsWithPolyfill()
  return new ReadableStream<T>(
    {
      async pull(controller) {
        const { value, done } = await iterator.next()

        if (done) {
          controller.close()
        } else {
          controller.enqueue(value as T)
        }
      },
    },
    ZeroQueueingStrategy,
  )
}

const BUF_SIZE = 1024 * 4
const appender = (): [typeof enqueue, typeof flush] => {
  // we need to convert to Uint8Array (binary string)
  const textEncoder = new TextEncoder()
  const buf = {
    idx: 0,
    size: BUF_SIZE,
    data: new Uint8Array(BUF_SIZE),
  }

  const enqueue = (controller: TransformStreamDefaultController<Uint8Array>, str: string) => {
    if (BUF_SIZE < 100) {
      return controller.enqueue(textEncoder.encode(str))
    }
    const read = () => {
      const result = textEncoder.encodeInto(str, buf.data.subarray(buf.idx))
      buf.idx += result.written
      return result
    }

    for (let enc = read(); enc.read < str.length; enc = read()) {
      controller.enqueue(buf.data)
      buf.data = new Uint8Array(buf.size)
      buf.idx = 0
      str = str.substring(enc.read)
    }
  }
  const flush = (controller: TransformStreamDefaultController<Uint8Array>) => {
    if (BUF_SIZE >= 100) {
      controller.enqueue(buf.data.subarray(0, buf.idx))
    }
  }
  return [enqueue, flush]
}

export async function transformAnyToNdjson<T extends TransformRecord = Record<string, unknown>>({ delimiter = '\n' } = {}): Promise<
  TransformStream<T, Uint8Array>
> {
  const { TransformStream } = await browserStreamsWithPolyfill()
  const [enqueue, flush] = appender()

  const enqueueString = (controller, chunk) => {
    enqueue(controller, chunk)
    enqueue(controller, delimiter)
  }
  return new TransformStream<T, Uint8Array>(
    {
      start(controller) {
        enqueue(controller, BOM)
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async transform(chunk: any, controller) {
        chunk = await chunk
        switch (typeof chunk) {
          case 'object':
            // just say the stream is done I guess
            if (chunk === null) controller.terminate()
            else if (ArrayBuffer.isView(chunk)) controller.enqueue(new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength))
            else if (Array.isArray(chunk) && chunk.every(value => typeof value === 'number'))
              controller.enqueue(new Uint8Array(chunk))
            else if ('function' === typeof chunk.valueOf && chunk.valueOf() !== chunk) enqueueString(controller, chunk.valueOf())
            // hack
            else if ('toJSON' in chunk) this.transform(chunk.toJSON(), controller)
            else enqueueString(controller, JSON.stringify(chunk))
            break
          case 'symbol':
            controller.error('Cannot send a symbol as a chunk part')
            break
          case 'undefined':
            controller.error('Cannot send undefined as a chunk part')
            break
          case 'string':
            enqueueString(controller, chunk)
            break
          default:
            enqueueString(controller, String(chunk))
            break
        }
      },
      flush,
    },
    DefaultQueueingStrategy,
  )
}

export async function transformJsonToCsv<T extends TransformRecord = Record<string, unknown>>(
  opts = {},
): Promise<TransformStream<T, Uint8Array>> {
  const { TransformStream } = await browserStreamsWithPolyfill()
  const { AsyncParser } = await import('json2csv')
  const asyncParser = new AsyncParser(opts, { objectMode: true })
  const [enqueue, flush] = appender()

  return new TransformStream<T, Uint8Array>(
    {
      start(controller) {
        enqueue(controller, BOM)
        asyncParser.processor
          .on('data', (data: string) => {
            enqueue(controller, data)
          })
          .on('end', () => {
            flush(controller)
            controller.terminate()
          })
          .on('error', error => controller.error(error))
      },
      async transform(chunk) {
        asyncParser.input.push(chunk)
      },
      async flush() {
        asyncParser.input.push(null)
        await new Promise((resolve, reject) => {
          asyncParser.processor.once('end', resolve)
          asyncParser.processor.once('error', reject)
        })
      },
    },
    DefaultQueueingStrategy,
  )
}
