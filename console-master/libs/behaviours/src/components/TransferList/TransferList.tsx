/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

/* eslint-disable sonarjs/cognitive-complexity*/
import cn from 'clsx'
import { intersection, pull, union } from 'lodash-es'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@material-ui/core'

import { ArrowChevronLeft, ArrowChevronRight } from '@ues/assets'

import useStyles from './styles'

function not(a: string[], b: string[]) {
  return a ? a.filter(value => b.indexOf(value) === -1) : []
}

export interface TransferListProps {
  disabled?: boolean
  allValues?: string[]
  rightValues: string[]
  listLabel: string
  rightLabel: string
  leftLabel: string
  allowLeftEmpty?: boolean
  allowRightEmpty?: boolean
  selectAllLeftLabel?: string
  selectAllRightLabel?: string
  transferItemsLeftLabel?: string
  transferItemsRightLabel?: string
  onChange?: (leftValues: string[], rightValues: string[]) => void
  sortFunction: (a: unknown, b: unknown) => number
}

export const TransferList = ({
  disabled,
  allValues,
  rightValues,
  listLabel,
  rightLabel,
  leftLabel,
  allowLeftEmpty,
  allowRightEmpty,
  selectAllLeftLabel,
  selectAllRightLabel,
  transferItemsLeftLabel,
  transferItemsRightLabel,
  onChange,
  sortFunction,
}: TransferListProps) => {
  const theme = useTheme()
  const classes = useStyles(theme)
  const { t } = useTranslation(['components'])
  const selectAllLeftLabelValue = selectAllLeftLabel ?? t('transferList.selectAllLeftLabel')
  const selectAllRightLabelValue = selectAllRightLabel ?? t('transferList.selectAllRightLabel')
  const transferItemsLeftLabelValue = transferItemsLeftLabel ?? t('transferList.transferItemsLeftLabel')
  const transferItemsRightLabelValue = transferItemsRightLabel ?? t('transferList.transferItemsRightLabel')

  allowLeftEmpty = allowLeftEmpty === undefined ? true : allowLeftEmpty

  const [checked, setChecked] = React.useState([])
  if (allValues === undefined) allValues = []
  if (rightValues === undefined) rightValues = []

  const [left, setLeft] = React.useState(pull(allValues, ...rightValues).sort(sortFunction))
  const [right, setRight] = React.useState(rightValues.sort(sortFunction))

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const numberOfChecked = (items: string[]) => intersection(checked, items).length

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    const tempRight = right.concat(leftChecked).sort(sortFunction)
    setRight(tempRight)
    const tempLeft = pull(left, ...leftChecked).sort(sortFunction)
    setLeft(tempLeft)
    setChecked(pull(checked, ...leftChecked))
    onChange(tempLeft, tempRight)
  }

  const handleCheckedLeft = () => {
    const tempRight = pull(right, ...rightChecked).sort(sortFunction)
    const tempLeft = left.concat(rightChecked).sort(sortFunction)
    setLeft(tempLeft)
    setRight(tempRight)
    setChecked(pull(checked, ...rightChecked))
    onChange(tempLeft, tempRight)
  }

  const getErrorState = (items: string[], allowEmpty: boolean) => {
    if (disabled) return false
    if (allowEmpty) return false
    return items.length === 0
  }

  const disabledClassName = () => (disabled ? { className: classes.textDisabled } : {})

  const errorClassName = (items, allowEmpty) => (getErrorState(items, allowEmpty) ? { className: classes.gridError } : {})

  const getCountSummaryLabel = (items: string[]) =>
    `${t('transferList.selectedCount', { selectedCount: numberOfChecked(items), totalCount: items.length })}`

  const customList = (title: string, selectAllLabel: string, items: string[], allowEmpty: boolean) => (
    <Card {...errorClassName(items, allowEmpty)} classes={{ root: classes.cardRoot }} aria-label={title}>
      <CardHeader
        disabled={disabled}
        classes={{
          content: classes.cardHeaderContent,
          root: classes.cardHeaderRoot,
        }}
        {...disabledClassName()}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={disabled || items.length === 0}
            disableRipple
            inputProps={{ 'aria-label': selectAllLabel }}
          />
        }
        title={title}
        subheader={<Typography variant="caption">{getCountSummaryLabel(items)}</Typography>}
      />
      <Divider />
      <FormControl disabled={disabled} classes={{ root: classes.formControl }}>
        <List className={classes.list} dense component="div" role="list">
          {items.map(value => {
            const labelId = `transferList-allItem-${value}Label`

            return (
              <ListItem
                key={value}
                role="listitem"
                button
                onClick={handleToggle(value)}
                classes={{ gutters: classes.listItemGutters, root: classes.listItemRoot }}
                disabled={disabled}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-label': value }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value} {...disabledClassName()} />
              </ListItem>
            )
          })}
          <ListItem />
        </List>
      </FormControl>
    </Card>
  )

  return (
    <>
      <Typography variant="body2" className={disabled ? cn(classes.listLabel, classes.textDisabled) : classes.listLabel}>
        {listLabel}
      </Typography>
      <Grid container spacing={2} justifyContent="flex-start" alignItems="center">
        <Grid item>{customList(leftLabel, selectAllLeftLabelValue, left, allowLeftEmpty)}</Grid>
        <Grid item className={classes.buttons}>
          <Grid container direction="column" alignItems="center">
            <IconButton
              onClick={handleCheckedRight}
              title={transferItemsRightLabelValue}
              disabled={disabled || leftChecked.length === 0}
            >
              <Icon component={ArrowChevronRight} />
            </IconButton>
            <IconButton
              onClick={handleCheckedLeft}
              title={transferItemsLeftLabelValue}
              disabled={disabled || rightChecked.length === 0}
            >
              <Icon component={ArrowChevronLeft} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>{customList(rightLabel, selectAllRightLabelValue, right, allowRightEmpty)}</Grid>
      </Grid>
    </>
  )
}
