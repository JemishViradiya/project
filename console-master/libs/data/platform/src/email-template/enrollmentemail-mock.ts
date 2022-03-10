//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

/* eslint-disable prefer-rest-params */
/* eslint-disable sonarjs/no-duplicate-string */

import type { Response } from '@ues-data/shared'

import type EnrollmentEmailInterface from './enrollmentemail-interface'
import type { PredefinedEmail } from './predefinedemail-types'

const predefinedEnrollmentMobileEmailHtmlMock = {
  content: '<html><b>Predefined Mobile Html Content</b></html>',
  subject: 'Predefined mobile subject for html content',
  format: 'html',
}
const predefinedEnrollmentDesktopEmailHtmlMock = {
  content: '<html><b>Predefined Desktop Html Content</b></html>',
  subject: 'Predefined desktop subject for html content',
  format: 'html',
}
const predefinedEnrollmentEmailPlainTextMock = {
  content: 'Predfined plaintext content',
  subject: 'Predefined subject for plaintext content',
  format: 'html',
}

class EnrollmentEmailClass implements EnrollmentEmailInterface {
  getPredefinedEnrollmentEmail(type: string, format: string): Response<PredefinedEmail> {
    let mockToReturn = predefinedEnrollmentEmailPlainTextMock
    if (format === 'html') {
      mockToReturn = type === 'mobile' ? predefinedEnrollmentMobileEmailHtmlMock : predefinedEnrollmentDesktopEmailHtmlMock
    }
    return Promise.resolve({ data: mockToReturn })
  }
}

const EnrollmentEmailMock = new EnrollmentEmailClass()

export { EnrollmentEmailMock }
