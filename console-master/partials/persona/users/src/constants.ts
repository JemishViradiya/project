import { PersonaModelStatus, PersonaModelType, UserState } from '@ues-data/persona'

export const ROUTES = {
  DEFAULT: '/',
  USER_LIST: '/users',
  USER_DETAILS: '/uc/persona#/users/:id',
  ALERT_DETAILS: '/Persona#/persona/alert/details/:id',
  VENUE_DEVICE_DETAILS: '/Asset/Device/DeviceDetails/:id',
  VENUE_ZONE_DETAILS: '/Zone/ZoneDetails/:id',
}

export const USER_STATE_I18N_MAP = {
  [UserState.ONLINE]: 'users.state.online',
  [UserState.OFFLINE]: 'users.state.offline',
}

export const USERLIST_PAGESIZE_OPTIONS = [10, 25, 50, 100]

export const LOWEST_SAFE_TRUST_SCORE = 59

export const PERSONA_MODEL_TYPE_I18N_MAP = {
  [PersonaModelType.META]: 'personaModelTypes.Meta',
  [PersonaModelType.CONDUCT]: 'personaModelTypes.Process',
  [PersonaModelType.KEYBOARD]: 'personaModelTypes.Keyboard',
  [PersonaModelType.MOUSE]: 'personaModelTypes.Mouse',
  [PersonaModelType.NETWORK]: 'personaModelTypes.Network',
  [PersonaModelType.LOGON]: 'personaModelTypes.Logon',
}

export const PERSONA_MODEL_TYPES_LIST = Object.values(PersonaModelType)

export const PERSONA_MODEL_STATUS_I18N_MAP = {
  [PersonaModelStatus.TRAINING]: 'personaModelStatus.Training',
  [PersonaModelStatus.SCORING]: 'personaModelStatus.Scoring',
  [PersonaModelStatus.PAUSED]: 'personaModelStatus.Paused',
}
