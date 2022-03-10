// dependencies
import cond from 'lodash/cond'
import difference from 'lodash/difference'
import get from 'lodash/get'
import intersection from 'lodash/intersection'
import union from 'lodash/union'
import { useCallback, useState } from 'react'

export type UseSelected<TRow extends unknown> = {
  selected: string[]
  onSelect: (row: TRow, omit?: TOmit<TRow>, checked?: boolean) => void
  onSelectAll: (event: unknown, data: TRow[], omit?: (_: TRow) => boolean) => void
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  isSelected: (row: TRow) => boolean
  getNumSelectedOnPage: (pageData: TRow[]) => number
  resetSelectedItems: () => void
  isAllSelected?: (pageData: TRow[]) => boolean
  isSomeSelected?: (pageData: TRow[]) => boolean
  isSelectable: (rowData: TRow) => boolean
}

export type TOmit<TRow> = (row: TRow) => boolean

const defaultIdFunction = (r: any) => r.id

function useSelected<TRow extends unknown>(
  rowIdField: string,
  idFunction = defaultIdFunction,
  initialValues: string[] = [],
  isSelectable: UseSelected<TRow>['isSelectable'] = () => true,
): UseSelected<TRow> {
  // state
  const [selected, setSelected] = useState(initialValues)

  const getId = useCallback(
    row => {
      const idFromFunc = idFunction ? idFunction(row) : row
      return rowIdField ? row[rowIdField] : idFromFunc
    },
    [rowIdField, idFunction],
  )

  // actions
  const onSelect = useCallback(
    (row: TRow, omit: TOmit<TRow> = () => false) => {
      const rowId = getId(row)

      const newSelected = cond([
        [() => omit(row), () => [...selected]],
        [
          // already selected => unselect
          () => selected.includes(rowId),
          () => selected.filter(id => id !== rowId),
        ],
        // else add to selected
        [() => true, () => [...selected, rowId]],
      ])(undefined)

      setSelected(newSelected)
    },
    [getId, selected],
  )

  const onSelectAll = useCallback(
    (event, data: TRow[], omit: TOmit<TRow> = _row => false) => {
      const checked = get(event, 'target.checked', false)
      const selectedData = data.filter(d => !omit(d) && isSelectable(d)).map(d => getId(d))

      if (checked) {
        setSelected(union(selected, selectedData))
      } else {
        setSelected(difference(selected, selectedData))
      }
    },
    [getId, isSelectable, selected],
  )

  // utils
  const isSelected = useCallback((row: TRow) => selected.includes(getId(row)), [getId, selected])

  const getNumSelectedOnPage = useCallback(
    pageData =>
      intersection(
        selected,
        pageData.map(d => getId(d)),
      ).length,
    [getId, selected],
  )

  const resetSelectedItems = useCallback(() => setSelected([]), [])

  const isAllSelected = useCallback(
    pageData => {
      const checkableRows = pageData.filter(isSelectable)

      return selected.length > 0 && getNumSelectedOnPage(checkableRows) === checkableRows.length
    },
    [getNumSelectedOnPage, selected.length, isSelectable],
  )

  const isSomeSelected = useCallback(
    pageData => {
      const checkableRows = pageData.filter(isSelectable)

      return (
        selected.length > 0 &&
        (selected.length < checkableRows.length || getNumSelectedOnPage(checkableRows) < checkableRows.length)
      )
    },
    [getNumSelectedOnPage, selected.length, isSelectable],
  )

  // hook interface
  return {
    selected,
    onSelect,
    onSelectAll,
    setSelected,
    isSelected,
    getNumSelectedOnPage,
    resetSelectedItems,
    isAllSelected,
    isSomeSelected,
    isSelectable,
  }
}

export default useSelected
