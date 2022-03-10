import versions from '../../versions.json'
import API from './API'

const version = versions.devices

class DeviceAPI extends API {
  static getDevices(model, id) {
    return super.get(`/devices/tenants/${id}/devices`, model, version)
  }
}

export default DeviceAPI
