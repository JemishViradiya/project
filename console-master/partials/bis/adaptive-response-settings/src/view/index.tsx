import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'

import { Box, Typography } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import type { UCPartialRouteObject } from '@ues-behaviour/react'
import { useBISPolicySchema } from '@ues-data/bis'
import { useFeatures } from '@ues-data/shared'
import { FeatureName } from '@ues-data/shared-types'
import { BasicInfo } from '@ues/assets'
import type { TabRouteObject } from '@ues/behaviours'
import { ViewWrapper } from '@ues/behaviours'

const Settings = React.lazy(() => import('./AdaptiveResponseSettings'))

const SettingsWithConditions = () => {
  const { isMigratedToDP } = useBISPolicySchema()
  return !isMigratedToDP && <Settings />
}

export const AdaptiveResponseSettings: UCPartialRouteObject = {
  path: '/adaptiveresponse',
  element: <SettingsWithConditions />,
}

const AdaptiveSecurityTabs: TabRouteObject[] = [
  {
    path: '/defined-geozones',
    features: isEnabled => isEnabled(FeatureName.BisGeofenceEnabled),
    translations: {
      label: 'console:adaptiveSecurity.definedGeozones.title',
    },
  },
  {
    path: '/behavioral-risk',
    features: isEnabled => isEnabled(FeatureName.BisBehaviouralLocationEnabled),
    translations: {
      label: 'console:adaptiveSecurity.behavioralRisk.title',
    },
  },
  {
    path: '/general-settings',
    element: <Settings />,
    translations: {
      label: 'console:adaptiveSecurity.generalSettings.title',
    },
  },
]

export const AdaptiveSecurityDefaultTab = () => {
  const { isEnabled } = useFeatures()
  if (isEnabled(FeatureName.BisGeofenceEnabled)) {
    return <Navigate to="./defined-geozones" />
  }
  if (isEnabled(FeatureName.BisBehaviouralLocationEnabled)) {
    return <Navigate to="./behavioral-risk" />
  }
  return <Navigate to="./general-settings" />
}

const AdaptiveSecurityElement: React.FC = () => {
  const { t } = useTranslation(['bis/ues'])
  const { isMigratedToDP } = useBISPolicySchema()

  return useMemo(() => {
    if (!isMigratedToDP) {
      return (
        <ViewWrapper
          basename="/settings/adaptive-security"
          titleKey="console:adaptiveSecurity.title"
          tabs={AdaptiveSecurityTabs}
          tKeys={['console']}
        />
      )
    }

    return (
      <ViewWrapper basename="/settings/adaptive-security" titleKey="console:adaptiveSecurity.title" tKeys={['console']}>
        <Box p={4}>
          <Alert variant="outlined" severity="info" icon={<BasicInfo />}>
            <Box pb={2}>
              <Typography variant="subtitle2">{t('bis/ues:settings.comingSoonMessage.title')}</Typography>
            </Box>
            <Typography variant="body2">{t('bis/ues:settings.comingSoonMessage.description')}</Typography>
          </Alert>
        </Box>
      </ViewWrapper>
    )
  }, [isMigratedToDP, t])
}

export const AdaptiveSecurityRoutes = {
  path: '/settings/adaptive-security',
  element: <AdaptiveSecurityElement />,
  children: [{ path: '/', element: <AdaptiveSecurityDefaultTab /> }, ...AdaptiveSecurityTabs],
}
