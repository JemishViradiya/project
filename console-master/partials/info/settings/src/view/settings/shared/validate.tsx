/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as httpStatus from 'http-status-codes'

import { SERVER_OPERATION } from './defaults'
import { ENQUEUE_TYPE, notification, notificationArgs } from './notification'
import { exists, focus, FORM_REFS, getRef, select } from './reference'

export enum CONFLICT_SUBSTATUS {
  SETTING_NAME = 1,
}

export enum PRECONDITION_SUBSTATUS {
  ASSIGNED_USER = 101,
  ASSIGNED_GROUP = 102,
  ASSIGNED_USER_AND_GROUP = 103,
}

export enum FOCUSABLE_ERRORS {
  NAME = FORM_REFS.NAME,
}

export function Validate(values: any, serverError: any): Map<FORM_REFS, number> {
  const formError = new Map<FORM_REFS, number>()
  if (values && (!values.name || values.name.length === 0)) {
    formError[FORM_REFS.NAME] = 2
  }
  if (values && values.warningNotificationsEnabled) {
    const cnt = values.warningNotificationsCount * values.warningNotificationsInterval

    if (cnt < 15) {
      formError[FORM_REFS.WARNING_NOTIFCATION_COUNT] = 1
    } else if (cnt > 524160) {
      formError[FORM_REFS.WARNING_NOTIFCATION_COUNT] = 2
    }
  }
  validateServerErrors(formError, serverError)
  return formError
}

function isServerErrorValid(serverError: any): boolean {
  return serverError && serverError['response'] !== undefined && serverError.response['data'] !== undefined
}

function validateServerErrors(formError: Map<FORM_REFS, number>, serverError: any): void {
  if (
    isServerErrorValid(serverError) &&
    serverError.response.status === httpStatus.CONFLICT &&
    serverError.response.data.subcode === CONFLICT_SUBSTATUS.SETTING_NAME
  ) {
    formError[FORM_REFS.NAME] = 1
  }
}

export async function scrollToError(formError: Map<FORM_REFS, number>) {
  const scrollableError = Object.keys(formError).filter(error => exists(error))[0]
  if (scrollableError) {
    const errorRef = scrollableError as FORM_REFS
    if (exists(errorRef)) {
      window.scrollTo({
        left: 0,
        top: getRef(errorRef).offsetTop,
        behavior: 'smooth',
      })
      // If error is focusable - set focus and select in a delay to give time for "smooth" scroll
      if (Object.keys(FOCUSABLE_ERRORS).filter(key => key === scrollableError)[0] !== undefined) {
        await wait(750)
        focus(errorRef)
        select(errorRef)
      }
    }
  }

  const validationErrorCount = Object.keys(formError).length
  // show all errors
  if (validationErrorCount > 0) {
    console.log('formError:', { formError })
    notificationArgs(ENQUEUE_TYPE.ERROR, 'formSubmitSnackBarError', { count: validationErrorCount })
  }
}

// handler for http submission errors
export function processServerError(serverError: any, operation: SERVER_OPERATION): void {
  if (serverError) {
    const formError = Validate(null, serverError)
    if (formError && Object.keys(formError).length > 0) {
      scrollToError(formError)
      // force a form validate to highlight server error(s)
      if (exists(FORM_REFS.FORMIK_BAG)) {
        getRef(FORM_REFS.FORMIK_BAG).validateForm()
      }
    } else {
      issueServerErrorNotification(serverError, operation)
    }
  }
}

// handle notification per operation type
function issueServerErrorNotification(serverError: any, operation: SERVER_OPERATION): void {
  if (operation && isServerErrorValid(serverError) && !httpStatus.NOT_FOUND) {
    if (operation === SERVER_OPERATION.DELETE && serverError.response.status === httpStatus.PRECONDITION_FAILED) {
      // TODO:  failed on DELETE with PRECONDITION_FAILED
    } else if (operation === SERVER_OPERATION.UPDATE && serverError.response.status === httpStatus.PRECONDITION_FAILED) {
      // TODO:  failed on UPDATE with PRECONDITION_FAILED
    } else {
      notification(ENQUEUE_TYPE.ERROR, 'setting.serverError' + operation)
    }
  } else {
    issueServerErrorUnknownNotification(serverError)
  }
}

// handle unknown error notification
function issueServerErrorUnknownNotification(serverError: any): void {
  if (serverError.response && serverError.response.status) {
    notificationArgs(ENQUEUE_TYPE.ERROR, 'setting.unexpectedErrorWithHttpMessage', {
      status: serverError.response.status,
    })
  } else {
    notification(ENQUEUE_TYPE.ERROR, 'setting.unexpectedErrorMessage')
  }
}

function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}
