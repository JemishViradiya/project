/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Box } from '@material-ui/core'

import { getNonLocalizedDate } from '@ues-platform/shared'
import { BasicTable, TableProvider, useClientSort, useSort } from '@ues/behaviours'

import BCNDelete from './BCNDelete'
import BCNServices from './BCNServices'

const BCNTableData = props => {
  const { t } = useTranslation(['platform/common'])
  const { loading, data, deletable } = props
  const align = 'right'

  const columns = useMemo(() => {
    const deleteColumn = deletable
      ? {
          dataKey: 'action',
          label: '',
          icon: true,
          align: align,
          renderCell: rowData => <BCNDelete rowData={rowData} />,
          renderLabel: () => null,
        }
      : {}

    return [
      {
        label: t('bcn.table.serverName'),
        dataKey: 'displayName',
        clientSortable: true,
        renderCell: row => row.displayName,
      },
      {
        label: t('bcn.table.activationDate'),
        dataKey: 'activationDate',
        clientSortable: true,
        renderCell: row => getNonLocalizedDate(row.activationDate),
      },
      deleteColumn,
    ]
  }, [deletable, t])

  const idFunction = rowData => rowData.instanceId

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
      loading,
    }),
    [columns, loading],
  )

  const expandable = {
    isRowExpandable: () => true,
    renderExpandableRow: row => (
      <Box mx={5} my={2}>
        <BCNServices data={row.services} />
      </Box>
    ),
  }
  const sortProps = useSort(null, 'asc')
  const { sort, sortDirection } = sortProps
  const sortedData = useClientSort({ data: data, sort: { sortBy: sort, sortDir: sortDirection } })

  return (
    <TableProvider basicProps={basicProps} sortingProps={sortProps} expandableProps={expandable}>
      <BasicTable data={sortedData} noDataPlaceholder={t('bcn.table.emptyMessage')} />
    </TableProvider>
  )
}

export default BCNTableData
