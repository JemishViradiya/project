import { memoize } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { MobileProtectData } from '@ues-data/mtd'
import type { ActorDetectionType } from '@ues-data/shared-types'

import { DETECTIONS_CONFIG } from '../config/detections'
import { DetectionsProvider } from '../model'

const TRANSLATIONS_PATHS = {
  [DetectionsProvider.BIS]: 'bis/ues:detectionPolicies.threats.labels',
  [DetectionsProvider.MTD]: 'mtd/common:threats',
}

const DETECTION_TYPE_TRANSLATION_KEY_MAP: Partial<Record<ActorDetectionType, string>> = {
  encryptionDisabled: MobileProtectData.MobileThreatEventType.DEVICE_ENCRYPTION,
  hardwareAttestationFailed: MobileProtectData.MobileThreatEventType.ANDROID_HW_FAILURE,
  insecuredNetworkDetected: MobileProtectData.MobileThreatEventType.COMPROMISED_NETWORK,
  insecuredWifiDetected: MobileProtectData.MobileThreatEventType.INSECURE_WIFI,
  iosIntegrityFailure: MobileProtectData.MobileThreatEventType.IOS_INTEGRITY_FAILURE,
  maliciousAppDetected: MobileProtectData.MobileThreatEventType.MALICIOUS_APP,
  privilegeEscalationDetected: MobileProtectData.MobileThreatEventType.JAILBROKEN_ROOTED,
  restrictedAppDetected: MobileProtectData.MobileThreatEventType.RESTRICTED_APP,
  safetyNetAttestationFailed: MobileProtectData.MobileThreatEventType.ANDROID_SAFETYNET_FAILURE,
  screenLockDisabled: MobileProtectData.MobileThreatEventType.DEVICE_SCREENLOCK,
  sideLoadedAppDetected: MobileProtectData.MobileThreatEventType.SIDELOADED_APP,
  unsafeMessageDetected: MobileProtectData.MobileThreatEventType.UNSAFE_MESSAGE,
  unsupportedDeviceModelDetected: MobileProtectData.MobileThreatEventType.UNSUPPORTED_MODEL,
  unsupportedDeviceOSDetected: MobileProtectData.MobileThreatEventType.UNSUPPORTED_OS,
  unsupportedSecurityPatchDetected: MobileProtectData.MobileThreatEventType.UNSUPPORTED_SECURITY_PATCH,
  unresponsiveAgent: MobileProtectData.MobileThreatEventType.UNRESPONSIVE_AGENT,
}

export const useDetectionLabelFn = () => {
  const { t } = useTranslation(['bis/ues', 'mtd/common'])

  return useMemo(
    () =>
      memoize((detectionType: ActorDetectionType) => {
        const { provider } = DETECTIONS_CONFIG[detectionType]

        const key = DETECTION_TYPE_TRANSLATION_KEY_MAP[detectionType] ?? detectionType

        return t(`${TRANSLATIONS_PATHS[provider]}.${key}`)
      }),
    [t],
  )
}
