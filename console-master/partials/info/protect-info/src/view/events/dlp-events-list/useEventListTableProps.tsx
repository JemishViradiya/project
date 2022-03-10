/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { TFunction } from 'i18next'
import { isEmpty, some } from 'lodash-es'
import type { Moment } from 'moment'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@material-ui/core'

import { EVENTS_SORT_BY, EventsData } from '@ues-data/dlp'
import { useStatefulReduxQuery } from '@ues-data/shared'
import { Hooks } from '@ues-info/shared'
import { I18nFormats, useTextCellStyles } from '@ues/assets'
import type { SimpleFilter, TableProviderProps } from '@ues/behaviours'
import {
  ColumnPicker,
  DatePickerFilter,
  FILTER_TYPES,
  OPERATOR_VALUES,
  QuickSearchFilter,
  RadioFilter,
  useColumnPicker,
  useDatePickerFilter,
  useFilter,
  useFilterLabels,
  useQuickSearchFilter,
  useRadioFilter,
  useSnackbar,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useEventsPermissions } from './useEventsPermission'
import { buildEventListQuery } from './utils'

const TABLE_NAME = 'dlpEventList'
const FETCH_BATCH_SIZE = 200

const eventTypes = ['browser', 'email', 'removable media']
const eventTypesLabels = (t: TFunction) => {
  const labels = {}
  eventTypes.forEach(r => (labels[r] = t(`dashboard.exfiltrationEventTypes.${r.replace(' ', '_').toUpperCase()}`)))
  return labels
}
const getFilterLabels = t => {
  return { ...eventTypesLabels(t) }
}

const DetectionTimeFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<Moment>>()
  const props = useDatePickerFilter({ filterProps, key: 'violationTime', defaultOperator: OPERATOR_VALUES.EQUAL })
  return <DatePickerFilter label={label} operators={null} {...props} />
})

const DeviceFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'clientName', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const UserFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'userName', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

const ActivityFilterComponent: React.FC<{ fieldName: string; label: string; t: TFunction }> = memo(({ fieldName, label, t }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useRadioFilter({ filterProps, key: fieldName })
  return <RadioFilter label={label} items={eventTypes} itemsLabels={eventTypesLabels(t)} {...props} />
})

