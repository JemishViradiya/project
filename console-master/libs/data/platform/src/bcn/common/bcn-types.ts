/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
export interface BCNConnection {
  instanceId: string
  tenantId: string
  displayName: string
  activationDate: string
  version: string
  capabilities: Capability[]
  services: Service[]
}
export const BCNConnection = void 0

interface Capability {
  capability: string
  'module-id': string
  tags: string
  opaque: any
}

interface Service {
  serviceID: string
  instanceId: string
  version: string
  name: string
  paused: boolean
  health: { score: number; subServices: { id: string; score: number } }
  ha: { scheme: string; state: string }
  connections: BcnStatusConnection[]
}

interface BcnStatusConnection {
  type: string
  id: string
  connected: boolean
  dest: string
  properties: { name: string; value: string }
}

export interface BcnConfigSettings {
  globalSettings: any
  tenantLevelSettings: any
  instanceLevelSettings: any
}

export const BCN_SETTINGS_MAP = {
  debugLevel: 'common.logging.level',
  bcpHost: 'common.logging.syslog.host',
  bcpPort: 'common.logging.syslog.port',
  loggingFileEnabled: 'common.logging.file.enabled',
  maximumSizeMb: 'common.logging.file.maximum.size.mb',
  maximumAgeDays: 'common.logging.file.maximum.age.days',
  sysLogEnabled: 'common.logging.syslog.enabled',
  fileCompressionEnabled: 'common.logging.file.compress.enabled',
}
