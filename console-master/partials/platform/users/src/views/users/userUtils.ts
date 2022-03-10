import { serializeQueryParameter } from '@ues-data/shared'
import { serializeDateRangeForBffGrid } from '@ues-platform/shared'
import { OPERATOR_VALUES } from '@ues/behaviours'

export const renderDataSource = ({ dataSource }, t) => {
  return t(`users.add.dataSource.${dataSource?.toLowerCase()}`)
}

export const isCompleted = (current, previous) => {
  return current && !current.loading && previous.loading
}

const QUERY_SEPARATOR = ','

export const getDataSourceItems = t => {
  const dataSourceItems = {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    CUR: t('users.add.dataSource.cur'),
    AZURE: t('users.add.dataSource.azure'),
    LDAP: t('users.add.dataSource.ldap'),
    ACTIVE_DIRECTORY: t('users.add.dataSource.active_directory'),
  }
  return { items: Object.keys(dataSourceItems), itemsLabels: dataSourceItems }
}

export const FILTER_TYPES = {
  ENUM: 'enum' as const,
  SRTING: 'string' as const,
  NUMBER: 'number' as const,
  DATE_RANGE: 'dateRange' as const,
}

const resolveEnum = rawValue => {
  return `=${rawValue.value}`
}

const resolveNumber = rawValue => {
  const { operator, value } = rawValue
  switch (operator) {
    case OPERATOR_VALUES.GREATER_OR_EQUAL:
      return `=GTE:${value}`
    case OPERATOR_VALUES.GREATER:
      return `=GT:${value}`
    case OPERATOR_VALUES.LESS_OR_EQUAL:
      return `=LTE:${value}`
    case OPERATOR_VALUES.LESS:
      return `=LT:${value}`
    case OPERATOR_VALUES.EQUAL:
      return `=EQ:${value}`
    default:
      return null
  }
}

export const buildUsersQuery = activeFilters => {
  let query = 'isAdminOnly=false'
  Object.entries(activeFilters).forEach(filter => {
    if (query !== '') query += QUERY_SEPARATOR
    const key = filter[0]
    switch (key) {
      case 'displayName':
      case 'emailAddress':
        query += serializeQueryParameter(key, filter[1])
        break
      case 'dataSource': {
        query += key + resolveEnum(filter[1])
        break
      }
      case 'devices': {
        query += key + resolveNumber(filter[1])
        break
      }
      case 'expiry': {
        query += serializeDateRangeForBffGrid(key, filter[1])
        break
      }
    }
  })
  return query
}
