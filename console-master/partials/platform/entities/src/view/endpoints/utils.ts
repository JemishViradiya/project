import { serializeQueryParameter } from '@ues-data/shared'
import { serializeDateRangeForBffGrid } from '@ues-platform/shared'

export const getAgentDisplayName = (endpointData, t) => {
  switch (endpointData.appBundleId) {
    case 'com.blackberry.big':
    case 'com.blackberry.big1':
    case 'com.blackberry.big2':
    case 'com.blackberry.big3':
    case 'com.blackberry.protect':
      return t('endpoint.details.agentBundleId.' + endpointData.appBundleId.replace(/\./g, '_'))
  }
  return endpointData.appBundleId
}

export const getAgentFilterVariants = t => {
  const localizedIds = ['com.blackberry.big', 'com.blackberry.protect']
  return localizedIds.map(id => ({
    value: id,
    label: t('endpoint.details.agentBundleId.' + id.replace(/\./g, '_')),
  }))
}

const QUERY_SEPARATOR = ','

const serializeEnum = (field: string, rawValue = {} as any): string => {
  const { value } = rawValue
  if (!value) return ''
  return `${field}=${value.join(':')}`
}

export const buildDevicesQuery = activeFilters => {
  let query = 'mobile=true,enrollmentStatus=REGISTERED'
  Object.entries(activeFilters).forEach(filter => {
    if (query !== '') query += QUERY_SEPARATOR
    const key = filter[0]
    switch (key) {
      case 'device':
      case 'userDisplayName':
      case 'osVersion':
      case 'agent':
      case 'osSecurityPatch':
      case 'userEmailAddress':
        query += serializeQueryParameter(key, filter[1])
        break
      case 'osPlatform':
      case 'riskLevelStatus':
      case 'emmType':
        query += serializeEnum(key, filter[1])
        break
      case 'enrollmentTime':
        query += serializeDateRangeForBffGrid(key, filter[1])
        break
    }
  })
  return query
}
