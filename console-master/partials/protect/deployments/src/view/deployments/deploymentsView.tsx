import React from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'

import { PageTitlePanel } from '@ues/behaviours'

import Deployments from './deployments'
import useStyles from './styles'

const DeploymentsView: React.FC = () => {
  const { t } = useTranslation(['deployments'])
  const { outerContainer } = useStyles()
  return (
    <Box className={window.isInVenue ? '' : outerContainer}>
      <PageTitlePanel title={[t('title')]} borderBottom />
      <Deployments />
    </Box>
  )
}

export default DeploymentsView
