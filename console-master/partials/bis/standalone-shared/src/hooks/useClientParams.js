import { useContext } from 'react'

import { Context } from '../f11n'

export default name => {
  const ctx = useContext(Context)
  const { loading, value = {} } = ctx
  if (loading) {
    return null
  }
  return name ? value[name] : value
}
