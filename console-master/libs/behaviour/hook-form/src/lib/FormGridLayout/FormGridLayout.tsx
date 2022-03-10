//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import { isEmpty, isEqual, omit } from 'lodash-es'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { GridSize } from '@material-ui/core'
import { Box, Button, Grid, IconButton, Typography } from '@material-ui/core'

import { usePrevious } from '@ues-behaviour/react'
import { BasicAdd, BasicDelete } from '@ues/assets'

import useStyles from './styles'
import type { FormGridLayoutProps } from './types'

const FIRST_SLOT_INDEX = 1
const MAX_COLUMNS = 12
const MAX_COLUMNS_WITH_ACTION = 10

const FormGridLayout: React.FC<FormGridLayoutProps> = ({
  columns,
  disabled,
  initialValues,
  onChange,
  muiProps,
  noDataPlaceholder,
}) => {
  const classes = useStyles()
  const { t } = useTranslation(['components', 'general/form'])
  const [autoFocus, setAutoFocus] = useState<boolean>(false)

  const initialRowIndex = isEmpty(initialValues) ? FIRST_SLOT_INDEX : initialValues.length
  const [rowIndex, setRowIndex] = useState(initialRowIndex)

  const makeRow = (index: number) => ({ [index]: columns })

  const initialRows = Object.assign({}, ...[...Array(initialRowIndex).keys()].map(index => makeRow(index)))

  const [rows, setRows] = useState<Record<string, FormGridLayoutProps['columns']>>(initialRows)

  const previousRows = usePrevious(rows)

  const rowsKeys = Object.keys(rows)
  const rowsCount = rowsKeys.length

  const maxColumns = !disabled ? MAX_COLUMNS_WITH_ACTION : MAX_COLUMNS
  const gridSize = useMemo(() => Math.floor(maxColumns / columns.length), [maxColumns, columns]) as GridSize

  const handleChange = () => {
    if (typeof onChange === 'function') {
      onChange()
    }
  }

  useEffect(() => {
    if (!isEqual(previousRows, rows)) {
      handleChange()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousRows, rows])

  const handleAdd = useCallback(() => {
    setRows({ ...rows, ...makeRow(rowIndex) })
    setRowIndex(rowIndex + 1)
    setAutoFocus(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, rowIndex])

  const handleRemove = (rowKey: string) => setRows(omit(rows, rowKey))

  const gridRows = useMemo(
    () =>
      rowsCount === 0 ? (
        <Grid item xs={12} className={classes.gridItem} role="gridcell">
          <Box display="flex" justifyContent="center">
            <Typography>{noDataPlaceholder ?? t('general/form:commonLabels.noData')}</Typography>
          </Box>
        </Grid>
      ) : (
        rowsKeys.map((rowKey, rowIndex) => (
          <Fragment key={rowKey}>
            {rows[rowKey].map(({ renderCell, muiProps }, colIndex: number) => {
              const gridIndex = `${rowKey}${colIndex}`
              const shouldFocus = autoFocus && rowIndex === rowsKeys.length - 1 && colIndex === 0

              return (
                <Grid
                  key={gridIndex}
                  item
                  className={classes.gridItem}
                  xs={gridSize}
                  {...muiProps}
                  aria-label={`grid-item-${gridIndex}`}
                  role="gridcell"
                >
                  {React.cloneElement(renderCell(rowIndex, rowsCount), {
                    autoFocus: shouldFocus,
                    disabled,
                    gridIndex,
                    initialValues: !isEmpty(initialValues) && initialValues[rowKey] ? initialValues[rowKey][colIndex] : undefined,
                    onChange: handleChange,
                  })}
                </Grid>
              )
            })}
            {!disabled && (
              <Grid item xs={2} className={classes.actionButtonGridItem}>
                <IconButton size="small" onClick={() => handleRemove(rowKey)} aria-label={`remove-grid-row-button-${rowKey}`}>
                  <BasicDelete />
                </IconButton>
              </Grid>
            )}
          </Fragment>
        ))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classes, disabled, rows, gridSize, initialValues],
  )

  const gridLabels = useMemo(
    () => (
      <>
        {columns.map((column, index) => (
          <Grid key={index} item xs={gridSize} role="gridcell" className={classes.gridItem} {...column.muiProps}>
            <Box ml={2}>
              {column.renderLabel ? (
                <Box className={classes.columnLabel}>{column.renderLabel()}</Box>
              ) : (
                <Typography className={classes.columnLabel}>{column.label}</Typography>
              )}
            </Box>
          </Grid>
        ))}
        {!disabled && <Grid item xs={2} className={classes.actionButtonGridItem}></Grid>}
      </>
    ),
    [columns, classes, disabled, gridSize],
  )

  return (
    <Grid container spacing={5} role="grid" {...muiProps}>
      {gridLabels}
      {gridRows}
      {!disabled && (
        <Box mt={4}>
          <Button variant="contained" color="secondary" onClick={() => handleAdd()} startIcon={<BasicAdd />}>
            {t('inputGroups.buttonAdd')}
          </Button>
        </Box>
      )}
    </Grid>
  )
}

export default FormGridLayout
