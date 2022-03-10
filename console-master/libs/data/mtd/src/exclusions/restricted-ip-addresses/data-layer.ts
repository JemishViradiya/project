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
import { MtdApi, MtdApiRestrictedMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createRestrictedIpAddressStart,
  deleteRestrictedIpAddressesStart,
  editRestrictedIpAddressStart,
  fetchRestrictedIpAddressesStart,
  importRestrictedIpAddressesStart,
} from './actions'
import {
  getCreateRestrictedIpAddressTask,
  getDeleteRestrictedIpAddressesTask,
  getEditRestrictedIpAddressTask,
  getImportRestrictedIpAddressesTask,
  getRestrictedIpAddressesTask,
} from './selectors'
import type { RestrictedIpAddressesState } from './types'
import { ReduxSlice } from './types'

export const queryRestrictedIpAddressesState: ReduxQuery<
  EntitiesPageableResponse<IWebAddress>,
  Parameters<typeof fetchRestrictedIpAddressesStart>[0],
  RestrictedIpAddressesState['tasks']['restrictedIpAddresses']
> = {
  query: payload => fetchRestrictedIpAddressesStart(payload, MtdApi),
  mockQuery: payload => fetchRestrictedIpAddressesStart(payload, apiForMocks()),
  selector: () => getRestrictedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateRestrictedIpAddress: ReduxMutation<
  IWebAddress,
  Parameters<typeof createRestrictedIpAddressStart>[0],
  RestrictedIpAddressesState['tasks']['createRestrictedIpAddress']
> = {
  mutation: payload => createRestrictedIpAddressStart(payload, MtdApi),
  mockMutation: payload => createRestrictedIpAddressStart(payload, apiForMocks()),
  selector: () => getCreateRestrictedIpAddressTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditRestrictedIpAddress: ReduxMutation<
  void,
  Parameters<typeof editRestrictedIpAddressStart>[0],
  RestrictedIpAddressesState['tasks']['editRestrictedIpAddress']
> = {
  mutation: payload => editRestrictedIpAddressStart(payload, MtdApi),
  mockMutation: payload => editRestrictedIpAddressStart(payload, apiForMocks()),
  selector: () => getEditRestrictedIpAddressTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteRestrictedIpAddresses: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteRestrictedIpAddressesStart>[0],
  RestrictedIpAddressesState['tasks']['deleteRestrictedIpAddresses']
> = {
  mutation: payload => deleteRestrictedIpAddressesStart(payload, MtdApi),
  mockMutation: payload => deleteRestrictedIpAddressesStart(payload, apiForMocks()),
  selector: () => getDeleteRestrictedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationImportRestrictedIpAddresses: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importRestrictedIpAddressesStart>[0],
  RestrictedIpAddressesState['tasks']['importRestrictedIpAddresses']
> = {
  mutation: payload => importRestrictedIpAddressesStart(payload, MtdApi),
  mockMutation: payload => importRestrictedIpAddressesStart(payload, apiForMocks()),
  selector: () => getImportRestrictedIpAddressesTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}
const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiRestrictedMock
}
