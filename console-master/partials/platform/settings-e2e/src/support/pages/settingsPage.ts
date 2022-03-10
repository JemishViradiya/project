import i18n from 'i18next'
import React from 'react'

import { Permission } from '@ues-data/shared-types'

import { BasePage } from './basePage'

export const getBCNTab = () =>
  I.findByRoleWithin('tablist', 'tab', { name: I.translate('console:directoryConnections.connectivityNode.title') })

export const getDirectoryConnectionsTab = () =>
  I.findByRoleWithin('tablist', 'tab', { name: I.translate('console:directoryConnections.connections.title') })
