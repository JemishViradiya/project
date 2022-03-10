import axios from 'axios'

import versions from '../../versions.json'
import API from './API'

const version = versions.auth
export const TOKEN_URL = '/auth/tokens/mtc-console'

class AuthAPI extends API {
  static login(username, password) {
    return super.login(TOKEN_URL, username, password, version)
  }

  static refresh() {
    return super.post(TOKEN_URL, null, version, null)
  }

  static forgotPassword(email) {
    return super.post('/auth/forgot-password', { email }, version, true)
  }

  static setPassword(token, password) {
    return super.put(`/auth/password-tokens/${token}`, { password }, version, true)
  }

  static changePassword(id, password) {
    return super.post(`/auth/users/${id}/password`, password, version)
  }

  static getPermissions() {
    return super.get('/auth/permissions', null, version)
  }

  static getPermissionsEdit(id) {
    return axios.all([super.get('/auth/permissions', null, version), super.get(`/auth/roles/${id}`, null, version)])
  }

  static getUsersData(model) {
    return super.get('/auth/users', model, version)
  }

  static getUserDetailsById(id) {
    return super.get(`/auth/users/${id}`, null, version)
  }

  static getUserProfileById(id) {
    return super.get(`/auth/users/${id}/profile`, null, version)
  }

  static getRoleDetailsById(id) {
    return super.get(`/auth/roles/${id}`, null, version)
  }

  static createUser(model) {
    return super.post('/auth/users', model, version)
  }

  static editUser(model, id) {
    return super.put(`/auth/users/${id}`, model, version)
  }

  static deleteUser(id) {
    return super.delete(`/auth/users/${id}`, version)
  }

  static getRoles(model) {
    return super.get('/auth/roles', model, version)
  }

  static createRole(model) {
    return super.post('/auth/roles', model, version)
  }

  static editRole(model, id) {
    return super.put(`/auth/roles/${id}`, model, version)
  }

  static deleteRole(id) {
    return super.delete(`/auth/roles/${id}`, version)
  }

  static assignTenantToUsers(id, users) {
    return super.put(`/auth/tenants/${id}/users`, users, version)
  }

  static getTenantPartnerUserList(model, id) {
    return super.get(`/auth/tenants/${id}/users`, model, version)
  }

  static validateToken(id) {
    return super.get(`/auth/password-tokens/is-valid/${id}`, null, version, true)
  }

  static resendPasswordEmail(id) {
    return super.post(`/auth/password-tokens/${id}`, null, version)
  }

  static getPartnerUsersByPartnerId(id) {
    return super.get(`/auth/partners/${id}/users`, null, version)
  }
}

export default AuthAPI
