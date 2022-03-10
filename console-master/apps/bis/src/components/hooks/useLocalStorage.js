import { useCallback } from 'react'

// Keys:
export const LocalStorageKeys = Object.freeze({
  VIEW_USERS: 'viewUsers',
  VIEW_EVENTS: 'viewEvents',
  VIEW_EVENT: 'viewEvent',
  VIEW_GEOZONES: 'viewGeozones',
  MAP_OPTIONS: 'mapOptions',
  NOTIFICATION_IDS: 'notificationIds',
})

const store = {}
export default (key, defaultData) => {
  if (!key || typeof key !== 'string') return
  if (!store[key]) {
    store[key] = localStorage.getItem(key)
  }

  let data
  if (store[key] !== null) {
    try {
      data = JSON.parse(store[key])
    } catch (err) {
      console.warn('Unable to parse stored data: %s, %s, %o', key, store[key], err)
    }
  }
  if (data === undefined) {
    data = defaultData
  }

  const saveData = useCallback(
    value => {
      if (value === undefined) {
        delete store[key]
        localStorage.removeItem(key)
        return
      }
      try {
        store[key] = JSON.stringify(value)
        localStorage.setItem(key, store[key])
      } catch (err) {
        console.warn('Unable to save data: %s, %o, %o', key, value, err)
      }
    },
    [key],
  )
  return [data, saveData]
}
