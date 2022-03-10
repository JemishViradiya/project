import { PersonaAlertStatus, PersonaModelType, PersonaSeverity } from '@ues-data/persona'

export const PERSONA_EVENT_ID_I18N_MAP = {
  4624: 'personaEvents.UserSuccessfulLogOn',
  4625: 'personaEvents.UserFailedLogon',
  10100: 'personaEvents.MaliciousRuleHit',
  20100: 'personaEvents.KeystrokeModelAtomicScore',
  20110: 'personaEvents.KeystrokeModelStatus',
  20200: 'personaEvents.MouseModelAtomicScore',
  20210: 'personaEvents.MouseModelStatus',
  20300: 'personaEvents.ConductProcessStartModelAtomicScore',
  20310: 'personaEvents.ConductProcessStartModelStatus',
  20320: 'personaEvents.ConductProcessStartModelSync',
  20330: 'personaEvents.ConductProcessStartModelUpload',
  20400: 'personaEvents.NetworkDataFlowModelAtomicScore',
  20410: 'personaEvents.NetworkDataFlowModelStatus',
  20500: 'personaEvents.LogonModelAtomicScore',
  20510: 'personaEvents.LogonModelStatus',
  21100: 'personaEvents.MetaModelScore',
  21110: 'personaEvents.MetaModelStatus',
  30100: 'personaEvents.UserTrustScore',
  30200: 'personaEvents.ForcedStepUpAuthentication',
  40100: 'personaEvents.Successful2FALogon',
  40110: 'personaEvents.Failed2FALogon',
}

export const PERSONA_ALERT_STATUS_I18N_MAP = {
  [PersonaAlertStatus.NEW]: 'alertStatus.New',
  [PersonaAlertStatus.IN_PROGRESS]: 'alertStatus.InProgress',
  [PersonaAlertStatus.REVIEWED]: 'alertStatus.Reviewed',
  [PersonaAlertStatus.FALSE_POSITIVE]: 'alertStatus.FalsePositive',
}

export const PERSONA_SEVERITY_I18N_MAP = {
  [PersonaSeverity.LOW]: 'personaSeverity.low',
  [PersonaSeverity.MEDIUM]: 'personaSeverity.medium',
  [PersonaSeverity.HIGH]: 'personaSeverity.high',
  [PersonaSeverity.CRITICAL]: 'personaSeverity.critical',
  [PersonaSeverity.INFO]: 'personaSeverity.info',
}

export const PERSONA_SEVERITY_CHIP_CLASSNAME_MAP = {
  [PersonaSeverity.INFO]: 'alert-chip-info',
  [PersonaSeverity.LOW]: 'alert-chip-low',
  [PersonaSeverity.MEDIUM]: 'alert-chip-medium',
  [PersonaSeverity.HIGH]: 'alert-chip-high',
  [PersonaSeverity.CRITICAL]: 'alert-chip-critical',
}

export const ENABLED_PERSONA_MODELS_LIST = [
  PersonaModelType.META,
  PersonaModelType.LOGON,
  PersonaModelType.KEYBOARD,
  PersonaModelType.MOUSE,
  PersonaModelType.CONDUCT,
]
