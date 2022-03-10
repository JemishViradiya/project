/* eslint-disable sonarjs/no-duplicate-string */
import type { IDBPDatabase } from 'idb'

import type { CacheDBSchema } from '@ues-data/shared'
import { idbCacheFactory, UesSessionApi } from '@ues-data/shared'

import type { PlatformUser, UserInfoAggregated } from '../../shared/types'

interface UsersDBv1 extends CacheDBSchema {
  users: {
    value: PlatformUser
    key: string
    indexes: { 'by-displayName': 'displayName'; 'by-emailAddress': 'emailAddress'; 'by-id': 'id' }
  }
}

export type UsersDB = UsersDBv1

export const UsersCache = idbCacheFactory<UsersDB>({
  name: 'PlatformUser',
  version: 1,
  store: 'users',
  scope: UesSessionApi.getSessionKey,
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const v1Db = (db as unknown) as IDBPDatabase<UsersDBv1>
      const usersStore = v1Db.createObjectStore('users', { keyPath: 'ecoId' })
      usersStore.createIndex('by-id', 'id')
      usersStore.createIndex('by-displayName', 'displayName')
      usersStore.createIndex('by-emailAddress', 'emailAddress')
    }
  },
})

interface UsersAggregatedDBv1 extends CacheDBSchema {
  users: {
    value: UserInfoAggregated
    key: string
    indexes: { 'by-displayName': 'displayName'; 'by-emailAddress': 'emailAddress'; 'by-userId': 'userId' }
  }
}

export type UsersAggregatedDB = UsersAggregatedDBv1

export const UsersAggregatedCache = idbCacheFactory<UsersAggregatedDB>({
  name: 'UserInfoAggregated',
  version: 1,
  store: 'users',
  scope: UesSessionApi.getSessionKey,
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const v1Db = (db as unknown) as IDBPDatabase<UsersAggregatedDBv1>
      const usersAggregatedStore = v1Db.createObjectStore('users', { keyPath: 'userId' })
      usersAggregatedStore.createIndex('by-userId', 'userId')
      usersAggregatedStore.createIndex('by-displayName', 'displayName')
      usersAggregatedStore.createIndex('by-emailAddress', 'emailAddress')
    }
  },
})
