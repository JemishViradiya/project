import { cond } from 'lodash-es'
import { useState } from 'react'

const emptyColumns = []
const useColumns = (columns = emptyColumns) => {
  const [cols, setCols] = useState(columns)

  const setVisibility = index => {
    const newCols = [...cols]
    newCols[index].show = !newCols[index].show
    setCols(newCols)
  }

  const isColumnVisible = id => cols.find(col => col.id === id && col.show)

  return {
    cols,
    setVisibility,
    isColumnVisible,
  }
}

const usePopover = () => {
  const [popoverAnchorEl, setAnchorEl] = useState(null)

  const handlePopoverClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const popoverIsOpen = Boolean(popoverAnchorEl)

  return {
    popoverAnchorEl,
    handlePopoverClick,
    handlePopoverClose,
    popoverIsOpen,
  }
}

function useSelected(rowIdField) {
  // state
  const [selected, setSelected] = useState([])

  // actions

  const onSelect = row => {
    const rowId = row[rowIdField]
    const newSelected = cond([
      [
        // already selected => unselect
        () => selected.includes(rowId),
        () => selected.filter(id => id !== rowId),
      ],
      // else add to selected
      [() => true, () => [...selected, rowId]],
    ])()

    setSelected(newSelected)
  }

  const onSelectAll = ({ target: { checked } }, data) =>
    cond([
      [
        // select all checked => add each rowId to selected
        () => checked,
        () => {
          const newSelected = data.map(d => d[rowIdField])
          setSelected(newSelected)
        },
      ],
      // else clear selected
      [() => true, () => setSelected([])],
    ])()

  // utils

  const isSelected = row => selected.includes(row[rowIdField])

  // hook interface
  return {
    selected,
    onSelect,
    onSelectAll,
    setSelected,
    isSelected,
  }
}

export { useColumns, usePopover, useSelected }
