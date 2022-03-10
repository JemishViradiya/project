/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { useMemo } from 'react'

import { Card, makeStyles } from '@material-ui/core'

import { MobileAlertByDevice } from '@ues-mtd/alerts'
import { Tabs, useStatefulTabsProps } from '@ues/behaviours'

const useStyles = makeStyles({
  box: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})

const AlertsTab = () => {
  const { box } = useStyles()
  const tabs = useMemo(
    () => [
      {
        translations: {
          label: 'platform/endpoints:endpoint.threats.mobileDevice',
        },
        component: <MobileAlertByDevice />,
      },
    ],
    [],
  )
  const tabsProps = useStatefulTabsProps({ defaultSelectedTabIndex: 0, tabs, tNs: ['platform/endpoints'] })
  return (
    <Card className={box} variant="outlined">
      <Tabs fullScreen {...tabsProps} />
    </Card>
  )
}

export default AlertsTab
