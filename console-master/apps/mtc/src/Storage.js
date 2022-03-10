import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

import history from './configureHistory'
import { ERROR } from './constants/Error'
import AuthAPI from './services/api/authAPI'
import ErrorService from './services/errors'

class Storage {
  static checkPermission(permission) {
    const token = Cookies.get('access_token')
    if (token === null) {
      return false
    }
    const { per } = jwtDecode(token)
    return per.indexOf(permission) !== -1
  }

  static checkBearerTokenNotExpired() {
    const token = Cookies.get('access_token')
    if (token === null || token === undefined) {
      return false
    }
    const { exp } = jwtDecode(token)
    if (exp !== null && exp !== 'undefined') {
      const currentTime = moment()
      const expirationTime = moment(parseInt(exp, 10) * 1000).subtract(6, 'seconds')
      if (!currentTime.isAfter(expirationTime) && !currentTime.isSame(expirationTime)) {
        return true
      }
    }
    return false
  }

  static getUserId() {
    const token = Cookies.get('access_token')
    if (token === null) {
      return false
    }
    const { uid } = jwtDecode(token)
    return uid
  }

  static storeBearerToken(response) {
    const decoded = jwtDecode(response.data)
    if (typeof decoded.exp === 'undefined') {
      throw new Error('Missing expected properties in JWT Token')
    } else if (window.location.href.includes('https')) {
      Cookies.set('access_token', response.data, { sameSite: 'strict', secure: true })
    } else if (window.location.href.includes('localhost')) {
      Cookies.set('access_token', response.data, { sameSite: 'strict' })
    }
  }

  static getBearerToken() {
    if (Cookies.get('access_token') !== null) {
      return Cookies.get('access_token')
    }
    return false
  }

  static getDecodedBearerToken() {
    if (Cookies.get('access_token') !== null) {
      return jwtDecode(Cookies.get('access_token'))
    }
    return false
  }

  static getTokenExpiration() {
    const token = Cookies.get('access_token')
    if (token === null) {
      return false
    }
    const { exp } = jwtDecode(token)
    return exp
  }

  static refreshToken(cb) {
    AuthAPI.refresh()
      .then(response => {
        Storage.storeBearerToken(response)
        cb()
      })
      .catch(() => {
        cb(true)
        ErrorService.log(ERROR.REFRESH_TOKEN)
        Storage.deleteToken()
        history.push('/auth/login')
      })
  }

  static deleteCookies() {
    Cookies.remove('logged_in_account')
    Cookies.remove('access_token')
  }

  static deleteToken(redirect = true) {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('login_redirect')
    if (redirect) {
      history.push('/auth/login')
    }
  }

  static setEnvironment(env) {
    localStorage.setItem('environment', env)
  }

  static getEnvironment() {
    return localStorage.getItem('environment')
  }

  static getLoggedInAccount() {
    return Cookies.get('logged_in_account')
  }

  static setLoggedInAccount(name) {
    if (window.location.href.includes('https')) {
      Cookies.set('logged_in_account', `${name}`, { sameSite: 'strict', secure: true })
    } else if (window.location.href.includes('localhost')) {
      Cookies.set('logged_in_account', `${name}`, { sameSite: 'strict' })
    }
  }

  static setRegion(regionCode) {
    localStorage.setItem('region', regionCode)
  }

  static getRegion() {
    const region = localStorage.getItem('region')
    if (region === null) {
      return ''
    } else {
      return region
    }
  }

  static getVpiRegion() {
    let region = this.getRegion()
    region = region ? region.toLowerCase() : region
    switch (region) {
      case 'eu':
        return 'eu'
      case 'sp':
        return 'sa'
      case 'au':
        return 'au'
      case 'jp':
        return 'jp'
      case 'gc':
        return 'gov'
      case 'us':
      default:
        return 'us'
    }
  }

  static deleteRegion() {
    localStorage.removeItem('region')
  }

  /*
        Methods for storing a user's column selection preference within the Data Grid.
        Unfortunately, present implementations in JS only support string-to-string mappings,
        so we use JSON.stringify() and JSON.parse() below to handle the column arrays.
    */

  static setVisibleColumns(key, columns) {
    const newKey = `${key}-columns-visible`
    localStorage.setItem(newKey, JSON.stringify(columns))
  }

  static getVisibleColumns(key) {
    const newKey = `${key}-columns-visible`
    return JSON.parse(localStorage.getItem(newKey))
  }

  /*
        Methods for locally getting and setting features
    */

  static setFeatures(features) {
    if (typeof features !== 'undefined') {
      localStorage.setItem('features', JSON.stringify(features))
    }
  }

  static getFeatures() {
    const features = localStorage.getItem('features')
    if (features === 'undefined') {
      localStorage.removeItem('features')
      return false
    }
    if (features !== null) {
      return JSON.parse(localStorage.getItem('features'))
    }
    return false
  }

  static deleteFeatures() {
    localStorage.removeItem('features')
  }
}

export default Storage
