// dependencies
import get from 'lodash/get'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
// components
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import { useTheme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import { BasicCancel, BasicFilter, BasicSettings, boxPaddingProps, dropdownMenuProps } from '@ues/assets'
import { useFilter, usePopover } from '@ues/behaviours'

import { DEFAULT_NUMERIC_OPERATOR_VALUE, NUMERIC_OPERATORS } from './filters.constants'
// constants

export const NumericNoRangeFilter = ({ activeFilters, onSetFilter, filterKey: key, label }) => {
  const theme = useTheme()
  const { t } = useTranslation('tables')
  // state
  const [showOperators, setShowOperators] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState(DEFAULT_NUMERIC_OPERATOR_VALUE)
  const [value, setValue] = useState(null)

  // hooks

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  useEffect(() => {
    const { number = null } = get(activeFilters, key, {})

    if (!number) {
      setValue(null)
    }
  }, [activeFilters, key])

  // actions

  const onTextChange = event => {
    const { value } = get(event, 'currentTarget', {})
    setValue(value)

    if (value || value === 0) {
      onSetFilter({
        key,
        value: {
          number: parseInt(value || 0),
          operator: selectedOperator,
        },
      })
    }
  }

  const onSelectOperator = op => () => {
    setSelectedOperator(op)

    if (value || value === 0) {
      onSetFilter({
        key,
        value: {
          number: value,
          operator: op,
        },
      })
    }
  }

  const onToggleOperators = () => {
    setShowOperators(!showOperators)
  }

  const onPopoverClose = (...args) => {
    const { number = null } = get(activeFilters, key, {})

    // set value back to applied filter value. 250ms
    // timeout to allow popover to be done closing
    // before resetting value to prevent a "flicker"
    // as popover closes
    setTimeout(() => {
      setValue(number)
    }, 250)

    handlePopoverClose(...args)
  }

  // utils

  const renderFilterIcon = () => (
    <IconButton onClick={handlePopoverClick}>
      {value !== null ? (
        <Badge color="secondary" variant="dot">
          <BasicFilter />
        </Badge>
      ) : (
        <BasicFilter />
      )}
    </IconButton>
  )

  return (
    <>
      {renderFilterIcon()}
      <Popover
        open={popoverIsOpen}
        anchorEl={popoverAnchorEl}
        onClose={onPopoverClose}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'filter-paper',
        }}
      >
        <Box px={4} pt={4}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={10}>
              <Typography variant="subtitle1" noWrap>
                {label}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={onToggleOperators} edge="end" size="small">
                <BasicSettings />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <Collapse in={showOperators}>
          <Box {...boxPaddingProps} bgcolor={theme.props.colors.grey[50]}>
            <Grid container spacing={2}>
              {NUMERIC_OPERATORS.map(op => (
                <Grid item key={op}>
                  <Chip
                    clickable
                    onClick={onSelectOperator(op)}
                    label={t(op)}
                    variant="outlined"
                    color={selectedOperator === op ? 'secondary' : 'default'}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>

        <Box p={4}>
          <TextField
            type="number"
            value={value === null ? '' : value}
            onChange={onTextChange}
            color="secondary"
            fullWidth
            className="no-label"
            InputProps={{
              endAdornment: value !== null && (
                <IconButton onClick={() => setValue('')} edge="end" size="small">
                  <BasicCancel />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Popover>
    </>
  )
}

NumericNoRangeFilter.decorators = [
  storyFn => {
    const { activeFilters, onSetFilter } = useFilter()
    const args = {
      activeFilters,
      onSetFilter,
      filterKey: 'test',
      label: 'Numeric No Range Filter',
    }

    return storyFn({ args })
  },
]
