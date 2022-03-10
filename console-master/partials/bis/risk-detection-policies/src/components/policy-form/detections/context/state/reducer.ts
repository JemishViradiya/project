import { omit } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import type { ActorDetectionType } from '@ues-data/shared-types'

import { useRiskLevels } from '../../../../../hooks/use-risk-levels'
import type { DetectionsEntity, DetectionsRiskLevel } from '../../../../../model'
import type { Action, State } from './model'
import { ActionType } from './model'

type ActionHandler<TActionType extends ActionType> = (
  state: State,
  action: Extract<Action, { type: TActionType }>,
  defaultState: State,
) => State

export const useDefaultState = (): State => {
  const { riskLevels } = useRiskLevels()

  return useMemo(
    () => ({
      value: riskLevels.map<DetectionsRiskLevel>(riskLevel => ({
        riskLevel,
        detections: [],
      })),
      store: {
        selection: {},
      },
      table: {
        selection: {},
      },
    }),
    [riskLevels],
  )
}

const detectionsEntitiesToSelection = (detections: DetectionsEntity[]) =>
  detections.reduce<Record<string, true>>((acc, detection) => ({ ...acc, [detection.type]: true }), {})

const clearStoreItemsSelectionHandler: ActionHandler<ActionType.ClearStoreItemsSelection> = (state, _, __) => ({
  ...state,
  store: {
    ...state.store,
    selection: {},
  },
})

const clearTableItemsSelectionHandler: ActionHandler<ActionType.ClearTableItemsSelection> = (state, _, __) => ({
  ...state,
  table: {
    ...state.table,
    selection: {},
  },
})

const clearAllSelectionsHandler: ActionHandler<ActionType.ClearAllSelections> = (state, _, __) => ({
  ...state,
  store: {
    ...state.store,
    selection: {},
  },
  table: {
    ...state.table,
    selection: {},
  },
})

const toggleStoreItemSelectionHandler: ActionHandler<ActionType.ToggleStoreItemSelection> = (state, action, _) => {
  const groupSize = Object.keys(state.store.selection).length
  const isSelected = state.store.selection[action.payload.detectionType] === true

  let selection: Record<string, true> = {}
  if (!action.payload.withinGroup) {
    selection = isSelected && groupSize === 1 ? {} : { [action.payload.detectionType]: true }
  } else {
    selection = isSelected
      ? omit(state.store.selection, [action.payload.detectionType])
      : { ...state.store.selection, [action.payload.detectionType]: true }
  }

  return {
    ...state,
    store: {
      ...state.store,
      selection,
    },
    table: {
      ...state.table,
      selection: {},
    },
  }
}

const toggleTableItemSelectionHandler: ActionHandler<ActionType.ToggleTableItemSelection> = (state, action, _) => {
  const groupSize = Object.keys(state.table.selection).length
  const isSelected = state.table.selection[action.payload.detectionType] === true

  let selection: Record<string, true> = {}
  if (!action.payload.withinGroup) {
    selection = isSelected && groupSize === 1 ? {} : { [action.payload.detectionType]: true }
  } else {
    selection = isSelected
      ? omit(state.table.selection, [action.payload.detectionType])
      : { ...state.table.selection, [action.payload.detectionType]: true }
  }

  return {
    ...state,
    table: {
      ...state.table,
      selection,
    },
    store: {
      ...state.store,
      selection: {},
    },
  }
}

const addItemsFromStoreHandler: ActionHandler<ActionType.AddItemsFromStore> = (state, action, _) => {
  const shouldAddSelection = state.store.selection[action.payload.detectionType] === true
  const addedDetections = (shouldAddSelection
    ? Array.from(new Set([...(Object.keys(state.store.selection) as ActorDetectionType[]), action.payload.detectionType]))
    : [action.payload.detectionType]
  ).map<DetectionsEntity>(detectionType => ({
    type: detectionType,
  }))

  return {
    ...state,
    value: state.value.map<DetectionsRiskLevel>(data => {
      if (data.riskLevel === action.payload.riskLevel) {
        return {
          riskLevel: action.payload.riskLevel,
          detections: [
            ...data.detections.slice(0, action.payload.index),
            ...addedDetections,
            ...data.detections.slice(action.payload.index),
          ],
        }
      }

      return data
    }),
    table: {
      ...state.table,
      selection: shouldAddSelection ? detectionsEntitiesToSelection(addedDetections) : {},
    },
    store: {
      selection: {},
    },
  }
}

const moveItemsWithinTableHandler: ActionHandler<ActionType.MoveItemsWithinTable> = (state, action, _) => {
  const shouldMoveSelection = state.table.selection[action.payload.detectionType] === true
  const selection = new Set(shouldMoveSelection ? Object.keys(state.table.selection) : [action.payload.detectionType])
  const movedDetections = state.value.reduce<DetectionsEntity[]>((acc, data) => {
    return [...acc, ...data.detections.filter(detection => selection.has(detection.type))]
  }, [])

  return {
    ...state,
    value: state.value.map<DetectionsRiskLevel>(data => {
      const filteredDetections = data.detections.filter(detection => !selection.has(detection.type))

      if (data.riskLevel === action.payload.riskLevel) {
        return {
          riskLevel: data.riskLevel,
          detections: [
            ...filteredDetections.slice(0, action.payload.index),
            ...movedDetections,
            ...filteredDetections.slice(action.payload.index),
          ],
        }
      }

      return { riskLevel: data.riskLevel, detections: filteredDetections }
    }),
    table: {
      ...state.table,
      selection: shouldMoveSelection ? detectionsEntitiesToSelection(movedDetections) : {},
    },
  }
}

const removeItemHandler: ActionHandler<ActionType.RemoveItem> = (state, action, _) => {
  const shouldRemoveSelection = state.table.selection[action.payload.detectionType] === true
  const selection = new Set(shouldRemoveSelection ? Object.keys(state.table.selection) : [action.payload.detectionType])

  return {
    ...state,
    value: state.value.map(data => ({
      riskLevel: data.riskLevel,
      detections: data.detections.filter(detection => !selection.has(detection.type)),
    })),
    table: {
      selection: {},
    },
  }
}

const setValueHandler: ActionHandler<ActionType.SetValue> = (state, action, defaultState) => {
  return {
    ...state,
    value: action.payload.value ?? defaultState.value,
  }
}

export const useReducerFunction = () => {
  const defaultState = useDefaultState()

  return useCallback(
    (state: State, action: Action): State => {
      switch (action.type) {
        case ActionType.ClearAllSelections:
          return clearAllSelectionsHandler(state, action, defaultState)
        case ActionType.ClearStoreItemsSelection:
          return clearStoreItemsSelectionHandler(state, action, defaultState)
        case ActionType.ClearTableItemsSelection:
          return clearTableItemsSelectionHandler(state, action, defaultState)
        case ActionType.ToggleStoreItemSelection:
          return toggleStoreItemSelectionHandler(state, action, defaultState)
        case ActionType.ToggleTableItemSelection:
          return toggleTableItemSelectionHandler(state, action, defaultState)
        case ActionType.AddItemsFromStore:
          return addItemsFromStoreHandler(state, action, defaultState)
        case ActionType.MoveItemsWithinTable:
          return moveItemsWithinTableHandler(state, action, defaultState)
        case ActionType.RemoveItem:
          return removeItemHandler(state, action, defaultState)
        case ActionType.SetValue:
          return setValueHandler(state, action, defaultState)
        default:
          return state
      }
    },
    [defaultState],
  )
}
