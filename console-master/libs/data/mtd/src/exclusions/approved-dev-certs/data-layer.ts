/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import { FeatureName, FeaturizationApi } from '@ues-data/shared'

import type { BulkDeleteResponse, CsvRecordFailure, CsvResult, EntitiesPageableResponse, IDeveloperCertificate } from '../../types'
import { MtdApi, MtdApiMock } from '../api'
import {
  ExclusionCreatePermissions,
  ExclusionDeletePermissions,
  ExclusionReadPermissions,
  ExclusionUpdatePermissions,
} from '../shared/permissions'
import {
  createApprovedDeveloperCertificateStart,
  deleteApprovedDeveloperCertificatesStart,
  editApprovedDeveloperCertificateStart,
  fetchApprovedDeveloperCertificatesStart,
  importApprovedDeveloperCertificatesStart,
} from './actions'
import {
  getApprovedDevCertsTask,
  getCreateApprovedDevCertTask,
  getDeleteApprovedDevCertsTask,
  getEditApprovedDevCertTask,
  getImportApprovedDevCertTask,
} from './selectors'
import type { ApprovedDevCertsState } from './types'
import { ReduxSlice } from './types'

export const queryApprovedDevCerts: ReduxQuery<
  EntitiesPageableResponse<IDeveloperCertificate>,
  Parameters<typeof fetchApprovedDeveloperCertificatesStart>[0],
  ApprovedDevCertsState['tasks']['approvedDevCerts']
> = {
  query: payload => fetchApprovedDeveloperCertificatesStart(payload, MtdApi),
  mockQuery: payload => fetchApprovedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getApprovedDevCertsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionReadPermissions,
}

export const mutationCreateApprovedDevCert: ReduxMutation<
  IDeveloperCertificate,
  Parameters<typeof createApprovedDeveloperCertificateStart>[0],
  ApprovedDevCertsState['tasks']['createApprovedDevCert']
> = {
  mutation: payload => createApprovedDeveloperCertificateStart(payload, MtdApi),
  mockMutation: payload => createApprovedDeveloperCertificateStart(payload, apiForMocks()),
  selector: () => getCreateApprovedDevCertTask,
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

export const mutationEditApprovedDevCert: ReduxMutation<
  void,
  Parameters<typeof editApprovedDeveloperCertificateStart>[0],
  ApprovedDevCertsState['tasks']['editApprovedDevCert']
> = {
  mutation: payload => editApprovedDeveloperCertificateStart(payload, MtdApi),
  mockMutation: payload => editApprovedDeveloperCertificateStart(payload, apiForMocks()),
  selector: () => getEditApprovedDevCertTask,
  slice: ReduxSlice,
  permissions: ExclusionUpdatePermissions,
}

export const mutationDeleteApprovedDevCerts: ReduxMutation<
  BulkDeleteResponse,
  Parameters<typeof deleteApprovedDeveloperCertificatesStart>[0],
  ApprovedDevCertsState['tasks']['deleteApprovedDevCerts']
> = {
  mutation: payload => deleteApprovedDeveloperCertificatesStart(payload, MtdApi),
  mockMutation: payload => deleteApprovedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getDeleteApprovedDevCertsTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionDeletePermissions,
}

export const mutationImportApprovedDevCerts: ReduxMutation<
  CsvResult<CsvRecordFailure>,
  Parameters<typeof importApprovedDeveloperCertificatesStart>[0],
  ApprovedDevCertsState['tasks']['importApprovedDevCerts']
> = {
  mutation: payload => importApprovedDeveloperCertificatesStart(payload, MtdApi),
  mockMutation: payload => importApprovedDeveloperCertificatesStart(payload, apiForMocks()),
  selector: () => getImportApprovedDevCertTask,
  dataProp: 'result',
  slice: ReduxSlice,
  permissions: ExclusionCreatePermissions,
}

const apiForMocks = () => {
  return FeaturizationApi.isFeatureEnabled(FeatureName.MockDataBypassMode) ? MtdApi : MtdApiMock
}
