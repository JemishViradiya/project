// types
import type {
  AppControl,
  DataPrivacy,
  DeviceControl,
  DevicePolicy,
  FileProtection,
  MemoryViolation,
  MemoryViolationActions,
  Persona,
  ScriptControl,
  ScriptControlV2,
} from './types'

enum DevicePoliciesTaskId {
  FetchDevicePolicyList = 'fetchDevicePolicyList',
}

const DevicePoliciesReduxSlice = 'app.epp.device-policies'

const DevicePoliciesActions = {
  FetchDevicePolicyListStart: `${DevicePoliciesReduxSlice}/fetch-device-policy-list-start`,
  FetchDevicePolicyListSuccess: `${DevicePoliciesReduxSlice}/fetch-device-policy-list-success`,
  FetchDevicePolicyListError: `${DevicePoliciesReduxSlice}/fetch-device-policy-list-error`,
}

/**
 * --NOTE: the enums and the `POLICY_DEFAULTS` constant in this file are based on the Default.json
 * implemented here - https://bitbucket.d.cylance.com/projects/PPS/repos/protectapi-policy/browse/src/Default.json
 * and the API V2 schema documented here - https://cylance.atlassian.net/wiki/spaces/ATS/pages/162953287/Venue+Policy+API+V2
 *
 * => we'll need to manually keep this file up to date with any changes to the resources above
 */

// field enums

enum DevicePolicyListItemField {
  policy_name = 'policy_name',
  created = 'created',
  modified = 'modified',
  tenant_policy_id = 'tenant_policy_id',
  tenant_id = 'tenant_id',
  device_count = 'device_count',
}

enum RootPolicyField {
  policy_id = 'policy_id',
  policy_name = 'policy_name',
  policy_utctimestamp = 'policy_utctimestamp',
  checksum = 'checksum',
  logpolicy = 'logpolicy',
  policy = 'policy',
  file_exclusions = 'file_exclusions',
  filetype_actions = 'filetype_actions',
  memoryviolation_actions = 'memoryviolation_actions',
  script_control = 'script_control',
  script_control_v2 = 'script_control_v2',
  device_control = 'device_control',
  appcontrol = 'appcontrol',
  data_privacy = 'data_privacy',
  persona = 'persona',
  software_inventory = 'software_inventory',
}

enum LogField {
  retentiondays = 'retentiondays',
  log_upload = 'log_upload',
  maxlogsize = 'maxlogsize',
  compress = 'compress',
  delete = 'delete',
}

enum FileProtectionField {
  suspicious_files = 'suspicious_files',
  threat_files = 'threat_files',
  actions = 'actions',
  file_type = 'file_type',
  file_name = 'file_name',
  file_hash = 'file_hash',
  md5 = 'md5',
  cloud_score = 'cloud_score',
  infinity = 'infinity',
  av_industry = 'av_industry',
  category_id = 'category_id',
  reason = 'reason',
  research_class_id = 'research_class_id',
  research_subclass_id = 'research_subclass_id',
}

enum MemoryProtectionField {
  memory_exclusion_list = 'memory_exclusion_list',
  memory_exclusion_list_v2 = 'memory_exclusion_list_v2',
  memory_violations = 'memory_violations',
  memory_violations_ext = 'memory_violations_ext',
  memory_violations_ext_v2 = 'memory_violations_ext_v2',
  violation_type = 'violation_type',
  action = 'action',
}

enum MemoryProtectionV2ExlusionListField {
  path = 'path',
  violations = 'violations',
}

enum ScriptControlField {
  global_settings = 'global_settings',
  powershell_settings = 'powershell_settings',
  macro_settings = 'macro_settings',
  activescript_settings = 'activescript_settings',
  control_mode = 'control_mode',
  console_mode = 'console_mode',
  allowed_folders = 'allowed_folders',
}

enum ScriptControlV2Field {
  dotnet_dlr_settings = 'dotnet_dlr_settings',
  python_settings = 'python_settings',
  exclusion_list = 'exclusion_list',
}

enum SoftwareInventoryField {
  enabled = 'enabled',
  full_report_hours = 'full_report_hours',
}

enum ScriptControlV2ExclusionListField {
  path = 'path',
  type = 'type',
}

enum DeviceControlField {
  configurations = 'configurations',
  device_class = 'device_class',
  control_mode = 'control_mode',
  exclusion_list = 'exclusion_list',
  vendor_id = 'vendor_id',
  product_id = 'product_id',
  serial_number = 'serial_number',
  comment = 'comment',
  date_added = 'date_added',
}

