// import versions from '../../versions.json'
import faker from 'faker'

import API from './API'

// const version = versions.threats

const categoryOptions = [
  'Admin Tool',
  'Internal Application',
  'Commercial Software',
  'Operating System',
  'Drivers',
  'Security Software',
  'None',
]
class ThreatAPI extends API {
  static getThreats(id, model) {
    return super.get(`/threats/tenants/${id}/threats`, model)
  }

  static quarantineThreats(id, threats) {
    return super.post(`/threats/tenants/${id}/global-lists`, threats)
  }

  static bulkQuarantineThreats(id, threatInfo) {
    return super.put(`/threats/tenants/${id}/global-lists/bulk`, threatInfo)
  }

  static removeThreatsFromQuarantine(id, threats) {
    return super.delete(`/threats/tenants/${id}/global-lists`, threats)
  }

  static bulkRemoveThreatsFromQuarantine(id, threatInfo) {
    return super.delete(`/threats/tenants/${id}/global-lists/bulk`, threatInfo)
  }

  static removeThreatsFromSafelist(id, threats) {
    return super.delete(`/threats/tenants/${id}/global-lists`, threats)
  }

  static bulkRemoveThreatsFromSafelist(id, threatInfo) {
    return super.delete(`/threats/tenants/${id}/global-lists/bulk`, threatInfo)
  }

  static safelistThreats(id, threats) {
    return super.post(`/threats/tenants/${id}/global-lists`, threats)
  }

  static bulkSafelistThreats(id, threatInfo) {
    return super.put(`/threats/tenants/${id}/global-lists/bulk`, threatInfo)
  }

  static globalListBulkAddRequest(id) {
    return super.post(`/threats/tenants/${id}/threats`, threats)
  }

  static createSafelistEntry(n) {
    return [...Array(n)].map(() => {
      return {
        name: faker.system.commonFileName(),
        sha256: faker.random.alphaNumeric(64),
        reason: faker.lorem.sentence(),
        category: faker.random.arrayElement(categoryOptions),
        createdDateTime: faker.date.past(),
      }
    })
  }

  static createQuarantineEntry(n) {
    return [...Array(n)].map(() => {
      return {
        name: faker.system.commonFileName(),
        sha256: faker.random.alphaNumeric(64),
        reason: faker.lorem.sentence(),
        createdDateTime: faker.date.past(),
      }
    })
  }

  static createThreatEntry(n) {
    return [...Array(n)].map(() => {
      return {
        name: faker.system.commonFileName(),
        sha256: faker.random.alphaNumeric(64),
        cylanceScore: faker.random.number(100, -99),
        classification: faker.random.arrayElement(['Ransomware', 'Malware', 'Virus', 'Rootkit']),
        subClassification: faker.random.arrayElement(['A', 'B', 'C', 'D', 'E', 'F']),
        lastFound: faker.date.past(),
      }
    })
  }

  static getSafelist(id, model) {
    // The listTypeId field is used to differentiate between quarantine and safelist.
    const safelistModel = {
      listTypeId: 1,
    }
    Object.assign(safelistModel, model)
    return super.get(`/threats/tenants/${id}/global-lists`, safelistModel)
  }

  static getQuarantineList(id, model) {
    // The listTypeId field is used to differentiate between quarantine and safelist
    const quarantineModel = {
      listTypeId: 0,
    }
    Object.assign(quarantineModel, model)
    return super.get(`/threats/tenants/${id}/global-lists`, quarantineModel)
  }

  static globalListBulkAdd(id, model) {
    const globalListBulkAddRequestModel = {
      AddRequestModels: {},
      TenantIds: {},
    }
    Object.assign(globalListBulkAddRequestModel, model)
    return super.post(`/threats/tenants/${id}/global-lists/bulk`, model)
  }

  static addCustomHash(id, model) {
    return super.post(`/threats/tenants/${id}/global-lists`, model)
  }
}

export default ThreatAPI
