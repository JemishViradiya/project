import type { Service } from '../types'
import { ServiceId, ServiceStatusType } from '../types'

export const mockServices: Service[] = Object.entries(ServiceId).map(([key]) => ({
  name: ServiceId[key],
  status: ServiceStatusType.Associated,
}))
