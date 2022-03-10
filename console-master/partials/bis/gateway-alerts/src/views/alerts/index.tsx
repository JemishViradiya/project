import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useActorDPEnabled } from '@ues-bis/shared'
import { FeatureName, ServiceId, useFeatures } from '@ues-data/shared'
import { HelpLinks } from '@ues/assets'
import { ContentAreaPanel, PageTitlePanel, SecuredContent, SecuredContentBoundary, usePageTitle } from '@ues/behaviours'

import { GatewayAlertDrawer, useDrawerProps } from '../../components/drawer'
import { PassiveModeAlert } from '../../components/passive-mode-alert'
import { GatewayAlertsTable } from '../../components/table'
import { TRANSLATION_NAMESPACES } from '../../config'
import { GeneralSettingsProvider } from '../../providers/general-settings-provider'
import type { UserHrefFn } from '../../types'
import { ColumnKey } from '../../types'
import { useStyles } from './styles'

const userHrefFn: UserHrefFn = ecoId => `/users/${encodeURIComponent(btoa(ecoId))}`

const Alerts: React.FC = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const [id, setId] = useState(null)
  const { isOpen, toggleDrawer, excludeEventFromDrawerToggling } = useDrawerProps()
  const { isEnabled } = useFeatures()
  const actorDPEnabled = useActorDPEnabled()
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)
  const hiddenColumns = actorDPEnabled ? [ColumnKey.Response] : []

  usePageTitle(t(gatewayAlertsTransition ? 'bis/ues:gatewayEvents.networkEvents.label' : 'bis/ues:gatewayAlertDetails.pageTitle'))

  const classNames = useStyles()

  const onRowClick = useCallback(
    event => {
      excludeEventFromDrawerToggling(event.event.nativeEvent)
      if (event.rowData.id === id) {
        toggleDrawer()
      } else {
        setId(event.rowData.id)
        if (!isOpen) {
          toggleDrawer()
        }
      }
    },
    [excludeEventFromDrawerToggling, id, toggleDrawer, isOpen],
  )

  return (
    <div className={classNames.container}>
      {!gatewayAlertsTransition && (
        <PageTitlePanel
          title={[
            t('bis/ues:gatewayAlertDetails.labelGateway'),
            actorDPEnabled ? t('bis/ues:gatewayAlertDetails.pageTitleDpActor') : t('bis/ues:gatewayAlertDetails.pageTitle'),
          ]}
          borderBottom
          helpId={HelpLinks.Alerts}
        />
      )}

      <div className={classNames.content}>
        <SecuredContentBoundary>
          <SecuredContent requiredServices={ServiceId.BIG}>
            <GeneralSettingsProvider>
              <PassiveModeAlert />

              <ContentAreaPanel fullHeight boxProps={{ width: '100%', maxWidth: 'none' }}>
                <GatewayAlertsTable userHrefFn={userHrefFn} onRowClick={onRowClick} hiddenColumns={hiddenColumns} />
                <GatewayAlertDrawer eventId={id} isOpen={isOpen} toggleDrawer={toggleDrawer} />
              </ContentAreaPanel>
            </GeneralSettingsProvider>
          </SecuredContent>
        </SecuredContentBoundary>
      </div>
    </div>
  )
}

export default Alerts
