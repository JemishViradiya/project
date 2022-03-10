import React, { memo, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Alert from '@material-ui/lab/Alert'

import { useActorDPEnabled } from '@ues-bis/shared'
import { OperatingMode } from '@ues-data/bis/model'
import { FeatureName, useFeatures } from '@ues-data/shared'
import { BasicInfo } from '@ues/assets'

import { TRANSLATION_NAMESPACES } from '../../config'
import { GeneralSettingsContext } from '../../providers/general-settings-provider'
import { useStyles } from './styles'

export const PassiveModeAlert: React.FC = memo(() => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const { isEnabled } = useFeatures()
  const styles = useStyles()
  const { data } = useContext(GeneralSettingsContext)
  const isPassiveMode = data?.generalSettings?.tenantSettings?.operatingMode === OperatingMode.PASSIVE
  const actorDPEnabled = useActorDPEnabled()

  const adaptiveSettingsPath = useMemo(() => {
    return isEnabled(FeatureName.UESCronosNavigation)
      ? '/uc/console#/settings/adaptive-security/general-settings'
      : '/uc/gateway-settings#/adaptiveresponse'
  }, [isEnabled])

  return isPassiveMode && !actorDPEnabled ? (
    <Alert className={styles.container} variant="outlined" severity="info" icon={<BasicInfo />}>
      <Box pb={2}>
        <Typography variant="subtitle2">{t('bis/ues:gatewayAlerts.alert.passiveMode.title')}</Typography>
      </Box>
      <Typography variant="body2">
        {t('bis/ues:gatewayAlerts.alert.passiveMode.description')}
        <Link className={styles.link} href={adaptiveSettingsPath} variant="inherit" color="primary">
          {t('bis/ues:gatewayAlerts.alert.passiveMode.settingsLink')}
        </Link>
      </Typography>
    </Alert>
  ) : null
})
