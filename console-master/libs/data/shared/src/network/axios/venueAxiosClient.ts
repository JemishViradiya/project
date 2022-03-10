import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { ConsoleApi } from '@ues-data/network'

import { UesSessionApi } from '../../console'
import { serializeParams } from '../../utils/serialize-params'

let singleton: AxiosInstance

export const VenueAxiosClient = (): AxiosInstance => {
  if (singleton) return singleton

  singleton = axios.create({
    paramsSerializer: serializeParams,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: false,
  })
  singleton.interceptors.request.use(config => {
    const accessToken = UesSessionApi.getTokenVenue()
    if (!config.headers?.Authorization) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    config.baseURL = `${ConsoleApi.apiResolver()}${config.baseURL || ''}`
    return config
  })

  return singleton
}
