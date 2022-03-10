import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'

import { USER_ALERTS_WINDOW_HEIGHT } from '../userDetails.constants'
import { ActiveAlertsList } from './activeAlertsList'
import { AlertHistoryList } from './alertsHistoryList'

enum UserAlertsTab {
  ACTIVE_ALERTS_TAB = 'ACTIVE_ALERTS_TAB',
  ALERT_HISTORY_TAB = 'ALERT_HISTORY_TAB',
}

interface UserAlertsProps {
  userId: string
}

export const UserAlerts: React.FC<UserAlertsProps> = ({ userId }: UserAlertsProps) => {
  const { t } = useTranslation(['persona/common'])

  const [activeTab, setActiveTab] = useState(UserAlertsTab.ACTIVE_ALERTS_TAB)

  const onChangeTab = (_event: React.ChangeEvent, newTab: UserAlertsTab) => setActiveTab(newTab)

  return (
    <Paper variant="outlined">
      <Box p={6} height={USER_ALERTS_WINDOW_HEIGHT} display="flex" flexDirection="column">
        <Box mb={2}>
          <Typography variant="h2">{t('users.sectionTitles.personaAlerts')}</Typography>
        </Box>
        <Box pb={6}>
          <Tabs value={activeTab} onChange={onChangeTab}>
            <Tab
              style={{ marginLeft: 0 }}
              value={UserAlertsTab.ACTIVE_ALERTS_TAB}
              label={<Typography variant="h3">{t('users.tabs.activeAlerts')}</Typography>}
            />
            <Tab
              value={UserAlertsTab.ALERT_HISTORY_TAB}
              label={<Typography variant="h3">{t('users.tabs.alertHistory')}</Typography>}
            />
          </Tabs>
        </Box>
        <Box overflow="auto" data-autoid="alert-info-content">
          {activeTab === UserAlertsTab.ACTIVE_ALERTS_TAB ? <ActiveAlertsList userId={userId} /> : null}
          {activeTab === UserAlertsTab.ALERT_HISTORY_TAB ? <AlertHistoryList userId={userId} /> : null}
        </Box>
      </Box>
    </Paper>
  )
}