enum AppControlField {
  changewindow_enabled = 'changewindow_enabled',
  lockdown = 'lockdown',
  lockdown_type = 'lockdown_type',
  allowed_folders = 'allowed_folders',
  action = 'action',
}

enum DataPrivacyField {
  data_privacy = 'data_privacy',
  enable = 'enable',
  field = 'field',
  hostname = 'hostname',
  file_path = 'file_path',
  file_owner = 'file_owner',
  username = 'username',
  ipv6 = 'ipv6',
  mac_address = 'mac_address',
  distinguished_name = 'distinguished_name',
  active_directory_information = 'active_directory_information',
  fqdn = 'fqdn',
}

enum PolicyNvpField {
  name = 'name',
  value = 'value',
}

enum PersonaField {
  mode = 'mode',
  admin_whitelist = 'admin_whitelist',
  mitigation_actions = 'mitigation_actions',
}

// value enums

enum FileType {
  executable = 'executable',
}

enum ViolationCategory {
  Exploitation = 'Exploitation',
  ProcessInjection = 'ProcessInjection',
  Escalation = 'Escalation',
}

enum ViolationType {
  stackpivot = 'stackpivot',
  stackprotect = 'stackprotect',
  lsassread = 'lsassread',
  overwritecode = 'overwritecode',
  outofprocessunmapmemory = 'outofprocessunmapmemory',
  outofprocessoverwritecode = 'outofprocessoverwritecode',
  outofprocesscreatethread = 'outofprocesscreatethread',
  outofprocesswritepe = 'outofprocesswritepe',
  outofprocessallocation = 'outofprocessallocation',
  outofprocessmap = 'outofprocessmap',
  outofprocesswrite = 'outofprocesswrite',
  outofprocessapc = 'outofprocessapc',
  // "ext"
  dyldinjection = 'dyldinjection',
  trackdataread = 'trackdataread',
  zeroallocate = 'zeroallocate',
  maliciouspayload = 'maliciouspayload',
  // "ext_v2"
  runmacroscript = 'runmacroscript',
  doppelganger = 'doppelganger',
  oopprotect = 'oopprotect',
  childprocessprotect = 'childprocessprotect',
  syscallprobe = 'syscallprobe',
  directsyscall = 'directsyscall',
  systemdllwrite = 'systemdllwrite',
  stolensystemtoken = 'stolensystemtoken',
  dangerousenvvariable = 'dangerousenvvariable',
  maliciouslowintegrity = 'maliciouslowintegrity',
  dangerouscomobject = 'dangerouscomobject',
  injectionviaapc = 'injectionviaapc',
}

enum ViolationAction {
  None = 'None',
  Alert = 'Alert',
  Block = 'Block',
  Terminate = 'Terminate',
}

enum ScriptControlMode {
  Alert = 'Alert',
  Block = 'Block',
}

enum ScriptControlPowerShellConsoleMode {
  Allow = 'Allow',
  Block = 'Block',
}

enum ScriptControlV2ExclusionScriptType {
  All = '',
  VbScript = 'VbScript',
  Jscript = 'Jscript',
  Python = 'Python',
  DotnetDlr = 'DotnetDlr',
  PowershellScript = 'PowershellScript',
}

enum DeviceControlMode {
  FullAccess = 'FullAccess',
  ReadOnly = 'ReadOnly',
  Block = 'Block',
}

enum DeviceClass {
  AndroidUSB = 'AndroidUSB',
  iOS = 'iOS',
  StillImage = 'StillImage',
  USBCDDVDRW = 'USBCDDVDRW',
  USBDrive = 'USBDrive',
  VMWareMount = 'VMWareMount',
  WPD = 'WPD',
}

enum LockdownType {
  executionfromexternaldrives = 'executionfromexternaldrives',
  pechange = 'pechange',
}

enum LockdownAction {
  deny = 'deny',
  allow = 'allow',
}

