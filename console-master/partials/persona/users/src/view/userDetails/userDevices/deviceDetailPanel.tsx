import React from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import type { UserDeviceInfo } from '@ues-data/persona'
import { ArrowChevronDown } from '@ues/assets'

import { DeviceDetailPanelTitle } from './deviceDetailPanelTitle'
import { isDeviceOffline } from './devicePanel.utils'
import { PersonaStatus } from './personaStatus'
import { DeviceTrustScoreLog } from './trustScoreLog'

interface DeviceDetailPanelProps {
  userId: string
  device: UserDeviceInfo
}

export const DeviceDetailPanel: React.FC<DeviceDetailPanelProps> = React.memo(({ userId, device }: DeviceDetailPanelProps) => {
  const { id: deviceId } = device

  return (
    <Box my={4}>
      <Paper variant="outlined">
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ArrowChevronDown />} aria-controls="panel-content" className="stand-alone-expansion-panel">
            <DeviceDetailPanelTitle device={device} />
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid item xs={5}>
                <PersonaStatus userId={userId} deviceId={deviceId} isDeviceOffline={isDeviceOffline(device.lastEventTime)} />
              </Grid>
              <Grid item xs={7}>
                <DeviceTrustScoreLog userId={userId} deviceId={deviceId} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  )
})
