import { all, call, put, takeLeading } from 'redux-saga/effects'

import type { ActivationProfile } from '@ues-data/platform'

import type {
  createPolicyStart,
  deleteMultiplePoliciesStart,
  deletePolicyStart,
  fetchPolicyStart,
  updatePolicyStart,
} from './actions'
import {
  createPolicyError,
  createPolicySuccess,
  deleteMultiplePoliciesError,
  deleteMultiplePoliciesSuccess,
  deletePolicyError,
  deletePolicySuccess,
  fetchPolicyError,
  fetchPolicySuccess,
  updatePolicyError,
  updatePolicySuccess,
} from './actions'
import type { ErrorWithResponse } from './types'
import { ActionType } from './types'

export const fetchPolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof fetchPolicyStart>>(
    ActionType.FetchPolicyStart,
    function* ({ payload: { entityId, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.ActivationProfiles.readOne, entityId)
        yield put(fetchPolicySuccess({ result: data }))
      } catch (error) {
        yield put(fetchPolicyError(error as Error))
      }
    },
  )
}

export const createPolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createPolicyStart>>(
    ActionType.CreatePolicyStart,
    function* ({ payload: { apiProvider, profile } }) {
      const profileData: ActivationProfile = {
        ...profile,
      }

      try {
        const { data } = yield call(apiProvider.ActivationProfiles.create, profileData)
        yield put(createPolicySuccess(data))
      } catch (error) {
        yield put(createPolicyError(error as Error))
      }
    },
  )
}

export const updatePolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof updatePolicyStart>>(
    ActionType.UpdatePolicyStart,
    function* ({ payload: { apiProvider, profile } }) {
      try {
        yield call(apiProvider.ActivationProfiles.update, profile.id, profile)
        yield put(updatePolicySuccess())
      } catch (error) {
        yield put(updatePolicyError(error as Error))
      }
    },
  )
}

export const deletePolicySaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deletePolicyStart>>(
    ActionType.DeletePolicyStart,
    function* ({ payload: { entityId, apiProvider } }) {
      try {
        yield call(apiProvider.ActivationProfiles.remove, entityId)
        yield put(deletePolicySuccess())
      } catch (error) {
        yield put(deletePolicyError(error as Error))
      }
    },
  )
}

export const deleteMultiplePoliciesSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deleteMultiplePoliciesStart>>(
    ActionType.DeleteMultiplePoliciesStart,
    function* ({ payload: { entityIds, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.ActivationProfiles.removeMultiple, entityIds)
        if (data.failedCount > 0) {
          const newError: ErrorWithResponse = {
            name: 'deleteMultiplePoliciesError',
            message: 'Multiple delete policies failure',
            data: data,
          }
          yield put(deleteMultiplePoliciesError(newError))
        } else {
          yield put(deleteMultiplePoliciesSuccess())
        }
      } catch (error) {
        yield put(deleteMultiplePoliciesError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(fetchPolicySaga),
    call(createPolicySaga),
    call(updatePolicySaga),
    call(deletePolicySaga),
    call(deleteMultiplePoliciesSaga),
  ])
}
