import React, { memo, useMemo } from 'react'

import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { XGrid } from '@ues-behaviour/x-grid'
import { AppliedFilterPanel, Loading, TableProvider, TableToolbar } from '@ues/behaviours'

import { SelectedResults, TotalResults } from './table-toolbar'

interface GeozonesTableProps {
  providerProps: any
  loading: boolean
  filterLabelProps: any
  onDelete: () => void
  tableProps: any
}

const useStyles = makeStyles(() => {
  return {
    table: {
      height: '100%',
    },
  }
})

const GeozonesTable: React.FC<GeozonesTableProps> = memo(({ providerProps, loading, filterLabelProps, onDelete, tableProps }) => {
  const { basicProps, selectedProps, sortingProps, filterProps, data } = providerProps
  const styles = useStyles()

  const toolbar = useMemo(
    () => (
      <TableToolbar
        begin={<SelectedResults selectedCount={selectedProps?.selected.length} onDelete={onDelete} />}
        end={<TotalResults total={data.length} />}
        bottom={<AppliedFilterPanel {...filterProps} {...filterLabelProps} />}
      />
    ),
    [data.length, filterLabelProps, filterProps, onDelete, selectedProps?.selected.length],
  )

  const table = useMemo(
    () => (
      <TableProvider basicProps={basicProps} selectedProps={selectedProps} sortingProps={sortingProps} filterProps={filterProps}>
        <XGrid wrapperStyle={{ height: 'calc(100% - 52px)' }} {...tableProps} noRowsMessageKey="general/form:commonLabels.noData" />
      </TableProvider>
    ),
    [basicProps, filterProps, selectedProps, sortingProps, tableProps],
  )

  // Workaround for https://jirasd.rim.net/browse/UES-6876
  return useMemo(
    () => (
      <>
        <Box className={styles.table} style={loading ? { display: 'none' } : {}}>
          {toolbar}
          {table}
        </Box>
        {loading ? <Loading /> : null}
      </>
    ),
    [loading, styles.table, table, toolbar],
  )
})

export default GeozonesTable
