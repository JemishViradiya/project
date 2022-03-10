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
import { MtdApi, MtdApiApprovedForDomainMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createApprovedDomainStart,
  deleteApprovedDomainStart,
  deleteMultipleApprovedDomainsStart,
  editApprovedDomainStart,
  fetchApprovedDomainsStart,
  importApprovedDomainsStart,
} from './actions'
import {
  getApprovedDomainsTask,
  getCreateApprovedDomainTask,
  getDeleteApprovedDomainTask,
  getDeleteMultipleApprovedDomainsTask,
  getEditApprovedDomainTask,
  getImportApprovedDomainsTask,
} from './selectors'
import type { ApprovedDomainsState } from './types'
import { ReduxSlice } from './types'

export const queryApprovedDomainsState: ReduxQuery<
  EntitiesPageableResponse<IWebAddress>,
  Parameters<typeof fetchApprovedDomainsStart>[0],
  ApprovedDomainsState['tasks']['approvedDomains']
> = {
  query: payload => fetchApprovedDomainsStart(payload, MtdApi),
  mockQuery: payload => fetchApprovedDomainsStart(payload, apiForMocks()),
  selector: () => getApprovedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateApprovedDomain: ReduxMutation<
  IWebAddress,
  Parameters<typeof createApprovedDomainStart>[0],
  ApprovedDomainsState['tasks']['createApprovedDomain']
> = {
  mutation: payload => createApprovedDomainStart(payload, MtdApi),
  mockMutation: payload => createApprovedDomainStart(payload, apiForMocks()),
  selector: () => getCreateApprovedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditApprovedDomain: ReduxMutation<
  void,
  Parameters<typeof editApprovedDomainStart>[0],
  ApprovedDomainsState['tasks']['editApprovedDomain']
> = {
  mutation: payload => editApprovedDomainStart(payload, MtdApi),
  mockMutation: payload => editApprovedDomainStart(payload, apiForMocks()),
  selector: () => getEditApprovedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteApprovedDomain: ReduxMutation<
  void,
  Parameters<typeof deleteApprovedDomainStart>[0],
  ApprovedDomainsState['tasks']['deleteApprovedDomain']
> = {
  mutation: payload => deleteApprovedDomainStart(payload, MtdApi),
  mockMutation: payload => deleteApprovedDomainStart(payload, apiForMocks()),
  selector: () => getDeleteApprovedDomainTask,
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationDeleteMultipleApprovedDomains: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteMultipleApprovedDomainsStart>[0],
  ApprovedDomainsState['tasks']['deleteMultipleApprovedDomains']
> = {
  mutation: payload => deleteMultipleApprovedDomainsStart(payload, MtdApi),
  mockMutation: payload => deleteMultipleApprovedDomainsStart(payload, apiForMocks()),
  selector: () => getDeleteMultipleApprovedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationImportApprovedDomains: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importApprovedDomainsStart>[0],
  ApprovedDomainsState['tasks']['importApprovedDomains']
> = {
  mutation: payload => importApprovedDomainsStart(payload, MtdApi),
  mockMutation: payload => importApprovedDomainsStart(payload, apiForMocks()),
  selector: () => getImportApprovedDomainsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiApprovedForDomainMock
}
