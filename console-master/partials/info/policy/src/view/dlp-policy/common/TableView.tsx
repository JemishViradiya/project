import React, { useMemo } from 'react'

import type { BrowserDomain, DataEntity, Template } from '@ues-data/dlp'
import type { TableColumn } from '@ues/behaviours'
import { BasicTable, TableProvider, TableToolbar } from '@ues/behaviours'

type InputProps = {
  rows: Template[] | DataEntity[] | Partial<BrowserDomain>[]
  columns: TableColumn[]
  actionButton?: any
  noDataPlaceholder: string
  isHiddenTable?: boolean
}

const idFunction = row => row.guid

export const TableView = ({ rows, actionButton, noDataPlaceholder, columns, isHiddenTable = false }: InputProps) => {
  const basicProps = useMemo(
    () => ({
      embedded: true,
      columns: columns,
      idFunction,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns],
  )

  return (
    <>
      {actionButton && <TableToolbar begin={actionButton} />}
      {!isHiddenTable && (
        <TableProvider basicProps={basicProps}>
          <BasicTable data={rows ?? []} noDataPlaceholder={noDataPlaceholder} />
        </TableProvider>
      )}
    </>
  )
}
