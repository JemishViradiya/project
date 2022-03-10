import { UesSessionApi } from '../../console'
import { UesAxiosClient } from '../../network/axios'
import { MAX_SERVICE_ID } from '../types'

export const TenantApi = {
  getTenantServices: async () => {
    const services = await UesAxiosClient().get(`/platform/v1/tenants/${UesSessionApi.getTenantId()}/services`, {
      params: { offset: 0, max: MAX_SERVICE_ID },
    })
    return mapServices(services?.data)
  },
}

export const mapServices = services => {
  return services?.elements?.map(service => ({
    name: service.serviceId,
    status: service.serviceStatus,
  }))
}
