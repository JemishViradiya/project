import findKey from 'lodash/findKey'

import type { FlattenedDevicePolicy, PolicyField, PolicyValue } from '@ues-data/epp'
import {
  AppControlField,
  DataPrivacyField,
  DeviceClass,
  DeviceControlField,
  FileProtectionField,
  MemoryProtectionField,
  PersonaField,
  PolicyNvpField,
  PolicyNvpName,
  RootPolicyField,
  ScriptControlField,
  ScriptControlV2Field,
  SoftwareInventoryField,
  ViolationType,
} from '@ues-data/epp'

/**
 * Returns the value key for the provided `policyValue` from a flattened policy
 *
 * i.e. given a flattened policy like:
 *   {
 *     ...
 *     policy[19].name: 'sample_copy_path',
 *     policy[19].value: '1',
 *     ...
 *     memoryviolation_actions.memory_violations[2].violation_type: 'stackprotect',
 *     memoryviolation_actions.memory_violations[2].action: 'Block',
 *     ...
 *   }
 *
 * if "sample_copy_path" is provided as the `policyValue`,
 * this function will return "policy[19].value"
 *
 * if "stackprotect" is provided as the `policyValue`,
 * this function will return "memoryviolation_actions.memory_violations[2].action"
 *
 * @param policy A flattened policy object
 * @param policyValue The policy value to find
 * @param policyValueNameField The field of the policy value's name
 * @param policyValueValueField The field of the policy value's value
 */
const getPolicyValueKey = (
  policy: FlattenedDevicePolicy,
  rootField: RootPolicyField,
  searchValue: PolicyValue,
  valueNameField: PolicyField,
  valueValueField: PolicyField,
): string =>
  findKey(
    policy,
    (policyValue: unknown, key: string) =>
      policyValue === searchValue &&
      key !== RootPolicyField.policy_name &&
      key.startsWith(rootField) &&
      key.endsWith(valueNameField),
  )?.replace(valueNameField, valueValueField)

// #region - Policy form field getters by section

const getGeneralInfoFields = (): Record<string, string> => ({
  [RootPolicyField.policy_name]: RootPolicyField.policy_name,
})

const getFileProtectionFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const threatFilesActions = `${RootPolicyField.filetype_actions}.${FileProtectionField.threat_files}[0].${FileProtectionField.actions}`
  const suspiciousFilesActions = `${RootPolicyField.filetype_actions}.${FileProtectionField.suspicious_files}[0].${FileProtectionField.actions}`
  const killUnsafeProcess = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.kill_running_threats,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const autoUploading = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.auto_uploading,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const sampleCopyPath = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.sample_copy_path,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const fullDiscScan = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.full_disc_scan,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const watchForNewFiles = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.watch_for_new_files,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const scanMaxArchiveSize = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.scan_max_archive_size,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const trustFilesInScanExceptionList = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.trust_files_in_scan_exception_list,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const scanExceptionList = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.scan_exception_list,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  return {
    [FileProtectionField.threat_files]: threatFilesActions,
    [FileProtectionField.suspicious_files]: suspiciousFilesActions,
    [PolicyNvpName.kill_running_threats]: killUnsafeProcess,
    [PolicyNvpName.auto_uploading]: autoUploading,
    [PolicyNvpName.sample_copy_path]: sampleCopyPath,
    [RootPolicyField.file_exclusions]: RootPolicyField.file_exclusions,
    [PolicyNvpName.full_disc_scan]: fullDiscScan,
    [PolicyNvpName.watch_for_new_files]: watchForNewFiles,
    [PolicyNvpName.scan_max_archive_size]: scanMaxArchiveSize,
    [PolicyNvpName.trust_files_in_scan_exception_list]: trustFilesInScanExceptionList,
    [PolicyNvpName.scan_exception_list]: scanExceptionList,
  }
}

const getMemoryProtectionFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const memoryExploitProtection = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.memory_exploit_detection,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  // memory violations
  const stackPivot = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.stackpivot,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const stackProtect = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.stackprotect,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const lsassRead = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.lsassread,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const overwriteCode = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.overwritecode,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessUnmapMemory = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocessunmapmemory,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessOverwriteCode = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocessoverwritecode,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessCreateThread = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocesscreatethread,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessWritePe = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocesswritepe,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessAllocation = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocessallocation,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessMap = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocessmap,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessWrite = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocesswrite,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const outOfProcessApc = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.outofprocessapc,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  // memory violations - ext
  const dyldInjection = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.dyldinjection,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const trackDataRead = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.trackdataread,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const zeroAllocate = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.zeroallocate,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const maliciousPayload = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.maliciouspayload,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const doppelganger = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.doppelganger,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const oopProtect = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.oopprotect,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const childProcessProtect = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.childprocessprotect,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const syscallProbe = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.syscallprobe,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const directSyscall = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.directsyscall,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const systemDllWrite = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.systemdllwrite,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const stolenSystemToken = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.stolensystemtoken,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const dangerousEnvVariable = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.dangerousenvvariable,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const maliciousLowIntegrity = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.maliciouslowintegrity,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const dangerousComObject = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.dangerouscomobject,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const injectionViaApc = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.injectionviaapc,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )
  const runMacroScript = getPolicyValueKey(
    policy,
    RootPolicyField.memoryviolation_actions,
    ViolationType.runmacroscript,
    MemoryProtectionField.violation_type,
    MemoryProtectionField.action,
  )

  const memoryProtectionExclusionList = `${RootPolicyField.memoryviolation_actions}.${MemoryProtectionField.memory_exclusion_list}`
  const memoryProtectionExclusionListV2 = `${RootPolicyField.memoryviolation_actions}.${MemoryProtectionField.memory_exclusion_list_v2}`

  return {
    [PolicyNvpName.memory_exploit_detection]: memoryExploitProtection,
    // memory violations
    [ViolationType.stackpivot]: stackPivot,
    [ViolationType.stackprotect]: stackProtect,
    [ViolationType.lsassread]: lsassRead,
    [ViolationType.overwritecode]: overwriteCode,
    [ViolationType.outofprocessunmapmemory]: outOfProcessUnmapMemory,
    [ViolationType.outofprocessoverwritecode]: outOfProcessOverwriteCode,
    [ViolationType.outofprocesscreatethread]: outOfProcessCreateThread,
    [ViolationType.outofprocesswritepe]: outOfProcessWritePe,
    [ViolationType.outofprocessallocation]: outOfProcessAllocation,
    [ViolationType.outofprocessmap]: outOfProcessMap,
    [ViolationType.outofprocesswrite]: outOfProcessWrite,
    [ViolationType.outofprocessapc]: outOfProcessApc,
    // memory violations - ext
    [ViolationType.dyldinjection]: dyldInjection,
    [ViolationType.trackdataread]: trackDataRead,
    [ViolationType.zeroallocate]: zeroAllocate,
    [ViolationType.maliciouspayload]: maliciousPayload,
    // memory violations v2
    [ViolationType.doppelganger]: doppelganger,
    [ViolationType.oopprotect]: oopProtect,
    [ViolationType.childprocessprotect]: childProcessProtect,
    [ViolationType.syscallprobe]: syscallProbe,
    [ViolationType.directsyscall]: directSyscall,
    [ViolationType.systemdllwrite]: systemDllWrite,
    [ViolationType.stolensystemtoken]: stolenSystemToken,
    [ViolationType.dangerousenvvariable]: dangerousEnvVariable,
    [ViolationType.maliciouslowintegrity]: maliciousLowIntegrity,
    [ViolationType.dangerouscomobject]: dangerousComObject,
    [ViolationType.injectionviaapc]: injectionViaApc,
    [ViolationType.runmacroscript]: runMacroScript,
    // exclusion list
    [MemoryProtectionField.memory_exclusion_list]: memoryProtectionExclusionList,
    [MemoryProtectionField.memory_exclusion_list_v2]: memoryProtectionExclusionListV2,
  }
}

const getScriptControlFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const scriptControl = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.script_control,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  const globalSettings = `${PolicyNvpName.script_control}.${ScriptControlField.global_settings}.${ScriptControlField.control_mode}`
  const activeScriptSettings = `${PolicyNvpName.script_control}.${ScriptControlField.activescript_settings}.${ScriptControlField.control_mode}`
  const powershellSettingsControlMode = `${PolicyNvpName.script_control}.${ScriptControlField.powershell_settings}.${ScriptControlField.control_mode}`
  const powershellSettingsConsoleMode = `${PolicyNvpName.script_control}.${ScriptControlField.powershell_settings}.${ScriptControlField.console_mode}`
  const macroSettings = `${PolicyNvpName.script_control}.${ScriptControlField.macro_settings}.${ScriptControlField.control_mode}`

  const pythonSettings = `${RootPolicyField.script_control_v2}.${ScriptControlV2Field.python_settings}.${ScriptControlField.control_mode}`
  const dotNetDLRSettings = `${RootPolicyField.script_control_v2}.${ScriptControlV2Field.dotnet_dlr_settings}.${ScriptControlField.control_mode}`
  const scV2ExclusionList = `${RootPolicyField.script_control_v2}.${ScriptControlV2Field.exclusion_list}`

  return {
    [PolicyNvpName.script_control]: scriptControl,
    [ScriptControlField.global_settings]: globalSettings,
    [ScriptControlField.activescript_settings]: activeScriptSettings,
    [`${ScriptControlField.powershell_settings}.${ScriptControlField.control_mode}`]: powershellSettingsControlMode,
    [`${ScriptControlField.powershell_settings}.${ScriptControlField.console_mode}`]: powershellSettingsConsoleMode,
    [ScriptControlField.macro_settings]: macroSettings,
    [ScriptControlV2Field.python_settings]: pythonSettings,
    [ScriptControlV2Field.dotnet_dlr_settings]: dotNetDLRSettings,
    [ScriptControlV2Field.exclusion_list]: scV2ExclusionList,
  }
}

const getExternalDeviceControlFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const deviceControlToggle = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.device_control,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  const androidUSBControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.AndroidUSB,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )

  const iosControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.iOS,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )
  const stillImageControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.StillImage,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )
  const usbCdDvdRwControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.USBCDDVDRW,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )
  const usbDriveControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.USBDrive,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )
  const vmwareMountControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.VMWareMount,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )
  const wPDControlMode = getPolicyValueKey(
    policy,
    RootPolicyField.device_control,
    DeviceClass.WPD,
    DeviceControlField.device_class,
    DeviceControlField.control_mode,
  )

  const exclusionList = `${RootPolicyField.device_control}.${DeviceControlField.exclusion_list}`

  return {
    [PolicyNvpName.device_control]: deviceControlToggle,
    [DeviceClass.AndroidUSB]: androidUSBControlMode,
    [DeviceClass.iOS]: iosControlMode,
    [DeviceClass.StillImage]: stillImageControlMode,
    [DeviceClass.USBCDDVDRW]: usbCdDvdRwControlMode,
    [DeviceClass.USBDrive]: usbDriveControlMode,
    [DeviceClass.VMWareMount]: vmwareMountControlMode,
    [DeviceClass.WPD]: wPDControlMode,
    [DeviceControlField.exclusion_list]: exclusionList,
  }
}

const getApplicationControlFields = (): Record<string, string> => {
  const applicationControl = `${RootPolicyField.appcontrol}.${AppControlField.lockdown}`
  const changeWindow = `${RootPolicyField.appcontrol}.${AppControlField.changewindow_enabled}`
  const exclusionList = `${RootPolicyField.appcontrol}.${AppControlField.allowed_folders}`

  return {
    [RootPolicyField.appcontrol]: applicationControl,
    [AppControlField.changewindow_enabled]: changeWindow,
    [AppControlField.allowed_folders]: exclusionList,
  }
}

const getOpticsFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const opticsNVP = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const autoUploadThreatsNVP = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_malware_auto_upload,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const autoUploadMemoryProtectionNVP = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_memory_defense_auto_upload,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const deviceDataStorageLimit = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_set_disk_usage_maximum_fixed,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const showDetectionNotifications = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_show_notifications,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const dnsVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_dns_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const privateNetworkAddressVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_private_network_address_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const windowsEventLogVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_windows_event_log_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const advancedPowerShellVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_advanced_powershell_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const advancedWmiVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_advanced_wmi_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const advancedPortableExecutableParsing = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_advanced_executable_parsing,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const enhancedProcessAndHookingVisibility = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_enhanced_process_hooking_visibility,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const intelCryptominingDetection = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.optics_sensors_intel_cryptomining_detection,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  return {
    [PolicyNvpName.optics]: opticsNVP,
    [PolicyNvpName.optics_malware_auto_upload]: autoUploadThreatsNVP,
    [PolicyNvpName.optics_memory_defense_auto_upload]: autoUploadMemoryProtectionNVP,
    [PolicyNvpName.optics_set_disk_usage_maximum_fixed]: deviceDataStorageLimit,
    [PolicyNvpName.optics_show_notifications]: showDetectionNotifications,
    [PolicyNvpName.optics_sensors_dns_visibility]: dnsVisibility,
    [PolicyNvpName.optics_sensors_private_network_address_visibility]: privateNetworkAddressVisibility,
    [PolicyNvpName.optics_sensors_windows_event_log_visibility]: windowsEventLogVisibility,
    [PolicyNvpName.optics_sensors_advanced_powershell_visibility]: advancedPowerShellVisibility,
    [PolicyNvpName.optics_sensors_advanced_wmi_visibility]: advancedWmiVisibility,
    [PolicyNvpName.optics_sensors_advanced_executable_parsing]: advancedPortableExecutableParsing,
    [PolicyNvpName.optics_sensors_enhanced_process_hooking_visibility]: enhancedProcessAndHookingVisibility,
    [PolicyNvpName.optics_sensors_intel_cryptomining_detection]: intelCryptominingDetection,
  }
}

