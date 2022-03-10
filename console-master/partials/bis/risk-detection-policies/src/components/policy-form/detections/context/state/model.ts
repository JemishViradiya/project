import type { ActorDetectionType, RiskLevel } from '@ues-data/shared-types'

import type { DetectionsValue } from '../../../../../model'

// Actions
export enum ActionType {
  AddItemsFromStore,
  ClearStoreItemsSelection,
  ClearTableItemsSelection,
  MoveItemsWithinTable,
  RemoveItem,
  ToggleStoreItemSelection,
  ToggleTableItemSelection,
  ClearAllSelections,
  SetValue,
}

interface ActionWithPayload<TType extends ActionType, TPayload = any> {
  type: TType
  payload: TPayload
}

export type ToggleStoreItemSelectionAction = ActionWithPayload<
  ActionType.ToggleStoreItemSelection,
  { detectionType: ActorDetectionType; withinGroup: boolean }
>

export type ToggleTableItemSelectionAction = ActionWithPayload<
  ActionType.ToggleTableItemSelection,
  { detectionType: ActorDetectionType; withinGroup: boolean }
>

export type ClearStoreItemsSelectionAction = ActionWithPayload<ActionType.ClearStoreItemsSelection>

export type AddItemsFromStoreAction = ActionWithPayload<
  ActionType.AddItemsFromStore,
  {
    riskLevel: RiskLevel
    index: number
    detectionType: ActorDetectionType
  }
>

export type MoveItemsWithinTableAction = ActionWithPayload<
  ActionType.MoveItemsWithinTable,
  {
    riskLevel: RiskLevel
    index: number
    detectionType: ActorDetectionType
  }
>

export type ClearTableItemsSelectionAction = ActionWithPayload<ActionType.ClearTableItemsSelection>

export type RemoveItemAction = ActionWithPayload<ActionType.RemoveItem, { detectionType: ActorDetectionType }>

export type ClearAllSelectionsAction = ActionWithPayload<ActionType.ClearAllSelections>

export type SetValueAction = ActionWithPayload<ActionType.SetValue, { value?: DetectionsValue }>

export type Action =
  | AddItemsFromStoreAction
  | ClearAllSelectionsAction
  | ClearStoreItemsSelectionAction
  | ClearTableItemsSelectionAction
  | MoveItemsWithinTableAction
  | RemoveItemAction
  | ToggleStoreItemSelectionAction
  | ToggleTableItemSelectionAction
  | SetValueAction

// State
export interface State {
  value: DetectionsValue
  table: {
    selection: Record<string, true>
  }
  store: {
    selection: Record<string, true>
  }
}
