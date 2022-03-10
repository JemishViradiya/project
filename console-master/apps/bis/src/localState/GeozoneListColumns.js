import {
  GeozoneListColumnsDataKey,
  GeozoneListColumnsQuery,
  GeozoneListColumnsUpdateKey,
  GeozoneListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = GeozoneListColumnsDataKey
export const updateKey = GeozoneListColumnsUpdateKey
export const getGeozoneListColumns = GeozoneListColumnsQuery
export const updateGeozoneListColumnsMutation = GeozoneListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['risk', 'name', 'location']
export const query = getGeozoneListColumns.query