enum PolicyNvpName {
  auto_blocking = 'auto_blocking',
  auto_delete = 'auto_delete',
  days_until_deleted = 'days_until_deleted',
  auto_uploading = 'auto_uploading',
  pdf_auto_uploading = 'pdf_auto_uploading',
  ole_auto_uploading = 'ole_auto_uploading',
  docx_auto_uploading = 'docx_auto_uploading',
  python_auto_uploading = 'python_auto_uploading',
  autoit_auto_uploading = 'autoit_auto_uploading',
  powershell_auto_uploading = 'powershell_auto_uploading',
  threat_report_limit = 'threat_report_limit',
  low_confidence_threshold = 'low_confidence_threshold',
  full_disc_scan = 'full_disc_scan',
  watch_for_new_files = 'watch_for_new_files',
  memory_exploit_detection = 'memory_exploit_detection',
  trust_files_in_scan_exception_list = 'trust_files_in_scan_exception_list',
  logpolicy = 'logpolicy',
  prevent_service_shutdown = 'prevent_service_shutdown',
  scan_max_archive_size = 'scan_max_archive_size',
  sample_copy_path = 'sample_copy_path',
  kill_running_threats = 'kill_running_threats',
  show_notifications = 'show_notifications',
  custom_thumbprint = 'custom_thumbprint',
  scan_exception_list = 'scan_exception_list',
  device_control = 'device_control',
  data_privacy = 'data_privacy',
  script_control = 'script_control',
  optics = 'optics',
  optics_set_disk_usage_maximum_fixed = 'optics_set_disk_usage_maximum_fixed',
  optics_malware_auto_upload = 'optics_malware_auto_upload',
  optics_memory_defense_auto_upload = 'optics_memory_defense_auto_upload',
  optics_script_control_auto_upload = 'optics_script_control_auto_upload',
  optics_application_control_auto_upload = 'optics_application_control_auto_upload',
  optics_sensors_dns_visibility = 'optics_sensors_dns_visibility',
  optics_sensors_private_network_address_visibility = 'optics_sensors_private_network_address_visibility',
  optics_sensors_windows_event_log_visibility = 'optics_sensors_windows_event_log_visibility',
  optics_sensors_advanced_powershell_visibility = 'optics_sensors_advanced_powershell_visibility',
  optics_sensors_advanced_wmi_visibility = 'optics_sensors_advanced_wmi_visibility',
  optics_sensors_advanced_executable_parsing = 'optics_sensors_advanced_executable_parsing',
  optics_sensors_enhanced_process_hooking_visibility = 'optics_sensors_enhanced_process_hooking_visibility',
  optics_show_notifications = 'optics_show_notifications',
  optics_sensors_intel_cryptomining_detection = 'optics_sensors_intel_cryptomining_detection',
}

enum PersonaMitigationActionField {
  action = 'action',
  threshold = 'threshold',
  method = 'method',
}

enum PersonaAdminSafeListField {
  username = 'username',
}

enum PersonaMitigationAction {
  promptUsernameAndPassword = 'promptUsernameAndPassword',
  prompt2fa = 'prompt2fa',
  alertsOnly = 'alertsOnly',
}

enum Persona2FAMethod {
  duo = 'duo',
  google = 'google',
  fido = 'fido',
}

// constants

const DEFAULT_DEVICE_POLICY_NAME = 'Default'

const POLICY_NVP_DEFAULTS = [
  {
    [PolicyNvpField.name]: PolicyNvpName.auto_blocking,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.auto_delete,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.days_until_deleted,
    [PolicyNvpField.value]: '14',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.pdf_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.ole_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.docx_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.python_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.autoit_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.powershell_auto_uploading,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.threat_report_limit,
    [PolicyNvpField.value]: '500',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.low_confidence_threshold,
    [PolicyNvpField.value]: '-600',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.full_disc_scan,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.watch_for_new_files,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.memory_exploit_detection,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.trust_files_in_scan_exception_list,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.logpolicy,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.prevent_service_shutdown,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.scan_max_archive_size,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.sample_copy_path,
    [PolicyNvpField.value]: null,
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.kill_running_threats,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.show_notifications,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.custom_thumbprint,
    [PolicyNvpField.value]: null,
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.scan_exception_list,
    [PolicyNvpField.value]: [],
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.device_control,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.data_privacy,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.script_control,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_set_disk_usage_maximum_fixed,
    [PolicyNvpField.value]: '1000',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_malware_auto_upload,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_memory_defense_auto_upload,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_script_control_auto_upload,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_application_control_auto_upload,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_dns_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_private_network_address_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_windows_event_log_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_advanced_powershell_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_advanced_wmi_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_advanced_executable_parsing,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_enhanced_process_hooking_visibility,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_show_notifications,
    [PolicyNvpField.value]: '0',
  },
  {
    [PolicyNvpField.name]: PolicyNvpName.optics_sensors_intel_cryptomining_detection,
    [PolicyNvpField.value]: '0',
  },
]

