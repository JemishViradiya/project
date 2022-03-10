import { ConsoleApi } from '@ues-data/network'
import { UesAxiosClient, UesSessionApi } from '@ues-data/shared'

const dashboardBaseUrl = '/Dashboard'
const consoleApiBaseUrl = ConsoleApi.apiResolver()
const deploymentsBaseUrl = `${consoleApiBaseUrl}deployments`
const devicePoliciesBaseUrl = `${consoleApiBaseUrl}/api/policies/v2.0`

const axiosInstance = () => {
  const axiosClientInstance = UesAxiosClient()

  axiosClientInstance.interceptors.request.use(config => {
    const accessToken = UesSessionApi?.getTokenVenue?.()

    if (!config.headers?.Authorization) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  return axiosClientInstance
}

export { axiosInstance, dashboardBaseUrl, deploymentsBaseUrl, devicePoliciesBaseUrl }
