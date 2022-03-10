import API from './API'

class PartnerAppAPI extends API {
  static getPartnerAppList(model) {
    return super.get('/partner-app', model)
  }

  static createPartnerApp(model) {
    const partnerAppCreateModel = {
      Name: {},
      Permissions: [],
    }
    Object.assign(partnerAppCreateModel, model)
    return super.post('/partner-app', model)
  }

  static deletePartnerApp(id) {
    return super.delete(`/partner-app/${id}`)
  }

  static updatePartnerApp(id, model) {
    const partnerAppCreateModel = {
      Name: {},
      Permissions: [],
    }
    Object.assign(partnerAppCreateModel, model)
    return super.put(`/partner-app/${id}`, model)
  }

  static regenerateCredentials(id) {
    return super.post(`/partner-app/${id}/refresh-secret`)
  }
}

export default PartnerAppAPI
