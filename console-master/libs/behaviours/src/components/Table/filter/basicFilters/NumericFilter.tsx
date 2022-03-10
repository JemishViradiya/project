import get from 'lodash/get'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Link from '@material-ui/core/Link'
import Popover from '@material-ui/core/Popover'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'

import { BasicSettings, dropdownMenuProps } from '@ues/assets'

import type { OPERATOR_VALUES } from '../../../../filters/filters.constants'
import { DEFAULT_NUMERIC_OPERATOR_VALUE, NUMERIC_OPERATORS } from '../../../../filters/filters.constants'
import type { FilterProps, SimpleFilter } from '../../../../filters/filters.hooks'
import { usePopover, usePopoverTracker } from '../../../../popovers'
import { getFieldOperatorValueLabel } from './../../../../filters/filters.utils'
import { FilterIcon } from './FilterIcon'
import { FilterOperators } from './FilterOperators'

export interface NumericFilterProps {
  label: string
  onIconClick: () => unknown
  popoverProps?: any
  popoverTrackerId?: string
  operatorsProps?: any
  operators?: OPERATOR_VALUES[]
  min: number
  max: number
  value: number
  onSliderChange: (event: any, newValue: number) => void
  onClear: (event: any) => void
  disabled?: boolean
}

export const NumericFilter = ({
  label,
  onIconClick,
  popoverProps,
  popoverTrackerId,
  min,
  max,
  value,
  operatorsProps,
  operators = NUMERIC_OPERATORS,
  onSliderChange,
  onClear,
  disabled,
}: NumericFilterProps) => {
  const { t } = useTranslation(['tables'])

  return (
    <>
      <FilterIcon handleClick={onIconClick} modified={value !== null} disabled={disabled} />
      <Popover
        {...popoverProps}
        {...dropdownMenuProps}
        PaperProps={{
          className: 'filter-paper',
          id: popoverTrackerId,
        }}
      >
        <Box px={4} pt={4}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={10}>
              <Typography variant="subtitle1" noWrap>
                {label}
              </Typography>
            </Grid>
            {operators && operators.length && (
              <Grid item>
                <IconButton onClick={operatorsProps.onToggleOperators} edge="end" size="small">
                  <BasicSettings />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>

        {operators && <FilterOperators operatorsList={operators} {...operatorsProps} />}
        <Box p={4}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="body2">{value === null ? min : value}</Typography>
            </Grid>
            <Grid item>
              <Typography className="numeric-range-clear-button" variant="body2">
                <Link onClick={onClear}>{t('clear')}</Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box px={4} pb={4}>
          <Slider value={value || min} onChange={onSliderChange} valueLabelDisplay="auto" color="secondary" max={max} min={min} />
        </Box>
      </Popover>
    </>
  )
}

export const useNumericFilter = ({
  filterProps,
  key,
  label,
}: {
  filterProps: FilterProps<SimpleFilter<number>>
  key: string
  label?: string
}) => {
  const { t: translate } = useTranslation(['tables'])
  const { activeFilters, onSetFilter, onRemoveFilter } = filterProps
  const { value = null, operator = DEFAULT_NUMERIC_OPERATOR_VALUE } = get(activeFilters, key, {}) as SimpleFilter<number>

  const [showOperators, setShowOperators] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState(DEFAULT_NUMERIC_OPERATOR_VALUE)

  const { popoverAnchorEl, handlePopoverClick, handlePopoverClose, popoverIsOpen } = usePopover()

  const paperId = `numeric-filter-${key}`
  usePopoverTracker({
    anchorEl: popoverAnchorEl,
    paperId,
  })

  useEffect(() => {
    onSelectOperator(operator)()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator])

  const onSliderChange = (_event, newValue) => {
    onSetFilter({
      key,
      value: {
        value: newValue,
        operator: selectedOperator,
        label: getFieldOperatorValueLabel(label || key, translate(selectedOperator).toLowerCase(), newValue),
      },
    })
  }

  const onSelectOperator = op => () => {
    setSelectedOperator(op)

    if (value || value === 0) {
      onSetFilter({
        key,
        value: {
          value,
          operator: op,
          label: getFieldOperatorValueLabel(label || key, translate(op).toLowerCase(), `${value}`),
        },
      })
    }
  }

  const onToggleOperators = () => {
    setShowOperators(!showOperators)
  }

  const onClear = () => {
    onRemoveFilter(key)
  }

  return {
    popoverProps: {
      open: popoverIsOpen,
      anchorEl: popoverAnchorEl,
      onClose: handlePopoverClose,
    },
    popoverTrackerId: paperId,
    onIconClick: handlePopoverClick,
    operatorsProps: {
      onToggleOperators,
      onSelectOperator,
      selectedOperator,
      showOperators,
    },
    onClear,
    value,
    onSliderChange,
  }
}
