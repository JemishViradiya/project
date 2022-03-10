//******************************************************************************
// Copyright 2021 BlackBerry. All Rights Reserved.

import type { TenantPrivateDnsZonesType } from '@ues-data/gateway'
import type { UseControlledDialogProps } from '@ues/behaviours'

export interface LookupZonesListProps {
  zonesType: TenantPrivateDnsZonesType
}

export interface LookupZonesDialogProps {
  dialogId: UseControlledDialogProps['dialogId']
  rowData?: { zone: string; id: number }
  zonesType?: TenantPrivateDnsZonesType
}

export interface ZoneListItem {
  zone: string
  id: number
}
