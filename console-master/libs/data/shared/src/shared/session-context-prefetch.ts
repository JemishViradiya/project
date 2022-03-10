import type { Feature } from '../featurization/store/types'
import { fetchJson } from '../lib/fetch'
import type { TenantServiceEntity } from '../service/types'

export type SessionContext = {
  features: Feature[]
  serviceEnablement: { elements: TenantServiceEntity[] }
}

const prefetchSessionContext = async (): Promise<SessionContext> => {
  await window.workboxReady
  return await fetchJson<SessionContext | { error: string }>('/uc/session-context')
    .then(data => {
      if ('error' in data) throw new Error(data?.error || 'Fetch failed')
      return data
    })
    .catch(err => {
      console.log(`Session context prefetch failed`)
      return new Promise(resolve => resolve(undefined))
    })
}

const contextPrefetchPromise = prefetchSessionContext()

export const tryWithSessionContextPrefetch = async <T>(fetchFieldFn: (c: SessionContext) => T, fallbackFunc: () => Promise<T>) => {
  let fetchedData = await contextPrefetchPromise.then(c => (c ? fetchFieldFn(c) : undefined))
  if (!fetchedData) {
    // If prefetch failed
    fetchedData = await fallbackFunc()
  }
  return fetchedData
}
