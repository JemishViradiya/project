//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import cn from 'classnames'
import { isArray } from 'lodash-es'
import type { FC, ReactEventHandler } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Chip, Tooltip, Typography } from '@material-ui/core'

import { CHIP_VALUE_TOOLTIP_DELAY } from '../constants'
import { enhancedSearchActions, useEnhancedSearchContext } from '../EnhancedSearchProvider'
import type { EnhancedSearchChip } from '../types'
import { SearchStep } from '../types'
import { isNoChipValue } from '../utils'
import { makeChipValue } from './ChipValueRenderer'

interface ChipRendererProps {
  value: EnhancedSearchChip[]
  classes: Record<string, string>
  showChipSeparator: boolean
  disabled: boolean
  handleEditChip: (index: number, step: SearchStep) => () => void
  handleDeleteChip: (index: number) => (event: ReactEventHandler) => void
  setSelectedChipRef: (el: HTMLDivElement) => void
}

export const ChipRenderer: FC<ChipRendererProps> = ({
  value,
  classes,
  showChipSeparator,
  disabled,
  handleEditChip,
  handleDeleteChip,
  setSelectedChipRef,
}) => {
  const {
    state: { values, step, selectedFieldIndex, optionsShow },
    dispatch,
  } = useEnhancedSearchContext()
  const { t } = useTranslation(['components'])

  return (
    <>
      {value.map((item, index) => {
        const chipValue = makeChipValue(item)

        const fullChip = !isNoChipValue(item)

        const chipsSeparator = showChipSeparator &&
          (index + 1 !== values.length || (optionsShow && index === values.length - 1 && step === SearchStep.First)) && (
            <Typography variant="body2" className={classes.chipSeparatorText}>
              {t('enhancedSearch.and')}
            </Typography>
          )
        const renderEmptyValue = () => {
          if (!fullChip && isNoChipValue(item)) {
            return (
              <Typography
                component="span"
                aria-label="chipValue"
                className={cn({
                  [classes.emptyValue]: true,
                  [classes.chipValue]: true,
                  [classes.activeChipStep]: selectedFieldIndex === index && step === SearchStep.Third,
                })}
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleEditChip(index, !item.comparison.value ? SearchStep.Second : SearchStep.Third)()
                }}
              />
            )
          }
        }
        const renderChipLabel = () => (
          <div className={classes.chip}>
            <Typography className={classes.chipLabel} component="span" data-label-step="true">
              {item.label}
            </Typography>
            {item.comparison.value && (
              <Typography
                component="span"
                data-comparison-step="true"
                aria-label="comparison"
                className={cn({
                  [classes.chipComparison]: true,
                  [classes.activeChipStep]: selectedFieldIndex === index && step === SearchStep.Second,
                })}
              >
                {item.comparison.value}
              </Typography>
            )}
            {renderEmptyValue()}
            {fullChip && (
              <Tooltip
                title={chipValue}
                placement="top"
                enterDelay={CHIP_VALUE_TOOLTIP_DELAY}
                enterNextDelay={CHIP_VALUE_TOOLTIP_DELAY}
              >
                <Typography
                  component="span"
                  aria-label="chipValue"
                  className={cn({
                    [classes.chipValue]: true,
                    [classes.activeChipStep]: selectedFieldIndex === index && step === SearchStep.Third,
                  })}
                >
                  {chipValue}
                </Typography>
              </Tooltip>
            )}
          </div>
        )

        return (
          <div
            key={index}
            className={`${classes.chipWrapper}`}
            ref={el => {
              if (selectedFieldIndex === index) {
                setSelectedChipRef(el)
              }
            }}
          >
            <div
              className={cn({
                [classes.fullChip]: fullChip,
                [classes.flexBox]: true,
              })}
            >
              <Chip
                size="medium"
                variant="outlined"
                label={renderChipLabel()}
                className={cn({
                  [classes.completeChip]: fullChip,
                  [classes.pendingChip]: !fullChip,
                  [classes.activeChip]: selectedFieldIndex === index,
                })}
                onClick={e => {
                  if (fullChip && (e.target as HTMLElement)?.dataset?.labelStep) {
                    dispatch(enhancedSearchActions.setCurrentOptionsShow({ show: false }))
                    return
                  }
                  handleEditChip(
                    index,
                    !fullChip || (e.target as HTMLElement)?.dataset?.comparisonStep ? SearchStep.Second : SearchStep.Third,
                  )()
                }}
                onDelete={disabled || !fullChip ? null : handleDeleteChip(index)}
                disabled={disabled}
              />
              {chipsSeparator}
            </div>
          </div>
        )
      })}
    </>
  )
}
