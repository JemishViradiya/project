import { createSelector } from 'reselect'

import type { CertificateState } from './types'
import { CertificatesReduxSlice } from './types'

const getState = (state: { [k in typeof CertificatesReduxSlice]: CertificateState }) => state[CertificatesReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getCertificatesTask = createSelector(getTasks, tasks => tasks?.certificates)

export const getCreateCertificateTask = createSelector(getTasks, tasks => tasks?.createCertificate)

export const getDeleteCertificateTask = createSelector(getTasks, tasks => tasks?.deleteCertificate)
