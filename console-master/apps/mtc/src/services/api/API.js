import axios from 'axios'
import { isEmpty } from 'lodash'

import history from '../../configureHistory'
import Storage from '../../Storage'
import { Base64 } from '../../utils/base64'

class API {
  static getBearerToken() {
    const token = Storage.getBearerToken()
    if (token === false) {
      history.push('/auth/login')
    }
    return `Bearer ${token}`
  }

  static getEndpointBase() {
    return `${API.getRegionCode()}/api`
  }

  static getRegionCode() {
    return `${Storage.getRegion().toLowerCase()}`
  }

  static genHeaders(version, auth = true) {
    const headers = {}
    if (version !== null) {
      headers.Version = version
    }
    if (auth) {
      headers.Authorization = API.getBearerToken()
    }
    return headers
  }

  static get(route, params, version, noAuth = false) {
    const payload = {}

    if (!isEmpty(params)) {
      payload.params = params
    }

    if (noAuth) {
      payload.headers = API.genHeaders(version, false)
    } else {
      payload.headers = API.genHeaders(version)
    }

    return axios.get(`${API.getEndpointBase()}${route}`, payload)
  }

  static login(route, username, password, version) {
    const authString = `${username}:${password}`
    const payload = {
      headers: {
        version: version,
        Authorization: `Basic ${Base64.encode(authString)}`,
      },
    }
    return axios.post(`${API.getEndpointBase()}${route}`, {}, payload)
  }

  static post(route, params, version, noAuth = false) {
    const axiosHeader = {}
    if (noAuth) {
      axiosHeader.headers = API.genHeaders(version, false)
    } else {
      axiosHeader.headers = API.genHeaders(version)
    }
    return axios.post(`${API.getEndpointBase()}${route}`, params, axiosHeader)
  }

  static put(route, params, version, noAuth = false) {
    const axiosHeader = {}
    if (noAuth) {
      axiosHeader.headers = API.genHeaders(version, false)
    } else {
      axiosHeader.headers = API.genHeaders(version)
    }
    return axios.put(`${API.getEndpointBase()}${route}`, params, axiosHeader)
  }

  static delete(route, params, version, noAuth = false) {
    const axiosHeader = {}
    if (!isEmpty(params)) {
      axiosHeader.data = params
    }
    if (noAuth) {
      axiosHeader.headers = API.genHeaders(version, false)
    } else {
      axiosHeader.headers = API.genHeaders(version)
    }
    return axios.delete(`${API.getEndpointBase()}${route}`, axiosHeader)
  }

  static getAppInfo() {
    return axios.get(`${API.getEndpointBase()}/auth/app-info`)
  }

  static csv(route, version) {
    const payload = {
      headers: API.genHeaders(version),
      responseType: 'blob',
    }

    return axios.get(`${API.getEndpointBase()}${route}`, payload)
  }
}

export default API
