import axios from 'axios'

import { Base64 } from './base64'

const RestClient = (token, region) => {
  if (typeof token !== 'undefined') {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  const baseUrl = `${region}/api`

  return {
    get: (route, params) => {
      return axios
        .get(`${baseUrl}${route}`, { params })
        .then(response => response)
        .catch(error => {
          throw error
        })
    },
    post: (route, body) => {
      return axios
        .post(`${baseUrl}${route}`, body)
        .then(response => response)
        .catch(error => {
          throw error
        })
    },
    put: (route, body, version = '1.0') => {
      const config = {
        headers: {
          version,
        },
      }
      return axios
        .put(`${baseUrl}${route}`, body, config)
        .then(response => response)
        .catch(error => {
          throw error
        })
    },
    delete: (route, params, data) => {
      return axios
        .delete(`${baseUrl}${route}`, { params, data })
        .then(response => response)
        .catch(error => {
          throw error
        })
    },
    login: (route, email, password) => {
      const authString = `${email}:${password}`
      axios.defaults.headers.common.Authorization = `Basic ${Base64.encode(authString)}`
      return axios
        .post(`${baseUrl}${route}`)
        .then(response => response)
        .catch(error => {
          throw error
        })
    },
  }
}

export default RestClient
