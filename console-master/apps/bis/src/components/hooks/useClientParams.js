import { useContext } from 'react'

import { f11n } from '@ues-bis/standalone-shared'

export default name => {
  const ctx = useContext(f11n.Context)
  const { loading, value = {} } = ctx
  if (loading) {
    return null
  }
  return name ? value[name] : value
}
