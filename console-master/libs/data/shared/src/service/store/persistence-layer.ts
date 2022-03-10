import { resolveOverrideEnvironmentValue } from '../../shared/overrideEnvironmentVariable'
import { tryWithSessionContextPrefetch } from '../../shared/session-context-prefetch'
import type { ServicesState } from '../types'
import { ServiceId, ServiceStatusType } from '../types'
import { mapServices, TenantApi } from './common'
import { mockServices } from './mock'

const loadServicesOverrides = (state: ServicesState): ServicesState => {
  const overrides = Object.values(ServiceId)
    .map((name: ServiceId) => {
      const { value } = resolveOverrideEnvironmentValue(name)

      return value
        ? { name, status: value === ServiceStatusType.Associated ? ServiceStatusType.Associated : ServiceStatusType.Disassociated }
        : undefined
    })
    .filter(value => value)
  state.overrides = overrides
  return state
}

export const applyOverrides = <T extends ServicesState>(state: T) => {
  if (!state.services) return state
  state?.overrides?.forEach(override => {
    let index = state.services.findIndex(item => item.name === override.name)
    if (index === -1) index = state.services.length
    state.services[index] = { ...override }
  })
  return state
}

export const getDefaultState = () => applyOverrides(loadServicesOverrides({}))

export const initializeServices = async (ref, setState, mock) => {
  let loadedServices
  if (mock) {
    loadedServices = mockServices
  } else {
    loadedServices = await tryWithSessionContextPrefetch(
      context => mapServices(context.serviceEnablement),
      TenantApi.getTenantServices,
    )
  }
  const overridenServices = applyOverrides(loadServicesOverrides({ services: loadedServices }))
  ref.current = { ...ref.current, ...overridenServices, loaded: true }
  setState(overridenServices.services)
}
