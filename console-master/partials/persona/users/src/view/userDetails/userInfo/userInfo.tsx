import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import { queryUserDetails } from '@ues-data/persona'
import { useStatefulReduxQuery } from '@ues-data/shared'

import { USER_ALERTS_WINDOW_HEIGHT } from '../userDetails.constants'
import UserZones from './userZones'

interface UserInfoProps {
  userId: string
}

export const UserInfo: React.FC<UserInfoProps> = React.memo(({ userId }: UserInfoProps) => {
  const { t } = useTranslation(['persona/common'])

  const queryOptions = useMemo(() => ({ variables: userId }), [userId])
  const { data: userDetails } = useStatefulReduxQuery(queryUserDetails, queryOptions)

  return (
    <Paper variant="outlined">
      <Box p={5} display="flex" flexDirection="column" minHeight={USER_ALERTS_WINDOW_HEIGHT}>
        <Typography variant="h2">{t('users.sectionTitles.userInfo')}</Typography>
        <Box display="flex" flexDirection="column" pt={6}>
          <Box py={3}>
            <Grid container>
              <Grid item xs={3}>
                <Typography variant="h4">{t('users.columns.userName')}</Typography>
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2">{userDetails?.userName}</Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <UserZones zones={userDetails?.zones} />
        </Box>
      </Box>
    </Paper>
  )
})
