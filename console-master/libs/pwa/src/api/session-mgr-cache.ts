import { openDB } from 'idb'

import type { SessionState } from '../types/session-mgr'
import { NoSessionState } from '../types/session-mgr'

const SESSION_STORAGE = 'session-storage'
const SESSION_STORE_NAME = 'sesion'
const KEY = 'current'

const upgradeCallback = upgradeDb => {
  if (!upgradeDb.objectStoreNames.contains(SESSION_STORE_NAME)) {
    upgradeDb.createObjectStore(SESSION_STORE_NAME)
  }
}

const openStore = async () => {
  return openDB(SESSION_STORAGE, 1, { upgrade: upgradeCallback })
}

export const restoreSessionFromStorage = async (): Promise<SessionState> => {
  const store = await openStore()
  const storedSession = await store.get(SESSION_STORE_NAME, KEY)

  if (!storedSession) return new NoSessionState()
  else {
    return new NoSessionState().clone(storedSession)
  }
}

export const updateStorage = async newState => {
  const store = await openStore()
  await store.put(SESSION_STORE_NAME, newState, KEY)
}

export const clearStorage = async () => {
  const store = await openStore()
  await store.clear(SESSION_STORE_NAME)
}
