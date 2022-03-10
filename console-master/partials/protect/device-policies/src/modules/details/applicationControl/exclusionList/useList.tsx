import difference from 'lodash/difference'
import React from 'react'

import { AppControlField } from '@ues-data/epp'
import type { FilterProps, SimpleFilter, TableProviderProps, UseFilterLabelsInterface } from '@ues/behaviours'
import { useClientTable, useFilter, useFilterLabels, useSelected, useSort, useToggle } from '@ues/behaviours'

import useColumns from './columns'
import type { AddDialogProps, DeleteDialogProps } from './types'

interface UseListInterface {
  data: string[]
  tableProviderProps: Omit<TableProviderProps, 'children'>
  filterPanelProps: FilterProps<SimpleFilter<string>>
  filterLabels: UseFilterLabelsInterface<string>
  addDialogProps: AddDialogProps
  deleteDialogProps: DeleteDialogProps
}

const useList = (
  fields: Record<string, string>,
  values: Record<string, any>,
  setField: (name: string, value: string[]) => void,
): UseListInterface => {
  // dialog state

  const addDialogToggleProps = useToggle()

  const deleteDialogToggleProps = useToggle()

  // table state

  const sortingProps = useSort<string>(null)

  const filterProps = useFilter<SimpleFilter<string>>()

  const columns = useColumns()

  const filterLabels = useFilterLabels(filterProps.activeFilters, columns)

  const selectedProps = useSelected<string>(null, (row: string) => row)

  const { data } = useClientTable<string>({
    tableData: values[fields[AppControlField.allowed_folders]],
    sort: sortingProps.sort,
    sortDirection: sortingProps.sortDirection,
    activeFilters: filterProps.activeFilters,
    columns,
  })

  // table props

  const basicProps = React.useMemo(
    () => ({
      columns,
      idFunction: (row: string) => row,
    }),
    [columns],
  )

  // actions

  const onAdd = (folderPath: string) => {
    setField(fields[AppControlField.allowed_folders], [folderPath, ...values[fields[AppControlField.allowed_folders]]])
    addDialogToggleProps.onToggle()
  }

  const onDelete = () => {
    setField(
      fields[AppControlField.allowed_folders],
      difference(values[fields[AppControlField.allowed_folders]], selectedProps.selected),
    )
    selectedProps.resetSelectedItems()
    deleteDialogToggleProps.onToggle()
  }

  // hook interface
  return {
    data,
    tableProviderProps: {
      basicProps,
      sortingProps,
      filterProps,
      selectedProps,
    },
    filterPanelProps: { ...filterProps },
    filterLabels,
    addDialogProps: {
      isAddDialogOpen: addDialogToggleProps.isOn,
      onToggleAddDialog: addDialogToggleProps.onToggle,
      onAdd,
    },
    deleteDialogProps: {
      isDeleteDialogOpen: deleteDialogToggleProps.isOn,
      onToggleDeleteDialog: deleteDialogToggleProps.onToggle,
      onDelete,
    },
  }
}

export default useList
