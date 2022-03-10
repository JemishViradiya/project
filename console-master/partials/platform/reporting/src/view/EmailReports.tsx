/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

// components

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Popover from '@material-ui/core/Popover'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import { ScheduledReportsApi } from '@ues-data/reporting'
// utils
import { BasicAdd, BasicDelete, Columns, dropdownMenuProps } from '@ues/assets'
import { usePageTitle } from '@ues/behaviours'

import makeStyles from './EmailReportsStyles'
import { useColumns, usePopover, useSelected } from './tableHooks'

const TEMP_TENTANT = 'L60858679'

export default function EmailReports(): JSX.Element {
  const { t } = useTranslation(['reporting/common', 'general/form'])
  usePageTitle(t('scheduledReports'))
  const canEdit = true
  const classes = makeStyles()

  const columns = useMemo(
    () => [
      {
        id: 'name',
        label: t('name'),
        sortable: true,
        show: true,
        canToggle: false,
        minWidth: 100,
      },
      {
        id: 'frequency',
        label: t('frequency'),
        dataKey: 'recurrence',
        sortable: true,
        show: true,
        canToggle: true,
      },
      {
        id: 'content',
        label: t('content'),
        dataKey: 'reportParams.dashboardId',
        sortable: true,
        show: true,
        canToggle: true,
      },
      {
        id: 'recipients',
        label: t('recipients'),
        dataKey: 'details.recipients',
        sortable: true,
        show: true,
        canToggle: true,
      },
      {
        id: 'enabled',
        label: t('enabled'),
        sortable: true,
        show: true,
        canToggle: true,
      },
      {
        id: 'delete',
        label: t('remove'),
        sortable: false,
        show: true,
        canToggle: true,
      },
    ],
    [t],
  )

  // hooks
  const { cols, setVisibility, isColumnVisible } = useColumns(columns)
  const { selected, onSelect, onSelectAll, isSelected } = useSelected('name')
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)

  const handleDelete = (event, row) => {
    ScheduledReportsApi.ScheduledReports.remove(TEMP_TENTANT, row.guid)
      .then(function (response) {
        setData(data =>
          data.filter(function (item) {
            return item !== row
          }),
        )
      })
      .catch(function (error) {
        // handleError(error)
      })
  }

  const handleEnabled = (event, row) => {
    const report = row
    report.enabled = !report.enabled
    ScheduledReportsApi.ScheduledReports.update(TEMP_TENTANT, row.guid, { ...report })
      .then(function (response) {
        setData(data =>
          data.filter(function (item) {
            if (item === row) {
              item = report
            }
            return item
          }),
        )
      })
      .catch(function (error) {
        // handleError(error)
      })
  }

  const fetchData = async () => {
    ScheduledReportsApi.ScheduledReports.getAll(TEMP_TENTANT)
      .then(response => {
        setData(response.data)
        setTotal(response.data.length)
      })
      .catch(error => {
        console.error('Error getting emailreports: ' + error)
      })
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const EnhancedToolbar = ({ cols, setVisibility }) => {
    const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

    return (
      <Toolbar>
        <Box display="flex" flex={1}>
          <Box flexGrow={1} />
          <Box>
            <IconButton aria-label="toggle columns" onClick={handlePopoverClick}>
              <Columns />
            </IconButton>
            <Popover
              open={popoverIsOpen}
              anchorEl={popoverAnchorEl}
              onClose={handlePopoverClose}
              {...dropdownMenuProps}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <List>
                <ListSubheader>
                  <Typography variant="h3" gutterBottom>
                    Table Columns
                  </Typography>
                </ListSubheader>
                {cols.map((col, i) => (
                  <ListItem key={col.id} button dense disabled={!col.canToggle} onClick={() => setVisibility(i)}>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={col.show} tabIndex={-1} inputProps={{ 'aria-labelledby': col.id }} />
                    </ListItemIcon>
                    <ListItemText id={col.id} primary={col.label} />
                  </ListItem>
                ))}
              </List>
            </Popover>
          </Box>
        </Box>
      </Toolbar>
    )
  }

  const TableColumns = ({ columns, numRows, numSelected, onSelectAll }) => (
    <TableRow>
      {columns
        .filter(col => col.show)
        .map(col => (
          <TableCell key={col.id} style={{ minWidth: col.minWidth }}>
            <HeadCellLabel column={col} />
          </TableCell>
        ))}
      {/* <TableCell ></TableCell> */}
    </TableRow>
  )
  const HeadCellLabel = ({ column }) => {
    if (!column.sortable) return column.label

    return <TableSortLabel>{column.label}</TableSortLabel>
  }
  return (
    <div className={classes.root}>
      {/* <Box className={classes.titlePanel}>
        <div>{t('users.grid.allUsers')}</div>
        <div className={classes.actionPanel}>
          <SearchBox updateQuery={updateQuery} />
          <RouterLink to="/users/add">
            <IconButton aria-label={t('general/form:commonLabels.add')}>
              <BasicAdd />
            </IconButton>
          </RouterLink>
          <ExportButton getExportLink={getExportLink} />
          <DeleteUsers
            selectionProps={selectionProps}
            total={total}
            fetchData={fetchData}
          />
        </div>
      </Box> */}
      <div className={classes.titlePanel}>
        <Typography variant="h1" gutterBottom>
          {t('scheduledReports')}
        </Typography>
        <div className={classes.actionPanel}>
          {canEdit ? (
            <RouterLink to="./add">
              <IconButton aria-label={t('general/form:commonLabels.add')}>
                <BasicAdd key="add" />
              </IconButton>
            </RouterLink>
          ) : null}
        </div>
      </div>
      <Card>
        <CardContent>
          <Paper square={false} elevation={0}>
            <EnhancedToolbar cols={cols} setVisibility={setVisibility} />
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableColumns
                    columns={cols}
                    numRows={data.length}
                    numSelected={selected.length}
                    onSelectAll={event => onSelectAll(event, data)}
                  />
                </TableHead>
                <TableBody>
                  {data.map(row => {
                    const isItemSelected = isSelected(row)

                    return (
                      <TableRow
                        key={row.name}
                        // onClick={() => onSelect(row)}
                        // selected={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell> */}
                        {isColumnVisible('name') && (
                          <TableCell component="th" scope="row" className="text-wrap">
                            <RouterLink to={'./' + row.guid}>{row.name}</RouterLink>
                          </TableCell>
                        )}
                        {isColumnVisible('frequency') && <TableCell align="right">{t(row.recurrence.toLowerCase())}</TableCell>}
                        {isColumnVisible('content') && <TableCell align="right">{row.reportParams.dashboardId}</TableCell>}
                        {isColumnVisible('recipients') && (
                          <TableCell align="right" className={classes.recipients}>
                            {row.details.recipients.join('\n')}
                          </TableCell>
                        )}
                        {isColumnVisible('enabled') && (
                          <TableCell align="right">
                            <Checkbox
                              edge="start"
                              checked={row.enabled}
                              tabIndex={-1}
                              onChange={e => handleEnabled(e, row)}
                              inputProps={{ 'aria-labelledby': row.enabled }}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <IconButton aria-label={'delete'} onClick={e => handleDelete(e, row)}>
                            <BasicDelete key="delete" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </CardContent>
      </Card>
    </div>
  )
}
