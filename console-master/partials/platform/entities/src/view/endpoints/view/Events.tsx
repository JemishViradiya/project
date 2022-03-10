/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import React, { lazy, useMemo } from 'react'

import { Card, makeStyles } from '@material-ui/core'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { GatewayEndpointEvents } from '@ues-gateway/events'
import { Tabs, useStatefulTabsProps } from '@ues/behaviours'

const useStyles = makeStyles({
  box: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
})

const EventsTab = () => {
  const { box } = useStyles()
  const { isEnabled } = useFeatures()
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)
  const tabs = useMemo(
    () => [
      {
        translations: {
          label: gatewayAlertsTransition
            ? 'platform/endpoints:endpoint.events.networkTraffic'
            : 'platform/endpoints:endpoint.events.networkConnections',
        },
        component: <GatewayEndpointEvents />,
      },
    ],
    [gatewayAlertsTransition],
  )
  const tabsProps = useStatefulTabsProps({ defaultSelectedTabIndex: 0, tabs, tNs: ['platform/endpoints'] })
  return (
    <Card className={box} variant="outlined">
      <Tabs fullScreen {...tabsProps} />
    </Card>
  )
}

export default EventsTab
