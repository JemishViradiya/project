import { isEqual } from 'lodash-es'

export const idsChanged = (prevIds: string[], newIds: string[]) => newIds.length !== prevIds.length || !isEqual(newIds, prevIds)

export const isCompleted = (current, previous) => {
  return current && !current.loading && previous.loading
}

export enum PolicyInfoTabId {
  Settings = 0,
  UsersAndGroups = 1,
}

export const TAB_ID_QUERY_PARAM_NAME = 'tabId'
