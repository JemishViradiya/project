/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isArray, isEmpty, isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import type { DataEntitiesState } from './types'
import { DataEntitiesReduxSlice } from './types'

const getState = (state: { [k in typeof DataEntitiesReduxSlice]: DataEntitiesState }) => state[DataEntitiesReduxSlice]

const getTasks = createSelector(getState, state => state?.tasks)

export const getDataEntities = createSelector(getTasks, tasks => tasks?.dataEntities?.result?.elements ?? [])

export const getDataEntitiesTask = createSelector(getTasks, tasks => tasks?.dataEntities)

export const getDataEntityTask = createSelector(getTasks, tasks => tasks?.getDataEntity)

export const getCreateDataEntityTask = createSelector(getTasks, tasks => tasks?.createDataEntity)

export const getEditDataEntityTask = createSelector(getTasks, tasks => tasks?.editDataEntity)

export const getDeleteDataEntityTask = createSelector(getTasks, tasks => tasks?.deleteDataEntity)

export const getAssociatedTask = createSelector(getTasks, tasks => tasks?.getAssociatedDataEntities)

export const getDataEntitiesByGuidsTask = createSelector(getTasks, tasks => tasks?.getDataEntitiesByGuids)

export const getAssociateDataEntitiesTask = createSelector(getTasks, tasks => tasks?.associateDataEntities)

export const getLocalDataEntity = createSelector(getState, state => state?.ui?.localDataEntity)

export const getHasUnsavedDataEntityChanges = selectedDataType => {
  return createSelector(getLocalDataEntity, localDataEntity => {
    return (
      !isEmpty(localDataEntity) &&
      !isEqual(
        {
          ...localDataEntity,
          description: isArray(localDataEntity?.description)
            ? localDataEntity?.description.join(' ')
            : localDataEntity?.description,
        },
        selectedDataType,
      )
    )
  })
}