const POLICY_DEFAULTS: DevicePolicy = {
  [RootPolicyField.policy_name]: '',
  [RootPolicyField.checksum]: '',
  [RootPolicyField.logpolicy]: {
    [LogField.retentiondays]: '30',
    [LogField.log_upload]: null,
    [LogField.maxlogsize]: '100',
  },
  [RootPolicyField.policy]: POLICY_NVP_DEFAULTS,
  // --NOTE: all Script Control fields need to be added to this default policy object,
  //         otherwise their value will be interpreted as disabled
  [RootPolicyField.script_control]: {
    [ScriptControlField.global_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
      [ScriptControlField.allowed_folders]: [],
    },
    [ScriptControlField.powershell_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
      [ScriptControlField.console_mode]: ScriptControlPowerShellConsoleMode.Allow,
    },
    [ScriptControlField.macro_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
    },
    [ScriptControlField.activescript_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
    },
  },
  [RootPolicyField.script_control_v2]: {
    [ScriptControlV2Field.dotnet_dlr_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
    },
    [ScriptControlV2Field.python_settings]: {
      [ScriptControlField.control_mode]: ScriptControlMode.Alert,
    },
    [ScriptControlV2Field.exclusion_list]: [],
  },
  [RootPolicyField.software_inventory]: {
    [SoftwareInventoryField.enabled]: '0',
    [SoftwareInventoryField.full_report_hours]: '24',
  },
}

const APPLICATION_CONTROL_DEFAULTS: AppControl = {
  [AppControlField.changewindow_enabled]: '0',
  [AppControlField.allowed_folders]: [],
  [AppControlField.lockdown]: [],
}

const DATA_PRIVACY_DEFAULTS: DataPrivacy = {
  [DataPrivacyField.data_privacy]: [
    {
      [DataPrivacyField.field]: DataPrivacyField.hostname,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.fqdn,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.username,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.ipv6,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.mac_address,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.distinguished_name,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.active_directory_information,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.file_owner,
      [DataPrivacyField.enable]: '0',
    },
    {
      [DataPrivacyField.field]: DataPrivacyField.file_path,
      [DataPrivacyField.enable]: '0',
    },
  ],
}

