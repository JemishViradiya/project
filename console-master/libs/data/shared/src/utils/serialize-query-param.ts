const serializeValue = (value: string | number | boolean, operator = 'equal'): string => {
  switch (operator) {
    case 'contains':
      return `=*${value}*`
    case 'startsWith':
      return `=${value}*`
    case 'endsWith':
      return `=*${value}`
    case 'greaterOrEqual':
      return `>=${value}`
    case 'greater':
      return `>${value}`
    case 'lessOrEqual':
      return `<=${value}`
    case 'less':
      return `<${value}`
    case 'equal':
      return `=${value}`
    default:
      return ''
  }
}

export const serializeQueryParameter = (field: string, rawValue = {} as any): string => {
  const { value, operator } = rawValue
  if (!value) return ''
  return `${field}${serializeValue(value, operator)}`
}
