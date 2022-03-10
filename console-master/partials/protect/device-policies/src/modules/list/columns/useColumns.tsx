import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { DevicePolicyListItem } from '@ues-data/epp'
import { DevicePolicyListItemField } from '@ues-data/epp'
import { I18nFormats } from '@ues/assets'
import type { ColumnPickerProps, TableColumn } from '@ues/behaviours'
import { FILTER_TYPES, useColumnPicker } from '@ues/behaviours'

import { LIST_NAME } from './../constants'
import { PolicyNameCell } from './cells'

interface UseColumnsInterface {
  allColumns: TableColumn<DevicePolicyListItem>[]
  displayedColumns: TableColumn<DevicePolicyListItem>[]
  columnPickerProps: ColumnPickerProps
}

const useColumns = (data: DevicePolicyListItem[]): UseColumnsInterface => {
  const { t: translate, i18n } = useTranslation(['protect', 'profiles'])

  const columns = useMemo(
    (): TableColumn<DevicePolicyListItem>[] => [
      {
        dataKey: DevicePolicyListItemField.policy_name,
        label: translate('policyName'),
        sortable: true,
        show: true,
        persistent: true,
        filterType: FILTER_TYPES.QUICK_SEARCH,
        renderCell: (row: DevicePolicyListItem) => <PolicyNameCell row={row} />,
        // renderFilter: () => <PolicyNameFilter />,
      },
      {
        dataKey: DevicePolicyListItemField.device_count,
        label: translate('numberOfDevices'),
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.NUMERIC_RANGE,
        //renderFilter: () => <DeviceCountFilter data={data} />,
      },
      {
        dataKey: DevicePolicyListItemField.created,
        label: translate('dateAdded'),
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.DATE_PICKER,
        renderCell: (row: DevicePolicyListItem) => i18n.format(row.created, I18nFormats.DateTime),
        // renderFilter: () => <CreatedDateFilter />,
      },
      {
        dataKey: DevicePolicyListItemField.modified,
        label: translate('dateModified'),
        sortable: true,
        show: true,
        persistent: false,
        filterType: FILTER_TYPES.DATE_PICKER,
        renderCell: (row: DevicePolicyListItem) => i18n.format(row.modified, I18nFormats.DateTime),
        // renderFilter: () => <ModifiedDateFilter />,
      },
    ],
    [i18n, translate],
  )

  const { displayedColumns, columnPickerProps } = useColumnPicker({
    columns,
    title: translate('profiles:policy.list.columnPicker'),
    tableName: LIST_NAME,
  })
  columnPickerProps.tableCell = false

  return {
    allColumns: columns,
    displayedColumns,
    columnPickerProps,
  }
}

export default useColumns
