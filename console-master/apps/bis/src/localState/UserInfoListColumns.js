import {
  UserInfoListColumnsDataKey,
  UserInfoListColumnsQuery,
  UserInfoListColumnsUpdateKey,
  UserInfoListColumnsUpdateMutation,
} from '@ues-data/bis'

export const dataKey = UserInfoListColumnsDataKey
export const updateKey = UserInfoListColumnsUpdateKey
export const getUserInfoListColumns = UserInfoListColumnsQuery
export const updateUserInfoListColumnsMutation = UserInfoListColumnsUpdateMutation
export const typename = `type_${dataKey}`
export const defaultValue = ['behaviorRiskLevel', 'behaviorRisk', 'geozoneRiskLevel', 'common.time']
export const query = getUserInfoListColumns.query
