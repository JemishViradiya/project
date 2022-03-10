import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react'

import type { GeozoneEntity } from './model'

type CoordinatedDataSelectionProviderProps = {
  selected?: GeozoneEntity
  highlighted?: GeozoneEntity
  select: (zone: GeozoneEntity) => void
  highlight: (zone: GeozoneEntity) => void
}

const CoordinatedDataSelectionContext = createContext<CoordinatedDataSelectionProviderProps>(null)
export const useCoordinatedDataSelectionContext = () => useContext(CoordinatedDataSelectionContext)

enum ReducerActionType {
  Select,
  Highlight,
}

interface ReducerState {
  selected?: GeozoneEntity
  highlighted?: GeozoneEntity
}

interface ReducerActionSelect {
  type: ReducerActionType.Select
  selected: GeozoneEntity
}

interface ReducerActionHighlight {
  type: ReducerActionType.Highlight
  highlighted: GeozoneEntity
}

type ReducerAction = ReducerActionSelect | ReducerActionHighlight

const reducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  switch (action.type) {
    case ReducerActionType.Select:
      return {
        ...state,
        selected: action.selected,
      }
    case ReducerActionType.Highlight:
      return {
        ...state,
        highlighted: action.highlighted,
      }
  }
}

export const CoordinatedDataSelectionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {})
  const select = useCallback((zone: GeozoneEntity) => {
    dispatch({
      type: ReducerActionType.Select,
      selected: zone,
    })
  }, [])
  const highlight = useCallback((zone: GeozoneEntity) => {
    dispatch({
      type: ReducerActionType.Highlight,
      highlighted: zone,
    })
  }, [])
  const value = useMemo<CoordinatedDataSelectionProviderProps>(
    () => ({
      ...state,
      select,
      highlight,
    }),
    [highlight, select, state],
  )
  return <CoordinatedDataSelectionContext.Provider value={value}>{children}</CoordinatedDataSelectionContext.Provider>
}
