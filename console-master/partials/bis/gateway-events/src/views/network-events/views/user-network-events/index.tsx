import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'

import { makeStyles } from '@material-ui/core'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { ContentAreaPanel, SecuredContentBoundary } from '@ues/behaviours'

import { NetworkAnomalyDrawer, useDrawerProps } from '../../components/drawer'
import { NetworkAnomalyTable } from '../../components/table'
import { EndpointsProvider } from '../../providers/endpoints-provider'
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
  const [id, setId] = useState(null)
  const { isOpen, toggleDrawer, excludeEventFromDrawerToggling } = useDrawerProps()
  const { isEnabled } = useFeatures()
  const arrEnabled = isEnabled(FeatureName.ARR)
  const gatewayAlertsTransition = isEnabled(FeatureName.UESNavigationGatewayAlertsTransition)

  const defaultHiddenColumns = [ColumnKey.Risk, ColumnKey.User]
  const hiddenColumns = arrEnabled ? defaultHiddenColumns : [ColumnKey.Response, ...defaultHiddenColumns]

  const params = useParams()
  const userIds = useMemo(() => [atob(params.id)], [params.id])

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
      gatewayAlertsTransition ? (
        <Fragment>{children}</Fragment>
      ) : (
        <ContentAreaPanel fullHeight boxProps={{ width: '100%', maxWidth: 'none' }}>
          {children}
        </ContentAreaPanel>
      ),
    [gatewayAlertsTransition],
  )

  return (
    <SecuredContentBoundary>
      <GeneralSettingsProvider>
        <EndpointsProvider>
          <div className={classNames.container}>
            <TableWrapper>
              <NetworkAnomalyTable onRowClick={onRowClick} userIds={userIds} hiddenColumns={hiddenColumns} />
              <NetworkAnomalyDrawer eventId={id} isOpen={isOpen} toggleDrawer={toggleDrawer} hiddenColumns={hiddenColumns} />
            </TableWrapper>
          </div>
        </EndpointsProvider>
      </GeneralSettingsProvider>
    </SecuredContentBoundary>
  )
}

export default UserAlerts
