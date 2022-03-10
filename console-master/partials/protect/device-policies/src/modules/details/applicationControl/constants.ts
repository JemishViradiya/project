import { AppControlField, LockdownAction, LockdownType } from '@ues-data/epp'

const DEFAULT_APPLICATION_CONTROL_LOCKDOWN = [
  {
    [AppControlField.action]: LockdownAction.deny,
    [AppControlField.lockdown_type]: LockdownType.executionfromexternaldrives,
  },
  {
    [AppControlField.action]: LockdownAction.deny,
    [AppControlField.lockdown_type]: LockdownType.pechange,
  },
]

export { DEFAULT_APPLICATION_CONTROL_LOCKDOWN }
