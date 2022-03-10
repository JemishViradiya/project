/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import * as httpStatus from 'http-status-codes'
import React, { createContext, memo, useContext } from 'react'

import { useSnackbar } from '@ues/behaviours'

import { ReferenceProvider, useReference } from '../reference'
import { FORM_REFS, getIndexName } from '../reference/types'
import { getI18Name, getI18PolicyOperationError, useTranslation } from './i18n'
import { ENQUEUE_TYPE, SERVER_POLICY_OPERATION } from './settings'

export enum CONFLICT_SUBSTATUS {
  POLICY_NAME = 1,
}

export enum PRECONDITION_SUBSTATUS {
  ASSIGNED_USER = 101,
  ASSIGNED_GROUP = 102,
  ASSIGNED_USER_AND_GROUP = 103,
}

export enum FOCUSABLE_ERRORS {
  NAME = FORM_REFS.POLICY_NAME,
}

function Validate(values: any, serverError: any, payload: any): Map<FORM_REFS, number> {
  const formError = new Map<FORM_REFS, number>()
  if (values && (!values.name || values.name.length === 0)) {
    formError[FORM_REFS.POLICY_NAME] = 2
  } else if (values && values.name.match(/^\s+|\s+$/g)) {
    formError[FORM_REFS.POLICY_NAME] = 3
  }

  // Must have at least one authenticator defined
  if (values && (!values.authenticators || values.authenticators.length === 0)) {
    formError[getIndexName(FORM_REFS.AUTHENTICATOR_LIST, -1)] = 1
    formError[FORM_REFS.AUTHENTICATOR_LIST] = 1
  }

  // All exceptions must have at least one authenticator defined
  values?.exceptions?.forEach((el, index) => {
    if (!el.authenticators || el.authenticators.length === 0) {
      formError[getIndexName(FORM_REFS.AUTHENTICATOR_LIST, index)] = 1
      formError[FORM_REFS.EXCEPTION_LIST] = 1
    }
  })

  if (formError[FORM_REFS.POLICY_NAME] === undefined) {
    validateServerErrors(formError, serverError)
  }
  if (formError[FORM_REFS.POLICY_NAME] === 1 && values && payload && values.name !== payload.name) {
    delete formError[FORM_REFS.POLICY_NAME]
  }
  return formError
}

function validateServerErrors(formError: Map<FORM_REFS, number>, serverError: any): void {
  if (
    isServerErrorValid(serverError) &&
    serverError.response.status === httpStatus.BAD_REQUEST &&
    serverError.response.data.message === 'The policy name must be unique'
  ) {
    formError[FORM_REFS.POLICY_NAME] = 1
  }
}

function isServerErrorValid(serverError: any): boolean {
  return serverError && serverError['response'] !== undefined && serverError.response['data'] !== undefined
}

const cntIgnore: string[] = [`${FORM_REFS.AUTHENTICATOR_LIST}`, `${FORM_REFS.EXCEPTION_LIST}`]

async function ScrollToError(formError: Map<FORM_REFS, number>, notification, references) {
  const scrollableError = Object.keys(formError).filter(error => references.exists(error))[0]
  // console.log('scrollToError: ', { formError, scrollableError })
  if (scrollableError) {
    const errorRef = scrollableError as FORM_REFS
    if (references.exists(errorRef)) {
      window.scrollTo({
        left: 0,
        top: references.getRef(errorRef).offsetTop,
        behavior: 'smooth',
      })
      // If error is focusable - set focus and select in a delay to give time for "smooth" scroll
      if (Object.keys(FOCUSABLE_ERRORS).filter(key => key === scrollableError)[0] !== undefined) {
        await wait(750)
        references.focus(errorRef)
        references.select(errorRef)
      }
    }
  }

  const validationErrorCount = Object.keys(formError).filter(key => !cntIgnore.includes(key)).length
  // show all errors
  if (validationErrorCount > 0) {
    notification(ENQUEUE_TYPE.ERROR, getI18Name('formSubmitSnackBarError'), { count: validationErrorCount })
  }
}

