import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { ContentAreaPanel, SecuredContentBoundary, usePageTitle } from '@ues/behaviours'

import { NetworkAnomalyDrawer, useDrawerProps } from '../../components/drawer'
import { NetworkAnomalyTable } from '../../components/table'
import { EndpointsProvider } from '../../providers/endpoints-provider'
import { GeneralSettingsProvider } from '../../providers/general-settings-provider'
import { ColumnKey } from '../../types'
import { useStyles } from './styles'

const NetworkAnomaly: React.FC = () => {
  const { t } = useTranslation(['bis/ues'])
  usePageTitle(t('bis/ues:gatewayEvents.networkEvents.pageTitle'))
  const [id, setId] = useState(null)
  const { isOpen, toggleDrawer, excludeEventFromDrawerToggling } = useDrawerProps()
  const { isEnabled } = useFeatures()
  const arrEnabled = isEnabled(FeatureName.ARR)
  const defaultHiddenColumns = [ColumnKey.Risk]
  const hiddenColumns = arrEnabled ? defaultHiddenColumns : [ColumnKey.Response, ...defaultHiddenColumns]

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

  const classNames = useStyles()

  return (
    <div className={classNames.container}>
      <div className={classNames.content}>
        <SecuredContentBoundary>
          <GeneralSettingsProvider>
            <EndpointsProvider>
              <ContentAreaPanel fullHeight boxProps={{ width: '100%', maxWidth: 'none' }}>
                <NetworkAnomalyTable onRowClick={onRowClick} hiddenColumns={hiddenColumns} />
                <NetworkAnomalyDrawer eventId={id} isOpen={isOpen} toggleDrawer={toggleDrawer} hiddenColumns={hiddenColumns} />
              </ContentAreaPanel>
            </EndpointsProvider>
          </GeneralSettingsProvider>
        </SecuredContentBoundary>
      </div>
    </div>
  )
}

export default NetworkAnomaly
