import versions from '../../versions.json'
import API from './API'

const version = versions.partners

class PartnerAPI extends API {
  static getPartnersList(model) {
    return super.get('/partners', model, version)
  }

  static getPartnerDetailsById(id) {
    return super.get(`/partners/${id}`, null, version)
  }

  static createPartner(model) {
    return super.post('/partners', model, version)
  }

  static editPartner(model, id) {
    return super.put(`/partners/${id}`, model, version)
  }

  static acceptPartnerEula(id) {
    return super.post(`/partners/${id}/eula`, null, version)
  }

  static getBillingInfo(id) {
    return super.get(`/billing/partners/${id}`, null, version)
  }

  static savePartnerBilling(values, id) {
    return super.put(`/billing/partners/${id}`, values, version)
  }

  static getBillingHistory(id) {
    return super.get(`/billing/partners/${id}/history`, null, version)
  }

  static downloadBillingCSV(partnerId, billingReportId) {
    return super.csv(`/billing/partners/${partnerId}/download/${billingReportId}`, version)
  }
}

export default PartnerAPI
