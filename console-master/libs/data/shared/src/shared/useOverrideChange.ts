import { useEffect, useState } from 'react'

import { GenericErrorBoundaryEvents } from '../types/error'
import { isLocalOverrideSupported } from './overrideEnvironmentVariable'

const storage = globalThis.localStorage
const thisOrigin = globalThis.origin

/**
 * This exists for trying to serialize the value back to JSON.
 * If it cannot serialize it, then it was a string value given.
 *
 * @param value the value you wish to try to parse
 */
function tryParse(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function writeStorage<TValue>(key: string, value: TValue) {
  try {
    storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`)
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('circular structure')) {
      throw new TypeError(
        'The object that was given to the writeStorage function has circular references.\n' +
          'For more information, check here: ' +
          'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value',
      )
    }
    throw err
  }
}

export interface OverrideMessage<TValue> {
  override: string
  value: TValue
}

if (window.addEventListener) {
  window.addEventListener('message', ({ origin, data }: MessageEvent<OverrideMessage<unknown> | void>) => {
    // listen for postMessage coming from the same origin that has the same key
    //console.log('thisOrigin=' + thisOrigin + ' , event.origin=' + event.origin + ', event.data' + event.data)
    if (origin === thisOrigin && data && data.override) {
      const detailValue = data.value
      writeStorage(data.override, detailValue)

      // force updates to any error boundaries
      window.dispatchEvent(new CustomEvent(GenericErrorBoundaryEvents.Invalidate))
    }
  })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function useOverrideChange<TValue = string>(
  key: string,
  defaultValue: TValue | null = null,
  storage = globalThis.localStorage,
) {
  const [localState, updateLocalState] = useState<TValue | null>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    storage.getItem(key) === null ? defaultValue : tryParse(storage.getItem(key)!),
  )

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      // An event value can be of TValue when `localStorage.setItem` is called, or null when
      // `localStorage.removeItem` is called.
      if (event.key === key) {
        updateLocalState(event.newValue === null ? null : tryParse(event.newValue))

        // force updates to any error boundaries
        window.dispatchEvent(new CustomEvent(GenericErrorBoundaryEvents.Invalidate))
      }
    }
    const msgListener = (event: MessageEvent<OverrideMessage<TValue> | void>) => {
      // listen for postMessage coming from the same origin that has the same key
      //console.log('thisOrigin=' + thisOrigin + ' , event.origin=' + event.origin + ', event.data' + event.data)
      if (event.origin === thisOrigin && event.data && event.data.override === key) {
        const detailValue = event.data.value
        updateLocalState(detailValue)
      }
    }

    // The storage event only works in the context of other documents (eg. other browser tabs)
    if (isLocalOverrideSupported()) {
      window.addEventListener('storage', listener)
      window.addEventListener('message', msgListener)
    }

    // Write default value to the local storage if there currently isn't any value there.
    // Don't however write a defaultValue that is null otherwise it'll trigger infinite updates.
    if (storage.getItem(key) === null && defaultValue !== null) {
      writeStorage(key, defaultValue)
    }

    if (isLocalOverrideSupported()) {
      return () => {
        window.removeEventListener('storage', listener)
        window.removeEventListener('message', msgListener)
      }
    }
  }, [key, defaultValue, storage])

  const state: TValue | null = isLocalOverrideSupported() ? localState ?? defaultValue : defaultValue

  return [state]
}
