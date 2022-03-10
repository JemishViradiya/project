/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC } from 'react'
import React, { memo } from 'react'

import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  clickable: {
    cursor: 'pointer',
  },
  description: {
    paddingLeft: theme.spacing(1),
    color: theme.palette.text.hint,
    verticalAlign: 'middle',
  },
}))

// the height of this component
export const TOTAL_COUNT_HEIGHT = 26

interface TotalCountProps {
  count: string
  description?: string
  onInteraction?: () => void
}

export const TotalCount: FC<TotalCountProps> = memo(({ count, description, onInteraction }) => {
  const styles = useStyles()

  const isClickable = typeof onInteraction === 'function'

  return (
    <div className={styles.container}>
      <Typography
        noWrap
        variant={'h1'}
        className={isClickable ? styles.clickable : undefined}
        onClick={isClickable ? onInteraction : undefined}
      >
        {count}
        <Typography variant={'caption'} className={styles.description}>
          {description}
        </Typography>
      </Typography>
    </div>
  )
})
