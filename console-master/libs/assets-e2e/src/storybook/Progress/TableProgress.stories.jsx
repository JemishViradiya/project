// dependencies
import cond from 'lodash/cond'
import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
// components
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

// utils
import { boxFlexCenterProps } from '@ues/assets'

import { mockData } from './tableProgress.data'

export const TableProgress = () => {
  const [tableData, setTableData] = useState(null)

  setTimeout(() => setTableData(mockData), 3000)

  const renderRows = () =>
    cond([
      [
        () => !tableData,
        () => (
          <TableRow>
            <TableCell colSpan={3}>
              <Box {...boxFlexCenterProps} width="100%">
                <Typography variant="body2" color="textSecondary">
                  Loading ...
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        ),
      ],
      [
        () => tableData.length === 0,
        () => (
          <TableRow>
            <TableCell colSpan={3}>
              <Box {...boxFlexCenterProps} width="100%">
                <Typography variant="body2" color="textSecondary">
                  No Data
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        ),
      ],
      [
        () => true,
        () =>
          tableData.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.col1}</TableCell>
              <TableCell>{row.col2}</TableCell>
              <TableCell>{row.col3}</TableCell>
            </TableRow>
          )),
      ],
    ])([])

  return (
    <Paper elevation={0}>
      <Toolbar>
        <Button variant="contained" color="secondary">
          Some Button
        </Button>
      </Toolbar>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column 1</TableCell>
              <TableCell>Column 2</TableCell>
              <TableCell>Column 3</TableCell>
            </TableRow>
            {!tableData ? (
              <TableRow>
                <TableCell colSpan={3} className="linear-progress">
                  <Box mt={-1}>
                    <LinearProgress color="secondary" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : null}
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default {
  title: 'Progress/Table',
}
