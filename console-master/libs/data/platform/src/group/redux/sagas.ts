/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { all, call, delay, put, takeLatest, takeLeading } from 'redux-saga/effects'

import { UesApolloClient, UesReduxStore } from '@ues-data/shared'

import { groupFragment } from '../apollo/queryGroups'
import type { Group, PolicyTypeWithEntities } from '../common'
import type {
  addUsersStart,
  assignProfilesStart,
  createGroupStart,
  deleteGroupsStart,
  getAssignableProfilesStart,
  getAssignedProfilesStart,
  getCurrentGroupStart,
  removeUsersStart,
  searchDirectoryGroupsStart,
  unassignProfileStart,
  updateGroupStart,
} from './actions'
import {
  addUsersError,
  addUsersSuccess,
  assignProfilesError,
  assignProfilesSuccess,
  createGroupError,
  createGroupSuccess,
  deleteGroupsError,
  deleteGroupsSuccess,
  getAssignableProfilesError,
  getAssignableProfilesSuccess,
  getAssignedProfilesError,
  getAssignedProfilesSuccess,
  getCurrentGroupError,
  getCurrentGroupSuccess,
  removeUsersError,
  removeUsersSuccess,
  searchDirectoryGroupsError,
  searchDirectoryGroupsSuccess,
  unassignProfilesError,
  unassignProfilesSuccess,
  updateGroupError,
  updateGroupSuccess,
} from './actions'
import { getAssignedProfilesTask } from './selectors'
import { ActionType } from './types'

export const deleteGroupsSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof deleteGroupsStart>>(
    ActionType.DeleteGroupsStart,
    function* ({ payload: { ids, apiProvider } }) {
      try {
        // remove one by one since User Service does not support bulk delete
        for (const id of ids) {
          yield call(apiProvider.remove, id)
        }
        yield put(deleteGroupsSuccess())
        UesApolloClient.cache.modify({
          fields: {
            userGroups(cachedGroups) {
              return {
                ...cachedGroups,
                elements: cachedGroups.elements.filter(g => !ids.includes(g.__ref.split(':')[1])),
                totals: { ...cachedGroups.totals, elements: cachedGroups.totals.elements - ids.length },
              }
            },
          },
        })
      } catch (error) {
        yield put(deleteGroupsError(error as Error))
      }
    },
  )
}

export const createGroupSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof createGroupStart>>(
    ActionType.CreateGroupStart,
    function* ({ payload: { group, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.create, group)
        const profileAssignments = getAssignedProfilesTask(UesReduxStore.getState()).result

        if (profileAssignments && profileAssignments.length > 0) {
          const assignedBody = profileAssignments.map(p => ({ serviceId: p.serviceId, entityId: p.entityId }))
          let assigned = false
          let tries = 5
          while (!assigned && tries > 0) {
            yield delay(200) //try 5 times
            try {
              yield call(apiProvider.assignPolicies, data.id, assignedBody)
              assigned = true
            } catch (error) {
              if (error.response.status === 404) {
                tries = tries - 1
              } else throw error
            }
          }
        }
        yield put(createGroupSuccess(data))
      } catch (error) {
        yield put(createGroupError(error as Error))
      }
    },
  )
}

export const updateGroupSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof updateGroupStart>>(
    ActionType.UpdateGroupStart,
    function* ({ payload: { group, apiProvider } }) {
      try {
        const { data } = yield call(apiProvider.update, group)
        yield put(updateGroupSuccess(data))
      } catch (error) {
        yield put(updateGroupError(error as Error))
      }
    },
  )
}

export const getCurrentGroupSaga = function* (): Generator {
  yield takeLeading<ReturnType<typeof getCurrentGroupStart>>(
    ActionType.GetCurrentGroupStart,
    function* ({ payload: { id, apiProvider } }) {
      try {
        let group = UesApolloClient.cache.readFragment<Group, unknown>({
          id: `UserGroup:${id}`,
          fragment: groupFragment,
        })
        if (!group) {
          const { data } = yield call(apiProvider.getGroups, `id=${id}`) // Get from the service if not present in cache
          group = data?.elements[0]
        }
        yield put(getCurrentGroupSuccess(group))
      } catch (error) {
        yield put(getCurrentGroupError(error as Error))
      }
    },
  )
}

export const searchDirectoryGroupsSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof searchDirectoryGroupsStart>>(
    ActionType.SearchDirectoryGroupsStart,
    function* ({ payload: { search, apiProvider } }) {
      try {
        if (search && search !== '') {
          yield delay(600) //debuonce
          const { data } = yield call(apiProvider.searchGroups, search)
          yield put(searchDirectoryGroupsSuccess(data))
        } else {
          yield put(searchDirectoryGroupsSuccess([]))
        }
      } catch (error) {
        yield put(searchDirectoryGroupsError(error as Error))
      }
    },
  )
}

export const getAssignableProfilesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getAssignableProfilesStart>>(
    ActionType.GetAssignableProfilesStart,
    function* ({ payload: { apiProvider } }) {
      try {
        const { data: definitions } = yield call(apiProvider.getDefinitions)
        const { data: allPolicies } = yield call(apiProvider.getEntities, '', 1000)
        const types: Record<string, PolicyTypeWithEntities> = {}
        definitions?.elements.filter(x => x['entityType'] !== 'role').forEach(d => (types[d.entityType] = { ...d, policies: [] }))
        allPolicies?.elements
          .filter(x => x['entityType'] !== 'role')
          .forEach(p => {
            types[p.entityType]?.policies.push(p)
          })
        yield put(getAssignableProfilesSuccess(Object.values(types)))
      } catch (error) {
        yield put(getAssignableProfilesError(error as Error))
      }
    },
  )
}

export const getAssignedProfilesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof getAssignedProfilesStart>>(
    ActionType.GetAssignedProfilesStart,
    function* ({ payload: { id, local, apiProvider } }) {
      try {
        if (!local && id) {
          const { data: assignedPolicies } = yield call(apiProvider.getGroupAssignments, id)
          const { data: allPolicies } = yield call(apiProvider.getEntities, '', 1000)
          const assignedPoliciesIds = assignedPolicies.elements.map(p => p.entityId)
          const filteredPolicies = allPolicies.elements.filter(p => assignedPoliciesIds.includes(p.entityId))
          yield put(getAssignedProfilesSuccess(filteredPolicies))
        } else {
          yield put(getAssignedProfilesSuccess([]))
        }
      } catch (error) {
        yield put(getAssignedProfilesError(error as Error))
      }
    },
  )
}

export const assignProfilesSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof assignProfilesStart>>(
    ActionType.AssignProfilesStart,
    function* ({ payload: { id, profiles, reconciliationType, local, apiProvider } }) {
      try {
        if (!local) {
          yield call(
            apiProvider.assignPolicies,
            id,
            profiles.map(p => ({ serviceId: p.serviceId, entityId: p.entityId })),
          )
          yield put(assignProfilesSuccess({ profiles, reconciliationType }))
        } else {
          yield put(assignProfilesSuccess({ profiles, reconciliationType }))
        }
      } catch (error) {
        yield put(assignProfilesError(error as Error))
      }
    },
  )
}

export const unssignProfileSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof unassignProfileStart>>(
    ActionType.UnassignProfilesStart,
    function* ({ payload: { id, profile, local, apiProvider } }) {
      try {
        if (!local) {
          yield call(apiProvider.unassignPolicies, id, [{ serviceId: profile.serviceId, entityId: profile.entityId }])
          yield put(unassignProfilesSuccess(profile))
        } else {
          yield put(unassignProfilesSuccess(profile))
        }
      } catch (error) {
        yield put(unassignProfilesError(error as Error))
      }
    },
  )
}

export const addUsersSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof addUsersStart>>(ActionType.AddUsersStart, function* ({ payload: { id, users, apiProvider } }) {
    try {
      yield call(apiProvider.addUsers, id, users)
      yield put(addUsersSuccess(users))
    } catch (error) {
      yield put(addUsersError(error as Error))
    }
  })
}

export const removeUsersSaga = function* (): Generator {
  yield takeLatest<ReturnType<typeof removeUsersStart>>(
    ActionType.RemoveUsersStart,
    function* ({ payload: { id, users, apiProvider } }) {
      try {
        yield call(apiProvider.removeUsers, id, users)
        yield put(removeUsersSuccess(users))
        const ids = users.map(u => u.id)
        UesApolloClient.cache.modify({
          fields: {
            usersInGroup(cachedUsers) {
              return {
                ...cachedUsers,
                elements: cachedUsers.elements.filter(g => !ids.includes(g.__ref.split(':')[1])),
                totals: { ...cachedUsers.totals, elements: cachedUsers.totals.elements - users.length },
              }
            },
          },
        })
      } catch (error) {
        yield put(removeUsersError(error as Error))
      }
    },
  )
}

export const rootSaga = function* (): Generator {
  yield all([
    call(deleteGroupsSaga),
    call(createGroupSaga),
    call(searchDirectoryGroupsSaga),
    call(getAssignableProfilesSaga),
    call(updateGroupSaga),
    call(getCurrentGroupSaga),
    call(getAssignedProfilesSaga),
    call(assignProfilesSaga),
    call(unssignProfileSaga),
    call(addUsersSaga),
    call(removeUsersSaga),
  ])
}
