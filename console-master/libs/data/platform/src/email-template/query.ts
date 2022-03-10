//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { AsyncQuery } from '@ues-data/shared'

import { EnrollmentEmail } from './enrollmentemail'
import { EnrollmentEmailMock } from './enrollmentemail-mock'
import type { PredefinedEmail } from './predefinedemail-types'

export const queryPredefinedEnrollmentEmail: AsyncQuery<
  PredefinedEmail,
  { type: 'mobile' | 'desktop'; format: 'html' | 'plaintext' }
> = {
  query: async ({ type, format }) => {
    const data = await EnrollmentEmail.getPredefinedEnrollmentEmail(type, format)
    return data.data
  },
  mockQueryFn: async ({ type, format }) => {
    const data = await EnrollmentEmailMock.getPredefinedEnrollmentEmail(type, format)
    return data.data
  },
  permissions: new Set([]),
}
