/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import classNames from 'classnames'
import type { ReactNode } from 'react'
import React, { memo, useMemo } from 'react'

import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  chartHeader: {
    width: '100%',
    minHeight: theme.spacing(4),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}))

export interface ChartHeaderProps {
  className: string
  children?: ReactNode
}

export const ChartHeader = memo(({ className, children }: ChartHeaderProps) => {
  const styles = useStyles()

  const chartHeaderClass = useMemo(() => classNames(className, styles.chartHeader), [className, styles.chartHeader])

  return <div className={chartHeaderClass}>{children}</div>
})
