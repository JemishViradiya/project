import React, { memo, useMemo } from 'react'

import type { TableRowProps } from '@material-ui/core'
import { Box, LinearProgress, TableCell, TableRow } from '@material-ui/core'

import { useBasicTable } from './types'

export const LoadingTable = memo(({ component = 'tr', width }: { component?: React.ElementType<TableRowProps>; width?: any }) => {
  const { loading } = useBasicTable()
  const style = useMemo(() => ({ width: width }), [width])

  if (loading && component === 'tr') {
    return (
      <TableRow style={style}>
        <TableCell colSpan={100} className="linear-progress">
          <Box mt={-1}>
            <LinearProgress color="secondary" />
          </Box>
        </TableCell>
      </TableRow>
    )
  } else if (loading && component === 'div') {
    return (
      <Box mt={-1} style={style}>
        <LinearProgress color="secondary" />
      </Box>
    )
  } else {
    return null
  }
})
