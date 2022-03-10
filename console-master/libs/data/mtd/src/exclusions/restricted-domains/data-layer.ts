/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse } from '../../types'
import type { IWebAddress } from '../api'
import { MtdApi, MtdApiRestrictedForDomainMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createRestrictedDomainStart,
  deleteMultipleRestrictedDomainsStart,
  deleteRestrictedDomainStart,
  editRestrictedDomainStart,
  fetchRestrictedDomainsStart,
  importRestrictedDomainsStart,
} from './actions'
import {
  getCreateRestrictedDomainTask,
  getDeleteMultipleRestrictedDomainsTask,
  getDeleteRestrictedDomainTask,
  getEditRestrictedDomainTask,
  getImportRestrictedDomainsTask,
  getRestrictedDomainsTask,
} from './selectors'
import type { RestrictedDomainsState } from './types'
import { ReduxSlice } from './types'

export const queryRestrictedDomainsState: ReduxQuery<
  EntitiesPageableResponse<IWebAddress>,
  Parameters<typeof fetchRestrictedDomainsStart>[0],
  RestrictedDomainsState['tasks']['restrictedDomains']
> = {
  query: payload => fetchRestrictedDomainsStart(payload, MtdApi),
  mockQuery: payload => fetchRestrictedDomainsStart(payload, apiForMocks()),
  selector: () => getRestrictedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateRestrictedDomain: ReduxMutation<
  IWebAddress,
  Parameters<typeof createRestrictedDomainStart>[0],
  RestrictedDomainsState['tasks']['createRestrictedDomain']
> = {
  mutation: payload => createRestrictedDomainStart(payload, MtdApi),
  mockMutation: payload => createRestrictedDomainStart(payload, apiForMocks()),
  selector: () => getCreateRestrictedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditRestrictedDomain: ReduxMutation<
  void,
  Parameters<typeof editRestrictedDomainStart>[0],
  RestrictedDomainsState['tasks']['editRestrictedDomain']
> = {
  mutation: payload => editRestrictedDomainStart(payload, MtdApi),
  mockMutation: payload => editRestrictedDomainStart(payload, apiForMocks()),
  selector: () => getEditRestrictedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteRestrictedDomain: ReduxMutation<
  void,
  Parameters<typeof deleteRestrictedDomainStart>[0],
  RestrictedDomainsState['tasks']['deleteRestrictedDomain']
> = {
  mutation: payload => deleteRestrictedDomainStart(payload, MtdApi),
  mockMutation: payload => deleteRestrictedDomainStart(payload, apiForMocks()),
  selector: () => getDeleteRestrictedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationDeleteMultipleRestrictedDomains: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteMultipleRestrictedDomainsStart>[0],
  RestrictedDomainsState['tasks']['deleteMultipleRestrictedDomains']
> = {
  mutation: payload => deleteMultipleRestrictedDomainsStart(payload, MtdApi),
  mockMutation: payload => deleteMultipleRestrictedDomainsStart(payload, apiForMocks()),
  selector: () => getDeleteMultipleRestrictedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationImportRestrictedDomains: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importRestrictedDomainsStart>[0],
  RestrictedDomainsState['tasks']['importRestrictedDomains']
> = {
  mutation: payload => importRestrictedDomainsStart(payload, MtdApi),
  mockMutation: payload => importRestrictedDomainsStart(payload, apiForMocks()),
  selector: () => getImportRestrictedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiRestrictedForDomainMock
}
