import {
  AppledListColumnsDataKey,
  AppledListColumnsQuery,
  AppledListColumnsUpdateKey,
  AppliedListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = AppledListColumnsDataKey
export const updateKey = AppledListColumnsUpdateKey
export const getAppliedListColumns = AppledListColumnsQuery
export const updateAppliedListColumnsMutation = AppliedListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['displayName', 'primaryEmail']
export const query = getAppliedListColumns.query
