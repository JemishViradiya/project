import type {
  DBSchema,
  IDBPDatabase,
  IDBPIndex,
  IDBPObjectStore,
  IndexNames,
  OpenDBCallbacks,
  StoreKey,
  StoreNames,
  StoreValue,
} from 'idb'

export type IdbFetchPolicy = 'cache-first' | 'cache-only' | 'network-only' | 'no-cache'

export interface CacheDBSchema extends DBSchema {
  meta: {
    value: string
    key: 'scope'
  }
}

export interface CacheOptions<T extends CacheDBSchema> extends Partial<OpenDBCallbacks<T>> {
  name: string
  version: number
  store: Exclude<StoreNames<T>, 'meta'>
  scope: () => string | undefined
  upgrade: OpenDBCallbacks<T>['upgrade']
}

const applyMeta = async (db: IDBPDatabase<CacheDBSchema>, dbScope: string): Promise<void> => {
  // ensure we only operate on a datebase with our scope
  const tx = db.transaction('meta', 'readwrite')
  const existingScope = await tx.store.get('scope')
  if (existingScope && existingScope !== dbScope) {
    await tx.store.clear()
  }
  await tx.store.put(dbScope, 'scope')
  await tx.done
}

export const idbCacheFactory = <T extends CacheDBSchema>({
  name,
  version,
  scope,
  store: storeName,
  upgrade,
  ...options
}: CacheOptions<T>) => {
  let _db: IDBPDatabase<T>
  async function openDB(): Promise<IDBPDatabase<T>> {
    if (_db) return _db

    const dbScope = scope()
    if (!dbScope) {
      throw new Error(`IDB Scope must be defined`)
    }

    const { openDB: idbOpenDB } = await import('idb')
    const dbInstance = await idbOpenDB<T>(name, version, {
      blocking() {
        // Using set timeout so closing isn't immediate.
        setTimeout(() => {
          dbInstance.close()
          if (_db === dbInstance) {
            _db = undefined
          }
        }, 0)
      },
      upgrade: async (db, oldVersion, newVersion, tx) => {
        await upgrade(db, oldVersion, newVersion, tx)

        // typescript does not like T extends CacheDBSchema implicitly
        const metaDb = (db as unknown) as IDBPDatabase<CacheDBSchema>
        if ([...metaDb.objectStoreNames].indexOf('meta') === -1) {
          metaDb.createObjectStore('meta')
        }
      },
      ...options,
    })

    // typescript does not like T extends CacheDBSchema implicitl
    const metaDb = (dbInstance as unknown) as IDBPDatabase<CacheDBSchema>
    await applyMeta(metaDb, dbScope)

    return (_db = dbInstance)
  }

  return {
    meta: { name, version } as const,
    async db() {
      return openDB()
    },
    async read(id: IDBKeyRange | StoreKey<T, typeof storeName>): Promise<StoreValue<T, typeof storeName> | undefined> {
      const db = await openDB()
      return db.get(storeName, id)
    },
    async index(
      indexName: IndexNames<T, typeof storeName>,
      id: IDBKeyRange | StoreKey<T, typeof storeName>,
    ): Promise<StoreValue<T, typeof storeName> | undefined> {
      const db = await openDB()
      return db.getFromIndex<typeof storeName, IndexNames<T, typeof storeName>>(storeName, indexName, id as IDBKeyRange)
    },
    async readMany(...ids: (IDBKeyRange | StoreKey<T, typeof storeName>)[]): Promise<StoreValue<T, typeof storeName>[]> {
      const db = await openDB()
      const { store, done } = db.transaction(storeName, 'readwrite')

      const tasks = Promise.all(ids.map(id => store.get(id)))
      const [results] = await Promise.all([tasks, done])
      return results
    },
    async indexMany(
      indexName: IndexNames<T, typeof storeName>,
      query = null,
      limit = 100,
      ...ids: (IDBKeyRange | StoreKey<T, typeof storeName>)[]
    ): Promise<StoreValue<T, typeof storeName>[]> {
      const db = await openDB()
      return await db.getAllFromIndex(storeName, indexName, null, limit)
    },
    async write(...items: StoreValue<T, typeof storeName>[]): Promise<void> {
      const db = await openDB()
      const { store, done } = db.transaction(storeName, 'readwrite')

      const tasks = Promise.all(items.map(item => store.put(item)))
      await Promise.all([tasks, done])
      console.log(`idbCache.${name}: wrote ${items.length} items`)
    },
    async query(
      field: keyof StoreValue<T, typeof storeName>,
      {
        query,
        sort,
        sortDirection,
      }: {
        query?: string
        sort?: IndexNames<T, typeof storeName>
        sortDirection?: 'asc' | 'asc'
      },
    ): Promise<Array<StoreValue<T, typeof storeName>>> {
      const search = query && new RegExp(query, 'i')
      const direction = sortDirection?.toLowerCase() === 'asc' ? 'prev' : 'next'

      const db = await openDB()
      let store:
        | IDBPObjectStore<T, typeof storeName[], typeof storeName>
        | IDBPIndex<T, typeof storeName[], typeof storeName> = db.transaction(storeName).store
      if (sort) store = store.index(sort)

      const results: Array<StoreValue<T, typeof storeName>> = []
      for (let cursor = await store.openCursor(null, direction); cursor; cursor = await cursor.continue()) {
        const v = cursor.value
        if (!search || search.test((v[field] as unknown) as string)) {
          results.push(v)
        }
      }
      return results
    },
  } as const
}
