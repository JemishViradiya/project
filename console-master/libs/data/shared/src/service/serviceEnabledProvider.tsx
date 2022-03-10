import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useMock } from '../lib'
import { initializeServices } from './store/persistence-layer'
import type { ServiceId, ServicesState } from './types'
import { ServiceStatusType } from './types'

export type IsServiceEnabled = (service: ServiceId) => boolean

export type ServiceEnabledProps = {
  isEnabled: IsServiceEnabled
}

export const ServiceEnabledContext = createContext<ServiceEnabledProps>({
  isEnabled: (key: ServiceId) => true,
})

export const useServiceEnabled = () => useContext(ServiceEnabledContext)

const ref: React.MutableRefObject<ServicesState> = {
  current: {
    services: [],
    overrides: [],
    loaded: false,
    initializationPromise: undefined,
  },
}

export const ServiceEnabledProvider: React.FC<{ loadingElement?: React.ReactNode }> = ({ children, loadingElement }) => {
  const [allServices, setServices] = useState(() => ref.current?.services ?? [])
  const mock = useMock()

  useEffect(() => {
    ref.current.initializationPromise = ref.current.initializationPromise ?? initializeServices(ref, setServices, mock)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const servicesProps = useMemo(() => {
    return {
      isEnabled: (key: ServiceId) => {
        // Service is enabled if we are associating or associated, fail closed
        const status = allServices?.find(f => f.name === key)?.status ?? ServiceStatusType.Disassociated

        return status === ServiceStatusType.Associating || status === ServiceStatusType.Associated
      },
    }
  }, [allServices])

  if (!ref.current?.loaded && loadingElement) {
    return <>{loadingElement}</>
  }

  return <ServiceEnabledContext.Provider value={servicesProps}>{children}</ServiceEnabledContext.Provider>
}

export const getCurrentServices = () => ref.current.services
