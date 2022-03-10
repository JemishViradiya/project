/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Divider, Link, makeStyles } from '@material-ui/core'

import type { UesTheme } from '@ues/assets'
import { ArrowUp } from '@ues/assets'

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

const useStyles = makeStyles<UesTheme>(theme => ({
  title: {
    ...theme.typography.h6,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  chartTitle: {
    flex: '0 0 auto',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    ...theme.typography.h2,
    marginTop: 0,
    marginBottom: theme.spacing(4),
    fontWeight: 600,
  },
  riskLevel: {
    fontSize: '1.125rem',
    lineHeight: 1.25,
    alignItems: 'baseline',
    marginTop: 16,
    marginBottom: 16,
  },
  riskLevelName: {
    textTransform: 'uppercase',
    flex: '1 0 auto',
    marginLeft: theme.spacing(3),
    ...theme.typography.h3,
  },
  arrow: {
    alignSelf: 'flex-end',
    marginTop: -theme.spacing(1),
  },
  row: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  rowDescription: {
    fontWeight: 500,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    fontSize: '0.6875rem',
    textAlign: 'right',
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  icon: {
    fontSize: '2.667rem',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    // color: ({ color }) => color,
    alignSelf: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexFlow: 'column nowrap',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}))

export interface TopThreatsProps {
  data: {
    total: number
    high: {
      threats: number
      percentage: number
      devices: number
    }
    medium: {
      threats: number
      percentage: number
      devices: number
    }
    low: {
      threats: number
      percentage: number
      devices: number
    }
  }
  title: string
}

export const TopThreats: React.FC<TopThreatsProps> = memo(props => {
  const { t } = useTranslation('dashboard')
  const classes = useStyles()

  const { total } = props.data

  const riskLevel = key => {
    const data = props.data[key]
    return (
      <>
        <Divider />
        <div className={classes.riskLevel} key={key}>
          <div className={classes.row}>
            <ArrowUp className={classes.arrow} />
            <div className={classes.riskLevelName}>{key}</div>
            <Link>{data.threats}</Link>
          </div>
          <div className={classes.rowDescription}>
            <Link>{data.percentage}%</Link>
            <span>{' of total files'}</span>
            <span>{' | '}</span>
            <Link>{data.devices}</Link>
            <span>{' affected devices'}</span>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={classes.container}>
      {/* <Divider /> */}
      <h4 className={classes.chartTitle}>
        <div>{t('total')}</div>
        <Link>{total}</Link>
      </h4>
      {riskLevel('high')}
      {riskLevel('medium')}
      {riskLevel('low')}
    </div>
  )
})
