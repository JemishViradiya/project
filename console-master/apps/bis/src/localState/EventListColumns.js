import {
  EventListColumnsDataKey,
  EventListColumnsQuery,
  EventListColumnsUpdateKey,
  EventListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = EventListColumnsDataKey
export const updateKey = EventListColumnsUpdateKey
export const getEventListColumns = EventListColumnsQuery
export const updateEventListColumnsMutation = EventListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['behavioralRiskLevel', 'riskScore', 'geozoneRiskLevel', 'userInfo', 'datetime']
export const query = getEventListColumns.query
