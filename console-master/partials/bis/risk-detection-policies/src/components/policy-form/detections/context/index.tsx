import { noop } from 'lodash-es'
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { DragStart, DropResult } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'

import type { ActorDetectionType, RiskLevel } from '@ues-data/shared-types'

import type { DetectionsValue } from '../../../../model'
import {
  addItemsFromStore,
  clearAllSelections,
  clearStoreItemsSelection,
  clearTableItemsSelection,
  moveItemsWithinTable,
  removeItem,
  setValue,
  toggleStoreItemSelection,
  toggleTableItemSelection,
  useDefaultState,
  useReducerFunction,
} from './state'

export interface DetectionsContextProviderProps {
  value?: DetectionsValue
  onChange?: (value: DetectionsValue) => void
}

export interface DetectionsContextValue {
  value: DetectionsValue
  store: {
    selection: Set<ActorDetectionType>
    toggleItemSelection: (detectionType: ActorDetectionType) => void
    clearSelection: () => void
  }
  table: {
    selection: Set<ActorDetectionType>
    toggleItemSelection: (detectionType: ActorDetectionType) => void
    clearSelection: () => void
    removeItem: (detectionType: ActorDetectionType) => void
  }
}

export const DetectionsContext = React.createContext<DetectionsContextValue>({
  value: [],
  store: {
    selection: new Set(),
    toggleItemSelection: noop,
    clearSelection: noop,
  },
  table: {
    selection: new Set(),
    toggleItemSelection: noop,
    clearSelection: noop,
    removeItem: noop,
  },
})

export const useDetectionsContext = () => useContext(DetectionsContext)

export const DetectionsContextProvider: React.FC<DetectionsContextProviderProps> = ({ children, value, onChange }) => {
  const defaultState = useDefaultState()
  const reducer = useReducerFunction()
  const [state, dispatch] = useReducer(reducer, defaultState)
  const groupingButtonPressedRef = useRef(false)

  useEffect(() => {
    if (value) {
      dispatch(setValue(value))
    }
  }, [value])

  const onTableDrop = useCallback((result: DropResult) => {
    const riskLevel = result.destination?.droppableId as RiskLevel
    const detectionType = result.draggableId as ActorDetectionType

    if (!riskLevel) {
      return
    }

    if (result.source.droppableId === 'store') {
      dispatch(addItemsFromStore(riskLevel, result.destination?.index ?? 0, detectionType))
    } else {
      dispatch(moveItemsWithinTable(riskLevel, result.destination?.index ?? 0, detectionType))
    }
  }, [])

  const onDragStart = useCallback(
    (initial: DragStart) => {
      const detectionType = initial.draggableId as ActorDetectionType
      const isFromStore = initial.source.droppableId === 'store'
      const sourceSelection = isFromStore ? state.store.selection : state.table.selection

      if (sourceSelection[detectionType]) {
        if (isFromStore) {
          dispatch(clearTableItemsSelection())
        } else {
          dispatch(clearStoreItemsSelection())
        }
      } else {
        dispatch(clearAllSelections())
      }
    },
    [state.store.selection, state.table.selection],
  )

  useEffect(() => {
    if (onChange) {
      onChange(state.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.value])

  useEffect(() => {
    const clearAllSelectionsOnClickAway = (event: MouseEvent) => {
      if (!event.defaultPrevented) {
        dispatch(clearAllSelections())
      }
    }

    const updateGroupSelectionButtonPressed = (event: KeyboardEvent) => {
      if (!event.defaultPrevented) {
        const isUsingMacOS = navigator.userAgent.indexOf('Mac OS') >= 0
        const isCorrectButton = isUsingMacOS ? event.key === 'Meta' : event.key === 'Control'

        if (isCorrectButton) {
          groupingButtonPressedRef.current = event.type === 'keydown'
        }
      }
    }

    const clearSelectionOnEscapeButtonClick = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && event.key === 'Escape') {
        dispatch(clearAllSelections())
      }
    }

    const resetGroupSelectionButtonPressed = () => {
      groupingButtonPressedRef.current = false
    }

    const handlers: [string, (event: Event) => void][] = [
      ['blur', resetGroupSelectionButtonPressed],
      ['click', clearAllSelectionsOnClickAway],
      ['keydown', clearSelectionOnEscapeButtonClick],
      ['keydown', updateGroupSelectionButtonPressed],
      ['keyup', updateGroupSelectionButtonPressed],
    ]

    handlers.forEach(([event, handler]) => {
      window.addEventListener(event, handler)
    })

    return () => handlers.forEach(([event, handler]) => window.removeEventListener(event, handler))
  }, [])

  const storeSelectionSet = useMemo(() => new Set(Object.keys(state.store.selection) as ActorDetectionType[]), [
    state.store.selection,
  ])
  const clearStoreSelectionFn = useCallback(() => dispatch(clearStoreItemsSelection()), [])
  const toggleStoreItemSelectionFn = useCallback(
    (detectionType: ActorDetectionType) => dispatch(toggleStoreItemSelection(detectionType, groupingButtonPressedRef.current)),
    [],
  )

  const tableSelectionSet = useMemo(() => new Set(Object.keys(state.table.selection) as ActorDetectionType[]), [
    state.table.selection,
  ])
  const clearTableSelectionFn = useCallback(() => dispatch(clearTableItemsSelection()), [])
  const removeTableItemFn = useCallback((detectionType: ActorDetectionType) => dispatch(removeItem(detectionType)), [])
  const toggleTableItemSelectionFn = useCallback(
    (detectionType: ActorDetectionType) => dispatch(toggleTableItemSelection(detectionType, groupingButtonPressedRef.current)),
    [],
  )

  const contextValue = useMemo<DetectionsContextValue>(
    () => ({
      value: state.value,
      store: {
        clearSelection: clearStoreSelectionFn,
        selection: storeSelectionSet,
        toggleItemSelection: toggleStoreItemSelectionFn,
      },
      table: {
        clearSelection: clearTableSelectionFn,
        removeItem: removeTableItemFn,
        selection: tableSelectionSet,
        toggleItemSelection: toggleTableItemSelectionFn,
      },
    }),
    [
      clearStoreSelectionFn,
      clearTableSelectionFn,
      removeTableItemFn,
      state.value,
      storeSelectionSet,
      tableSelectionSet,
      toggleStoreItemSelectionFn,
      toggleTableItemSelectionFn,
    ],
  )

  return (
    <DragDropContext onDragEnd={onTableDrop} onDragStart={onDragStart}>
      <DetectionsContext.Provider value={contextValue}>{children}</DetectionsContext.Provider>
    </DragDropContext>
  )
}
