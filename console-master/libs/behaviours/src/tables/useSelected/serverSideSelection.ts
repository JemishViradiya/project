import { get } from 'lodash-es'
import { useCallback, useMemo, useRef, useState } from 'react'

import type { TOmit, UseSelected } from './useSelected'
import useSelected from './useSelected'

const defaultIdFunction = (r: any) => r.id

export type SelectionModel = {
  allSelected: boolean
  selected: string[]
}

type ServerSideUseSelected<TRow extends unknown> = UseSelected<TRow> & {
  onLoadedSelect: (data: TRow[], reselect?: boolean) => void
  selectionModel: SelectionModel
  countSelected: (total: number) => number
}

export const useServerSideSelection = <TRow extends unknown>({
  idFunction = defaultIdFunction,
  initialValues = [],
}): ServerSideUseSelected<TRow> => {
  // Server selection model
  const allSelected = useRef(false)
  const [selected, setSelected] = useState(initialValues)

  const selectedProps = useSelected<TRow>(null, idFunction)

  const isAllSelected = useCallback(pageData => allSelected.current, [allSelected])

  const onSelectAll = useCallback(
    (event, data: TRow[], omit: TOmit<TRow> = _row => false) => {
      const checked = get(event, 'target.checked', false)
      allSelected.current = checked
      setSelected([])

      if (checked) {
        selectedProps?.onSelectAll(event, data, omit)
      } else {
        selectedProps?.resetSelectedItems()
      }
    },
    [selectedProps],
  )

  const onSelect = useCallback(
    (row: TRow, omit: TOmit<TRow> = () => false, checked = true) => {
      const shouldAdd = (checked && !allSelected.current) || (!checked && allSelected.current)
      setSelected(shouldAdd ? [...selected, idFunction(row)] : selected.filter(id => id !== idFunction(row)))

      selectedProps?.onSelect(row, omit)
    },
    [idFunction, selected, selectedProps],
  )

  const resetSelectedItems = useCallback(() => {
    allSelected.current = false
    setSelected([])

    selectedProps?.resetSelectedItems()
  }, [selectedProps])

  const onLoadedSelect = useCallback(
    (data: TRow[], reselect = false) => {
      if (data && allSelected.current) {
        let newData = []
        if (reselect) {
          newData = data.map(d => idFunction(d)).filter(d => !selected.includes(d))
        } else {
          newData = [...selectedProps?.selected, ...data.map(d => idFunction(d)).filter(d => !selected.includes(d))]
        }
        selectedProps?.setSelected(newData as string[])
      }
    },
    [idFunction, selectedProps, selected],
  )

  const selectionModel = useMemo(() => {
    return { allSelected: allSelected.current, selected }
  }, [selected])

  const countSelected = useCallback(
    total => {
      return allSelected.current ? total - selected.length : selected.length
    },
    [allSelected, selected],
  )

  return {
    ...selectedProps,
    isAllSelected,
    onSelectAll,
    onSelect,
    resetSelectedItems,
    onLoadedSelect,
    selectionModel,
    countSelected,
  }
}
