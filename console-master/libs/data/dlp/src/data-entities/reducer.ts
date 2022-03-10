/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import { isEmpty } from 'lodash-es'
import type { Action, Reducer } from 'redux'

import type { DataEntitiesState, Task } from './types'
import { DataEntityActionType, TaskId } from './types'

interface ActionWithPayload<TActionType extends string, TPayload = any> extends Action<TActionType> {
  payload?: TPayload
}

export const defaultState: DataEntitiesState = {
  tasks: {
    dataEntities: {
      loading: false,
    },
    getAssociatedDataEntities: {
      loading: false,
    },
    getDataEntitiesByGuids: {
      loading: false,
    },
    getDataEntity: {
      loading: false,
    },
    createDataEntity: {
      loading: false,
    },
    associateDataEntities: {
      loading: false,
    },
    editDataEntity: {
      loading: false,
    },
    deleteDataEntity: {
      loading: false,
    },
  },
  ui: { localDataEntity: {} },
}

const updateTask = (state: DataEntitiesState, taskId: string, data: Task): DataEntitiesState => ({
  ...state,
  tasks: {
    ...state.tasks,
    [taskId]: data,
  },
})

const reducer: Reducer<DataEntitiesState, ActionWithPayload<DataEntityActionType>> = (state = defaultState, action) => {
  switch (action.type) {
    //fetch dataEntities
    case DataEntityActionType.FetchDataEntitiesStart:
      return updateTask(state, TaskId.DataEntities, { ...state.tasks.dataEntities, loading: true })

    case DataEntityActionType.FetchDataEntitiesError:
      return updateTask(state, TaskId.DataEntities, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.FetchDataEntitiesSuccess: {
      if (!action.payload.offset || action.payload.offset === 0) {
        return updateTask(state, TaskId.DataEntities, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedDataEntities = [...(state.tasks.dataEntities?.result?.elements ?? []), ...action.payload.elements]
        return updateTask(state, TaskId.DataEntities, {
          loading: false,
          result: { ...action.payload, elements: allFetchedDataEntities },
        })
      }
    }

    //fetch dataEntities by guids
    case DataEntityActionType.GetDataEntitiesByGuidsStart:
      return updateTask(state, TaskId.GetDataEntitiesByGuid, { ...state.tasks.getDataEntitiesByGuids, loading: true })

    case DataEntityActionType.GetDataEntitiesByGuidsError:
      return updateTask(state, TaskId.GetDataEntitiesByGuid, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.GetDataEntitiesByGuidsSuccess: {
      return updateTask(state, TaskId.GetDataEntitiesByGuid, {
        loading: false,
        result: action.payload,
      })
    }

    //fetch associated dataEntities
    case DataEntityActionType.GetAssociatedDataEntitiesStart:
      return updateTask(state, TaskId.AssociatedDataEntities, { ...state.tasks.getAssociatedDataEntities, loading: true })

    case DataEntityActionType.GetAssociatedDataEntitiesError:
      return updateTask(state, TaskId.AssociatedDataEntities, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.GetAssociatedDataEntitiesSuccess: {
      if (!action.payload?.offset || action.payload?.offset === 0) {
        return updateTask(state, TaskId.AssociatedDataEntities, {
          loading: false,
          result: action.payload,
        })
      } else {
        const allFetchedAssociatedDataEntities = [
          ...(state.tasks.getAssociatedDataEntities?.result?.elements ?? []),
          ...action.payload.elements,
        ]
        return updateTask(state, TaskId.AssociatedDataEntities, {
          loading: false,
          result: { ...action.payload, elements: allFetchedAssociatedDataEntities },
        })
      }
    }

    //get dataEntity
    case DataEntityActionType.GetDataEntityStart:
      return updateTask(state, TaskId.GetDataEntity, { loading: true })

    case DataEntityActionType.GetDataEntityError:
      return updateTask(state, TaskId.GetDataEntity, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.GetDataEntitySuccess: {
      return updateTask(state, TaskId.GetDataEntity, { loading: false, result: action.payload })
    }

    //create dataEntity
    case DataEntityActionType.CreateDataEntityStart:
      return updateTask(state, TaskId.CreateDataEntity, { loading: true })

    case DataEntityActionType.CreateDataEntityError:
      return updateTask(state, TaskId.CreateDataEntity, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.CreateDataEntitySuccess:
      return updateTask(state, TaskId.CreateDataEntity, { loading: false, result: action.payload })

    //assotiate dataEntities
    case DataEntityActionType.AssociateDataEntitiesStart:
      return updateTask(state, TaskId.AssociateDataEntities, { loading: true })

    case DataEntityActionType.AssociateDataEntitiesError:
      return updateTask(state, TaskId.AssociateDataEntities, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.AssociateDataEntitiesSuccess:
      return updateTask(state, TaskId.AssociateDataEntities, {
        loading: false,
      })

    //edit dataEntity
    case DataEntityActionType.EditDataEntityStart:
      return updateTask(state, TaskId.EditDataEntity, { loading: true })

    case DataEntityActionType.EditDataEntityError:
      return updateTask(state, TaskId.EditDataEntity, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.EditDataEntitySuccess:
      return updateTask(state, TaskId.EditDataEntity, {
        loading: false,
      })

    //delete dataEntity
    case DataEntityActionType.DeleteDataEntityStart:
      return updateTask(state, TaskId.DeleteDataEntity, { loading: true })

    case DataEntityActionType.DeleteDataEntityError:
      return updateTask(state, TaskId.DeleteDataEntity, {
        loading: false,
        error: action.payload.error,
      })

    case DataEntityActionType.DeleteDataEntitySuccess:
      return updateTask(state, TaskId.DeleteDataEntity, {
        loading: false,
      })

    case DataEntityActionType.UpdateLocalDataEntity:
      return {
        ...state,
        ui: {
          ...state.ui,
          localDataEntity: { ...state.ui.localDataEntity, ...action.payload },
        },
      }

    case DataEntityActionType.ClearDataEntity: {
      return {
        ...state,
        ui: { ...state.ui, localDataEntity: {} },
      }
    }

    default:
      return state
  }
}

export default reducer
