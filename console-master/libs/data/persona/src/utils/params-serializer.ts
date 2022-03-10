import { stringify } from 'query-string'

export const paramsSerializer = (params: Record<string, string | string[]>): string =>
  stringify(params, { arrayFormat: 'none', skipNull: true })
