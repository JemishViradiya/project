/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import type { ReduxMutation, ReduxQuery } from '@ues-data/shared'
import type { PagableResponse } from '@ues-data/shared-types'
import { Permission } from '@ues-data/shared-types'

import type { Certificate } from '../certificate-service'
import { CertificatesApi, CertificatesMockApi } from '../certificate-service'
import { createCertificateStart, deleteCertificateStart, fetchCertificatesStart } from './actions'
import { getCertificatesTask, getCreateCertificateTask, getDeleteCertificateTask } from './selectors'
import type { CertificateState, TaskId } from './types'
import { CertificatesReduxSlice } from './types'

export const queryCertificates: ReduxQuery<
  PagableResponse<Certificate>,
  Parameters<typeof fetchCertificatesStart>[0],
  CertificateState['tasks'][TaskId.Certificates]
> = {
  query: payload => fetchCertificatesStart(payload, CertificatesApi),
  mockQuery: payload => fetchCertificatesStart(payload, CertificatesMockApi),
  selector: () => getCertificatesTask,
  dataProp: 'result',
  slice: CertificatesReduxSlice,
  permissions: new Set([Permission.BIP_SETTINGS_READ]),
}

export const mutationCreateCertificate: ReduxMutation<
  Certificate,
  Parameters<typeof createCertificateStart>[0],
  CertificateState['tasks'][TaskId.CreateCertificate]
> = {
  mutation: payload => createCertificateStart(payload, CertificatesApi),
  mockMutation: payload => createCertificateStart(payload, CertificatesMockApi),
  selector: () => getCreateCertificateTask,
  dataProp: 'result',
  slice: CertificatesReduxSlice,
}

export const mutationDeleteCertificate: ReduxMutation<
  void,
  Parameters<typeof deleteCertificateStart>[0],
  CertificateState['tasks'][TaskId.DeleteCertificate]
> = {
  mutation: payload => deleteCertificateStart(payload, CertificatesApi),
  mockMutation: payload => deleteCertificateStart(payload, CertificatesMockApi),
  selector: () => getDeleteCertificateTask,
  slice: CertificatesReduxSlice,
}
