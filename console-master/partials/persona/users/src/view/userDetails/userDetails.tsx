import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { HelpLinks } from '@ues/assets'
import { PageTitlePanel, usePageTitle } from '@ues/behaviours'

import { UserAlerts } from './userAlerts'
import { UserDevices } from './userDevices'
import { UserInfo } from './userInfo'

const useStyles = makeStyles(theme => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(6),
  },
}))

const UserDetails: React.FC = () => {
  const { t } = useTranslation(['persona/common'])
  usePageTitle(t('users.detailsTitle'))
  const { outerContainer } = useStyles()

  const { userId } = useParams()

  return (
    <Box className={outerContainer}>
      <PageTitlePanel
        title={[t('users.sectionTitles.assets'), t('users.title')]}
        helpId={HelpLinks.AssetsPersonaUsers}
        borderBottom
      />
      <Box m={6}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={6}>
            <UserInfo userId={userId} />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <UserAlerts userId={userId} />
          </Grid>
        </Grid>
        <UserDevices userId={userId} />
      </Box>
    </Box>
  )
}

export default UserDetails
