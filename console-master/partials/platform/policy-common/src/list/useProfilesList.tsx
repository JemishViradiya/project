import { isEqual } from 'lodash-es'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Link as MuiLink } from '@material-ui/core'

import { I18nFormats } from '@ues/assets'
import type { DraggableTableProps, DraggableTableProviderInputProps, TableColumn, TableSortDirection } from '@ues/behaviours'
import {
  ColumnPicker,
  useClientSearch,
  useClientSort,
  useColumnPicker,
  useDraggableTable,
  useSelected,
  useSort,
} from '@ues/behaviours'

type UseProfilesListInput = {
  rankable?: boolean
  getNamePath?: (profile) => string
  getUsersPath?: (profile) => string
  getGroupsPath?: (profile) => string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[]
  setRankingSaved?: (boolean) => void
  selectionEnabled?: boolean
  loading?: boolean
  tableName?: string
}

type UseProfilesListReturn = {
  tableProps: DraggableTableProps
  rankMode: boolean
  setRankMode: (mode: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedItems: any[]
  unselectAll: () => void
  handleSearch: (str: string) => void
  resetDrag: () => void
  providerProps: Omit<DraggableTableProviderInputProps, 'children'>
}

enum PolicyColumns {
  RANK = 'rank',
  NAME = 'name',
  DESCRIPTION = 'description',
  USER_COUNT = 'userCount',
  GROUP_COUNT = 'groupCount',
  CREATED = 'created',
  MODIFIED = 'modified',
}

const columnIdentifier = PolicyColumns.NAME
const idFunction = rowData => rowData.entityId

const displayModifiedData = (created, modified) => modified && created !== modified
const modifiedColumnClientSortableDataAccessor = ({ created, modified }) =>
  displayModifiedData(created, modified) ? modified : undefined

export const useProfilesList = ({
  rankable = false,
  getNamePath = profile => '#',
  getUsersPath = profile => '#',
  getGroupsPath = profile => '#',
  data,
  setRankingSaved = () => {
    //do nothing if undefined
  },
  selectionEnabled = true,
  loading = false,
  tableName = 'policiesTable',
}: UseProfilesListInput): UseProfilesListReturn => {
  const { t, i18n } = useTranslation(['profiles'])
  const [rankMode, setRankMode] = useState(false)
  const [searchString, setSearchString] = useState<string>()

  const columns: TableColumn[] = useMemo(
    () => {
      const rawColumns: TableColumn[] = [
        {
          label: t('policy.list.columns.name'),
          dataKey: PolicyColumns.NAME,
          renderCell: rowData => (
            <MuiLink component={Link} to={getNamePath(rowData)}>
              {rowData.default ? t('policy.defaultPolicyName') : rowData.name}
            </MuiLink>
          ),
          persistent: true,
          clientSortable: true,
        },
        {
          label: t('policy.list.columns.description'),
          dataKey: PolicyColumns.DESCRIPTION,
        },
        {
          label: t('policy.list.columns.userCount'),
          dataKey: PolicyColumns.USER_COUNT,
          renderCell: rowData => (
            <MuiLink component={Link} to={getUsersPath(rowData)}>
              {rowData.userCount}
            </MuiLink>
          ),
          clientSortable: true,
        },
        {
          label: t('policy.list.columns.groupCount'),
          dataKey: PolicyColumns.GROUP_COUNT,
          renderCell: rowData => (
            <MuiLink component={Link} to={getGroupsPath(rowData)}>
              {rowData.groupCount}
            </MuiLink>
          ),
          clientSortable: true,
        },
        {
          label: t('policy.list.columns.added'),
          dataKey: PolicyColumns.CREATED,
          renderCell: ({ created }) => created && i18n.format(created, I18nFormats.DateTimeForEvents),
          clientSortable: true,
        },
        {
          label: t('policy.list.columns.modified'),
          dataKey: PolicyColumns.MODIFIED,
          renderCell: ({ created, modified }) =>
            displayModifiedData(created, modified) && i18n.format(modified, I18nFormats.DateTimeForEvents),
          clientSortable: true,
          clientSortableDataAccessor: modifiedColumnClientSortableDataAccessor,
        },
      ]
      if (rankable) {
        rawColumns.unshift({
          label: t('policy.list.columns.rank'),
          dataKey: PolicyColumns.RANK,
          clientSortable: true,
          persistent: true,
        })
      }
      return rawColumns
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, rankable],
  )

  const sortingProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortingProps

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns, title: t('policy.list.columnPicker'), tableName })
  const selectedProps = useSelected('entityId', undefined, undefined, (rowData: any) => rowData.default !== true)

  const draggable = rankMode
    ? {
        onDragChange: ({ updatedDataSource }) => {
          isEqual(data, updatedDataSource) ? setRankingSaved(true) : setRankingSaved(false)
        },
        onDataReorder: (rowData, index) => ({ ...rowData, rank: index + 1 }),
      }
    : undefined

  const filteredData = useClientSearch({ data, searchColumns: ['name', 'description'], searchString })
  const sortParams = useMemo(
    () => ({
      data: filteredData,
      sort: { sortBy: sort, sortDir: sortDirection as TableSortDirection },
      dataAccessor: displayedColumns.find(column => sort === column.dataKey)?.clientSortableDataAccessor,
    }),
    [displayedColumns, filteredData, sort, sortDirection],
  )
  const sortedData = useClientSort(sortParams)

  const { data: processedData, draggableProps, resetDrag } = useDraggableTable({
    initialData: sortedData,
    idFunction,
    draggable,
  })

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      columnIdentifier: columnIdentifier,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      idFunction,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const unselectAll = () => {
    // eslint-disable-next-line no-unused-expressions
    selectedProps?.resetSelectedItems()
  }

  const tableProps = { noDataPlaceholder: t('policy.list.noData'), data: processedData }

  const providerProps = {
    basicProps,
    draggableProps,
    sortingProps,
    selectedProps: selectionEnabled ? selectedProps : undefined,
  }

  const selectedItems = useMemo(() => {
    return data.filter(i => selectedProps?.selected.includes(i.entityId))
  }, [data, selectedProps.selected])

  return {
    unselectAll,
    tableProps,
    providerProps,
    rankMode,
    setRankMode,
    selectedItems,
    handleSearch: setSearchString,
    resetDrag,
  }
}
