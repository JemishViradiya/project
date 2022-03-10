import versions from '../../versions.json'
import API from './API'

const version = versions.tenants

class TenantAPI extends API {
  static getTenants(model) {
    return super.get('/tenants', model, version)
  }

  static getAllTenantsData(model) {
    if (model !== null) {
      return super.get('/tenants', model, version)
    } else {
      return super.get('/tenants', null, version)
    }
  }

  static getPendingShutdownTenantsData(model) {
    if (model !== null) {
      return super.get('/tenants/pending-shutdown', model, version)
    } else {
      return super.get('/tenants/pending-shutdown', null, version)
    }
  }

  static getShutdownListData(model) {
    if (model !== null) {
      return super.get('/tenants/shutdown', model, version)
    } else {
      return super.get('/tenants/shutdown', null, version)
    }
  }

  static approveTenant(id) {
    return super.put(
      '/tenants/tenant-status',
      {
        Id: id,
        TenantStatus: 2,
      },
      version,
    )
  }

  static denyTenant(id) {
    return super.put(
      '/tenants/tenant-status',
      {
        Id: id,
        TenantStatus: 3,
      },
      version,
    )
  }

  static getTenantsDetails(id) {
    return super.get(`/tenants/${id}`, null, version)
  }

  static getLicenseInformation(id) {
    return super.get(`/tenants/${id}/license-info`, null, version)
  }

  static postTenant(model) {
    return super.post('/tenants', model, version)
  }

  static deleteTenant(id) {
    return super.delete(`/tenants/${id}`, version)
  }

  static convertToCustomer(id, dateTime) {
    return super.put(
      `/tenants/${id}/customer`,
      {
        startDate: dateTime,
      },
      version,
    )
  }

  static pendingShutdownTenant(id, dateTime) {
    return super.put(
      `/tenants/${id}/pending-shutdown`,
      {
        shutdownDate: dateTime,
      },
      version,
    )
  }

  static shutdownTenant(id) {
    return super.post(`/billing-jobs/tenants/${id}/shutdown`, {}, version)
  }

  static removeAllShutdownTenants() {
    return super.delete('/billing-jobs/tenants/bulk-shutdown')
  }

  static cancelShutdown(id) {
    return super.put(`/tenants/${id}/cancel-shutdown`, version)
  }

  static deprecatedGetTenantsEula(id) {
    return super.get(`/tenants/${id}/eulas`, null, version)
  }

  static deprecatedPutTenantsDetails(id, model) {
    return super.put(`/tenants/${id}`, model, version)
  }

  static deprecatedGetPendingApprovalTenantsData(model) {
    return super.get('/tenants/pending-approval', model, version)
  }

  static deprecatedDelete(id) {
    return super.put(`/tenants/${id}/shutdown`, version)
  }

  static resetOpsUser(id) {
    return super.put(`/tenants/${id}/missing-ops-user`)
  }
}

export default TenantAPI
