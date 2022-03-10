import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { shallowEqualObjects } from 'shallow-equal'

import { F11n, transport } from './api'

const LOAD = Symbol('load')

let fetchOnce
const getF11n = (loader, setValue) => {
  const load = loader()
  if (fetchOnce && !fetchOnce.loading && load === fetchOnce[LOAD]) {
    return fetchOnce
  }
  if (!(load instanceof Promise)) {
    fetchOnce = { value: load, [LOAD]: load }
    return fetchOnce
  }
  fetchOnce = { loading: !load.initialValue, value: load.initialValue, [LOAD]: load }
  load.then(value => {
    if (fetchOnce.loading || !shallowEqualObjects(fetchOnce.value, value)) {
      fetchOnce = { value: value || {}, [LOAD]: load }
      setValue(fetchOnce)
    }
  })
  return fetchOnce
}

export const Context = React.createContext({ value: {} })

const Provider = ({ children, loader = transport.json }) => {
  const [value, setValue] = useState(getF11n(loader, value => setValue(value)))
  useMemo(() => F11n.set(value), [value])
  return <Context.Provider value={value}>{children}</Context.Provider>
}
Provider.displayName = 'ReactF11n.Provider'
Provider.propTypes = {
  loader: PropTypes.func,
  children: PropTypes.node,
}

export default Provider
