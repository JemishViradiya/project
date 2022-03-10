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
import { ChipSelect, useChipSelect } from './widgets/ChipSelect'
import { MenuListItem } from './widgets/MenuListItem'

type TimeSelectProps = {
  dashboardTime: DashboardTime
  setDashboardTime: (DashboardTime) => void
  testid?: string
}

const useStyles = makeStyles(theme => ({
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}))

export const TimeSelectSmall: FC<TimeSelectProps> = memo(props => {
  const { t } = useTranslation(['dashboard'])
  const { testid, dashboardTime, setDashboardTime } = props
  const chipSelectProps = useChipSelect()
  const nowTime = useSelector(selectNowTime)

  const styles = useStyles()

  const handleSelection = newValue => {
    setDashboardTime({ timeInterval: newValue, nowTime })
    chipSelectProps.setOpen(false)
  }

  const renderMenuItems = timeIntervals => {
    const items = []
    for (const id in timeIntervals) {
      items.push(
        <MenuListItem
          key={id}
          value={id}
          data-testid={testid + '_' + id}
          onClick={() => handleSelection(id)}
          selected={id === dashboardTime.timeInterval}
        >
          {t(id)}
        </MenuListItem>,
      )
    }

    return items
  }

  return (
    <ChipSelect label={t(dashboardTime.timeInterval)} {...chipSelectProps}>
      {renderMenuItems(getTimeIntervals1(nowTime))}
      <Divider classes={{ root: styles.divider }} />
      {renderMenuItems(getTimeIntervals2(nowTime))}
    </ChipSelect>
  )
})
