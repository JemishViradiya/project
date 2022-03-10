import versions from '../../versions.json'
import API from './API'

const version = versions['tenant-users']

class TenantUserAPI extends API {
  static getTenantUserById(tenantUserId, tenantId) {
    return super.get(`/tenant-users/tenants/${tenantId}/users/${tenantUserId}`, null, version)
  }

  static createTenantUser(model, id) {
    return super.post(`/tenant-users/tenants/${id}/users`, model, version)
  }

  static editTenantUser(model, tenantId, tenantUserId) {
    return super.put(`/tenant-users/tenants/${tenantId}/users/${tenantUserId}`, model, version)
  }

  static getGhostLogin(tenantUserId, tenantId) {
    return super.get(`/tenant-users/tenants/${tenantId}/users/${tenantUserId}/ghost-login`, null, version)
  }

  static getGhostLoginByTenantId(tenantId) {
    return super.get(`/tenant-users/tenants/${tenantId}/users/default-ghost-login`)
  }
}

export default TenantUserAPI
