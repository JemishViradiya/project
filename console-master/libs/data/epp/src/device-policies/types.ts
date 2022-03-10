import type { DevicePoliciesApi, DevicePoliciesMockApi } from './../device-policies-service'
import type {
  AppControlField,
  DataPrivacyField,
  DeviceClass,
  DeviceControlField,
  DeviceControlMode,
  DevicePoliciesTaskId,
  DevicePolicyListItemField,
  FileProtectionField,
  FileType,
  LockdownAction,
  LockdownType,
  LogField,
  MemoryProtectionField,
  MemoryProtectionV2ExlusionListField,
  Persona2FAMethod,
  PersonaAdminSafeListField,
  PersonaField,
  PersonaMitigationAction,
  PersonaMitigationActionField,
  PolicyNvpField,
  PolicyNvpName,
  RootPolicyField,
  ScriptControlField,
  ScriptControlMode,
  ScriptControlPowerShellConsoleMode,
  ScriptControlV2ExclusionListField,
  ScriptControlV2ExclusionScriptType,
  ScriptControlV2Field,
  SoftwareInventoryField,
  ViolationAction,
  ViolationType,
} from './constants'

interface DevicePoliciesTask<TResult = unknown> {
  loading: boolean
  result: TResult
  error?: Error
}

type DevicePoliciesApiProvider = typeof DevicePoliciesApi | typeof DevicePoliciesMockApi

interface DevicePoliciesState {
  tasks?: {
    [DevicePoliciesTaskId.FetchDevicePolicyList]: DevicePoliciesTask<DevicePolicyListItem[]>
  }
}

/**
 * --NOTE: the interfaces in this file are based on the Default.json
 * implemented here - https://bitbucket.d.cylance.com/projects/PPS/repos/protectapi-policy/browse/src/Default.json
 * and the API V2 schema documented here - https://cylance.atlassian.net/wiki/spaces/ATS/pages/162953287/Venue+Policy+API+V2
 *
 * => we'll need to manually keep this file up to date with any changes to the resources above
 */

type PolicyField =
  | RootPolicyField
  | PolicyNvpField
  | FileProtectionField
  | MemoryProtectionField
  | ScriptControlField
  | DeviceControlField
  | AppControlField
  | DataPrivacyField
  | LogField
  | PersonaField

type PolicyValue =
  | FileType
  | ViolationType
  | ViolationAction
  | ScriptControlMode
  | ScriptControlPowerShellConsoleMode
  | DeviceControlMode
  | DeviceClass
  | LockdownType
  | LockdownAction
  | PolicyNvpName
  | PersonaMitigationActionField
  | PersonaAdminSafeListField
  | DataPrivacyField

// log

interface LogUpload {
  [LogField.compress]: boolean
  [LogField.delete]: boolean
}

interface LogPolicy {
  [LogField.retentiondays]: number | string
  [LogField.maxlogsize]: number | string
  [LogField.log_upload]: LogUpload
}

// file protection

interface FileProtection {
  [RootPolicyField.filetype_actions]: FileTypeActions
  [RootPolicyField.file_exclusions]: Array<FileExclusions>
}

interface FileAction {
  [FileProtectionField.file_type]: FileType
  [FileProtectionField.actions]: number | string
}

interface FileTypeActions {
  [FileProtectionField.suspicious_files]: FileAction[]
  [FileProtectionField.threat_files]: FileAction[]
}

interface FileExclusions {
  [FileProtectionField.file_name]: string
  [FileProtectionField.file_type]: number | string
  [FileProtectionField.file_hash]: string
  [FileProtectionField.md5]: string
  [FileProtectionField.cloud_score]: number | string
  [FileProtectionField.infinity]: number | string
  [FileProtectionField.av_industry]: boolean
  [FileProtectionField.category_id]: string
  [FileProtectionField.reason]: string
  [FileProtectionField.research_class_id]: string
  [FileProtectionField.research_subclass_id]: string
}

// memory protection

interface MemoryViolation {
  [MemoryProtectionField.violation_type]: ViolationType
  [MemoryProtectionField.action]: ViolationAction
}

interface MemoryViolationActions {
  [MemoryProtectionField.memory_exclusion_list]: string[]
  [MemoryProtectionField.memory_exclusion_list_v2]: Array<MemoryProtectionV2ExclusionListItem>
  [MemoryProtectionField.memory_violations]: MemoryViolation[]
  [MemoryProtectionField.memory_violations_ext]: MemoryViolation[]
  [MemoryProtectionField.memory_violations_ext_v2]: MemoryViolation[]
}

interface MemoryProtectionV2ExclusionListItem {
  id?: string // used by UI only as a unique key value
  [MemoryProtectionV2ExlusionListField.path]: string
  [MemoryProtectionV2ExlusionListField.violations]: Array<MemoryViolation>
}

// script control

interface ScriptControl {
  [ScriptControlField.global_settings]: {
    [ScriptControlField.control_mode]: ScriptControlMode
    [ScriptControlField.allowed_folders]: string[]
  }
  [ScriptControlField.powershell_settings]?: {
    [ScriptControlField.control_mode]: ScriptControlMode
    [ScriptControlField.console_mode]: ScriptControlPowerShellConsoleMode
  }
  [ScriptControlField.macro_settings]?: {
    [ScriptControlField.control_mode]: ScriptControlMode
  }
  [ScriptControlField.activescript_settings]?: {
    [ScriptControlField.control_mode]: ScriptControlMode
  }
}

