import isEmpty from 'lodash-es/isEmpty'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const defaultSelectionDefaults = {
  selectMode: true, // if falsy, it means we are in "deselectMode" and we should assume all are selected, except of these in "deselected"
  selectedAll: false,
  selected: {},
  deselected: {},
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useSelection = ({ idParam = 'id', pluralParam = 'ids', key } = {}) => {
  const historyKey = key ? `${key}.selection` : undefined
  const navigate = useNavigate()
  const selectionRef = useRef()
  const { pathname, state, search } = useLocation()
  if (!selectionRef.current) {
    const historyState = window.history?.state?.usr
    selectionRef.current = (historyState && historyState[historyKey]) || { ...defaultSelectionDefaults }
  }
  const [selection, applySelection] = useState(selectionRef.current)
  const setSelection = useCallback(
    props => {
      selectionRef.current = props
      if (historyKey) {
        const newState = {
          ...state,
          [historyKey]: selectionRef.current,
        }
        navigate({ pathname, search }, { replace: true, state: newState })
      }
      applySelection(props)
    },
    [navigate, historyKey, pathname, search, state],
  )

  const clearSelection = useCallback(() => setSelection({ ...defaultSelectionDefaults }), [setSelection])

  const onSelected = useCallback(
    (_, data, opts) => {
      const id = data[idParam]
      const selection = selectionRef.current
      if (selection.selectedAll) {
        if (opts && opts.total <= 1) {
          setSelection({
            ...selection,
            ...defaultSelectionDefaults,
          })
        } else {
          setSelection({
            ...selection,
            selectedAll: false,
            deselected: {
              [id]: data,
            },
          })
        }
        return
      }

      if (!isEmpty(selection.deselected)) {
        if (selection.deselected[id]) {
          const { [id]: _, ...newDeselected } = selection.deselected
          setSelection({
            ...selection,
            selectedAll: isEmpty(newDeselected),
            deselected: newDeselected,
          })
        } else {
          if (opts && opts.total <= Object.keys(selection.deselected).length + 1) {
            setSelection({
              ...selection,
              ...defaultSelectionDefaults,
            })
          } else {
            setSelection({
              ...selection,
              deselected: {
                ...selection.deselected,
                [id]: data,
              },
            })
          }
        }
        return
      }
      if (selection.selected[id]) {
        const { [id]: _, ...newSelected } = selection.selected
        setSelection({
          ...selection,
          selected: newSelected,
        })
      } else {
        setSelection({
          ...selection,
          selected: {
            ...selection.selected,
            [id]: data,
          },
        })
      }
    },
    [idParam, selectionRef, setSelection],
  )

  const onSelectAll = useCallback(
    () =>
      setSelection({
        selectMode: !selection.selectedAll ? false : !selection.selectMode,
        selectedAll: !selection.selectedAll,
        selected: {},
        deselected: {},
      }),
    [selection.selectMode, selection.selectedAll, setSelection],
  )

  const onSelectMultiple = useCallback(
    (data, selectedAll) => {
      setSelection({
        ...defaultSelectionDefaults,
        selectedAll,
        selected: data.reduce((acc, obj) => {
          acc[obj[idParam]] = obj
          return acc
        }, {}),
      })
    },
    [idParam, setSelection],
  )

  const getSelectionVariables = useMemo(() => {
    return {
      selectMode: selection.selectMode,
      [pluralParam]: selection.selectMode ? Object.keys(selection.selected) : Object.keys(selection.deselected),
    }
  }, [pluralParam, selection.deselected, selection.selectMode, selection.selected])

  const selectedCount = Object.keys(selection.selected).length
  const deselectedCount = Object.keys(selection.deselected).length

  const onDeleteSingle = useCallback(
    id => {
      const newSelection = selectionRef.current
      if (newSelection.selected[id]) {
        delete newSelection.selected[id]
        setSelection(newSelection)
      }
    },
    [selectionRef, setSelection],
  )

  const validateSelection = useCallback(
    data => {
      const selection = selectionRef.current
      let updateRequired = false
      for (const selectedPolicy in selection.selected) {
        if (!data.some(policy => policy.id === selectedPolicy)) {
          delete selection.selected[selectedPolicy]
          updateRequired = true
        }
      }
      if (updateRequired) setSelection(selection)
    },
    [selectionRef, setSelection],
  )

  return {
    selectionState: selection,
    selectionVariables: getSelectionVariables,
    onSelected,
    onSelectAll,
    onSelectMultiple,
    clearSelection,
    onDeleteSingle,
    selectedAll: selection.selectedAll,
    selectedCount,
    deselectedCount,
    validateSelection,
  }
}

export const hasEmptySelection = selection => {
  return !selection.selectedAll && isEmpty(selection.selected) && isEmpty(selection.deselected)
}

export const isSelected = (selection, id) => {
  if (selection.selectedAll) {
    return true
  }
  if (!isEmpty(selection.deselected)) {
    return !selection.deselected[id]
  }
  return !!selection.selected[id]
}

// export default useSelection
