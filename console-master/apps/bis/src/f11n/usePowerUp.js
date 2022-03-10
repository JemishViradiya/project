import { useContext } from 'react'

import { Context } from './Provider'

export default name => {
  const { loading, value: { f11n = {} } = {} } = useContext(Context)
  if (loading) {
    return null
  }
  return name === undefined ? f11n : f11n[name]
}
