import React, { useEffect, useState } from 'react'

import useLocalStorage, { LocalStorageKeys } from '../components/hooks/useLocalStorage'
import RiskType from '../components/RiskType'

const defaultOptions = { riskTypes: [RiskType.BEHAVIORAL, RiskType.GEOZONE] }
const Context = React.createContext([{ ...defaultOptions }, () => undefined])
const MapOptionsProvider = ({ children }) => {
  const [localOptions, storeLocalOptions] = useLocalStorage(LocalStorageKeys.MAP_OPTIONS, defaultOptions)
  const [options, setOptions] = useState(localOptions || defaultOptions)

  let mapOptions = options
  if (!mapOptions.riskTypes || mapOptions.riskTypes.length === 0) {
    mapOptions = defaultOptions
  }

  useEffect(() => {
    storeLocalOptions(mapOptions)
  }, [mapOptions, storeLocalOptions])

  const toggleMapOption = option => {
    const i = mapOptions.riskTypes.indexOf(option)
    if (i >= 0) {
      mapOptions.riskTypes.splice(i, 1)
    } else {
      mapOptions.riskTypes.push(option)
    }
    setOptions({ ...mapOptions })
  }

  return <Context.Provider value={[mapOptions, toggleMapOption]}>{children}</Context.Provider>
}

MapOptionsProvider.Context = Context
MapOptionsProvider.Consumer = Context.Consumer
export default MapOptionsProvider
