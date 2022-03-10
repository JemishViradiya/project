import type { IDBPDatabase } from 'idb'

import type { CacheDBSchema } from '@ues-data/shared'
import { idbCacheFactory, UesSessionApi } from '@ues-data/shared'

import type { AggregatedEndpoint } from './types'

interface EndpointsDBv1 extends CacheDBSchema {
  endpoints: {
    value: AggregatedEndpoint
    key: string
    indexes: { 'by-userId': 'userId'; 'by-deviceInfo.deviceId': 'deviceId' }
  }
}

export type EndpointsDB = EndpointsDBv1

export const EndpointsCache = idbCacheFactory<EndpointsDB>({
  name: 'AggregatedEndpoint',
  version: 1,
  store: 'endpoints',
  scope: UesSessionApi.getSessionKey,
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const v1Db = (db as unknown) as IDBPDatabase<EndpointsDBv1>
      const endpointsStore = v1Db.createObjectStore('endpoints', { keyPath: 'endpointId' })
      endpointsStore.createIndex('by-userId', 'userId')
      endpointsStore.createIndex('by-deviceInfo.deviceId', 'deviceId')
    }
  },
})
