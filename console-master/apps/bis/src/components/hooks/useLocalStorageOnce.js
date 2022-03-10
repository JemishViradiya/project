import { useMemo } from 'react'

const noop = obj => obj

export default (key, def = undefined, transform = noop) =>
  useMemo(() => {
    const value = localStorage.getItem(key)
    transform(value ? JSON.parse(value) : def)
  }, [key, def, transform])
