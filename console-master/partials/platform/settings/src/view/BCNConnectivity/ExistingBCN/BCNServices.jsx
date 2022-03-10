/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '@material-ui/core'

import { BasicTable, TableProvider } from '@ues/behaviours'

const BCNServices = props => {
  const { t } = useTranslation(['platform/common'])

  const columns = useMemo(
    () => [
      {
        label: t('bcn.table.service'),
        dataKey: 'name',
        // clientSortable: true,
        renderCell: row => row.name,
      },
      {
        label: t('bcn.table.status'),
        dataKey: 'status',
        // clientSortable: true,
        renderCell: service => {
          const getServiceStatus = service => {
            const numberOfConnections = service.connections ? service.connections.length : 0
            const numberOfActiveConnections = service.connections ? service.connections.filter(x => x.connected === true).length : 0

            return (
              numberOfConnections > 0 && (
                <Typography variant="body2">
                  {t('bcn.table.infrastructureStatus', {
                    numberOfActiveConnections: numberOfActiveConnections,
                    numberOfConnections: numberOfConnections,
                  })}
                </Typography>
              )
            )
          }

          return (
            <>
              <Typography>
                {service.paused === true || service.paused === null
                  ? t('bcn.table.serviceStatus.paused')
                  : t('bcn.table.serviceStatus.running')}
              </Typography>
              {getServiceStatus(service)}
            </>
          )
        },
      },
      {
        label: t('bcn.table.version'),
        dataKey: 'version',
        // clientSortable: true,
        renderCell: row => row.version,
      },
    ],
    [t],
  )

  const idFunction = rowData => rowData.serviceID

  const basicProps = useMemo(
    () => ({
      columns,
      idFunction,
    }),
    [columns],
  )

  // const sortProps = useSort(null, TableSortDirection.Asc)
  // const { sort, sortDirection } = sortProps
  // const sortedData = useClientSort({
  //   data: networkUsers?.tenant?.fieldAgg ?? [],
  //   sort: { sortBy: sort, sortDir: sortDirection },
  // })

  // return <Typography>Empty</Typography>
  return (
    <TableProvider
      basicProps={basicProps}
      // sortingProps={sortProps}
    >
      <BasicTable
        data={props.data}
        // data={sortedData}
        noDataPlaceholder={t('bcn.table.emptyServices')}
      />
    </TableProvider>
  )
}

export default BCNServices
