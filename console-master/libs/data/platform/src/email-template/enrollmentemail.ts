//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.
import type { Response } from '@ues-data/shared'
import { UesAxiosClient } from '@ues-data/shared'

import type EnrollmentEmailInterface from './enrollmentemail-interface'
import { PredefinedEmail } from './predefinedemail-types'

const makeUrl = (): string => `/platform/v1/endpoints/admin/email`

class EnrollmentEmailClass implements EnrollmentEmailInterface {
  getPredefinedEnrollmentEmail(type: string, format: string): Response<PredefinedEmail> {
    return UesAxiosClient().get(makeUrl() + `?type=${type}&format=${format}`)
  }
}

const EnrollmentEmail = new EnrollmentEmailClass()

export { EnrollmentEmail }
export { PredefinedEmail }
