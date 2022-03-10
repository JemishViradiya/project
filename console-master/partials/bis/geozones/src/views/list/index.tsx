import React, { memo, useMemo } from 'react'

import type { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'

import { ContentArea, ContentAreaPanel } from '@ues/behaviours'

import GeozoneTable from '../../components/geozones-table'

interface ListViewArgs {
  providerProps: any
  loading: boolean
  filterLabelProps: any
  onDelete: () => void
  tableProps: any
}

const useStyles = makeStyles((theme: Theme) => {
  return {
    table: {
      height: '100%',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      paddingBottom: theme.spacing(4),
      paddingTop: theme.spacing(4),
      boxSizing: 'border-box',
    },
    footer: {
      display: 'flex',
      marginTop: 'auto',
    },
  }
})

const ListView: React.FC<ListViewArgs> = memo(({ providerProps, loading, filterLabelProps, onDelete, tableProps }) => {
  const styles = useStyles()
  const contentAreaStyle = useMemo(
    () => ({
      marginTop: 0,
      marginBottom: 0,
      display: 'block',
      height: '100%',
    }),
    [],
  )

  return (
    <div className={styles.container}>
      <ContentArea {...contentAreaStyle}>
        <ContentAreaPanel fullHeight fullWidth boxProps={{ minWidth: 'none', marginTop: 0, display: 'flex' }}>
          <GeozoneTable
            tableProps={tableProps}
            providerProps={providerProps}
            loading={loading}
            filterLabelProps={filterLabelProps}
            onDelete={onDelete}
          />
        </ContentAreaPanel>
      </ContentArea>
    </div>
  )
})

export default ListView