function ProcessServerError(serverError: any, policyOperation: SERVER_POLICY_OPERATION, notification, references): void {
  if (serverError) {
    const formError = Validate(null, serverError, null)
    if (formError && Object.keys(formError).length > 0) {
      ScrollToError(formError, notification, references)
      // force a form validate to highlight server error(s)
      if (references.exists(FORM_REFS.FORMIK_BAG)) {
        references.getRef(FORM_REFS.FORMIK_BAG).validateForm()
      }
    } else {
      issueServerErrorNotification(serverError, policyOperation, notification)
    }
  }
}

function issueServerErrorNotification(serverError: any, policyOperation: SERVER_POLICY_OPERATION, notification): void {
  if (policyOperation) {
    if (
      policyOperation === SERVER_POLICY_OPERATION.DELETE &&
      isServerErrorValid(serverError) &&
      serverError.response.status === httpStatus.PRECONDITION_FAILED &&
      serverError.response.data.subcode
    ) {
      switch (serverError.response.data.subcode) {
        case PRECONDITION_SUBSTATUS.ASSIGNED_USER:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithUsers'))
          return
        case PRECONDITION_SUBSTATUS.ASSIGNED_GROUP:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithGroups'))
          return
        case PRECONDITION_SUBSTATUS.ASSIGNED_USER_AND_GROUP:
          notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('deleteWithUsersAndGroups'))
          return
      }
    } else if (
      policyOperation === SERVER_POLICY_OPERATION.UPDATE &&
      isServerErrorValid(serverError) &&
      serverError.response.status === httpStatus.BAD_REQUEST &&
      serverError.response.data.message.includes('You cannot have two internal auth types in the same policy')
    ) {
      notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError('multipleInternalAuthErrorMsg'))
      return
    }
    notification(ENQUEUE_TYPE.ERROR, getI18PolicyOperationError(policyOperation))
  } else {
    issueServerErrorUnknownNotification(serverError, notification)
  }
}

function issueServerErrorUnknownNotification(serverError: any, notification): void {
  if (serverError.response && serverError.response.status) {
    if (serverError.response.data && serverError.response.data.subcode) {
      notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorWithHttpSubcodeMessage'), {
        status: serverError.response.status,
        subcode: serverError.response.data.subcode,
      })
    } else {
      notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorWithHttpMessage'), { status: serverError.response.status })
    }
  } else {
    notification(ENQUEUE_TYPE.ERROR, getI18Name('unexpectedErrorMessage'))
  }
}

function wait(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

const FormValidationContext = createContext({
  validate: (values: any, serverError: any, payload: any) => new Map<FORM_REFS, number>(),
  scrollToError: (formError: Map<FORM_REFS, number>) => {
    /* dummy scroll handler */
  },
  processServerError: (serverError: any, policyOperation: SERVER_POLICY_OPERATION) => {
    /* dummy error handler */
  },
} as const)

const FormValidationProvider = ({ children }) => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const references = useReference()

  const notification = (variant: ENQUEUE_TYPE, message: string, formatArgs?: any) => {
    snackbar.enqueueMessage(formatArgs ? t(message, formatArgs) : t(message), variant)
  }

  const validate = (values: any, serverError: any, payload: any) => Validate(values, serverError, payload)
  const scrollToError = async (formError: Map<FORM_REFS, number>) => ScrollToError(formError, notification, references)
  const processServerError = (serverError: any, policyOperation: SERVER_POLICY_OPERATION) =>
    ProcessServerError(serverError, policyOperation, notification, references)

  return (
    <FormValidationContext.Provider value={{ validate, scrollToError, processServerError }}>
      {children}
    </FormValidationContext.Provider>
  )
}

export const FormProvider = memo(({ children }) => {
  return (
    <ReferenceProvider>
      <FormValidationProvider>{children}</FormValidationProvider>
    </ReferenceProvider>
  )
})

export function hasAuthenticationError(errors: any, index: number): boolean {
  return (
    errors &&
    errors[getIndexName(FORM_REFS.AUTHENTICATOR_LIST, index)] !== undefined &&
    errors[getIndexName(FORM_REFS.AUTHENTICATOR_LIST, index)] !== 0
  )
}

export const useFormValidation = () => useContext(FormValidationContext)
