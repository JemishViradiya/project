/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC } from 'react'
import React, { memo, useState } from 'react'

import type { SvgIcon } from '@material-ui/core'
import { Button, makeStyles, Tooltip } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { ArrowCaretDown, ArrowCaretUp } from '@ues/assets'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexDirection: 'row',
    minWidth: '100px',
  },
  description: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'normal',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'left',
  },
  iconContainer: {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px ${theme.spacing(0)}px ${theme.spacing(0)}px`,
    alignItems: 'flex-start',
  },
  clickable: {
    cursor: 'pointer',
  },
  changeGood: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette['alert']['success'],
    color: theme.palette['alert']['successBorder'],
    width: 'min-content',
    marginTop: theme.spacing(2.5),
  },
  changeBad: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette['alert']['error'],
    color: theme.palette['alert']['errorBorder'],
    width: 'min-content',
    marginTop: theme.spacing(2.5),
  },
}))

type CountProps = {
  count: number
  description?: string
  icon?: typeof SvgIcon
  showChange?: boolean
  isIncreaseGood?: boolean
  prevCount?: number
  onCountClick?: () => void
  onChangeClick?: () => void
}

export const Count: FC<CountProps> = memo(props => {
  const { count, description, onCountClick, onChangeClick, icon: Icon, showChange, isIncreaseGood, prevCount } = props
  const styles = useStyles()
  const [showChangePercentage, setShowChangePercentage] = useState(false)

  const diff = count - prevCount
  const isIncrease = diff >= 0
  const percentDiff: string =
    prevCount === 0
      ? Math.abs((diff / Math.abs(1)) * 100).toFixed(2) + '%' // to avoid Infinity, sub with 1
      : Math.abs((diff / Math.abs(prevCount)) * 100).toFixed(2) + '%'

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>{Icon && <Icon />}</div>
      <div className={styles.titleContainer}>
        <Typography
          noWrap
          variant="h1"
          className={typeof onCountClick !== 'undefined' ? styles.clickable : undefined}
          onClick={typeof onCountClick !== 'undefined' ? onCountClick : undefined}
        >
          {count}
        </Typography>
        <Tooltip title={description} className={styles.description} arrow>
          <Typography variant={'caption'}>{description}</Typography>
        </Tooltip>
        {showChange && (
          <div>
            <Button
              className={isIncreaseGood === isIncrease ? styles.changeGood : styles.changeBad} //XNOR
              onClick={() => setShowChangePercentage(!showChangePercentage)}
              variant="contained"
              size="small"
              startIcon={isIncrease ? <ArrowCaretUp /> : <ArrowCaretDown />}
            >
              {showChangePercentage ? percentDiff : Math.abs(diff)}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
})
