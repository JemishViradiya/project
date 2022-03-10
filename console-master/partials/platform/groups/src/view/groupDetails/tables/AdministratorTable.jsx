/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@material-ui/core'

import { BasicAdd } from '@ues/assets'

import styles from './AdministratorTable.module.less'

function createData(assignedRole, assigned) {
  return { assignedRole, assigned }
}

const rows = [createData('Admin role 01', 'Direct'), createData('Admin role 02', 'Direct'), createData('Admin role 03', 'Direct')]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])
  const headCells = [
    {
      id: 'assignedRole',
      label: t('groups.groupDetails.table.assignedRole'),
      sortable: true,
    },
    {
      id: 'assigned',
      label: t('groups.groupDetails.table.assigned'),
      sortable: false,
    },
  ]
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead className={styles.tableHead}>
      <TableRow className={styles.tableRow}>
        {headCells.map(headCell => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            {headCell.label}
            {headCell.sortable && (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              />
            )}
          </TableCell>
        ))}
        <TableCell>
          <div className={styles.icon} title={t('general/form:commonLabels.remove')}>
            <BasicAdd className={styles.icon} />
          </div>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default function AdministratorTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('assignedRole')
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <>
      <Box pb={2}>
        <Typography variant="h2">{t('groups.groupDetails.table.administratorRole')}</Typography>
      </Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle" aria-label="enhanced table">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              return (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell>{row.assignedRole}</TableCell>
                  <TableCell>{row.assigned}</TableCell>
                  <TableCell />
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
