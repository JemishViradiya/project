import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router'

import { FeatureName, useFeatures } from '@ues-data/shared'
import { SecuredContentBoundary } from '@ues/behaviours'

import { NetworkAnomalyDrawer, useDrawerProps } from '../../components/drawer'
import { NetworkAnomalyTable } from '../../components/table'
import { GeneralSettingsProvider } from '../../providers/general-settings-provider'
import { ColumnKey } from '../../types'

const DeviceNetworkEvents = () => {
  const [id, setId] = useState(null)
  const { isOpen, toggleDrawer, excludeEventFromDrawerToggling } = useDrawerProps()
  const { isEnabled } = useFeatures()
  const arrEnabled = isEnabled(FeatureName.ARR)
  const defaultHiddenColumns = [ColumnKey.Risk, ColumnKey.User, ColumnKey.Device]
  const hiddenColumns = arrEnabled ? defaultHiddenColumns : [ColumnKey.Response, ...defaultHiddenColumns]

  const params = useParams()
  const containerIds = [params.endpointId]

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
    <SecuredContentBoundary>
      <GeneralSettingsProvider>
        <NetworkAnomalyTable onRowClick={onRowClick} hiddenColumns={hiddenColumns} containerIds={containerIds} />
        <NetworkAnomalyDrawer eventId={id} isOpen={isOpen} toggleDrawer={toggleDrawer} hiddenColumns={hiddenColumns} />
      </GeneralSettingsProvider>
    </SecuredContentBoundary>
  )
}

export default DeviceNetworkEvents
