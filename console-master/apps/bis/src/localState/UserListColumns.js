import {
  UserListColumnsDataKey,
  UserListColumnsQuery,
  UserListColumnsUpdateKey,
  UserListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = UserListColumnsDataKey
export const updateKey = UserListColumnsUpdateKey
export const getUserListColumns = UserListColumnsQuery
export const updateUserListColumnsMutation = UserListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['assessment.behavioralRiskLevel', 'assessment.geozoneRiskLevel', 'info', 'assessment.datetime']
export const query = getUserListColumns.query
