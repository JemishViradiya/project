import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import { makeStyles, Typography } from '@material-ui/core'

import { useActorDPEnabled } from '@ues-bis/shared'
import { FeatureName, ServiceId, useFeatures } from '@ues-data/shared'
import { ContentAreaPanel, SecuredContent, SecuredContentBoundary } from '@ues/behaviours'

import { GatewayAlertDrawer, useDrawerProps } from '../../components/drawer'
import { PassiveModeAlert } from '../../components/passive-mode-alert'
import { GatewayAlertsTable } from '../../components/table'
import { TRANSLATION_NAMESPACES } from '../../config'
import { GeneralSettingsProvider } from '../../providers/general-settings-provider'
import { ColumnKey } from '../../types'

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    display: 'flex',
  },
}))

const UserAlerts: React.FC = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES)
  const [id, setId] = useState(null)
  const { isOpen, toggleDrawer, excludeEventFromDrawerToggling } = useDrawerProps()
  const { isEnabled } = useFeatures()
  const cronosNavigation = isEnabled(FeatureName.UESCronosNavigation)
  const actorDPEnabled = useActorDPEnabled()

  const hiddenColumns = actorDPEnabled ? [ColumnKey.User, ColumnKey.Response] : [ColumnKey.User]

  const params = useParams()
  const userIds: string[] = useMemo(() => [params.id ? atob(params.id) : []], [params?.id]) as string[]

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

  const TableWrapper = useCallback<React.FC>(
    ({ children }) =>
      isEnabled(FeatureName.UESCronosNavigation) ? (
        <Fragment>{children}</Fragment>
      ) : (
        <ContentAreaPanel fullHeight boxProps={{ width: '100%', maxWidth: 'none' }}>
          {children}
        </ContentAreaPanel>
      ),
    [isEnabled],
  )

  return (
    <SecuredContentBoundary>
      <SecuredContent requiredServices={ServiceId.BIG}>
        <GeneralSettingsProvider>
          <PassiveModeAlert />
          <div className={classNames.container}>
            <TableWrapper>
              <GatewayAlertsTable
                tableTitle={!cronosNavigation && <Typography variant="h2">{t('bis/ues:gatewayAlertDetails.pageTitle')}</Typography>}
                onRowClick={onRowClick}
                userIds={userIds}
                hiddenColumns={hiddenColumns}
              />

              <GatewayAlertDrawer eventId={id} isOpen={isOpen} toggleDrawer={toggleDrawer} />
            </TableWrapper>
          </div>
        </GeneralSettingsProvider>
      </SecuredContent>
    </SecuredContentBoundary>
  )
}

export default UserAlerts
