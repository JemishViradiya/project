/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */

import { isEqual } from 'lodash-es'
import type { ComponentType, FC } from 'react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Box, Card, CardContent, CardHeader, Typography } from '@material-ui/core'
import type { Theme } from '@material-ui/core/styles'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'

import type { Permission, ServiceId } from '@ues-data/shared-types'
import { GenericErrorBoundary, SecuredContent, useErrorBoundaryRecovery } from '@ues/behaviours'

import { useChartColors } from '../ChartStyles'
import { selectGlobalTime } from '../store'
import type { ChartProps, ChartType } from '../types'
import { CardErrorHandler } from './DashboardCardFallback'
import DashboardCardMenu from './DashboardCardMenu'
import { useCardMenu } from './useCardMenu'

const prevent = event => {
  event.preventDefault()
}

const defaultCardBorder = 1
const editableCardBorder = 2
export const cardBorder = (editable: boolean) => (editable ? editableCardBorder : defaultCardBorder)

// override react-grid-layout styles
const globalCardStyles = theme => {
  return {
    '@global': {
      '.react-resizable-handle': {
        visibility: 'hidden',
      },
      '.react-grid-item:hover .react-resizable-handle': {
        visibility: 'visible',
      },
      '.react-grid-item.react-grid-placeholder': {
        backgroundColor: `${theme.props.colors.secondary[200]} !important`,
        borderRadius: '2px',
      },
    },
  }
}

const useCardClasses = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px`,
    display: 'flex',
    flexFlow: 'column',
    borderRadius: '2px',
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    margin: -editableCardBorder,
    '&:hover': {
      borderColor: theme.palette.divider,
    },
    '&:focus': {
      borderColor: theme.palette.divider,
    },
  },
}))

const useEditableCardClasses = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(4)}px ${theme.spacing(6)}px`,
    display: 'flex',
    flexFlow: 'column',
    borderRadius: '2px',
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    borderWidth: defaultCardBorder,
    borderStyle: 'solid',
    margin: -defaultCardBorder,
    '&:hover': {
      boxShadow: theme.shadows[4],
      '& > .card-menu-icon': {
        visibility: 'visible',
      },
    },
    transition: ([
      theme.transitions.create(
        [
          // from our styles
          'border',
          // from  mui-paper
          'box-shadow',
          // from react-grid-item
          'width',
          'transform',
        ],
        {
          delay: 36,
        },
      ),
      '!important',
    ] as unknown) as React.CSSProperties['transition'],
    // transitionProperty: 'border, box-shadow, width, transform !important',

    '&.react-draggable-dragging': {
      transitionProperty: 'border, box-shadow !important',
    },
    '& > .card-menu-icon': {
      visibility: 'hidden',
    },
  },
}))

const useHeaderClasses = makeStyles<Theme, { editable: boolean; padding: number }>(theme => ({
  root: {
    flex: '0 1 auto',
    paddingBottom: theme.spacing(2),
  },
  content: {
    minWidth: 0,
    pointerEvents: 'none',
    userSelect: 'none',
  },
}))

const useCardContentStyles = makeStyles<Theme, ReturnType<typeof useChartColors>['chartListColor']>(theme => ({
  root: {
    height: '100%',
    flex: '1 1 auto',
    padding: '0 !important',
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '5px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      width: '5px',
      background: chartListColors => chartListColors.thumbBackgroundColor,
      borderRadius: theme.shape.borderRadius,
    },
    scrollbarWidth: 'thin',
    scrollbarColor: chartListColors => `${chartListColors.scrollbarColor} transparent`,
  },
}))

type CardProps = {
  id: string
  chartId: string
  child: ComponentType<ChartProps>
  childProps?: unknown[]
  key: string
  className?: string
  titleText: string
  chartType?: ChartType
  showCardTitle?: boolean
  permissions?: Permission[]
  services?: ServiceId[]
  editable: boolean
  role: string
  style?: { width: string; height: string }
}

const arePropsEqual = (prev, next) => {
  let _isEqual = true

  const dashboardCardProps = [
    'chartId',
    'chartType',
    'child',
    'editable',
    'id',
    'permissions',
    'services',
    'showCardTitle',
    'style',
    'titleText',
  ]

  for (let i = 0; i < dashboardCardProps.length; i++) {
    const key = dashboardCardProps[i]

    _isEqual = _isEqual && isEqual(prev[key], next[key])

    if (!_isEqual) break
  }

  return _isEqual
}

export const DashboardCard: FC<CardProps> = memo(props => {
  const theme = useTheme()
  const { t } = useTranslation(['dashboard'])

  const chartListColors = useChartColors(theme).chartListColor
  const styles = useCardContentStyles(chartListColors)
  const {
    id,
    chartId,
    child: Child,
    childProps,
    children,
    titleText,
    chartType,
    showCardTitle = true,
    editable,
    permissions,
    services,
    ...rest
  } = props
  const globalTime = useSelector(selectGlobalTime)
  const key = useErrorBoundaryRecovery(globalTime?.timeInterval)

  const {
    style: { width: styleWidth, height: styleHeight },
  } = rest

  const width = Math.max(parseInt(styleWidth.slice(0, -2)), 0)
  let height = parseInt(styleHeight.slice(0, -2))
  height = height < 0 ? 0 : (height -= showCardTitle ? theme.spacing(10) : 0)

  const cardMenuItems = useCardMenu({ id })
  const showMenu = cardMenuItems && cardMenuItems.length > 0
  const editableCardClasses = useEditableCardClasses()
  const cardClasses = useCardClasses()
  const headerClasses = useHeaderClasses({ editable, padding: 6 })

  const DashboardCardGlobalCss = useMemo(() => withStyles(globalCardStyles(theme))(() => null), [theme])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const MemoizedChildComponent = useMemo(() => Child, [chartId])

  if (!MemoizedChildComponent) return null

  // TODO replace card content with new components (will be done as part of UES-4616).
  let cardContent = (
    <MemoizedChildComponent
      {...childProps}
      id={id}
      chartId={chartId}
      globalTime={globalTime}
      width={width}
      height={height}
      chartType={chartType}
    />
  )

  cardContent =
    permissions || services ? (
      <SecuredContent requiredPermissions={new Set(permissions)} requiredServices={new Set(services)}>
        {cardContent}
      </SecuredContent>
    ) : (
      cardContent
    )

  return (
    <>
      <DashboardCardGlobalCss />
      <Card
        role="button"
        variant="outlined"
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
        {...rest}
        classes={editable ? editableCardClasses : cardClasses}
        onClick={prevent}
        onDragStart={prevent}
        elevation={0}
        id={id}
        aria-label={t('cardLabel', { titleText, chartType: t(chartType) })}
      >
        <Box
          mt={-6}
          ml={-6}
          pt={6}
          pl={6}
          className={editable ? 'draghandle' : undefined}
          style={{ cursor: editable ? 'move' : 'unset' }}
        >
          {showCardTitle && (
            <CardHeader
              classes={headerClasses}
              title={
                <Typography variant="h4" noWrap>
                  {titleText}
                </Typography>
              }
              subheader={null}
            />
          )}
        </Box>

        {editable && showMenu && <DashboardCardMenu id={id} cardMenuItems={cardMenuItems} />}
        <CardContent classes={styles}>
          <GenericErrorBoundary key={key} fallback={<CardErrorHandler />}>
            {cardContent}
          </GenericErrorBoundary>
          {editable && children}
        </CardContent>
      </Card>
    </>
  )
}, arePropsEqual)
