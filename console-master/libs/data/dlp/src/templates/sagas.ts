/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects'

import type { Template } from '../template-service'
import type {
  assotiateTemplatesStart,
  createTemplateStart,
  deleteTemplateStart,
  disassociateTemplatesStart,
  editTemplateStart,
  fetchAssotiatedTemplatesStart,
  fetchTemplatesStart,
  getTemplateStart,
} from './actions'
import {
  assotiateTemplatesError,
  assotiateTemplatesSuccess,
  createTemplateError,
  createTemplateSuccess,
  deleteTemplateError,
  deleteTemplateSuccess,
  disassociateTemplatesError,
  disassociateTemplatesSuccess,
  editTemplateError,
  editTemplateSuccess,
  fetchAssotiatedTemplatesError,
  fetchAssotiatedTemplatesSuccess,
  fetchTemplatesError,
  fetchTemplatesSuccess,
  getTemplateError,
  getTemplateSuccess,
} from './actions'
import { TemplateActionType } from './types'

export const fetchTemplatesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchTemplatesStart>>(
    TemplateActionType.FetchTemplatesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAll, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchTemplatesSuccess(data))
      } catch (error) {
        yield put(fetchTemplatesError(error as Error))
      }
    },
  )
}

export const fetchAssociatedTemplatesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchAssotiatedTemplatesStart>>(
    TemplateActionType.FetchAssociatedTemplatesStart,
    function* ({ payload: { queryParams, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.readAssociated, queryParams)
        if (queryParams) {
          data.offset = queryParams.offset
        }
        yield put(fetchAssotiatedTemplatesSuccess(data))
      } catch (error) {
        yield put(fetchAssotiatedTemplatesError(error as Error))
      }
    },
  )
}

export const getTemplateSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getTemplateStart>>(
    TemplateActionType.GetTemplateStart,
    function* ({ payload: { templateId, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.read, templateId)
        yield put(getTemplateSuccess(data))
      } catch (error) {
        yield put(getTemplateError(error as Error))
      }
    },
  )
}

export const createTemplatesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createTemplateStart>>(
    TemplateActionType.CreateTemplateStart,
    function* ({ payload: { apiProvider, template } }) {
      const data: Template = template

      try {
        yield call(apiProvider.create, data)
        yield put(createTemplateSuccess())
      } catch (error) {
        yield put(createTemplateError(error as Error))
      }
    },
  )
}

export const associateTemplatesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof assotiateTemplatesStart>>(
    TemplateActionType.AssociateTemplatesStart,
    function* ({ payload: { templateIds, apiProvider } }) {
      try {
        yield call(apiProvider.associateTemplate, templateIds)
        yield put(assotiateTemplatesSuccess())
      } catch (error) {
        yield put(assotiateTemplatesError(error as Error))
      }
    },
  )
}

export const disassociateTemplatesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof disassociateTemplatesStart>>(
    TemplateActionType.DisassociateTemplatesStart,
    function* ({ payload: { templateIds, apiProvider } }) {
      try {
        yield call(apiProvider.disassociateTemplate, templateIds)
        yield put(disassociateTemplatesSuccess())
      } catch (error) {
        yield put(disassociateTemplatesError(error as Error))
      }
    },
  )
}

export const editTemplatesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof editTemplateStart>>(
    TemplateActionType.EditTemplateStart,
    function* ({ payload: { apiProvider, template } }) {
      const data: Template = template

      try {
        yield call(apiProvider.update, data)
        yield put(editTemplateSuccess())
      } catch (error) {
        yield put(editTemplateError(error as Error))
      }
    },
  )
}

export const deleteTemplatesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof deleteTemplateStart>>(
    TemplateActionType.DeleteTemplateStart,
    function* ({ payload: { templateId, apiProvider } }) {
      try {
        yield call(apiProvider.remove, templateId)
        yield put(deleteTemplateSuccess())
      } catch (error) {
        yield put(deleteTemplateError(error as Error))
      }
    },
  )
}
