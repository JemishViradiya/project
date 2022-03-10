import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import { MtdPolicyMock } from '../mocks'
import { ReadPolicyPermissions } from '../network'
import {
  CreatePolicy,
  DeletePolicy,
  FindPolicy,
  PolicyCreateSuccess,
  PolicyDeleteSuccess,
  PolicySuccess,
  PolicyUpdateSuccess,
  SetPolicy,
  UpdatePolicy,
} from './actions/Policy'
import { selectPolicy } from './selectors'

export const queryMtdPolicy: ReduxQuery<Record<string, any>, string> = {
  query: FindPolicy,
  mockQuery: id => PolicySuccess({ id, ...MtdPolicyMock }),
  dataProp: null,
  selector: () => selectPolicy,
  permissions: ReadPolicyPermissions,
}

const emptyState = {}
const emptySelector = () => emptyState
export const mutateDraftMtdPolicy: ReduxMutation<Record<string, any>, Record<string, any>> = {
  mutation: SetPolicy,
  mockMutation: SetPolicy,
  selector: () => emptySelector,
}

const updateMockMutation = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
    ? ({ payload, setSubmitting }) => UpdatePolicy(payload, setSubmitting)
    : ({ payload: policy, setSubmitting }) => PolicyUpdateSuccess({ policy, setSubmitting })
}

export const mutateMtdPolicy: ReduxMutation<Record<string, any>, Record<string, any>> = {
  mutation: ({ payload, setSubmitting }) => UpdatePolicy(payload, setSubmitting),
  mockMutation: updateMockMutation(),
  selector: () => emptySelector,
}

const createMockMutation = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode)
    ? ({ payload, setSubmitting }) => CreatePolicy(payload, setSubmitting)
    : ({ payload: policy, setSubmitting }) => PolicyCreateSuccess({ policy, setSubmitting })
}

export const mutateCreateMtdPolicy: ReduxMutation<Record<string, any>, Record<string, any>> = {
  mutation: ({ payload, setSubmitting }) => CreatePolicy(payload, setSubmitting),
  mockMutation: createMockMutation(),
  selector: () => emptySelector,
}

export const deleteMtdPolicy: ReduxMutation<Record<string, any>, string> = {
  mutation: DeletePolicy,
  mockMutation: FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? DeletePolicy : PolicyDeleteSuccess,
  selector: () => emptySelector,
}
