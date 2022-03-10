/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import type { BrowserDomain, Domain } from '@ues-data/dlp'
import type { InfiniteTableProps, InfiniteTableProviderInputProps, SimpleFilter } from '@ues/behaviours'
import {
  ColumnPicker,
  FILTER_TYPES,
  NumericRangeFilter,
  OPERATOR_VALUES,
  QuickSearchFilter,
  STRING_OPERATORS,
  useColumnPicker,
  useFilter,
  useFilterLabels,
  useNumericRangeFilter,
  useQuickSearchFilter,
  useSelected,
  useSort,
  useTableFilter,
} from '@ues/behaviours'

import { useDlpSettingsPermissions } from '../../useDlpSettingsPermissions'

const useStyles = makeStyles(theme => ({
  asLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}))

const NameFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'domain', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

const DescriptionFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<string>>()
  const props = useQuickSearchFilter({ filterProps, key: 'description', defaultOperator: OPERATOR_VALUES.CONTAINS })
  return <QuickSearchFilter label={label} operators={STRING_OPERATORS} {...props} />
}

const PoliciesAssignedFilterComponent = ({ label }) => {
  const filterProps = useTableFilter<SimpleFilter<[number, number]>>()
  const props = useNumericRangeFilter({ filterProps, key: 'policiesAssigned', min: 0, max: 100 })
  return <NumericRangeFilter label={label} min={0} max={100} {...props} />
}

type UseDomainInput = {
  data: any
  fetchMore?: (variables: any) => Promise<any>
  handleRowClick?: any
  onEdit?: (entity: BrowserDomain) => void
  selectionEnabled: boolean
}

type UseDomainReturn = {
  tableProps: InfiniteTableProps
  providerProps: Omit<InfiniteTableProviderInputProps, 'children'>
  filterLabelProps: any
  getSelected: any[]
  editDialogProps?: any
}

const idFunction = rowData => rowData.guid

export const useDomainTableProps = ({
  data,
  fetchMore,
  handleRowClick,
  onEdit,
  selectionEnabled,
}: UseDomainInput): UseDomainReturn => {
  const { canUpdate } = useDlpSettingsPermissions()
  const { t } = useTranslation(['dlp/common'])
  const classes = useStyles()
  const enabledText = t('setting.general.domain.columns.enabled')

  const defaultEditDialogProps = {
    openDialog: false,
    handleClose: () => {
      return
    },
    onEdit: onEdit,
    selectedItem: null,
  }
  const [editDialogProps, setEditDialogProps] = useState(defaultEditDialogProps)
  const [isOpenedDialog, setOpenedDialog] = useState(false)

  const onOpenEditDialog = (rowData: BrowserDomain) => {
    setEditDialogProps({
      openDialog: true,
      handleClose: () => {
        setEditDialogProps(defaultEditDialogProps)
      },
      onEdit: onEdit,
      selectedItem: rowData,
    })
  }

  const COLUMNS = useMemo(
    () => [
      {
        label: t('setting.general.domain.columns.guid'),
        dataKey: 'guid',
        sortable: true,
        show: false,
        persistent: true,
        clientSortable: true,
      },
      {
        label: t('setting.general.domain.columns.domainName'),
        dataKey: 'domain',
        sortable: true,
        show: true,
        persistent: true,
        clientSortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: rowData => {
          return canUpdate ? (
            <Link
              onClick={() => {
                onOpenEditDialog(rowData)
              }}
            >
              {rowData?.domain}
            </Link>
          ) : (
            <span>{rowData?.domain}</span>
          )
        },
        renderFilter: () => <NameFilterComponent label={t('setting.general.domain.filter.name')} />,
      },
      {
        label: t('setting.general.domain.columns.description'),
        dataKey: 'description',
        sortable: true,
        show: true,
        persistent: false,
        clientSortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderFilter: () => <DescriptionFilterComponent label={t('setting.general.domain.filter.description')} />,
      },
      {
        label: enabledText,
        dataKey: 'enabled',
        sortable: true,
        show: false,
        persistent: false,
        clientSortable: false,
      },
      {
        label: t('setting.general.domain.columns.policiesAssigned'),
        dataKey: 'policiesAssigned',
        sortable: true,
        show: true,
        persistent: false,
        clientSortable: true,
        renderCell: rowData =>
          rowData?.policiesAssigned > 0 ? (
            <Link onClick={() => console.log('link clicked')} className={classes.asLink}>
              {rowData?.policiesAssigned}
            </Link>
          ) : (
            0
          ),
        // filterType: FILTER_TYPES.NUMERIC_RANGE,
        // renderFilter: () => <PoliciesAssignedFilterComponent label={t('setting.general.domain.filter.policies')} />,
      },
      {
        label: `${enabledText}/${t('setting.general.domain.columns.disabled')}`,
        dataKey: 'enabled',
        sortable: true,
        show: true,
        persistent: false,
        clientSortable: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: rowData => (
          <Typography>{rowData?.enabled === 'true' ? enabledText : t('setting.general.domain.columns.disabled')}</Typography>
        ),
      },
      {
        label: t('setting.general.domain.columns.created'),
        dataKey: 'created',
        sortable: true,
        show: false,
        persistent: false,
        clientSortable: false,
      },
      {
        label: t('setting.general.domain.columns.updated'),
        dataKey: 'updated',
        sortable: true,
        show: false,
        persistent: false,
        clientSortable: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, enabledText, classes],
  )
  const columns = useMemo(() => COLUMNS.filter(col => col.show), [COLUMNS])

  const isRowLoaded = (prop: { index: number }) => data?.elements[prop.index] !== undefined ?? false

  const onLoadMoreRows = useCallback(
    async ({ startIndex, stopIndex }) => {
      const variables = {
        variables: { cursor: startIndex === 0 ? undefined : data?.cursor },
      }

      await fetchMore(variables)
    },
    [fetchMore, data],
  )

  const infinitLoader = {
    rowCount: data?.totals?.elements ?? 0,
    isRowLoaded: isRowLoaded,
    loadMoreRows: onLoadMoreRows,
    threshold: 30,
    minimumBatchSize: 50,
  }

  const { displayedColumns, columnPickerProps } = useColumnPicker({ columns: columns, title: t('tableColumns') })

  const sortingProps = useSort(null, 'asc')
  const selectedProps = useSelected('guid')

  const basicProps = useMemo(
    () => ({
      columns: displayedColumns,
      idFunction,
      columnPicker: props => <ColumnPicker {...columnPickerProps} {...props} />,
      onRowClick: handleRowClick,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayedColumns, columnPickerProps],
  )

  const filterProps = useFilter({})
  const filterLabelProps = useFilterLabels(filterProps.activeFilters, columns)

  const tableProps = {
    noDataPlaceholder: t('setting.list.noData'),
    infinitLoader,
  }

  const providerProps = {
    sortingProps,
    selectedProps: selectionEnabled ? selectedProps : undefined,
    basicProps,
    data: data?.elements ?? [],
    filterProps,
  }

  const getSelected = data?.elements?.filter(d => selectedProps?.selected.includes(idFunction(d)))

  return { tableProps, providerProps, filterLabelProps, getSelected, editDialogProps }
}