const LocationFilterComponent: React.FC<{ label: string }> = memo(({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'locations', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={null} {...props} />
})

type UseEventListInput = {
  handleRowClick?: any
  userId?: string
}

type UseEventListReturn = {
  tableProps: any
  providerProps: Omit<TableProviderProps, 'children'>
  filterLabelProps: any
}

const DEFAULT_SORT_BY = `${EVENTS_SORT_BY.violationTime}_DESC`

const idFunction = rowData => rowData?.eventUUID
export const useEventListTableProps = ({ handleRowClick, userId }: UseEventListInput): UseEventListReturn => {
  const { t, i18n } = useTranslation(['dlp/common', 'tables'])
  const snackbar = useSnackbar()
  const locationState = Hooks.useEventsLocationState()
  const [tableData, setTableData] = useState([])
  const [urlQueryParams, setUrlQueryParams] = useState({})
  const [eventQueryVariables, setEventQueryVariables] = useState({})
  const { fileHashes, userIds, deviceIds, ...rest } = locationState
  console.log('locationState', locationState)
  const { ellipsisTextCell } = useTextCellStyles()

  const [eventsListRequestBody, setEventsListRequestBody] = useState({})
  useEffect(
    () => {
      const eventsListPayloadValues = Object.entries({ fileHashes, userIds, deviceIds }).filter((k, i) => {
        return !!k[1]
      })
      if (eventsListPayloadValues.length) {
        const entries = eventsListPayloadValues.reduce((acc, k) => ({ ...acc, [k[0]]: k[1] }), {})
        setEventsListRequestBody(entries)
      }
      if (userId) {
        setEventsListRequestBody({ ...eventsListRequestBody, userIds: [userId] })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fileHashes, userIds, deviceIds, userId],
  )

  const { canReadDevice, canReadUsers } = useEventsPermissions()

  const columns = useMemo(
    () => [
      {
        label: t('events.columns.detectionTime'),
        dataKey: 'violationTime',
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.DATE_PICKER,
        renderCell: rowData => {
          return <div>{i18n.format(rowData['violationTime'], I18nFormats.DateTimeForEvents)}</div>
        },
        renderFilter: () => <DetectionTimeFilterComponent label={t('events.filter.detectionTime')} />,
        width: 10,
      },
      {
        label: t('events.columns.device'),
        dataKey: 'clientName',
        sortable: true,
        show: true,
        persistent: false,
        hidden: !canReadDevice,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DeviceFilterComponent label={t('events.filter.device')} />,
        width: 30,
      },
      {
        label: t('events.columns.user'),
        dataKey: 'userName',
        sortable: true,
        show: true,
        persistent: false,
        hidden: !!userId || !canReadUsers,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: (rowData: any) => {
          const { userId, userName } = rowData
          return (
            <div className={ellipsisTextCell}>
              {userId ? (
                userName ? (
                  <Link
                    variant="inherit"
                    color="primary"
                    href={`/uc/info#/users/${userId}`}
                    onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
                  >
                    {userName}
                  </Link>
                ) : (
                  t('events.columns.noUserName')
                )
              ) : (
                userName || t('events.columns.noUserName')
              )}
            </div>
          )
        },
        renderFilter: () => <UserFilterComponent label={t('events.filter.user')} />,
        width: 10,
      },
      {
        label: t('events.columns.activity'),
        dataKey: 'eventType',
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <ActivityFilterComponent fieldName="eventType" t={t} label={t('events.filter.activity')} />,
        renderCell: (rowData: any) => t(`dashboard.exfiltrationEventTypes.${rowData['eventType']}`),
        width: 5,
      },
      {
        label: t('events.columns.location'),
        dataKey: 'locations',
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: (rowData: any) => {
          const locations = rowData['locations']
          return <div className={ellipsisTextCell}>{locations ? locations.join(', ') : undefined}</div>
        },
        renderFilter: () => <LocationFilterComponent label={t('events.filter.location')} />,
        width: 30,
      },
      {
        label: t('events.columns.file'),
        dataKey: 'fileCount',
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        width: 5,
      },
      {
        label: t('events.columns.policy'),
        dataKey: 'policyCount',
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        width: 5,
      },
      {
        label: t('events.columns.dataEntityCount'),
        dataKey: 'dataEntityCount',
        sortable: false,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        width: 5,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const sortingProps = useSort('violationTime', 'desc')
  const { sort, sortDirection } = sortingProps

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns, getFilterLabels(t))

  // Filtering queries in request url
  const filterQuery = useMemo(() => buildEventListQuery(filterProps.activeFilters), [filterProps.activeFilters])

  useEffect(
    () => {
      setUrlQueryParams({ ...rest, ...filterQuery })
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterQuery],
  )
  const variables = useMemo(
    () => {
      const initialSearchQueryParams = {
        sortBy: `${EVENTS_SORT_BY[sort]}_${sortDirection.toUpperCase()}` || DEFAULT_SORT_BY,
        limit: FETCH_BATCH_SIZE,
      }
      const result = !Object.keys(urlQueryParams).length
        ? initialSearchQueryParams
        : { ...initialSearchQueryParams, ...urlQueryParams }
      console.debug(`variables = ${JSON.stringify(result)}`)
      setEventQueryVariables(result)
      return result
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [urlQueryParams, sort, sortDirection],
  )
  // TODO add search if needed
  // const filteredData = useClientSearch({ data?.elements , searchColumns: ['name', 'description'], searchString })
  const variablesRequest = useMemo(
    () => ({
      queryParams: eventQueryVariables,
      eventsListRequestBody,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventQueryVariables],
  )

  const {
    error: eventListError,
    loading: eventListLoading,
    data: eventListData,
    refetch,
    fetchMore,
  } = useStatefulReduxQuery(EventsData.queryEventList, { variables: variablesRequest })

  useEffect(() => {
    if (eventListError && !eventListLoading) {
      // TODO: enhance error handler
      snackbar.enqueueMessage(t('events.serverError.retrieveEvents'), 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventListError, eventListLoading, t])
  const data = eventListData

  // DEBUG START.
  // fetchMoreTest is returned by useStatefulReduxQuery
  // const fetchMoreTest: (variables?: unknown) => unknown | Promise<unknown> = null
  // DEBUG END

  useEffect(
    () => {
      if (eventListData) {
        setTableData([...tableData, ...eventListData?.elements])
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventListData],
  )

  useEffect(
    () => {
      if (eventListData) {
        setTableData([])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortingProps.sort, sortingProps.sortDirection, filterQuery],
  )

  const onLoadMoreRows = useCallback(
    // TODO In some cases cursor endpoint is calling initially event user does not scroll down table content. Should be fixed!!
    async () => {
      if (
        !isEmpty(eventQueryVariables) &&
        (eventListData?.navigation?.next || (eventListData?.navigation?.next && eventListData?.navigation?.previous))
      ) {
        const result = await fetchMore({
          queryParams: { ...eventQueryVariables, cursor: eventListData.navigation.next },
          eventsListRequestBody,
        })
      }
      // testing check
      //fetchMore ? await fetchMore({ queryParams: variables, type: eventTypes }) : console.debug('no fetchMore function')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [eventListData, fetchMore],
  )

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
      filterProps: filterProps,
      loading: eventListLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const tableProps = {
    rows: tableData ?? [],
    tableName: TABLE_NAME,
    noRowsMessageKey: 'tables:noData',
    onRowClick: handleRowClick,
    onRowsScrollEnd: onLoadMoreRows,
    scrollEndThreshold: 100,
  }

  const providerProps = {
    sortingProps,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
  }

  return { tableProps, providerProps, filterLabelProps }
}
