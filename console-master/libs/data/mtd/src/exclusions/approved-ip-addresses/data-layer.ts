/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse } from '../../types'
import { MtdApi, MtdApiMock } from '../api'
import type { IWebAddress } from '../api/web-addresses/web-addresses-api-types'
import { ExclusionCreatePermissions, ExclusionReadPermissions, ExclusionUpdatePermissions } from '../shared/permissions'
import {
  createApprovedIpAddressStart,
  deleteApprovedIpAddressesStart,
  editApprovedIpAddressStart,
  fetchApprovedIpAddressesStart,
  importApprovedIpAddressesStart,
} from './actions'
import {
  getApprovedIpAddressesTask,
  getCreateApprovedIpAddressTask,
  getDeleteApprovedIpAddressesTask,
  getEditApprovedIpAddressTask,
  getImportApprovedIpAddressesTask,
} from './selectors'
import type { ApprovedIpAddressesState } from './types'
import { ReduxSlice } from './types'

export const queryApprovedIpAddressesState: ReduxQuery<
  EntitiesPageableResponse<IWebAddress>,
  Parameters<typeof fetchApprovedIpAddressesStart>[0],
  ApprovedIpAddressesState['tasks']['approvedIpAddresses']
> = {
  query: payload => fetchApprovedIpAddressesStart(payload, MtdApi),
  mockQuery: payload => fetchApprovedIpAddressesStart(payload, apiForMocks()),
  selector: () => getApprovedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateApprovedIpAddress: ReduxMutation<
  IWebAddress,
  Parameters<typeof createApprovedIpAddressStart>[0],
  ApprovedIpAddressesState['tasks']['createApprovedIpAddress']
> = {
  mutation: payload => createApprovedIpAddressStart(payload, MtdApi),
  mockMutation: payload => createApprovedIpAddressStart(payload, apiForMocks()),
  selector: () => getCreateApprovedIpAddressTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditApprovedIpAddress: ReduxMutation<
  void,
  Parameters<typeof editApprovedIpAddressStart>[0],
  ApprovedIpAddressesState['tasks']['editApprovedIpAddress']
> = {
  mutation: payload => editApprovedIpAddressStart(payload, MtdApi),
  mockMutation: payload => editApprovedIpAddressStart(payload, apiForMocks()),
  selector: () => getEditApprovedIpAddressTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteApprovedIpAddresses: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteApprovedIpAddressesStart>[0],
  ApprovedIpAddressesState['tasks']['deleteApprovedIpAddresses']
> = {
  mutation: payload => deleteApprovedIpAddressesStart(payload, MtdApi),
  mockMutation: payload => deleteApprovedIpAddressesStart(payload, apiForMocks()),
  selector: () => getDeleteApprovedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
}

export const mutationImportApprovedIpAddresses: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importApprovedIpAddressesStart>[0],
  ApprovedIpAddressesState['tasks']['importApprovedIpAddresses']
> = {
  mutation: payload => importApprovedIpAddressesStart(payload, MtdApi),
  mockMutation: payload => importApprovedIpAddressesStart(payload, apiForMocks()),
  selector: () => getImportApprovedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiMock
}
