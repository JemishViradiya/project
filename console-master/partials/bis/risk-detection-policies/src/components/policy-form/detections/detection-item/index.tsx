import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import type { ActorDetectionType } from '@ues-data/shared-types'
import type { UesTheme } from '@ues/assets'
import { BrandPersona, DeviceMobile } from '@ues/assets'

import { useDetectionLabelFn } from '../../../../hooks/use-detection-label-fn'

export interface DetectionItemProps {
  detectionType: ActorDetectionType
  selected?: boolean
}

const ICONS_COMPONENTS: Record<ActorDetectionType, React.FC> = {
  encryptionDisabled: DeviceMobile,
  hardwareAttestationFailed: DeviceMobile,
  insecuredNetworkDetected: DeviceMobile,
  insecuredWifiDetected: DeviceMobile,
  iosIntegrityFailure: DeviceMobile,
  maliciousAppDetected: DeviceMobile,
  privilegeEscalationDetected: DeviceMobile,
  restrictedAppDetected: DeviceMobile,
  safetyNetAttestationFailed: DeviceMobile,
  screenLockDisabled: DeviceMobile,
  sideLoadedAppDetected: DeviceMobile,
  unsafeMessageDetected: DeviceMobile,
  unsupportedDeviceModelDetected: DeviceMobile,
  unsupportedDeviceOSDetected: DeviceMobile,
  unsupportedSecurityPatchDetected: DeviceMobile,
  unresponsiveAgent: DeviceMobile,
  developerModeDetected: DeviceMobile,
}

interface StylesProps {
  selected?: boolean
}

const useStyles = makeStyles<UesTheme, StylesProps>(theme => ({
  detectionItem: ({ selected }) => ({
    alignItems: 'center',
    background: theme.palette.background.default,
    borderColor: selected ? theme.palette.secondary.main : theme.palette.divider,
    borderStyle: 'solid',
    borderWidth: 1,
    color: selected ? theme.palette.secondary.dark : theme.palette.text.primary,
    display: 'flex',
    padding: theme.spacing(2),

    '& > svg': {
      color: selected ? theme.palette.secondary.dark : theme.palette.text.secondary,
      height: theme.spacing(5),
    },

    '& > span': {
      marginLeft: theme.spacing(2),
    },
  }),
}))

export const DetectionItem: React.FC<DetectionItemProps> = ({ detectionType, selected }) => {
  const classNames = useStyles({ selected })
  const translateLabel = useDetectionLabelFn()
  const IconComponent = ICONS_COMPONENTS[detectionType]

  return (
    <div className={classNames.detectionItem}>
      <IconComponent />
      <span>{translateLabel(detectionType)}</span>
    </div>
  )
}
