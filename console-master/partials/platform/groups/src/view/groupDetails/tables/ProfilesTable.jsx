/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential. *   Do not reproduce without permission in writing.
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

import { BasicAdd, BasicDelete } from '@ues/assets'

import styles from './ProfilesTable.module.less'

function createData(assignedProfile, assigned) {
  return { assignedProfile, assigned }
}

const rows = [
  createData('Persona', 'Direct'),
  createData('Internet Gateway', 'Direct'),
  createData('Intelligent Security', 'Direct'),
]

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
      id: 'assignedProfile',
      label: t('groups.groupDetails.table.assignedProfile'),
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
          <div className={styles.icon} title={t('general/form:commonLabels.add')}>
            <BasicAdd className={styles.icon} />
          </div>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

export default function ProfilesTable() {
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('assignedProfile')
  const { t } = useTranslation(['platform/common', 'profiles', 'general/form'])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <>
      <Box pb={2}>
        <Typography variant="h2">{t('groups.groupDetails.table.profiles')}</Typography>
      </Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle" aria-label="enhanced table">
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              return (
                <TableRow key={index} className={styles.tableRow}>
                  <TableCell>{row.assignedProfile}</TableCell>
                  <TableCell>{row.assigned}</TableCell>
                  <TableCell>
                    <div className={styles.icon} title={t('general/form:commonLabels.remove')}>
                      <BasicDelete className={styles.icon} />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
