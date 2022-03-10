import { all, call } from 'redux-saga/effects'

import { UesReduxStore } from '@ues-data/shared'

import ExclusionReducer from './reducer'
import {
  associateTemplatesSaga,
  createTemplatesSaga,
  deleteTemplatesSaga,
  disassociateTemplatesSaga,
  editTemplatesSaga,
  fetchAssociatedTemplatesSaga,
  fetchTemplatesSaga,
  getTemplateSaga,
} from './sagas'
import { TemplatesReduxSlice } from './types'

export function* exclusionSaga() {
  yield all([
    call(fetchTemplatesSaga),
    call(fetchAssociatedTemplatesSaga),
    call(getTemplateSaga),
    call(createTemplatesSaga),
    call(associateTemplatesSaga),
    call(disassociateTemplatesSaga),
    call(editTemplatesSaga),
    call(deleteTemplatesSaga),
  ])
}

UesReduxStore.registerSlice(TemplatesReduxSlice, { reducer: ExclusionReducer, saga: exclusionSaga }, { eager: false })

export * from './actions'
export * from './selectors'
export * from './data-layer'