const getPersonaFields = (): Record<string, string> => {
  const mode = `${RootPolicyField.persona}.${PersonaField.mode}`
  const adminWhitelist = `${RootPolicyField.persona}.${PersonaField.admin_whitelist}`
  const mitigationActions = `${RootPolicyField.persona}.${PersonaField.mitigation_actions}`

  return {
    [PersonaField.mode]: mode,
    [PersonaField.admin_whitelist]: adminWhitelist,
    [PersonaField.mitigation_actions]: mitigationActions,
  }
}

const getAgentSettingsFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const preventServiceShutdown = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.prevent_service_shutdown,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const logpolicy = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.logpolicy,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const showNotifications = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.show_notifications,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const autoDelete = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.auto_delete,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const daysUntilDeleted = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.days_until_deleted,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const dataPrivacy = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.data_privacy,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )
  const softwareInventoryMode = `${RootPolicyField.software_inventory}.${SoftwareInventoryField.enabled}`
  const softwareInventoryReportHours = `${RootPolicyField.software_inventory}.${SoftwareInventoryField.full_report_hours}`

  return {
    [PolicyNvpName.prevent_service_shutdown]: preventServiceShutdown,
    [PolicyNvpName.logpolicy]: logpolicy,
    [PolicyNvpName.show_notifications]: showNotifications,
    [PolicyNvpName.auto_delete]: autoDelete,
    [PolicyNvpName.days_until_deleted]: daysUntilDeleted,
    [PolicyNvpName.data_privacy]: dataPrivacy,
    [SoftwareInventoryField.enabled]: softwareInventoryMode,
    [SoftwareInventoryField.full_report_hours]: softwareInventoryReportHours,
  }
}

const getDataPrivacyFields = (policy: FlattenedDevicePolicy): Record<string, string> => {
  const dataPrivacyNVP = getPolicyValueKey(
    policy,
    RootPolicyField.policy,
    PolicyNvpName.data_privacy,
    PolicyNvpField.name,
    PolicyNvpField.value,
  )

  const hostname = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.hostname,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const fqdn = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.fqdn,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const username = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.username,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const ipv6 = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.ipv6,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const macAddress = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.mac_address,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const distinguishedName = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.distinguished_name,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const activeDirectoryInformation = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.active_directory_information,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const fileOwner = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.file_owner,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )
  const filePath = getPolicyValueKey(
    policy,
    RootPolicyField.data_privacy,
    DataPrivacyField.file_path,
    DataPrivacyField.field,
    DataPrivacyField.enable,
  )

  return {
    [PolicyNvpName.data_privacy]: dataPrivacyNVP,
    [DataPrivacyField.hostname]: hostname,
    [DataPrivacyField.fqdn]: fqdn,
    [DataPrivacyField.username]: username,
    [DataPrivacyField.ipv6]: ipv6,
    [DataPrivacyField.mac_address]: macAddress,
    [DataPrivacyField.distinguished_name]: distinguishedName,
    [DataPrivacyField.active_directory_information]: activeDirectoryInformation,
    [DataPrivacyField.file_owner]: fileOwner,
    [DataPrivacyField.file_path]: filePath,
  }
}

// #endregion

export {
  getPolicyValueKey,
  // Policy form field getters by section
  getGeneralInfoFields,
  getFileProtectionFields,
  getMemoryProtectionFields,
  getScriptControlFields,
  getExternalDeviceControlFields,
  getApplicationControlFields,
  getOpticsFields,
  getPersonaFields,
  getAgentSettingsFields,
  getDataPrivacyFields,
}
