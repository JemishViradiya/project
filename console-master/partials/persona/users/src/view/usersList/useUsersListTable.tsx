import orderBy from 'lodash-es/orderBy'
import type { ReactNode } from 'react'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Link from '@material-ui/core/Link'

import type { UserItem, ZoneInfo } from '@ues-data/persona'
import { queryUsers } from '@ues-data/persona'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { I18nFormats } from '@ues/assets'
import type { TableColumn } from '@ues/behaviours'
import {
  ColumnPicker,
  FILTER_TYPES,
  TableSortDirection,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  usePagination,
  useSelected,
  useSort,
} from '@ues/behaviours'

import { ROUTES, USER_STATE_I18N_MAP } from '../../constants'
import { LastOnlineFilter } from './filters/lastOnlineFilter'
import { StateFilterComponent } from './filters/stateFilter'
import { UserNameFilterComponent } from './filters/userNameFilter'
import { ZonesFilterComponent } from './filters/zonesFilter'
import { UserListColumnKey } from './userList.types'
import { idFunction, mapActiveFiltersToParams } from './userList.utils'

const renderUsernameCell = ({ id, userName }: UserItem) => (
  <Link
    href={ROUTES.USER_DETAILS.replace(':id', id)}
    variant="body2"
    style={{
      wordBreak: 'break-word',
    }}
  >
    {userName}
  </Link>
)

const renderZonesCell = (zones: ZoneInfo[]): ReactNode => {
  if (zones.length === 0) return ''

  const orderedZones = orderBy(zones, 'name')
  return orderedZones.map((zone, index) => {
    const link = (
      <Link href={ROUTES.VENUE_ZONE_DETAILS.replace(':id', zone.id)} variant="body2" data-autoid={`user-zone-link-${zone.id}`}>
        {zone.name}
      </Link>
    )
    return (
      <span key={zone.id}>
        {index < orderedZones.length - 1 ? (
          <>
            {link}
            {', '}
          </>
        ) : (
          link
        )}
      </span>
    )
  }, [])
}

export const useUsersListTable = () => {
  const { t, i18n } = useTranslation(['persona/common'])

  const columns: TableColumn<UserItem>[] = useMemo(
    () => [
      {
        label: t('users.columns.userName'),
        dataKey: UserListColumnKey.Username,
        sortable: true,
        show: true,
        persistent: true,
        renderCell: rowData => renderUsernameCell(rowData),
        filterType: FILTER_TYPES.OBJECT_AUTOCOMPLETE,
        renderFilter: () => <UserNameFilterComponent />,
        width: 150,
      },
      {
        label: t('users.columns.state'),
        dataKey: UserListColumnKey.State,
        sortable: true,
        show: true,
        persistent: false,
        renderCell: rowData => t(USER_STATE_I18N_MAP[rowData.state]),
        filterType: FILTER_TYPES.RADIO,
        renderFilter: () => <StateFilterComponent />,
        width: 80,
      },
      {
        label: t('users.columns.lastOnline'),
        dataKey: UserListColumnKey.LastOnline,
        sortable: true,
        show: true,
        persistent: false,
        renderCell: ({ lastEventTime }) => {
          return lastEventTime ? i18n.format(lastEventTime, I18nFormats.DateTimeShort) : undefined
        },
        filterType: FILTER_TYPES.DATE_RANGE,
        renderFilter: () => <LastOnlineFilter />,
        width: 150,
      },
      {
        label: t('users.columns.zones'),
        dataKey: UserListColumnKey.Zones,
        sortable: true,
        show: true,
        persistent: false,
        renderCell: rowData => renderZonesCell(rowData.zones),
        filterType: FILTER_TYPES.OBJECT_AUTOCOMPLETE,
        renderFilter: () => <ZonesFilterComponent />,
        width: 300,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })
  const sortingProps = useSort(UserListColumnKey.Username, TableSortDirection.Asc)
  const selectedProps = useSelected('id')
  const paginationProps = usePagination(1, 10)
  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const queryVars = useMemo(
    () => ({
      page: paginationProps.page,
      rowsPerPage: paginationProps.rowsPerPage,
      sort: sortingProps.sort,
      sortDirection: sortingProps.sortDirection,
      filters: mapActiveFiltersToParams(filterProps.activeFilters),
    }),
    [filterProps.activeFilters, paginationProps.page, paginationProps.rowsPerPage, sortingProps.sort, sortingProps.sortDirection],
  )

  const { data, loading, fetchMore } = useStatefulReduxQuery(queryUsers, {
    variables: queryVars,
  })

  const refreshUsersList = useCallback(() => {
    fetchMore(queryVars)
    selectedProps.resetSelectedItems()
  }, [fetchMore, queryVars, selectedProps])

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      loading,
    }),
    [displayedColumns, loading, columnPickerProps],
  )

  const rows = data?.data ?? []

  const tableProps = {
    noDataPlaceholder: t('users.noData'),
  }

  const getSelected = rows?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  return {
    tableProps,
    providerProps: {
      basicProps,
      sortingProps,
      filterProps,
      selectedProps,
      paginationProps,
      data: rows,
      meta: data?.meta,
    },
    filterPanelProps: { ...filterProps, ...filterLabelProps },
    refreshUsersList,
    getSelected,
  }
}
