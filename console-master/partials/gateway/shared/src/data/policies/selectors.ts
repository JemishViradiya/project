//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import type { AccessControlBlockType, NetworkServiceEntityPartial } from '@ues-data/gateway'
import { AccessControlType } from '@ues-data/gateway'
import { ReconciliationEntityType } from '@ues-data/shared-types'

import type { AccessControlListItem, PolicyEditorListItem } from '../../types'
import { WindowsPerAppVpnItemsType } from '../../types'
import { isAndroidEnabled } from '../../utils'
import type { PoliciesState } from './types'
import { ReduxSlice } from './types'

export const getState = (state): PoliciesState => state?.[ReduxSlice]

export const getTasks = createSelector(getState, state => state?.tasks)

export const getPolicy = createSelector(getTasks, tasks => tasks?.policy?.data)

export const getLocalPolicyData = createSelector(getState, state => state?.ui?.localPolicyData)

const makePolicyEditorListItem = (value: string, index: number, name?: string): PolicyEditorListItem => ({
  indexInParentArray: index,
  name: name ?? value,
  value,
})

export const getAccessControlListItems = createSelector(getLocalPolicyData, localPolicyData =>
  Object.values(AccessControlType).reduce<{
    [accessControlType: string]: AccessControlListItem[]
  }>(
    (acc, key) => ({
      ...acc,
      [key]: Object.entries(localPolicyData?.[key] ?? {}).reduce(
        (acc, [type, values]: [AccessControlBlockType, (string | NetworkServiceEntityPartial)[]]) => [
          ...acc,
          ...values?.map((item, index) => {
            const extractedItem = typeof item === 'string' ? { value: item, name: item } : { value: item.id, name: item.name }

            return {
              type,
              parentType: key,
              ...makePolicyEditorListItem(extractedItem.value, index, extractedItem.name),
            }
          }),
        ],
        [],
      ),
    }),
    {},
  ),
)

export const getAndroidAccessControlListItems = createSelector(
  getLocalPolicyData,
  localPolicyData =>
    localPolicyData?.platforms?.Android?.perAppVpn?.appIds?.map((value, index) => makePolicyEditorListItem(value, index)) || [],
)

export const getWindowsControlListItems = createSelector(getLocalPolicyData, localPolicyData =>
  Object.values(WindowsPerAppVpnItemsType).reduce<PolicyEditorListItem[]>(
    (acc, key) => [
      ...acc,
      ...(localPolicyData?.platforms?.Windows?.perAppVpn?.[key] ?? []).map((item, index) => {
        return {
          parentType: key,
          ...makePolicyEditorListItem(item, index),
        }
      }),
    ],
    [],
  ),
)

export const getSplitTunnelingListItems = createSelector(getLocalPolicyData, localPolicyData =>
  localPolicyData?.splitIpRanges?.map((value, index) => makePolicyEditorListItem(value, index)),
)

export const getPolicyTask = createSelector(getTasks, tasks => tasks?.policy)

export const getAddPolicyTask = createSelector(getTasks, tasks => tasks?.addPolicy)

export const getUpdatePolicyTask = createSelector(getTasks, tasks => tasks?.updatePolicy)

export const getDeletePolicyTask = createSelector(getTasks, tasks => tasks?.deletePolicy)

export const getDeletePoliciesTask = createSelector(getTasks, tasks => tasks?.deletePolicies)

export const getHasUnsavedPolicyChanges = createSelector(
  getPolicy,
  getLocalPolicyData,
  (policy, localPolicyData) => !isEqual(localPolicyData, policy),
)

export const getIsPolicyDefinitionValid = entityType => state => {
  const localPolicyData = getLocalPolicyData(state)

  if (
    entityType === ReconciliationEntityType.GatewayApp &&
    isAndroidEnabled(localPolicyData) &&
    !localPolicyData?.platforms?.Android?.perAppVpn?.appIds?.length
  ) {
    return false
  }

  return true
}
