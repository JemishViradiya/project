import versions from '../../versions.json'
import API from './API'

const version = versions.audit

class AuditAPI extends API {
  static getAudit(model) {
    return super.get('/audit', model, version)
  }
}

export default AuditAPI
