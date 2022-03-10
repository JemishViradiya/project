/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import type { PaginationRenderItemParams } from '@material-ui/lab'
import { Pagination, PaginationItem } from '@material-ui/lab'

import { StatusMediumOutline } from '@ues/assets'

const defaultChartOptions = {
  showLegend: true,
  showTooltip: true,
}

/* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
function getChartOption(props, optionName) {
  const optionValue = props[optionName]
  if (typeof optionValue === 'undefined') return defaultChartOptions[optionName]
  return optionValue
}

const useStyles = makeStyles<Theme, { color: string }>(theme => ({
  title: {
    ...theme.typography.h4,
    margin: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    // fontSize: '1rem',
  },
  chartContainer: {
    flex: '1 0 auto',
    // height: '30%',
  },
  dataRow: {
    whiteSpace: 'nowrap',
  },
  data: {
    fontWeight: 600,
    fontSize: '1.125rem',
  },
  icon: {
    fontSize: '2.667rem',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: ({ color }) => color,
    alignSelf: 'center',
  },
  container: {
    marginTop: -theme.spacing(1),
    height: '100%',
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  description: {
    fontSize: '0.667rem',
    fontWeight: 300,
  },
  switch: {
    position: 'absolute',
    right: theme.spacing(4),
    bottom: theme.spacing(1),
  },
  dataBlock: {
    display: 'flex',
    flexFlow: 'column nowrap',
    ...theme.typography.subtitle1,
    lineHeight: 1.25,
  },
  '@media (max-width: 960px)': {
    icon: {
      marginTop: theme.spacing(3),
    },
    switch: {
      right: theme.spacing(2),
    },
    dataBlock: {
      flexFlow: 'row nowrap',
      alignItems: 'baseline',
    },
    description: {
      marginLeft: theme.spacing(1),
    },
    chartContainer: {
      marginTop: theme.spacing(1),
    },
  },
}))

const usePaginationClasses = makeStyles(theme => ({
  sizeSmall: {
    fontSize: '0.625rem',
    height: '1em',
    margin: '0 2px',
    padding: 0,
    minWidth: '1em',
    maxWidth: '1em',
    borderRadius: '0.5em',
    color: 'transparent !important',
    backgroundColor: theme.palette.divider,
    // border: `1px solid ${theme.palette.primary.main}`,
  },
}))

export interface DualTotalStatsProps {
  id: string
  data: {
    total: number
    recent?: number
  }
  title: string
  color: string
  icon?: typeof StatusMediumOutline
}

export const DualTotalStats: React.FC<DualTotalStatsProps> = memo(props => {
  const { t } = useTranslation('dashboard')
  const classes = useStyles({ color: props.color })

  const Icon: typeof StatusMediumOutline = props.icon || StatusMediumOutline

  const paginationClasses = usePaginationClasses()

  const [showRecent, setShowRecent] = useState<boolean>(false)
  const handlePageChange = useCallback((ev, number) => {
    setShowRecent(number === 2)
  }, [])

  const { recent, total } = props.data

  return (
    <div id={props.id} className={classes.container}>
      <Icon className={classes.icon} />
      <div className={classes.chartContainer}>
        <h4 className={classes.title}>{props.title}</h4>
        <div className={classes.dataBlock}>
          <div className={classes.data}>{showRecent ? recent : total}</div>
          <div className={classes.description}>{t(showRecent ? 'recent' : 'total')}</div>
        </div>
      </div>
      {recent !== undefined && (
        <div className={classes.switch}>
          <Pagination
            count={2}
            page={showRecent ? 2 : 1}
            onChange={handlePageChange}
            color="primary"
            size="small"
            hidePrevButton
            hideNextButton
            renderItem={(props: PaginationRenderItemParams) => <PaginationItem classes={paginationClasses} {...props} />}
          />
        </div>
      )}
    </div>
  )
})