interface ScriptControlV2 {
  [ScriptControlV2Field.dotnet_dlr_settings]?: {
    [ScriptControlField.control_mode]: ScriptControlMode
  }
  [ScriptControlV2Field.python_settings]?: {
    [ScriptControlField.control_mode]: ScriptControlMode
  }
  [ScriptControlV2Field.exclusion_list]: Array<ScriptControlV2Exclusion>
}

interface ScriptControlV2Exclusion {
  [ScriptControlV2ExclusionListField.path]: string
  [ScriptControlV2ExclusionListField.type]: ScriptControlV2ExclusionScriptType
}

// software inventory

interface SoftwareInventory {
  [SoftwareInventoryField.enabled]: number | string
  [SoftwareInventoryField.full_report_hours]: number | string
}

// device control

interface DeviceControlConfiguration {
  [DeviceControlField.device_class]: DeviceClass
  [DeviceControlField.control_mode]: DeviceControlMode
}

interface DeviceControlExclusion {
  [DeviceControlField.vendor_id]: string
  [DeviceControlField.product_id]: string
  [DeviceControlField.serial_number]: string
  [DeviceControlField.comment]: string
  [DeviceControlField.date_added]: string
  [DeviceControlField.control_mode]: DeviceControlMode
}

interface DeviceControl {
  [DeviceControlField.configurations]: DeviceControlConfiguration[]
  [DeviceControlField.exclusion_list]: DeviceControlExclusion[]
}

// application control

interface Lockdown {
  [AppControlField.lockdown_type]: LockdownType
  [AppControlField.action]: LockdownAction
}

interface AppControl {
  [AppControlField.changewindow_enabled]: number | string
  [AppControlField.lockdown]: Lockdown[]
  [AppControlField.allowed_folders]: string[]
}

// data privacy

interface DataPrivacyItem {
  [DataPrivacyField.enable]: number | string
  [DataPrivacyField.field]: DataPrivacyField
}

interface DataPrivacy {
  [DataPrivacyField.data_privacy]: DataPrivacyItem[]
}

// persona

interface PersonaAdminSafeListItem {
  [PersonaAdminSafeListField.username]: string
}

interface PersonaMitigationActionItem {
  id: string
  [PersonaMitigationActionField.threshold]: string
  [PersonaMitigationActionField.action]: PersonaMitigationAction
  [PersonaMitigationActionField.method]: Persona2FAMethod
}

interface Persona {
  [PersonaField.admin_whitelist]: PersonaAdminSafeListItem[]
  [PersonaField.mitigation_actions]: PersonaMitigationActionItem[]
  [PersonaField.mode]: number | string
}

// policies

interface DevicePolicyListItem {
  [DevicePolicyListItemField.policy_name]: string
  [DevicePolicyListItemField.created]: string
  [DevicePolicyListItemField.modified]: string
  [DevicePolicyListItemField.tenant_policy_id]: string
  [DevicePolicyListItemField.tenant_id]: string
  [DevicePolicyListItemField.device_count]: number
}

interface PolicyNvp {
  [PolicyNvpField.name]: PolicyNvpName
  [PolicyNvpField.value]: unknown
}

interface DevicePolicy {
  [RootPolicyField.policy_name]: string
  [RootPolicyField.policy]: PolicyNvp[]
  [RootPolicyField.logpolicy]: LogPolicy
  [RootPolicyField.checksum]: string
  [RootPolicyField.policy_id]?: string
  [RootPolicyField.policy_utctimestamp]?: string
  [RootPolicyField.appcontrol]?: AppControl
  [RootPolicyField.data_privacy]?: DataPrivacy
  [RootPolicyField.device_control]?: DeviceControl
  [RootPolicyField.file_exclusions]?: FileExclusions[]
  [RootPolicyField.filetype_actions]?: FileTypeActions
  [RootPolicyField.memoryviolation_actions]?: MemoryViolationActions
  [RootPolicyField.persona]?: Persona
  [RootPolicyField.script_control]?: ScriptControl
  [RootPolicyField.script_control_v2]?: ScriptControlV2
  [RootPolicyField.software_inventory]?: SoftwareInventory
}

type FlattenedDevicePolicy = Record<string, string | unknown[]>

export {
  DevicePoliciesTask,
  DevicePoliciesApiProvider,
  DevicePoliciesState,
  PolicyField,
  PolicyValue,
  // log
  LogUpload,
  LogPolicy,
  // file protection
  FileProtection,
  FileAction,
  FileTypeActions,
  FileExclusions,
  // memory protection
  MemoryViolation,
  MemoryViolationActions,
  MemoryProtectionV2ExclusionListItem,
  // script control
  ScriptControl,
  ScriptControlV2,
  ScriptControlV2Exclusion,
  // device control
  DeviceControlConfiguration,
  DeviceControlExclusion,
  DeviceControl,
  // application control
  Lockdown,
  AppControl,
  // data privacy
  DataPrivacyItem,
  DataPrivacy,
  // policies
  PolicyNvp,
  DevicePolicyListItem,
  DevicePolicy,
  FlattenedDevicePolicy,
  // persona
  PersonaAdminSafeListItem,
  PersonaMitigationActionItem,
  Persona,
}
