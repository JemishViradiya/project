import { useRef, useState } from 'react'

import { useMock } from '@ues-data/shared'

const LOCAL_STORAGE_KEY = 'clientParams'

const load = async (fallback = {}) => {
  try {
    const response = await fetch('/clientParams', { cache: 'reload' })
    const value = (await response.json()) || {}
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
    return value
  } catch (error) {
    console.warn(error)
    return fallback
  }
}

const useLoader = isMock => {
  let initialValue = localStorage.getItem(LOCAL_STORAGE_KEY)
  try {
    initialValue = JSON.parse(initialValue) || {}
  } catch (_) {
    initialValue = undefined
  }
  const pending = isMock ? Promise.resolve({}) : load(initialValue).then(value => (pending.value = value))
  pending.initialValue = initialValue
  return pending
}

let loader
export default param => {
  const isMock = useMock()
  if (!loader) {
    loader = useLoader(isMock)
  }
  const [state, setState] = useState(loader.value || loader.initialValue)
  const ref = useRef()
  if (!ref.current) {
    ref.current = loader
    if (!loader.value) {
      loader.then(value => setState(value))
    }
  }
  return param ? state && state[param] : state
}
