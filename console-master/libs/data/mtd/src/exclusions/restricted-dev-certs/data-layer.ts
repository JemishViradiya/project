/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse, IDeveloperCertificate } from '../../types'
import { MtdApi, MtdApiRestrictedMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createRestrictedDeveloperCertificateStart,
  deleteRestrictedDeveloperCertificatesStart,
  editRestrictedDeveloperCertificateStart,
  fetchRestrictedDeveloperCertificatesStart,
  importRestrictedDeveloperCertificatesStart,
} from './actions'
import {
  getCreateRestrictedDevCertTask,
  getDeleteRestrictedDevCertsTask,
  getEditRestrictedDevCertTask,
  getImportRestrictedDevCertsTask,
  getRestrictedDevCertsTask,
} from './selectors'
import type { RestrictedDevCertsState } from './types'
import { ReduxSlice } from './types'

export const queryRestrictedDevCerts: ReduxQuery<
  EntitiesPageableResponse<IDeveloperCertificate>,
  Parameters<typeof fetchRestrictedDeveloperCertificatesStart>[0],
  RestrictedDevCertsState['tasks']['restrictedDevCerts']
> = {
  query: payload => fetchRestrictedDeveloperCertificatesStart(payload, MtdApi),
  mockQuery: payload => fetchRestrictedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getRestrictedDevCertsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateRestrictedDevCert: ReduxMutation<
  IDeveloperCertificate,
  Parameters<typeof createRestrictedDeveloperCertificateStart>[0],
  RestrictedDevCertsState['tasks']['createRestrictedDevCert']
> = {
  mutation: payload => createRestrictedDeveloperCertificateStart(payload, MtdApi),
  mockMutation: payload => createRestrictedDeveloperCertificateStart(payload, apiForMocks()),
  selector: () => getCreateRestrictedDevCertTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditRestrictedDevCert: ReduxMutation<
  void,
  Parameters<typeof editRestrictedDeveloperCertificateStart>[0],
  RestrictedDevCertsState['tasks']['editRestrictedDevCert']
> = {
  mutation: payload => editRestrictedDeveloperCertificateStart(payload, MtdApi),
  mockMutation: payload => editRestrictedDeveloperCertificateStart(payload, apiForMocks()),
  selector: () => getEditRestrictedDevCertTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteRestrictedDevCerts: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteRestrictedDeveloperCertificatesStart>[0],
  RestrictedDevCertsState['tasks']['deleteRestrictedDevCerts']
> = {
  mutation: payload => deleteRestrictedDeveloperCertificatesStart(payload, MtdApi),
  mockMutation: payload => deleteRestrictedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getDeleteRestrictedDevCertsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationImportRestrictedDevCerts: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importRestrictedDeveloperCertificatesStart>[0],
  RestrictedDevCertsState['tasks']['importRestrictedDevCerts']
> = {
  mutation: payload => importRestrictedDeveloperCertificatesStart(payload, MtdApi),
  mockMutation: payload => importRestrictedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getImportRestrictedDevCertsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiRestrictedMock
}
