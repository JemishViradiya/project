// dependencies
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { GridRowParams } from '@material-ui/x-grid'

import type { XGridProps } from '@ues-behaviour/x-grid'
import type { DevicePolicyListItem, DevicePolicyListItemField } from '@ues-data/epp'
import { DEFAULT_DEVICE_POLICY_NAME } from '@ues-data/epp'
import type { ColumnPickerProps, FilterProps, SimpleFilter, TableProviderProps, UseFilterLabelsInterface } from '@ues/behaviours'
import { ColumnPicker, useClientTable, useFilter, useFilterLabels, useSelected, useSort } from '@ues/behaviours'

import { ROUTES } from './../../constants'
import { useColumns } from './columns'
import { LIST_NAME } from './constants'
import useListData from './useListData'

const omit = (row: DevicePolicyListItem) => row.policy_name === DEFAULT_DEVICE_POLICY_NAME

interface UseListInterface {
  tableProviderProps: Omit<TableProviderProps, 'children'>
  xGridProps: XGridProps
  filterPanelProps: FilterProps<SimpleFilter<string>>
  filterLabels: UseFilterLabelsInterface<string>
  totalCount: number
  isDeleteDialogOpen: boolean
  onGoToAddPolicy: () => void
  onToggleDeleteDialogOpen: () => void
  onDeletePolicies: () => void
}

const useList = (): UseListInterface => {
  const navigate = useNavigate()

  // navigation

  const onGoToAddPolicy = useCallback(() => {
    navigate(ROUTES.AddPolicy)
  }, [navigate])

  // state

  const { data, loading } = useListData()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // table state

  const sortingProps = useSort<DevicePolicyListItemField>(null)

  const filterProps = useFilter<SimpleFilter<string>>()

  const columnProps = useColumns(data)

  const filterLabels = useFilterLabels(filterProps.activeFilters, columnProps.allColumns)

  const selectedProps = useSelected<DevicePolicyListItem>('tenant_policy_id', undefined, [], row => !omit(row))

  const { data: rows, total } = useClientTable({
    tableData: data,
    sort: sortingProps.sort,
    sortDirection: sortingProps.sortDirection,
    activeFilters: filterProps.activeFilters,
    columns: columnProps.displayedColumns,
  })

  // actions

  const onToggleDeleteDialogOpen = useCallback(() => setIsDeleteDialogOpen(isOpen => !isOpen), [])

  const onDeletePolicies = useCallback(() => {
    // --TODO: submit delete request

    onToggleDeleteDialogOpen()
  }, [onToggleDeleteDialogOpen])

  const isRowSelectable = useCallback((params: GridRowParams) => {
    return params.row.policy_name !== DEFAULT_DEVICE_POLICY_NAME
  }, [])

  // table props

  const basicProps = useMemo(
    () => ({
      columns: columnProps.displayedColumns,
      columnPicker: (props: ColumnPickerProps) => <ColumnPicker {...columnProps.columnPickerProps} {...props} />,
      idFunction: (row: DevicePolicyListItem) => row.tenant_policy_id,
      loading,
    }),
    [columnProps.displayedColumns, columnProps.columnPickerProps, loading],
  )

  // hook interface

  return {
    tableProviderProps: {
      basicProps,
      sortingProps,
      filterProps,
      selectedProps,
    },
    xGridProps: {
      tableName: LIST_NAME,
      rows,
      loading,
      checkboxSelection: true,
      isRowSelectable,
    },
    filterPanelProps: { ...filterProps },
    filterLabels,
    totalCount: total,
    isDeleteDialogOpen,
    onGoToAddPolicy,
    onToggleDeleteDialogOpen,
    onDeletePolicies,
  }
}

export default useList
