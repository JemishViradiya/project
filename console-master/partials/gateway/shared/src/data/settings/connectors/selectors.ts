//******************************************************************************
// Copyright 2020 BlackBerry. All Rights Reserved.

import { isEqual } from 'lodash-es'
import { createSelector } from 'reselect'

import type { ConnectorsState } from './types'
import { ReduxSlice } from './types'

export const getConnectorsState = (state): ConnectorsState => state?.[ReduxSlice]

export const getConnectorsTasks = createSelector(getConnectorsState, tasks => tasks?.tasks)

export const getConnectorTask = createSelector(getConnectorsTasks, tasks => tasks?.fetchConnectorTask)

export const getConnectorsTask = createSelector(getConnectorsTasks, tasks => tasks?.fetchConnectorsTask)

export const getDeleteConnectorTask = createSelector(getConnectorsTasks, tasks => tasks?.deleteConnectorTask)

export const getUpdateConnectorTask = createSelector(getConnectorsTasks, tasks => tasks?.updateConnectorTask)

export const getCreateConnectorTask = createSelector(getConnectorsTasks, tasks => tasks?.createConnectorTask)

export const getLocalConnectorConfig = createSelector(getConnectorsState, state => state?.ui?.localConnectorData)

export const getHasUnsavedConnectorChanges = createSelector(
  getConnectorTask,
  getLocalConnectorConfig,
  (connector, localConnectorsData) => !isEqual(localConnectorsData, connector.data),
)
