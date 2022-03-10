/*
 *   Copyright (c) 2020 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { FC } from 'react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

import { getTimeIntervals1, getTimeIntervals2 } from './dateUtils'
import { selectNowTime } from './store'
import type { DashboardTime } from './types'
import { MenuListItem } from './widgets/MenuListItem'
import { SelectMenu } from './widgets/SelectMenu'

const useStyles = makeStyles(theme => ({
  timeSelect: {
    '&:not(:nth-last-child(1))': {
      paddingRight: theme.spacing(2),
    },
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

interface TimeSelectProps {
  dashboardTime: DashboardTime
  setDashboardTime: (dashboardTime: DashboardTime) => void
  testid?: string
}

export const TimeSelect: FC<TimeSelectProps> = memo(props => {
  const styles = useStyles()
  const { t } = useTranslation(['dashboard'])
  const { testid, dashboardTime, setDashboardTime } = props
  const nowTime = useSelector(selectNowTime)

  const handleValueChange = newValue => {
    setDashboardTime({ timeInterval: newValue, nowTime })
  }

  const renderMenuItems = timeIntervals => {
    const items = []
    for (const id in timeIntervals) {
      items.push(
        <MenuListItem key={id} value={id} data-testid={testid + '_' + id}>
          {t(id)}
        </MenuListItem>,
      )
    }
    return items
  }

  return (
    <div className={styles.timeSelect}>
      <SelectMenu initValue={dashboardTime} onValueChange={handleValueChange} testid={testid}>
        {renderMenuItems(getTimeIntervals1(nowTime))}
        <Divider classes={{ root: styles.divider }} />
        {renderMenuItems(getTimeIntervals2(nowTime))}
      </SelectMenu>
    </div>
  )
})
