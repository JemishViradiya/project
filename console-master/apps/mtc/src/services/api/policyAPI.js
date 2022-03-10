import versions from '../../versions.json'
import API from './API'

const version = versions.policies

class PolicyAPI extends API {
  static getPolicies(model, id) {
    return super.get(`/policies/tenants/${id}/policies`, model, version)
  }
}

export default PolicyAPI
