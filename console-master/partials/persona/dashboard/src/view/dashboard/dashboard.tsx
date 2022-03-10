import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

import { HelpLinks } from '@ues/assets'
import { PageTitlePanel, usePageTitle } from '@ues/behaviours'

const useStyles = makeStyles(() => ({
  outerContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const Dashboard: React.FC = () => {
  const { t } = useTranslation(['persona/common'])
  usePageTitle(t('dashboard.title'))

  const { outerContainer } = useStyles()

  return (
    <Box className={outerContainer}>
      <PageTitlePanel title={[t('dashboard.title')]} helpId={HelpLinks.PersonaDesktopStats} borderBottom />

      <Box m={6}>
        <p>Persona Dashboard</p>
      </Box>
    </Box>
  )
}

export default Dashboard
