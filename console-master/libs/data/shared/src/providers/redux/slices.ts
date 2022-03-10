export type UesReduxSlices =
  //dlp
  | 'app.dlp.domains'
  | 'app.dlp.dashboard'
  | 'app.dlp.certificates'
  | 'app.dlp.tenantConfigs'
  | 'app.dlp.templates'
  | 'app.dlp.dataEntities'
  | 'app.dlp.policies'
  | 'app.dlp.events'
  | 'app.dlp.fileInventory'
  | 'app.dlp.evidenceLocker'
  | 'app.dlp.users'

  //emm
  | 'app.emm.connections'

  // gateway
  | 'app.gateway.acl'
  | 'app.gateway.connectors'
  | 'app.gateway.networkProtectionConfig'
  | 'app.gateway.networkServices.v2'
  | 'app.gateway.networkServices.v3'
  | 'app.gateway.policies'
  | 'app.gateway.tenantConfig'

  // mtd
  | 'app.mtd.policies'
  | 'app.mtd.policy'
  | 'app.mtd.approvedApps'
  | 'app.mtd.restrictedApps'
  | 'app.mtd.approvedDevCerts'
  | 'app.mtd.restrictedDevCerts'
  | 'app.mtd.approvedIpAddresses'
  | 'app.mtd.restrictedIpAddresses'
  | 'app.mtd.parsedApp'
  | 'app.mtd.approvedDomains'
  | 'app.mtd.restrictedDomains'

  // platform
  | 'app.platform.policies'
  | 'app.platform.bcn'
  | 'app.platform.directoryConnections'
  | 'app.platform.groups'
  | 'app.platform.users'
  | 'app.platform.intuneConnections'

  // persona
  | 'app.persona.users'
  | 'app.persona.dashboard'

  // epp
  | 'app.epp.dashboard'
  | 'app.epp.deployments'
  | 'app.epp.device-policies'

  // console
  | 'uc.dashboard.config'
  | 'uc.dashboard.state'
  | 'uc.features'

  // nav
  | 'uc.nav'

  // storybook
  | 'example.redux.dog'
  | 'example.redux.dogs'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const UesReduxSlices: UesReduxSlices = 0
