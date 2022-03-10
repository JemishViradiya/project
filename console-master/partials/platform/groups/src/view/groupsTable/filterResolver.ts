import { OPERATOR_VALUES } from '@ues/behaviours'

const resolveBoolean = rawValue => {
  return `=${rawValue.value}`
}

const resolveString = rawValue => {
  const { operator, value } = rawValue
  switch (operator) {
    case OPERATOR_VALUES.CONTAINS:
      return `=*${value}*`
    case OPERATOR_VALUES.STARTS_WITH:
      return `=${value}*`
    case OPERATOR_VALUES.ENDS_WITH:
      return `=*${value}`
    default:
      return null
  }
}

const resolveNumber = rawValue => {
  const { operator, value } = rawValue
  switch (operator) {
    case OPERATOR_VALUES.GREATER_OR_EQUAL:
      return `>=${value}`
    case OPERATOR_VALUES.GREATER:
      return `>${value}`
    case OPERATOR_VALUES.LESS_OR_EQUAL:
      return `<=${value}`
    case OPERATOR_VALUES.LESS:
      return `<${value}`
    case OPERATOR_VALUES.EQUAL:
      return `=${value}`
    default:
      return null
  }
}

export const resolveFilter = (type, value) => {
  switch (type) {
    case 'boolean':
      return resolveBoolean(value)
    case 'string':
      return resolveString(value)
    case 'number':
      return resolveNumber(value)
    default:
      return null
  }
}

const QUERY_SEPARATOR = ','

export const buildGroupQuery = filterProps => {
  let query = ''
  Object.entries(filterProps.activeFilters).forEach(filter => {
    if (query !== '') query += QUERY_SEPARATOR
    const key = filter[0]
    switch (key) {
      case 'name':
        query += key + resolveFilter('string', filter[1])
        break
      case 'userCount':
        query += key + resolveFilter('number', filter[1])
        break
      case 'isOnboardingEnabled':
        query += key + resolveFilter('boolean', filter[1])
        break
      default:
        break
    }
  })
  return query
}
