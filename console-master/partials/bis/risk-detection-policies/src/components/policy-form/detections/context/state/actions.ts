import type { ActorDetectionType, RiskLevel } from '@ues-data/shared-types'

import type { DetectionsValue } from '../../../../../model'
import type {
  AddItemsFromStoreAction,
  ClearAllSelectionsAction,
  ClearStoreItemsSelectionAction,
  ClearTableItemsSelectionAction,
  MoveItemsWithinTableAction,
  RemoveItemAction,
  SetValueAction,
  ToggleStoreItemSelectionAction,
  ToggleTableItemSelectionAction,
} from './model'
import { ActionType } from './model'

export const toggleStoreItemSelection = (
  detectionType: ActorDetectionType,
  withinGroup: boolean,
): ToggleStoreItemSelectionAction => ({
  type: ActionType.ToggleStoreItemSelection,
  payload: {
    detectionType,
    withinGroup,
  },
})

export const clearStoreItemsSelection = (): ClearStoreItemsSelectionAction => ({
  type: ActionType.ClearStoreItemsSelection,
  payload: {},
})

export const addItemsFromStore = (
  riskLevel: RiskLevel,
  index: number,
  detectionType: ActorDetectionType,
): AddItemsFromStoreAction => ({
  type: ActionType.AddItemsFromStore,
  payload: {
    riskLevel,
    index,
    detectionType,
  },
})

export const moveItemsWithinTable = (
  riskLevel: RiskLevel,
  index: number,
  detectionType: ActorDetectionType,
): MoveItemsWithinTableAction => ({
  type: ActionType.MoveItemsWithinTable,
  payload: {
    riskLevel,
    index,
    detectionType,
  },
})

export const clearTableItemsSelection = (): ClearTableItemsSelectionAction => ({
  type: ActionType.ClearTableItemsSelection,
  payload: {},
})

export const toggleTableItemSelection = (
  detectionType: ActorDetectionType,
  withinGroup: boolean,
): ToggleTableItemSelectionAction => ({
  type: ActionType.ToggleTableItemSelection,
  payload: {
    detectionType,
    withinGroup,
  },
})

export const removeItem = (detectionType: ActorDetectionType): RemoveItemAction => ({
  type: ActionType.RemoveItem,
  payload: {
    detectionType,
  },
})

export const clearAllSelections = (): ClearAllSelectionsAction => ({
  type: ActionType.ClearAllSelections,
  payload: {},
})

export const setValue = (value?: DetectionsValue): SetValueAction => ({
  type: ActionType.SetValue,
  payload: { value },
})
