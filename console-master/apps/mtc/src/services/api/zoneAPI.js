import versions from '../../versions.json'
import API from './API'

const version = versions.zones

class ZoneAPI extends API {
  static getZones(model, id) {
    return super.get(`/zones/tenants/${id}/zones`, model, version)
  }
}

export default ZoneAPI
