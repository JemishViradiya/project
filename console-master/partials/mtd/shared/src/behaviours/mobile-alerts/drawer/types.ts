/*
 *   Copyright (c) 2021 BlackBerry Ltd
 *   All rights reserved.
 *   BlackBerry Limited proprietary and confidential.
 *   Do not reproduce without permission in writing.
 */
import type { ReactNode } from 'react'

export interface RowProps {
  label: ReactNode
  value: ReactNode
}

export interface AccordionProps {
  title: ReactNode
  altTitle?: ReactNode
  subTitle?: ReactNode
  rows: RowProps[]
  noRows?: string
}

export interface DrawerProps {
  isOpen: boolean
  toggleDrawer: () => void
  details: { title: string } & { data: AccordionProps[] }
}

// Sort order for "values" keys (descending) - unrecognized keys will appear after this set
export enum EventValueKeySortOrder {
  osVersion,
  osName,

  packageName,
  packageVersion,
  applicationSha256,
  installerSource,

  attestationSubType,
  attestationState,
  attestationRuleFailure,

  ssid,
}
