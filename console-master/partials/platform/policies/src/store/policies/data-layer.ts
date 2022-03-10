import type { ActivationProfile } from '@ues-data/platform'
import { PlatformApi, PlatformApiMock } from '@ues-data/platform'
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { NoPermissions } from '@ues-data/shared'

import { createPolicyStart, deleteMultiplePoliciesStart, deletePolicyStart, fetchPolicyStart, updatePolicyStart } from './actions'
import { getCreatePolicyTask, getDeletePolicyTask, getPolicyTask, getUpdatePolicyTask } from './selectors'
import type { PoliciesState } from './types'
import { ReduxSlice } from './types'

export const queryPolicy: ReduxQuery<
  ActivationProfile,
  Parameters<typeof fetchPolicyStart>[0],
  PoliciesState['tasks']['policy']
> = {
  query: payload => fetchPolicyStart(payload, PlatformApi),
  mockQuery: payload => fetchPolicyStart(payload, PlatformApiMock),
  selector: () => getPolicyTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: NoPermissions,
}

export const mutationCreatePolicy: ReduxMutation<
  ActivationProfile,
  Parameters<typeof createPolicyStart>[0],
  PoliciesState['tasks']['createPolicy']
> = {
  mutation: payload => createPolicyStart(payload, PlatformApi),
  mockMutation: payload => createPolicyStart(payload, PlatformApiMock),
  selector: () => getCreatePolicyTask,
  dataProp: 'result',
  slice: ReduxSlice,
}

export const mutationUpdatePolicy: ReduxMutation<
  ActivationProfile,
  Parameters<typeof updatePolicyStart>[0],
  PoliciesState['tasks']['updatePolicy']
> = {
  mutation: payload => updatePolicyStart(payload, PlatformApi),
  mockMutation: payload => updatePolicyStart(payload, PlatformApiMock),
  selector: () => getUpdatePolicyTask,
  slice: ReduxSlice,
}

export const mutationDeletePolicy: ReduxMutation<
  { entityId: string },
  Parameters<typeof deletePolicyStart>[0],
  PoliciesState['tasks']['deletePolicy']
> = {
  mutation: payload => deletePolicyStart(payload, PlatformApi),
  mockMutation: payload => deletePolicyStart(payload, PlatformApiMock),
  selector: () => getDeletePolicyTask,
  slice: ReduxSlice,
}

export const mutationDeleteMultiplePolicies: ReduxMutation<
  { entityIds: string[] },
  Parameters<typeof deleteMultiplePoliciesStart>[0],
  PoliciesState['tasks']['deletePolicy']
> = {
  mutation: payload => deleteMultiplePoliciesStart(payload, PlatformApi),
  mockMutation: payload => deleteMultiplePoliciesStart(payload, PlatformApiMock),
  selector: () => getDeletePolicyTask,
  slice: ReduxSlice,
}
