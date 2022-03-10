import orderBy from 'lodash-es/orderBy'
import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import type { ZoneInfo } from '@ues-data/persona'

interface UserZonesProps {
  zones: ZoneInfo[]
}

const UserZones = ({ zones }: UserZonesProps) => {
  const { t } = useTranslation(['persona/common'])

  const orderedZones = orderBy(zones, 'name')

  return (
    <Box pt={3} data-autoid="user-info-zones">
      <Grid container>
        <Grid item xs={3}>
          <Typography variant="h4">{t('users.columns.zones')}</Typography>
        </Grid>
        <Grid item xs={9}>
          <Box display="flex" flexWrap="wrap" data-autoid="user-info-zones-box">
            {orderedZones.map(zone => (
              <Box key={zone.id} pb={1} pr={3}>
                <Chip label={<Typography variant="body2">{zone.name}</Typography>} variant="outlined" />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserZones
