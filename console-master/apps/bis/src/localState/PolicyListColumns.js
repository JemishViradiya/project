import {
  PolicyListColumnsDataKey,
  PolicyListColumnsQuery,
  PolicyListColumnsUpdateKey,
  PolicyListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = PolicyListColumnsDataKey
export const updateKey = PolicyListColumnsUpdateKey
export const getPolicyListColumns = PolicyListColumnsQuery
export const updatePolicyListColumnsMutation = PolicyListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['name', 'rank', 'appliedUsers', 'appliedGroups']
export const query = getPolicyListColumns.query