const DEVICE_CONTROL_DEFAULTS: DeviceControl = {
  [DeviceControlField.configurations]: [
    {
      [DeviceControlField.device_class]: DeviceClass.AndroidUSB,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.iOS,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.StillImage,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.USBCDDVDRW,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.USBDrive,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.VMWareMount,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
    {
      [DeviceControlField.device_class]: DeviceClass.WPD,
      [DeviceControlField.control_mode]: DeviceControlMode.FullAccess,
    },
  ],
  [DeviceControlField.exclusion_list]: [],
}

const FILE_PROTECTION_DEFAULTS: FileProtection = {
  [RootPolicyField.file_exclusions]: [],
  [RootPolicyField.filetype_actions]: {
    [FileProtectionField.suspicious_files]: [
      {
        [FileProtectionField.actions]: '0',
        [FileProtectionField.file_type]: FileType.executable,
      },
    ],
    [FileProtectionField.threat_files]: [
      {
        [FileProtectionField.actions]: '0',
        [FileProtectionField.file_type]: FileType.executable,
      },
    ],
  },
}

const MEMORY_PROTECTION_DEFAULTS: MemoryViolationActions = {
  [MemoryProtectionField.memory_exclusion_list]: [],
  [MemoryProtectionField.memory_exclusion_list_v2]: [],
  [MemoryProtectionField.memory_violations]: [
    {
      [MemoryProtectionField.violation_type]: ViolationType.lsassread,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocessunmapmemory,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.stackpivot,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.stackprotect,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocessoverwritecode,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocesscreatethread,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.overwritecode,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocesswritepe,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocessallocation,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocessmap,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocesswrite,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.outofprocessapc,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
  ],
  [MemoryProtectionField.memory_violations_ext]: [
    {
      [MemoryProtectionField.violation_type]: ViolationType.dyldinjection,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.trackdataread,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.zeroallocate,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.maliciouspayload,
      [MemoryProtectionField.action]: ViolationAction.Alert,
    },
  ],
  [MemoryProtectionField.memory_violations_ext_v2]: [
    {
      [MemoryProtectionField.violation_type]: ViolationType.doppelganger,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.oopprotect,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.childprocessprotect,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.syscallprobe,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.directsyscall,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.systemdllwrite,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.stolensystemtoken,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.dangerousenvvariable,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.maliciouslowintegrity,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.dangerouscomobject,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    {
      [MemoryProtectionField.violation_type]: ViolationType.injectionviaapc,
      [MemoryProtectionField.action]: ViolationAction.None,
    },
    // --NOTE: `ViolationType.runmacroscript` will be determined by Script Control
    //         if it does not exist in this list
  ],
}

const MEMORY_PROTECTION_VIOLATIONS_IGNORED: Array<MemoryViolation> = [
  {
    [MemoryProtectionField.violation_type]: ViolationType.lsassread,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocessunmapmemory,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.stackpivot,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.stackprotect,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocessoverwritecode,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocesscreatethread,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.overwritecode,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocesswritepe,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocessallocation,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocessmap,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocesswrite,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.outofprocessapc,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
]

const MEMORY_PROTECTION_VIOLATIONS_EXT_IGNORED: Array<MemoryViolation> = [
  {
    [MemoryProtectionField.violation_type]: ViolationType.dyldinjection,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.trackdataread,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.zeroallocate,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.maliciouspayload,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
]

const MEMORY_PROTECTION_VIOLATIONS_EXT_V2_IGNORED: Array<MemoryViolation> = [
  {
    [MemoryProtectionField.violation_type]: ViolationType.doppelganger,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.oopprotect,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.childprocessprotect,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.syscallprobe,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.directsyscall,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.systemdllwrite,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.stolensystemtoken,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.dangerousenvvariable,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.maliciouslowintegrity,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.dangerouscomobject,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
  {
    [MemoryProtectionField.violation_type]: ViolationType.injectionviaapc,
    [MemoryProtectionField.action]: ViolationAction.None,
  },
]

const PERSONA_DEFAULTS: Persona = {
  [PersonaField.admin_whitelist]: [],
  [PersonaField.mitigation_actions]: [],
  [PersonaField.mode]: '0',
}

const SCRIPT_CONTROL_DEFAULTS: ScriptControl = {
  [ScriptControlField.global_settings]: {
    [ScriptControlField.control_mode]: ScriptControlMode.Alert,
    [ScriptControlField.allowed_folders]: [],
  },
}

const SCRIPT_CONTROL_V2_DEFAULTS: ScriptControlV2 = {
  [ScriptControlV2Field.exclusion_list]: [],
}

export {
  DevicePoliciesTaskId,
  DevicePoliciesReduxSlice,
  DevicePoliciesActions,
  // field enums
  DevicePolicyListItemField,
  RootPolicyField,
  LogField,
  FileProtectionField,
  MemoryProtectionField,
  MemoryProtectionV2ExlusionListField,
  ScriptControlField,
  ScriptControlV2Field,
  ScriptControlV2ExclusionListField,
  DeviceControlField,
  AppControlField,
  DataPrivacyField,
  PolicyNvpField,
  PersonaField,
  PersonaAdminSafeListField,
  PersonaMitigationActionField,
  SoftwareInventoryField,
  // value enums
  FileType,
  ViolationCategory,
  ViolationType,
  ViolationAction,
  ScriptControlMode,
  ScriptControlPowerShellConsoleMode,
  ScriptControlV2ExclusionScriptType,
  DeviceControlMode,
  DeviceClass,
  LockdownType,
  LockdownAction,
  PolicyNvpName,
  PersonaMitigationAction,
  Persona2FAMethod,
  // constants
  DEFAULT_DEVICE_POLICY_NAME,
  POLICY_NVP_DEFAULTS,
  POLICY_DEFAULTS,
  APPLICATION_CONTROL_DEFAULTS,
  DATA_PRIVACY_DEFAULTS,
  DEVICE_CONTROL_DEFAULTS,
  FILE_PROTECTION_DEFAULTS,
  MEMORY_PROTECTION_DEFAULTS,
  MEMORY_PROTECTION_VIOLATIONS_IGNORED,
  MEMORY_PROTECTION_VIOLATIONS_EXT_IGNORED,
  MEMORY_PROTECTION_VIOLATIONS_EXT_V2_IGNORED,
  PERSONA_DEFAULTS,
  SCRIPT_CONTROL_DEFAULTS,
  SCRIPT_CONTROL_V2_DEFAULTS,
}
