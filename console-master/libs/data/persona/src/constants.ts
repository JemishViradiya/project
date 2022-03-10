import { PersonaAlertType } from './alert-service'

export const PERSONA_ALERT_TYPE_TO_EVENT_ID_MAP = {
  [PersonaAlertType.FAILED_MFA]: 40110,
  [PersonaAlertType.USER_FAILED_LOGON]: 4625,
  [PersonaAlertType.FORCED_MFA]: 30200,
  [PersonaAlertType.USER_TRUST_SCORE_THRESHOLD_CROSSED]: 30300,
  [PersonaAlertType.MALICIOUS_RULE_HIT]: 10100,
  [PersonaAlertType.USER_NEW_DEVICE_LOGON]: 40626,
}
